export const compareArrays = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((el, i) => el === arr2[i]);
};
