import { ajax } from "rxjs/ajax";
import { createXHR } from "../../utils/rx-utils";
import { map, mergeMap, take } from "rxjs";
import type { IYNABAccountsReponse, IYNABBudgetsReponse, IYNABPostTransactionsResponse, IYNABTransactionsResponse, IYNABUserResponse , IYNABTransaction} from "./types";
import dayjs from "dayjs";


const BASE_URL_V1 = "https://api.youneedabudget.com/v1";

export const getUser = (accessToken: string) => {
  return ajax<IYNABUserResponse>({
    createXHR,
    url: `${BASE_URL_V1}/user`,
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).pipe(
    map(resp => resp?.response?.data?.user?.id)
  );
};

export const getLastModifiedBudget = (accessToken: string) => {
  return ajax<IYNABBudgetsReponse>({
    createXHR,
    url: `${BASE_URL_V1}/budgets`,
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).pipe(
    map(resp => resp.response?.data?.budgets),
    map(budgets => budgets.map((budget) => ({
      ...budget,
      last_modified_on: dayjs(budget.last_modified_on)
    }))),
    mergeMap(budgets => budgets.sort(
      (a, b) => a.last_modified_on.isAfter(b.last_modified_on) ? -1 : 1)
    ),
    take(1),
  );
};

export const getAccounts = (accessToken: string) => (budgetId: string) => {
  return ajax<IYNABAccountsReponse>({
    createXHR,
    url: `${BASE_URL_V1}/budgets/${budgetId}/accounts`,
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).pipe(
    map(resp => resp?.response?.data?.accounts)
  );
};

export const getTransactions = (accessToken: string) => (budgetId: string) => {
  return ajax<IYNABTransactionsResponse>({
    createXHR,
    url: `${BASE_URL_V1}/budgets/${budgetId}/transactions`,
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).pipe(
    map(resp => resp?.response?.data?.transactions)
  );
};

export const addTransactions = (accessToken: string, budgetId: string) => (transactions: { transactions: IYNABTransaction[]}) => {
  return ajax<IYNABPostTransactionsResponse>({
    createXHR,
    method: "POST",
    url: `${BASE_URL_V1}/budgets/${budgetId}/transactions`,
    body: transactions,
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }).pipe(
    map(resp => resp.response?.data)
  );
};
