export const trimHttp = (str: string) => {
  return str.replace(/https?:\/\//, "");
};

export const randomId = (length = 8) => {
  return (Math.random() * 1e32).toString(36).slice(0, length);
};
