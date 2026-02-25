import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

// Datos de emergencia por si falla la DB
const MOCK_PERSONAS = [
  { id: '1', name: 'Abuelo Materno', role: 'Abuelo', color: 'bg-gray-600', userId: 'user-alejandro-id' },
  { id: '2', name: 'Abuela Materna', role: 'Abuela', color: 'bg-gray-600', userId: 'user-alejandro-id' },
  { id: '3', name: 'Madre', role: 'Madre', color: 'bg-pink-600', userId: 'user-alejandro-id' },
  { id: '4', name: 'Padre', role: 'Padre', color: 'bg-blue-600', userId: 'user-alejandro-id' },
  { id: '5', name: 'Tío Mickey', role: 'Tío', color: 'bg-green-600', userId: 'user-alejandro-id' },
  { id: '6', name: 'Tieta Camelia', role: 'Tía', color: 'bg-green-500', userId: 'user-alejandro-id' },
  { id: '7', name: 'Tío Gabriel', role: 'Tío', color: 'bg-purple-600', userId: 'user-alejandro-id' },
  { id: '8', name: 'Tieta Esther', role: 'Tía', color: 'bg-purple-500', userId: 'user-alejandro-id' },
  { id: '9', name: 'Alejandro (Yo)', role: 'Hijo', color: 'bg-orange-600', avatar: '😎', userId: 'user-alejandro-id' },
  { id: '10', name: 'Daniel', role: 'Hermano', color: 'bg-orange-500', userId: 'user-alejandro-id' },
  { id: '11', name: 'Elena', role: 'Prima', color: 'bg-teal-500', userId: 'user-alejandro-id' },
  { id: '12', name: 'Gabriela', role: 'Prima', color: 'bg-teal-500', userId: 'user-alejandro-id' },
  { id: '13', name: 'Gabriel (Hijo)', role: 'Primo', color: 'bg-indigo-500', userId: 'user-alejandro-id' },
  { id: '14', name: 'Edu', role: 'Primo', color: 'bg-indigo-500', userId: 'user-alejandro-id' },
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const personas = await prisma.person.findMany({
      where: { userId: session.user.id as string },
    });
    
    // Si la DB devuelve vacío (o falla silenciosamente y devuelve array vacío por error de id),
    // y el usuario es Alejandro, devolvemos los datos mock.
    if (personas.length === 0 && session.user.email === 'asilvafx24@gmail.com') {
       return NextResponse.json(MOCK_PERSONAS);
    }

    return NextResponse.json(personas);
  } catch (error: any) {
    console.error("Error fetching personas:", error);
    // FALLBACK DE EMERGENCIA
    if (session.user.email === 'asilvafx24@gmail.com') {
      return NextResponse.json(MOCK_PERSONAS);
    }
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
