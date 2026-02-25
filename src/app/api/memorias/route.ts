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
    const memorias = await prisma.memory.findMany({
      where: { userId: session.user.id as string },
      include: {
        person: { select: { name: true } }, // Include person's name
      },
      orderBy: { date: "desc" },
    });

    const formattedMemorias = memorias.map((memoria: any) => ({
      ...memoria,
      personName: memoria.person?.name || null, // Add personName for display
      date: memoria.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    }));

    return NextResponse.json(formattedMemorias);
  } catch (error: any) {
    console.error("Error fetching memorias:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, description, date, personId } = await request.json();

    if (!title || !description || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newMemory = await prisma.memory.create({
      data: {
        title,
        content: description,
        date: new Date(date), // Convert date string to Date object
        userId: session.user.id as string,
        personId: personId || null, // Allow null if no person is selected
      },
    });
    return NextResponse.json(newMemory, { status: 201 });
  } catch (error: any) {
    console.error("Error creating memory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
