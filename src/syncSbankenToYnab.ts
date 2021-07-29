import { filter, from, map, mergeMap } from "rxjs";
import * as sbanken from "./sbanken";
import * as ynab from "./ynab";
import fs  from "fs";
import { getEnviromentVariable } from "./utils";

const configPath = getEnviromentVariable("ACCOUNT_CONFIG_PATH");
const accountLink: { [key: string]: string} = JSON.parse(fs.readFileSync(configPath, "utf8"));

from(Object.entries(accountLink)).pipe(
  mergeMap(([ bankAccount, ynabAccount ]) => {
    return sbanken.getTransactionsFromAccount(bankAccount).pipe(
      filter((transactions) => transactions.length > 0),
      mergeMap((transactions) => ynab.addTransactions(ynabAccount, transactions)),
      map((response) => `Sync for bank account ${bankAccount} and YNAB account ${ynabAccount}
New: ${response.transaction_ids.length}
Duplicates: ${response.duplicate_import_ids.length}
`
      )
    );
  })
).subscribe(console.log);
