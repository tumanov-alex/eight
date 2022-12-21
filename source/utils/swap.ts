let resArr;
export const swap = (position1: number, position2: number, arr: any) => {
  resArr = [...arr];
  resArr[position1] = arr[position2];
  resArr[position2] = arr[position1];

  return resArr;
};
