import { prisma } from "@/lib/prisma";

export default async function Home() {
  const listStudents = await prisma.user.findMany();
  console.log(listStudents);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello World</h1>
    </main>
  );
}
