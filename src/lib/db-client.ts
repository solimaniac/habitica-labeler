import {Cursor, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();


export const upsertCursor = async(cursor: string) => {
  return prisma.cursor.upsert({
    where: {
      id: 1
    },
    update: {
      content: cursor,
    },
    create: {
      id: 1,
      content: cursor,
    }
  });
}
export const getCursor = async (): Promise<Cursor | null> => {
  return prisma.cursor.findUniqueOrThrow({
    where: {
      id: 1
    }
  }).then((cursor) => {
    return cursor.content;
  }).catch((error) => {
    return null;
  });
}
