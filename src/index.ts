function twosum(nums: number[], target: number) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const diff = target - nums[i];
    if (map.has(nums[i])) {
      return [i, map.get(nums[i])];
    }
    map.set(diff, i);
  }
  return [];
}
twosum([2, 7, 11, 15], 9);
