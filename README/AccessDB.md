```docker exec -it db bash``` => Access the db docker
```psql -d $POSTGRES_DB -U $POSTGRES_USER``` => log in with the ids.
```\l``` => list the dbs.
```\c``` <postgres> => connect to selected db
```\dt``` => list the tables in the db.
```SELECT * FROM user_appuser;``` => show the content of the db.

https://www.w3schools.com/sql/sql_syntax.asp