### Prerequisite
```
node: v16.13.2
psql (PostgreSQL) 14.0
```

### Project Setup
Once you clone or download project go into you folder

>now cope **.env.local** file to **.env** file

### Installing
```
> npm install or yarn install  (this will install all dependent libraries)
```

### Env Config Setup
so in my **.env** file will set below parameters.
```
# DB SETTINGS
DB_NAME=test_db
DB_USER=postgres
DB_PASS=root
DB_PORT=5432
DB_HOST=localhost
SECRET_KEY=F4C31@T
# API PORT
PORT=3000
```
some other inportant parameters/keys in **.env** file
```
PORT=3000               # application port
SECRET_KEY=secret       # secret key for encrypt/decrypt JWT token
```

### Migration and Seeders run
Follow below steps to prepared database

Note: before runing migraion command make sure you have updated proper database details in `migration/config/config.json`
```
> npm run db # it will create database and required talbes with test data
```
Follow below steps to run migration script indivisually
```
> npm run db:create     #it will create database
> npm run db:migration  #it will tables
> npm run db:seed       #it will create test data
````
for more info in sript command in `package.json`

>Everythig is setup and you are good to go test. :)

```
run `npm start`
```

## Some of Example APIs
>here attached link of postman collection you can download and check in local
>https://planetary-sunset-244396.postman.co/workspace/Veemo-API~ddac532d-fb01-43f7-81d5-ba29d7e28cbe/collection/12480358-1b9d5fec-ea01-4786-9b10-be76ddb87456?action=share&creator=12480358

```
Set postman env global variable
HOST_API: http://localhost:3000
AUTH_TOKEN: genrated token
```

### Login
```
> POST : http:localhost:3000/v1/users/login   
> Payload: email, password
> Response : 
{
    "statusCode": 200,
    "type": "success",
    "message": "OK",
    "data": {
        "status": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM0NTYzODlhLTYwNDMtNDI4Zi04MTU4LTMzMDBiNDcyZjk2MSIsImlhdCI6MTY0NDA2NTY2M30.STfvi8WbjfHHjie8kNqYKlAffXPbUEzjeDlgHkHXL5I"
    }
}
