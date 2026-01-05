export const getNumRange = (start: number, end: number) => {
  const length = end - start + 1;

  return Array.from({ length }, (_, id) => id + start);
};
