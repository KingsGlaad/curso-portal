// /pages/api/user/settings.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized", status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      settings: true,
    },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found", status: 404 });
  }

  return NextResponse.json(user.settings);
}

export async function POST() {
  const user = await prisma.user.findUnique({
    where: { id: "cmbn5i0in0001jpa4gic1r2zz" },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found", status: 404 });
  }
  const settings = await prisma.settings.create({
    data: {
      userId: user.id,
      avatar: user.image || "/images/default-user.png",
      fullName: user.name || "User",
      phone: "+1 (555) 123-4567",
      timezone: "utc-8",
      language: "pt-br",
      currency: "br",
      dateFormat: "mm-dd-yyyy",
      fontSize: 16,
      theme: "system",
      layout: "default",
      notifications: {
        email: true,
        push: true,
        sms: false,
        accountActivity: true,
        newFeatures: true,
        marketing: false,
        frequency: "real-time",
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
      },
      privacy: {
        analyticsSharing: true,
        personalizedAds: false,
        visibility: "public",
        dataRetention: "1-year",
      },
    },
  });
  return NextResponse.json(settings);
}
