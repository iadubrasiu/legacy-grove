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
    const person = await prisma.person.findUnique({
      where: { id, userId: session.user.id as string },
    });

    if (!person) {
      return new NextResponse("Person not found", { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error: any) {
    console.error("Error fetching person by ID:", error);
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
    await prisma.person.delete({
      where: { id, userId: session.user.id as string },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting person:", error);
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
  const { name, birthDate, bio, imageUrl } = body;

  try {
    const updatedPerson = await prisma.person.update({
      where: { id, userId: session.user.id as string },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        bio,
        imageUrl,
      },
    });

    return NextResponse.json(updatedPerson);
  } catch (error: any) {
    console.error("Error updating person:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
