export const swap = (position1: number, position2: number, arr: any) => {
  const numbers = [...arr];
  numbers[position1] = arr[position2];
  numbers[position2] = arr[position1];

  return numbers;
};
