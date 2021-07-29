import xhr2 from "xhr2";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createXHR = () => {
  return new xhr2();
};
