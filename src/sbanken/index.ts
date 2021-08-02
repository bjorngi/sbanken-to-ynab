import credentials from "./api/credentials";
import * as sbankenApi from "./api";
import { find, identity, map, mergeMap, Observable, toArray } from "rxjs";
import { ICommonTransaction } from "../types";
import { ISbankenTransacion } from "./api/types";
import dayjs from "dayjs";

const getBestDate = (transaction: ISbankenTransacion) => {
  if(transaction.cardDetailsSpecified) {
    return dayjs(transaction.cardDetails.purchaseDate);
  } else if(transaction.transactionDetailSpecified) {
    return dayjs(transaction.transactionDetail.registrationDate);
  } else if(
    !!transaction.interestDate &&
    !dayjs(transaction.interestDate).isAfter(dayjs(transaction.accountingDate))
  ) {
    return dayjs(transaction.interestDate);
  } else {
    return dayjs(transaction.accountingDate);
  }
};

const parseSbankenTransaction = (transaction: ISbankenTransacion): ICommonTransaction => ({
  amount: transaction.amount,
  date: getBestDate(transaction),
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

