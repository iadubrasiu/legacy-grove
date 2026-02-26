import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { type NextRequest } from "next/server";

const TARGET_EMAIL = 'asilvafx24@gmail.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const memory = await prisma.memory.findUnique({
      where: { id, userId: user.id },
      include: { people: { select: { id: true, name: true, color: true } } },
    });

    if (!memory) return new NextResponse("Memory not found", { status: 404 });

    const formattedMemory = {
      ...memory,
      people: memory.people,
      date: memory.date.toISOString().split('T')[0],
    };
    return NextResponse.json(formattedMemory);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    await prisma.memory.delete({ where: { id, userId: user.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  const { title, date, content, peopleIds } = body;

  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const updatedMemory = await prisma.memory.update({
      where: { id, userId: user.id },
      data: {
        title,
        date: date ? new Date(date) : undefined,
        content,
        people: {
           set: peopleIds ? peopleIds.map((pid: string) => ({ id: pid })) : [],
        }
      },
    });
    return NextResponse.json(updatedMemory);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
