import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const memorias = await prisma.memory.findMany({
    where: { userId: session.user.id },
    include: {
      people: {
        select: {
          id: true,
          name: true,
          color: true,
          avatar: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(
    memorias.map((m) => ({
      ...m,
      date: m.date.toISOString().split("T")[0],
    }))
  );
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { title, description, content, date, peopleIds, audioData } = body;

  const validPeople = Array.isArray(peopleIds) && peopleIds.length > 0
    ? await prisma.person.findMany({
        where: {
          id: { in: peopleIds },
          userId: session.user.id,
        },
        select: { id: true },
      })
    : [];

  const memory = await prisma.memory.create({
    data: {
      title,
      content: content ?? description ?? "",
      audioData,
      date: date ? new Date(date) : new Date(),
      userId: session.user.id,
      people: {
        connect: validPeople.map((p) => ({ id: p.id })),
      },
    },
  });

  return NextResponse.json(memory, { status: 201 });
}
