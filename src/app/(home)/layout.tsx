import Header from "@/components/layout/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Header />
      {children}
    </div>
  );
}
