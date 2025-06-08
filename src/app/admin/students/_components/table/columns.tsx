"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StudentActions } from "./actions";
import { Student } from "@/types/students";

// Função para formatar números com separador de milhares
export const formatarNumero = (numero: number) => {
  return numero.toLocaleString("pt-BR");
};

// Definição das colunas da tabela
export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center">
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Associado em",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <div className="flex items-center">
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "courses",
    header: "Cursos",
    cell: ({ row }) => {
      const courses = row.getValue("courses") as {
        id: string;
        title: string;
      }[];
      return (
        <div className="flex items-center">
          <span>{courses.map((course) => course.title).join(", ")}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return <StudentActions student={student} />;
    },
  },
];
