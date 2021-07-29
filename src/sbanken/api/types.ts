export interface ISbankenApiCredentials {
  userId: string;
  clientId: string;
  secret: string;
}

export interface ISbankenApiAccessToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface ISbankenAccountsApiResponse {
  availableItems: number;
  items: ISbankenAccount[];
  errorType: unknown;
  isError: boolean;
  errorCode: number | null;
  errorMessage: string | null;
  traceId: null;
}

export interface ISbankenAccount {
    accountId: string;
    accountNumber: string;
    ownerCustomerId: string;
    name: string;
    accountType: string;
    available: number;
    balance: number;
    creditLimit: number;
}

export interface ISbankenTransactionsApiResponse {
  availableItems: number;
  items: ISbankenTransacion[];
  errorType: unknown;
  isError: boolean;
  errorCode: number | null;
  errorMessage: string | null;
  traceId: null;
}

export interface ISbankenTransacion   {
    accountingDate: string;
    interestDate: string;
    otherAccountNumberSpecified: boolean;
    amount: number;
    text: string;
    transactionType: string;
    transactionTypeCode: number;
    transactionTypeText: string;
    isReservation: boolean;
    reservationType: unknown;
    source: string;
    cardDetailsSpecified: boolean;
    cardDetails?: {
      cardNumber: string;
      currencyAmount: number;
      currencyRate: number;
      merchantCategoryCode: string;
      merchantCategoryDescription: string;
      merchantCity: string;
      merchantName: string;
      originalCurrencyCode: string;
      purchaseDate: string;
      transactionId: string
    },
    transactionDetailSpecified: boolean;
  }

