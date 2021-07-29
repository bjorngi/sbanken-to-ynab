import type { ISbankenApiCredentials, ISbankenApiAccessToken, ISbankenAccountsApiResponse, ISbankenTransactionsApiResponse, ISbankenTransacion } from "./types";
import btoa from "btoa";
import { createXHR } from "../../utils/rx-utils";
import { ajax } from "rxjs/ajax";
import { map, Observable } from "rxjs";



const BASE_URL_V1 = "https://publicapi.sbanken.no/apibeta/api/v1";

export const getAccessToken = (credentials: ISbankenApiCredentials): Observable<string> => {

  const identityServerUrl = "https://auth.sbanken.no/identityserver/connect/token";
  const basicAuth: string = btoa(`${encodeURIComponent(credentials.clientId)}:${encodeURIComponent(credentials.secret)}`);

  return ajax<ISbankenApiAccessToken>({
    createXHR,
    method: "POST",
    url: identityServerUrl,
    body: "grant_type=client_credentials",
    headers: {
      "Authorization":  `Basic ${basicAuth}`,
      "Accept": "application/json",
      customerId: credentials.userId,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).pipe(
    map((resp) => resp?.response?.access_token),
  );
};


export const getAccounts = (accessToken: string): Observable<ISbankenAccountsApiResponse["items"]> => {
  return ajax<ISbankenAccountsApiResponse>({
    createXHR,
    url: `${BASE_URL_V1}/accounts`,
    headers: {
      "Authorization":  `Bearer ${accessToken}`,
    }
  }).pipe(
    map((resp) => resp?.response?.items),
  );
};

export const getTransactions = (accessToken: string) => (accountNumber: string): Observable<ISbankenTransacion[]> => {
  return ajax<ISbankenTransactionsApiResponse>({
    createXHR,
    url: `${BASE_URL_V1}/transactions/${accountNumber}`,
    headers: {
      "Authorization":  `Bearer ${accessToken}`,
      "Accept": "application/json",
    }
  }).pipe(
    map(resp => resp.response?.items),
  );
};
