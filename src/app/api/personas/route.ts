import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// HARDCODED USER FOR PUBLIC ACCESS
const TARGET_EMAIL = 'asilvafx24@gmail.com';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const personas = await prisma.person.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(personas);
  } catch (error: any) {
    console.error("Error fetching personas:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { name } = await request.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const newPerson = await prisma.person.create({
      data: {
        name,
        role: "Miembro", 
        userId: user.id,
      },
    });
    return NextResponse.json(newPerson, { status: 201 });
  } catch (error: any) {
    console.error("Error creating persona:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
