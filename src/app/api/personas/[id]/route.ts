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

    const person = await prisma.person.findUnique({
      where: { id, userId: user.id },
    });

    if (!person) return new NextResponse("Person not found", { status: 404 });
    return NextResponse.json(person);
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

    await prisma.person.delete({
      where: { id, userId: user.id },
    });
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
  const { name, birthDate, bio, imageUrl } = body;

  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const updatedPerson = await prisma.person.update({
      where: { id, userId: user.id },
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        bio,
        imageUrl,
      },
    });
    return NextResponse.json(updatedPerson);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
