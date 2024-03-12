import { PrismaClient } from '@prisma/client';
import fastify from 'fastify';
import { z } from 'zod';

const prisma = new PrismaClient();
const server = fastify();

server.get('/', async () => {
  const users = await prisma.user.findMany();

  return { users };
});

server.get('/:id', async (request) => {
  const getUserParamsSchema = z.object({
    id: z.string()
  });

  const { id } = getUserParamsSchema.parse(request.params);

  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });

  return { user };
});

server.post('/', async (request, reply) => {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string()
  });

  const { name, email } = createUserBodySchema.parse(request.body);

  await prisma.user.create({
    data: {
      name,
      email
    }
  });

  return reply.status(201).send();
});

server.put('/:id', async (request, reply) => {
  const updateUserParamsSchema = z.object({
    id: z.string()
  });

  const updateUserBodySchema = z.object({
    name: z.string(),
    email: z.string()
  });

  const { id } = updateUserParamsSchema.parse(request.params);
  const { name, email } = updateUserBodySchema.parse(request.body);

  await prisma.user.update({
    where: {
      id
    },
    data: {
      name,
      email
    }
  });

  return reply.status(204).send();
});

server.delete('/:id', async (request, reply) => {
  const deleteUserParamsSchema = z.object({
    id: z.string()
  });

  const { id } = deleteUserParamsSchema.parse(request.params);

  await prisma.user.delete({
    where: {
      id
    }
  });

  return reply.status(204).send();
});

server.delete('/', async (request, reply) => {
  await prisma.user.deleteMany();

  return reply.status(204).send();
});

server
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000
  })
  .then(() => {
    console.log('Server running on port 3000');
  });
