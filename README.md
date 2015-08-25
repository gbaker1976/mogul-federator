mogul-api
=========

The restful api for the mogul project.

GET accounts
curl -i http://localhost:10000/accounts -H "Authorization: Bearer foo"

POST account
garrett$ curl -i http://localhost:10000/accounts -H "Authorization: Bearer foo" -H "content-type: application/json" -X POST -d '{"username": "foo", "password": "bar", "firstname": "Bob", "lastname": "robertson"}'
