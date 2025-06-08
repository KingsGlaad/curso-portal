import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, name, role } = await req.json();
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }
  const createUser = await prisma.user.create({
    data: {
      email,
      name,
      password: await bcrypt.hash(password, 10),
      role,
    },
  });
  return NextResponse.json(createUser);
}
