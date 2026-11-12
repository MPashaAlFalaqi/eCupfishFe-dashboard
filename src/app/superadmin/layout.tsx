import AuthGuard from '@/components/AuthGuard';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard roles={['SUPERADMIN']}>{children}</AuthGuard>;
}