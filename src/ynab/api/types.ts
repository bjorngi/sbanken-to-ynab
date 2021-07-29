export interface IYNABUserResponse {
  data: {
    user: {
      id: string;
    }
  }
}

export interface IYNABAccount {
  id: string;
  name: string;
  type: string;
  on_budget: boolean;
  closed: boolean;
  note: string;
  balance: number;
  cleared_balance: number;
  uncleared_balance: number;
  transfer_payee_id: string;
  direct_import_linked: boolean;
  direct_import_in_error: boolean;
  deleted: boolean;
}
export interface IYNABBudget {
      id: string;
      name: string;
      last_modified_on: string;
      first_month: string;
      last_month: string;
      date_format: {
        format: string;
      };
      currency_format: {
        iso_code: string;
        example_format: string;
        decimal_digits: number;
        decimal_separator: string;
        symbol_first: boolean;
        group_separator: string;
        currency_symbol: string;
        display_symbol: boolean;
      accounts: IYNABAccount[]
    }
}

export interface IYNABTransaction {
  id?: string;
  date: string;
  amount: number,
  memo?: string;
  cleared?: string;
  approved?: true,
  flag_color?: string;
  account_id: string;
  payee_id?: string;
  category_id?: string;
  transfer_account_id?: string;
  transfer_transaction_id?: string;
  matched_transaction_id?: string;
  import_id: string;
  deleted?: boolean,
  account_name?: string;
  payee_name: string;
  category_name?: string;
  subtransactions?: unknown[]
}

export interface IYNABBudgetsReponse  {
  data: {
    budgets: IYNABBudget[];
    defualt_budget: IYNABBudget;
  }
}

export interface IYNABAccountsReponse {
  data: {
    accounts: IYNABAccount[];
    server_knowledge: number;
  }
}

export interface IYNABTransactionsResponse {
  data: {
    transactions: IYNABTransaction[];
    server_knowledge: number;
  }
}

export interface IYNABPostTransactionsResponse {
  data: {
    transaction_ids: string[];
    duplicate_import_ids: string[];
    transactions: IYNABTransaction[];
    server_knowledge: number;
  }
}
