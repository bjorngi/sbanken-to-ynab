import dayjs from "dayjs";

export interface ICommonTransaction {
  amount: number;
  ynabAccountNumber?: string;
  bankAccountNumber?: string;
  date: dayjs.Dayjs;
  memo: string;
  payee?: string;
}
