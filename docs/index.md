## Getting Started

Use the **DB Browser** app to export CSV to our ./data/profeval SQLite database.

- use .csv files exported from original MDB

- Available at: `https://github.com/sqlitebrowser/sqlitebrowser`

- Then export SQLite DB to an SQL file

## Use wrangler to load the data into the database:

```bash
npx wrangler login

npx wrangler d1 create prod-profeval

npx wrangler d1 execute prod-profeval --local --file=./data/profeval.sql
```

### VAlidate data locally

```bash
npx wrangler d1 execute prod-profeval --local --command="SELECT * FROM Schools"
```
