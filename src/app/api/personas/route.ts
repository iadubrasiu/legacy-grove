import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const personas = await prisma.person.findMany({
      where: { userId: session.user.id as string },
    });
    return NextResponse.json(personas);
  } catch (error: any) {
    console.error("Error fetching personas:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name } = await request.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const newPerson = await prisma.person.create({
      data: {
        name,
        role: "Miembro", // Default role
        userId: session.user.id as string,
      },
    });
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error: any) {
    console.error("Error creating persona:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
