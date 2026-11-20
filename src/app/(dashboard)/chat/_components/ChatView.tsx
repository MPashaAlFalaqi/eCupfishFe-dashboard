"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/Topbar";
import SearchInput from "@/components/SearchInput";
import { Card } from "@/components/ui";
import { api, jsonBody, session } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import ResetDataButton from "@/components/ResetDataButton";
import { chatList } from "@/lib/mock-data";

interface ConvItem {
  id: number;
  buyer: { id: number; name: string };
  product?: { id: number; name: string } | null;
  lastMessage?: string | null;
  unreadCount: number;
}

interface MsgItem {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdAt: string;
}

const quick = [
  "Stok masih tersedia, kak 😊",
  "Ikan dikemas double plastik + oksigen murni ya kak",
  "Mohon ditunggu, saya cek kolam dulu",
  "Terima kasih sudah berbelanja di tambak kami!",
];

export default function ChatView({ data }: { data?: any } = {}) {
  const meId = session.user?.id;
  const [list, setList] = useState<ConvItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MsgItem[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [q, setQ] = useState("");
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const loadSyncMessages = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat/messages");
        if (res.ok) {
          const json = await res.json();
          const remoteMsgs = json.data || [];
          if (remoteMsgs.length > 0) {
            const buyerMsg = remoteMsgs.find((m: any) => m.sender === "BUYER");
            const buyerName = buyerMsg?.senderName || "Pembeli (Mobile)";
            const lastMsg = remoteMsgs[remoteMsgs.length - 1];

            const conv: ConvItem = {
              id: 1,
              buyer: { id: 101, name: buyerName },
              product: { id: 201, name: "Tanya Penjual (Live Mobile)" },
              lastMessage: lastMsg?.body || "Mulai percakapan...",
              unreadCount: 0,
            };

            setList([conv]);
            setActiveId(1);
            setMessages(
              remoteMsgs.map((m: any, idx: number) => ({
                id: m.id || idx + 1,
                conversationId: 1,
                senderId: m.sender === "SELLER" ? (meId ?? 1) : 101,
                body: m.body,
                createdAt: m.createdAt || new Date().toISOString(),
              }))
            );
            return;
          }
        }
      } catch {}

      // Jika kosong atau backend belum merespons pesan, biarkan list bersih dari nol
      api<{ data: ConvItem[] }>("/api/conversations")
        .then((r) => {
          if (r.data && r.data.length > 0) {
            setList(r.data);
            setActiveId(r.data[0].id);
          } else {
            setList([]);
            setActiveId(null);
            setMessages([]);
          }
        })
        .catch(() => {
          setList([]);
          setActiveId(null);
          setMessages([]);
        });
    };

    loadSyncMessages();
    timer = setInterval(loadSyncMessages, 2000);

    return () => clearInterval(timer);
  }, [meId]);

  useEffect(() => {
    if (!activeId) return;
    api<{ data: MsgItem[] }>(`/api/conversations/${activeId}/messages`).then(
      (r) => setMessages(r.data)
    );
    setList((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unreadCount: 0 } : c))
    );

    const sock = getSocket();
    sock.emit("chat:join", activeId);
    const onNewMsg = (msg: MsgItem) => {
      if (msg.conversationId === activeId) {
        setMessages((prev) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
        );
      }
      setList((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId ? { ...c, lastMessage: msg.body } : c
        )
      );
    };
    sock.on("chat:message", onNewMsg);
    sock.on("chat:global", (data: any) => {
      if (data?.message) onNewMsg(data.message);
    });

    // Cross-tab / Broadcast sync
    let chatBc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      chatBc = new BroadcastChannel("ecupfish_chat_bus");
      chatBc.onmessage = (e) => {
        if (e.data?.type === "BUYER_MESSAGE" && e.data?.body) {
          const newMsg: MsgItem = {
            id: Date.now(),
            conversationId: activeId,
            senderId: 100,
            body: e.data.body,
            createdAt: e.data.createdAt || new Date().toISOString(),
          };
          setMessages((prev) => [...prev, newMsg]);
          setList((prev) =>
            prev.map((c) =>
              c.id === activeId
                ? {
                    ...c,
                    buyer: { ...c.buyer, name: e.data.buyerName || c.buyer.name },
                    lastMessage: e.data.body,
                  }
                : c
            )
          );
        }
      };
    }

    const handleChatStorage = (e: StorageEvent) => {
      if (e.key === "ecupfish_chat_sync" && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data.type === "BUYER_MESSAGE" && data.body) {
            const newMsg: MsgItem = {
              id: Date.now(),
              conversationId: activeId,
              senderId: 100,
              body: data.body,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setMessages((prev) => [...prev, newMsg]);
            setList((prev) =>
              prev.map((c) =>
                c.id === activeId
                  ? {
                      ...c,
                      buyer: { ...c.buyer, name: data.buyerName || c.buyer.name },
                      lastMessage: data.body,
                    }
                  : c
              )
            );
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleChatStorage);

    return () => {
      sock.off("chat:message", onNewMsg);
      sock.off("chat:global");
      if (chatBc) chatBc.close();
      window.removeEventListener("storage", handleChatStorage);
    };
  }, [activeId]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async (t: string) => {
    if (!t.trim() || !activeId) return;
    const bodyText = t.trim();
    setText("");

    // Kirim ke universal backend relay endpoint untuk mobile
    try {
      fetch("http://localhost:3000/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "SELLER",
          senderName: "Betta King Jakarta (Penjual Official)",
          body: bodyText,
        }),
      }).catch(() => {});
    } catch {}

    // Broadcast ke pembeli mobile secara realtime
    try {
      const bc = new BroadcastChannel("ecupfish_chat_bus");
      bc.postMessage({
        type: "SELLER_MESSAGE",
        conversationId: activeId,
        body: bodyText,
        createdAt: new Date().toISOString(),
      });
      bc.close();
    } catch {}
    try {
      localStorage.setItem(
        "ecupfish_chat_sync",
        JSON.stringify({
          type: "SELLER_MESSAGE",
          conversationId: activeId,
          body: bodyText,
          createdAt: new Date().toISOString(),
          ts: Date.now(),
        })
      );
    } catch {}

    try {
      const res = await api<{ data: MsgItem }>(
        `/api/conversations/${activeId}/messages`,
        { method: "POST", body: jsonBody({ body: bodyText }) }
      );
      setMessages((prev) =>
        prev.some((m) => m.id === res.data.id) ? prev : [...prev, res.data]
      );
    } catch {
      // Fallback live real-time local message
      const localMsg: MsgItem = {
        id: Date.now(),
        conversationId: activeId,
        senderId: meId ?? 1,
        body: bodyText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, localMsg]);
      setList((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, lastMessage: bodyText } : c
        )
      );
    }
  };

  const cur = list.find((c) => c.id === activeId);
  const shown = list.filter((c) =>
    [c.buyer.name, c.product?.name ?? ""].some((v) =>
      v.toLowerCase().includes(q.toLowerCase())
    )
  );

  return (
    <>
      <Topbar
        title="Chat"
        subtitle="Percakapan real-time dengan pembeli ikan cupang"
        action={<ResetDataButton label="Reset Data" />}
      />
      <div className="grid h-[calc(100vh-11rem)] min-h-[460px] gap-4 lg:grid-cols-[340px_1fr]">
        <Card
          className={clsx(
            "flex-col overflow-hidden !p-0",
            showChat ? "hidden lg:flex" : "flex"
          )}
        >
          <div className="border-b border-primary-50 p-3">
            <SearchInput
              className="w-full"
              value={q}
              onChange={setQ}
              placeholder="Cari pembeli atau produk..."
            />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {shown.length === 0 && (
              <li className="p-6 text-center text-sm text-primary-400">
                Belum ada percakapan masuk.
              </li>
            )}
            {shown.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setActiveId(c.id);
                    setShowChat(true);
                  }}
                  className={clsx(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-primary-50",
                    c.id === activeId && "bg-primary-50"
                  )}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                    {c.buyer.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate">{c.buyer.name}</b>
                    <span className="block truncate text-xs text-primary-400">
                      {c.product?.name ?? "Pertanyaan umum"}
                    </span>
                    <span className="block truncate text-sm text-primary-500">
                      {c.lastMessage ?? "Mulai percakapan..."}
                    </span>
                  </span>
                  {c.unreadCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-secondary-500 px-1.5 text-xs font-bold text-primary-950">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          className={clsx(
            "flex-col overflow-hidden !p-0",
            !showChat ? "hidden lg:flex" : "flex"
          )}
        >
          {!cur ? (
            <div className="grid flex-1 place-items-center text-sm text-primary-400">
              Pilih percakapan di sebelah kiri untuk membalas pesan
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-primary-50 px-4 py-3">
                <button
                  onClick={() => setShowChat(false)}
                  className="lg:hidden"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <p className="font-bold">{cur.buyer.name}</p>
                  <p className="text-xs text-primary-400">
                    {cur.product?.name ?? "Chat Pembeli"}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto bg-primary-50/40 p-4">
                {messages.map((m) => {
                  const mine = m.senderId === meId;
                  return (
                    <div
                      key={m.id}
                      className={clsx(
                        "flex",
                        mine ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={clsx(
                          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                          mine
                            ? "bg-primary-600 text-white"
                            : "bg-white text-primary-900 shadow-sm"
                        )}
                      >
                        <p>{m.body}</p>
                        <span
                          className={clsx(
                            "mt-1 block text-[10px]",
                            mine ? "text-primary-200" : "text-primary-400"
                          )}
                        >
                          {new Date(m.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={end} />
              </div>

              <div className="flex gap-1.5 overflow-x-auto border-t border-primary-50 px-3 py-2">
                {quick.map((qText) => (
                  <button
                    key={qText}
                    type="button"
                    onClick={() => send(qText)}
                    className="shrink-0 rounded-full bg-primary-50 px-3 py-1 text-xs text-primary-700 hover:bg-primary-100"
                  >
                    {qText}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(text);
                }}
                className="flex gap-2 border-t border-primary-50 p-3"
              >
                <input
                  className="input flex-1"
                  placeholder="Tulis balasan untuk pembeli..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  type="submit"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-white hover:bg-primary-700"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </Card>
      </div>
    </>
  );
}