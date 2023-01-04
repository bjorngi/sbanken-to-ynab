import credentials from "./api/credentials";
import * as sbankenApi from "./api";
import { find, identity, map, mergeMap, Observable, toArray } from "rxjs";
import { ICommonTransaction } from "../types";
import { ISbankenTransacion } from "./api/types";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

const getDateFromText = (memo: ISbankenTransacion["text"]) => {
  const whereDateShouldBe = memo.slice(6,11);
  const parsedDate = dayjs(whereDateShouldBe, "DD.MM", true);
  return parsedDate;
};

const getBestDate = (transaction: ISbankenTransacion) => {
  const dateFromText = getDateFromText(transaction.text);
  if(dateFromText.isValid() && dateFromText.isBefore(dayjs())) {
    return dateFromText;
  } else if(transaction.cardDetailsSpecified && dayjs(transaction.cardDetails.purchaseDate).isBefore(dayjs())) {
    return dayjs(transaction.cardDetails.purchaseDate);
  } else if(transaction.transactionDetailSpecified) {
    return dayjs(transaction.transactionDetail.registrationDate);
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

