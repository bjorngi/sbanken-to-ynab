import * as ynabApi from "./api/index";
import dotenv from "dotenv";
import { getEnviromentVariable } from "../utils";
import { filter, from, identity, map, toArray, mergeMap, zip } from "rxjs";
import { groupBy, mergeAll, scan } from "rxjs/operators";
import { IYNABTransaction } from "./api/types";
import { ICommonTransaction } from "../types";
import dayjs from "dayjs";
dotenv.config();

const accessToken = getEnviromentVariable("YNAB_TOKEN");
const budgetId = getEnviromentVariable("YNAB_BUDGET");

const parseYnabToCommonTransaction = (transaction: IYNABTransaction): ICommonTransaction => ({
  amount: transaction.amount/1000,
  ynabAccountNumber: transaction.account_id,
  memo: transaction.memo,
  date: dayjs(transaction.date),
  payee: transaction.payee_name,
});

export const getTransactionsFromAccount = (ynabAccountNumber: string) => (
  ynabApi.getTransactions(accessToken)(budgetId).pipe(
    mergeMap(identity),
    filter((transaction) => transaction.account_id === ynabAccountNumber),
    map(parseYnabToCommonTransaction),
    toArray(),
  )
);

const parseCommonToYnabTransactions = (ynabAccountNumber: string, importId = 1) => (transaction: ICommonTransaction): IYNABTransaction => {
  const parsedAmount = Math.round(transaction.amount * 1000);
  const formatedDate = transaction.date.format("YYYY-MM-DD");

  return {
    date: formatedDate,
    amount: parsedAmount,
    memo: transaction.memo,
    payee_name: transaction.memo,
    flag_color: "blue",
    account_id: ynabAccountNumber,
    cleared: "cleared",
    import_id: `YNAB:${parsedAmount}:${formatedDate}:${importId}`
  };
};

type ScanType = [number[], number, ICommonTransaction]
const findDuplicates = (acc: ScanType, cur: ICommonTransaction): ScanType => {
  const [prevAmounts] = acc;
  const newAmounts = [...prevAmounts as number[], cur.amount];
  const countAmount = newAmounts.filter((a) => a === cur.amount).length;
  return [newAmounts, countAmount, cur];
};

export const addTransactions = (ynabAccountNumber: string, transactions: ICommonTransaction[]) => {
  return zip(from(transactions).pipe(
    groupBy((transaction) => transaction.date.format("YYYY-MM-DD")),
    mergeMap((group$) => group$.pipe(
      scan(findDuplicates, [[], 1, null]),
      map(([amounts, importId, transaction]) => parseCommonToYnabTransactions(ynabAccountNumber, importId)(transaction)),
    )))).pipe(
    mergeAll(),
    toArray(),
    map((transactions) => ({
      transactions: transactions,
    })),
    mergeMap(ynabApi.addTransactions(accessToken, budgetId))
  );
};
