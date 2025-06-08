import { prisma } from "@/lib/prisma";
import { columns } from "./_components/table/columns";
import { Student } from "@/types/students";
import { StudentsDataTable } from "./_components/table/data-table";

async function getData(): Promise<Student[]> {
  const data = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return [...data];
}
export default async function StudentsPage() {
  const data = await getData();
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cidades</h2>
      </div>
      <StudentsDataTable columns={columns} data={data} />
    </div>
  );
}
