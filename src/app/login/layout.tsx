import { AuthProvider } from "@/providers/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">{children}</div>
    </AuthProvider>
  );
}
