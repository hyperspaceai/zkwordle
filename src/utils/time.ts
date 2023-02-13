export const calculateResetInterval = () => {
  const now = new Date();
  const midnightUTC = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1, // next day
    0,
    0,
    0,
  );
  return midnightUTC.getTime() - now.getTime();
};
