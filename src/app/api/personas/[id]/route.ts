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

  const person = await prisma.person.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      memories: true,
    },
  });

  if (!person) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(person);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const existing = await prisma.person.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = await req.json();

  const updated = await prisma.person.update({
    where: { id: params.id },
    data: body,
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

  const existing = await prisma.person.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!existing) {
    return new NextResponse("Not found", { status: 404 });
  }

  await prisma.person.delete({
    where: { id: params.id },
  });

  return new NextResponse(null, { status: 204 });
}
