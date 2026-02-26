import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

const TARGET_EMAIL = 'asilvafx24@gmail.com';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const memorias = await prisma.memory.findMany({
      where: { userId: user.id },
      include: {
        person: { select: { name: true } }, 
      },
      orderBy: { date: "desc" },
    });

    const formattedMemorias = memorias.map((memoria: any) => ({
      ...memoria,
      personName: memoria.person?.name || null,
      date: memoria.date.toISOString().split('T')[0],
    }));

    return NextResponse.json(formattedMemorias);
  } catch (error: any) {
    console.error("Error fetching memorias:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { title, description, date, personId } = await request.json();

    if (!title || !description || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newMemory = await prisma.memory.create({
      data: {
        title,
        content: description,
        date: new Date(date), 
        userId: user.id,
        personId: personId || null, 
      },
    });
    return NextResponse.json(newMemory, { status: 201 });
  } catch (error: any) {
    console.error("Error creating memory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
