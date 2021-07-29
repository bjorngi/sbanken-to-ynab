import dotenv from "dotenv";
dotenv.config();

export const getEnviromentVariable = (variable: string): string => {
  const data = process.env[variable];
  if(!data) {
    throw new Error(`Missing enviroment variable ${variable}`);
  }
  return data;
};
