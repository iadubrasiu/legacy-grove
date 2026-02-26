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
        people: { select: { name: true, color: true } }, 
      },
      orderBy: { date: "desc" },
    });

    const formattedMemorias = memorias.map((memoria: any) => ({
      ...memoria,
      peopleNames: memoria.people.map((p: any) => p.name).join(", "),
      people: memoria.people,
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

    const { title, description, date, peopleIds, audioData } = await request.json();

    if (!title && !audioData) { // Permitir título vacío si hay audio? Mejor pedir título siempre.
       // ...
    }

    const newMemory = await prisma.memory.create({
      data: {
        title: title || "Nota de voz",
        content: description || "",
        date: new Date(date), 
        audioData, // Guardar audio
        userId: user.id,
        people: {
          connect: peopleIds ? peopleIds.map((id: string) => ({ id })) : [],
        },
      },
    });
    return NextResponse.json(newMemory, { status: 201 });
  } catch (error: any) {
    console.error("Error creating memory:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
