// todo: add support for matrices bigger than 3

export const getInvariantCount = (nums: number[]): number => {
  let invariants = 0;

  for (let i = 0; i < 8; ++i) {
    for (let j = 1; j < 9; ++j) {
      if (nums[j] && nums[i] && nums[i] > nums[j]) {
        ++invariants;
      }
    }
  }

  return invariants;
};
