import credentials from "./api/credentials";
import * as sbankenApi from "./api";
import { find, identity, map, mergeMap, Observable, toArray } from "rxjs";
import { ICommonTransaction } from "../types";
import { ISbankenTransacion } from "./api/types";
import dayjs from "dayjs";


const parseSbankenTransaction = (transaction: ISbankenTransacion): ICommonTransaction => ({
  amount: transaction.amount,
  date: dayjs(transaction.accountingDate),
  memo: transaction.text,
});

export const getTransactionsFromAccount = (accountNumber: string): Observable<ICommonTransaction[]> => (
  sbankenApi.getAccessToken(credentials).pipe(
    mergeMap((accessToken) => (
      sbankenApi.getAccounts(accessToken).pipe(
        mergeMap(identity),
        find((account) => account.accountNumber === accountNumber),
        map((account) => account.accountId),
        mergeMap(sbankenApi.getTransactions(accessToken))
      ))),
    mergeMap(identity),
    map(parseSbankenTransaction),
    toArray(),
  )
);
