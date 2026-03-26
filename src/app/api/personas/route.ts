import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const personas = await prisma.person.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(personas);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  const person = await prisma.person.create({
    data: {
      name: body.name,
      role: body.role || "Miembro",
      color: body.color || "bg-blue-600",
      userId: session.user.id,
    },
  });

  return NextResponse.json(person);
}
