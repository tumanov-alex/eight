// swaps two elements in an array
export const swap = <T>(arr: T[], indexA: number, indexB: number): T[] => {
  const newArr = [...arr];
  [newArr[indexA], newArr[indexB]] = [newArr[indexB], newArr[indexA]];
  return newArr;
};
