Sbanken stenger ned. Jeg flytter til Sparebank1, her er ekvivalenten til sbanken-to-ynab for sparebank1, https://github.com/bjorngi/sparebank1-to-ynab


Automatisk synkroniser [Sbanken](https://sbanken.no/) med [You Need A Budget (YNAB)](https://www.youneedabudget.com/).

Programmet er laget for å kjøres med CRON eller annen orkestering som kjører programmet gjenvlig.
Etter at appen har startet vil den synkronisere alle transaksjoner fra [Account config](#account-config) for å så avslutte når det er ferdig.


# Miljø

## Variabler
```
SBANKEN_USERID=xxxfødselsnummerxxx
SBANKEN_CLIENTID=client-id-fra-sbanken
SBANKEN_SECRET=passord-fra-sbanken
YNAB_TOKEN=token-fra-ynab
YNAB_BUDGET=budget-id-fra-ynab
ACCOUNT_CONFIG_PATH=/path/to/account/config.json
```
### SBANKEN_USERID
Ditt fødselsnummer

### SBANKEN_CLIENTID
Vises på under **Applikasjonsnøkkel** [Sbanken sin utviklerportal](https://secure.sbanken.no/Personal/ApiBeta/Info) når en klient er laget

### SBANKEN_SECRET
Vises midlertidlig når man trykker **Bestill nytt passord** på [Sbanken sin utviklerportal](https://secure.sbanken.no/Personal/ApiBeta/Info)

### YNAB_TOKEN
Vises når man lager nytt **Personal Access Token** på [YNAB sin utviklerportal](https://app.youneedabudget.com/settings/developer)

### YNAB_BUDGET
Kan sees i URL når man åpner ett budskjett i YNAB
(eg. app.youneedabudget.com/**28b5535e-50cc-4800-b4c7-61151500a996**/budget)

### ACCOUNT_CONFIG_PATH
Absolutt path til `config.json` fil


## Account config
Link the correct bank account to the respective ynab account
```json
{
  "980xxxxxxxx": "28b5535e-50cc-4800-b4c7-61151500a996",
  "980xxxxxxxx": "716ebdfe-ee99-4c67-b9b1-dca19ecd96f5",
  "980xxxxxxxx": "2c422638-2804-4b0c-91f9-033bb4267dda",
  "980xxxxxxxx": "9d99cc85-40ed-47c5-92b4-f218135c8841"
  "key": "verdi"
}
```
Key er kontonummeret ditt i Sbanken og verdi er én YNAB budskjett konto som skal lenkes

Kan sees i URL når man trykker på en konto i YNAB, app.youneedabudget.com/28b5535e-50cc-4800-b4c7-61151500a996/accounts/**9d99cc85-40ed-47c5-92b4-f218135c8841**


# Kjør 
1. Lag [YNAB Personal Access Token](https://app.youneedabudget.com/settings/developer) ([docs](https://api.youneedabudget.com/))
2. Aktiver [Sbanken developer program](https://secure.sbanken.no/Home/Settings/BetaProgram)
3. Lag [application in Sbanken](https://secure.sbanken.no/Personal/ApiBeta/Info)
4. Lag [new password in Sbanken](https://secure.sbanken.no/Personal/ApiBeta/Info)
5. Lag `.env` fil og legg til [variables](#variables)
6. Lag `config.json` med [account mapping](#account-config)
7. Kjør med docker: `docker run --env-file .env --env ACCOUNT_CONFIG_PATH=/app/config.json -v $(pwd)/config.json:/app/config.json ghcr.io/bjorngi/sbanken-to-ynab/sbanken-to-ynab:latest`
