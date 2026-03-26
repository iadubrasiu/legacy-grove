import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const memory = await prisma.memory.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      people: true,
    },
  });

  if (!memory) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json({
    ...memory,
    date: memory.date.toISOString().split("T")[0],
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const existing = await prisma.memory.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return new NextResponse("Not found", { status: 404 });
  }

  const validPeople = Array.isArray(body.peopleIds) && body.peopleIds.length > 0
    ? await prisma.person.findMany({
        where: {
          id: { in: body.peopleIds },
          userId: session.user.id,
        },
        select: { id: true },
      })
    : [];

  const updated = await prisma.memory.update({
    where: { id: params.id },
    data: {
      title: body.title,
      content: body.content,
      audioData: body.audioData,
      date: body.date ? new Date(body.date) : undefined,
      people: {
        set: validPeople.map((p) => ({ id: p.id })),
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existing = await prisma.memory.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return new NextResponse("Not found", { status: 404 });
  }

  await prisma.memory.delete({
    where: { id: params.id },
  });

  return new NextResponse(null, { status: 204 });
}
