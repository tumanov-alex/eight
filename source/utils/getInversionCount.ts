// todo: add support for matrices bigger than 3

export const getInversionCount = (nums: number[]): number => {
  let inversions = 0;

  for (let i = 0; i < 8; ++i) {
    for (let j = i + 1; j < 9; ++j) {
      if (nums[j] && nums[i] && nums[i] > nums[j]) {
        ++inversions;
      }
    }
  }

  return inversions;
};
