import { ISbankenApiCredentials } from "./types";
import { getEnviromentVariable } from "../../utils";


const credentials: ISbankenApiCredentials = {
  userId: getEnviromentVariable("SBANKEN_USERID"),
  clientId: getEnviromentVariable("SBANKEN_CLIENTID"),
  secret: getEnviromentVariable("SBANKEN_SECRET"),
};

export default credentials;
