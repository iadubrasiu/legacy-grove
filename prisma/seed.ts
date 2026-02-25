import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'asilvafx24@gmail.com'
  const password = await bcrypt.hash('password123', 10)
  const name = 'Alejandro Silva'

  // 1. Crear Usuario Principal
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      password,
    },
  })

  console.log(`Usuario creado: ${user.name} (${user.email})`)

  // Borrar datos anteriores para evitar duplicados si se corre varias veces
  await prisma.person.deleteMany({ where: { userId: user.id } })

  // 2. Crear Abuelos (Nivel 1)
  const abueloMaterno = await prisma.person.create({
    data: { name: 'Abuelo Materno', role: 'Abuelo', userId: user.id, color: 'bg-gray-600' }
  })
  const abuelaMaterna = await prisma.person.create({
    data: { name: 'Abuela Materna', role: 'Abuela', userId: user.id, color: 'bg-gray-600' }
  })

  // 3. Crear Padres y Tíos (Nivel 2)
  const madre = await prisma.person.create({
    data: { name: 'Madre', role: 'Madre', userId: user.id, color: 'bg-pink-600' }
  })
  const padre = await prisma.person.create({
    data: { name: 'Padre', role: 'Padre', userId: user.id, color: 'bg-blue-600' }
  })

  const tioMickey = await prisma.person.create({
    data: { name: 'Tío Mickey', role: 'Tío', userId: user.id, color: 'bg-green-600' }
  })
  const tietaCamelia = await prisma.person.create({
    data: { name: 'Tieta Camelia', role: 'Tía', userId: user.id, color: 'bg-green-500' }
  })

  const tioGabriel = await prisma.person.create({
    data: { name: 'Tío Gabriel', role: 'Tío', userId: user.id, color: 'bg-purple-600' }
  })
  const tietaEsther = await prisma.person.create({
    data: { name: 'Tieta Esther', role: 'Tía', userId: user.id, color: 'bg-purple-500' }
  })

  // 4. Crear Hijos/Primos (Nivel 3)
  // Hijos de Madre y Padre
  await prisma.person.create({
    data: { name: 'Alejandro (Yo)', role: 'Hijo', userId: user.id, color: 'bg-orange-600', avatar: '😎' }
  })
  await prisma.person.create({
    data: { name: 'Daniel', role: 'Hermano', userId: user.id, color: 'bg-orange-500' }
  })

  // Hijos de Mickey y Camelia
  await prisma.person.create({
    data: { name: 'Elena', role: 'Prima', userId: user.id, color: 'bg-teal-500' }
  })
  await prisma.person.create({
    data: { name: 'Gabriela', role: 'Prima', userId: user.id, color: 'bg-teal-500' }
  })

  // Hijos de Gabriel y Esther
  await prisma.person.create({
    data: { name: 'Gabriel (Hijo)', role: 'Primo', userId: user.id, color: 'bg-indigo-500' }
  })
  await prisma.person.create({
    data: { name: 'Edu', role: 'Primo', userId: user.id, color: 'bg-indigo-500' }
  })

  console.log('Estructura familiar creada con éxito.')
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
