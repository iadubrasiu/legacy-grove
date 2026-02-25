import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = params.id;

  try {
    const memory = await prisma.memory.findUnique({
      where: { id, userId: session.user.id as string },
      include: {
        person: { select: { name: true } },
      },
    });

    if (!memory) {
      return new NextResponse("Memory not found", { status: 404 });
    }

    const formattedMemory = {
      ...memory,
      personName: memory.person?.name || null,
      date: memory.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };

    return NextResponse.json(formattedMemory);
  } catch (error: any) {
    console.error("Error fetching memory by ID:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = params.id;

  try {
    await prisma.memory.delete({
      where: { id, userId: session.user.id as string },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting memory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const id = params.id;
  const body = await request.json();
  const { title, date, content, personId } = body;

  try {
    const updatedMemory = await prisma.memory.update({
      where: { id, userId: session.user.id as string },
      data: {
        title,
        date: date ? new Date(date) : undefined,
        content,
        personId: personId || null,
      },
    });

    return NextResponse.json(updatedMemory);
  } catch (error: any) {
    console.error("Error updating memory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
