import { Role } from "@prisma/client";

export type Student = {
  id: string;
  image: string | null;
  role: Role;
  email: string | null;
  name: string | null;
  password: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  courses: {
    id: string;
    title: string;
    description: string | null;
  }[];
};
