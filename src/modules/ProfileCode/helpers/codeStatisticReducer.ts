import { type CodeStatistic } from '@prisma/client';

const codeStatisticReduce = (map: Map<string, number>, c: CodeStatistic) => {
  const key = c.city || c.country || c.region || '-';

  const count = map.get(key) ?? 0;
  map.set(key, count + 1);
  return map;
};

export { codeStatisticReduce };
