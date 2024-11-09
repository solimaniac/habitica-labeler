import {Cursor, Prisma, PrismaClient, Stats} from "@prisma/client";

const prisma = new PrismaClient();

export const upsertCursor = async (cursor: string) => {
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
    return cursor;
  }).catch((error) => {
    return null;
  });
}

export const createStats = async (
  localId: string,
  remoteId: string,
  playerClass: string,
  level: string,
  health: string,
  maxHealth: string,
  mana: string,
  maxMana: string,
) => {
  return prisma.stats.create({
    data: {
      localId,
      remoteId,
      class: playerClass,
      level,
      health,
      maxHealth,
      mana,
      maxMana,
      lastUpdated: new Date()
    }
  });
}

export const updateStats = async (
  id: string,
  remoteId: string,
  playerClass: string,
  level: string,
  health: string,
  maxHealth: string,
  mana: string,
  maxMana: string
) => {
  return prisma.stats.update({
    where: {
      id,
    },
    data: {
      remoteId,
      class: playerClass,
      level,
      health,
      maxHealth,
      mana,
      maxMana,
      lastUpdated: new Date()
    }
  });
}

export const updateStatsTimestamp = async (id: string) => {
  return prisma.stats.update({
    where: {
      id
    },
    data: {
      lastUpdated: new Date()
    }
  });
}

export const getStatsByLocalId = async (localId: string): Promise<Stats | null> => {
  try {
    return await prisma.stats.findFirstOrThrow({
      where: {
        localId: localId
      }
    });
  } catch (error) {
    return null;
  }
}

export const getStatsOlderThan = async (date: Date, limit: number): Promise<Stats[]> => {
  return prisma.stats.findMany({
    where: {
      lastUpdated: {
        lt: date,
      }
    },
    orderBy: {
      lastUpdated: Prisma.SortOrder.asc,
    },
    take: limit,
  });
}

export const deleteStatsById = async (id: string) => {
  return prisma.stats.delete({
    where: {
      id: id
    }
  });
}
