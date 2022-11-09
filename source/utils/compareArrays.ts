export const compareArrays = <T>(arr1: T[], arr2: T[]): boolean => {
  return arr1.every((el, i) => el === arr2[i]);
};
