import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'asilvafx24@gmail.com'
  
  // Buscar usuario
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.error("Usuario no encontrado. Ejecuta el seed anterior primero.")
    return
  }

  // Buscar familiares por nombre para asignarles historias
  const names = [
    'Abuelo Materno', 'Abuela Materna', 'Madre', 'Padre', 
    'Tío Mickey', 'Tieta Camelia', 'Tío Gabriel', 'Tieta Esther',
    'Alejandro (Yo)', 'Daniel', 'Elena', 'Gabriela', 'Gabriel (Hijo)', 'Edu'
  ];

  const stories = [
    "Recuerdo cuando íbamos al pueblo en verano y comíamos sandía bajo el porche.",
    "La vez que se nos escapó el perro y estuvimos toda la tarde buscándolo.",
    "Aquella Navidad donde se fue la luz y cenamos con velas.",
    "Cuando aprendí a montar en bicicleta sin ruedines en el parque.",
    "El viaje a la montaña donde vimos nieve por primera vez.",
    "La receta secreta de las croquetas que siempre salían perfectas.",
    "El día de la graduación, qué orgullo sentimos todos.",
    "Cuando fuimos a pescar y no pescamos nada, pero nos reímos mucho.",
    "La boda de la tía, ¡qué fiesta más bonita!",
    "Aquel cumpleaños sorpresa que casi sale mal.",
    "Jugando a las cartas después de comer los domingos.",
    "El primer coche que compramos, un Seat panda rojo.",
    "Cuando construimos la casa del árbol en el jardín.",
    "La excursión al río donde nos bañamos vestidos."
  ];

  console.log("Creando historias de prueba...");

  for (let i = 0; i < names.length; i++) {
    const person = await prisma.person.findFirst({
      where: { userId: user.id, name: names[i] }
    });

    if (person) {
      await prisma.memory.create({
        data: {
          title: `Recuerdo con ${names[i]}`,
          content: stories[i] || "Un recuerdo especial que siempre guardaré.",
          date: new Date(2023, i, 15), // Fechas variadas
          userId: user.id,
          people: {
            connect: [{ id: person.id }]
          }
        }
      });
      console.log(`+ Historia creada para ${names[i]}`);
    }
  }

  console.log('Historias de prueba generadas.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
