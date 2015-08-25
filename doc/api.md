FORMAT: 1A
HOST: http://api.app.com

# mogul
Mogul API (Zartan).

# Group Accounts
Account related resources of the **Mogul API**

## Accounts Collection [/accounts]
### List all Accounts [GET]
+ Response 200 (application/json)

        {
            "entities": [{
                "id": 1,
                "username": "elephantking24",
                "firstName": "George",
                "lastName": "Fapgar"
                }, {
                "id": 2,
                "username": "purplejack04",
                "firstName": "Lorena",
                "lastName": "Blobbit"
            }]
        }

### Create an Account [POST]
+ Request (application/json)

        {
            "username": "elephantking24",
            "firstName": "George",
            "lastName": "Fapgar"
        }

+ Response 201 (application/json)

        {
            "id": 3,
            "username": "elephantking24",
            "firstName": "George",
            "lastName": "Fapgar"
        }

## Account [/accounts/{accountId}]
A single Account object with all its details

+ Parameters
    + accountId (required, number, `1`) ... Numeric `id` of the Account to perform action with. Has example value.

### Retrieve an Account [GET]
+ Response 200 (application/json)

    + Body

            {
                "id": 2,
                "username": "elephantking24",
                "firstName": "George",
                "lastName": "Fapgar"
            }

### Remove an Account [DELETE]
+ Response 204

## Account Connectors Collection [/accounts/{accountId}/connectors]
A collection of provisioned connectors within an account.

+ Parameters
    + accountId (required, number, `1`) ... Numeric `id` of the Account to perform action with. Has example value.

### List all Account Connectors [GET]
+ Response 200 (application/json)

        {
            "entities": [{
                "id": 1,
                "username": "elephantking24",
                "firstName": "George",
                "lastName": "Fapgar"
                }, {
                "id": 2,
                "username": "purplejack04",
                "firstName": "Lorena",
                "lastName": "Blobbit"
            }]
        }

### Create an Account Connector [POST]
+ Request (application/json)

        {
            "username": "elephantking24",
            "firstName": "George",
            "lastName": "Fapgar"
        }

+ Response 201 (application/json)

        {
            "id": 3,
            "username": "elephantking24",
            "firstName": "George",
            "lastName": "Fapgar"
        }

## Account Connector [/accounts/{accountId}/connectors/{connectorId}]
A single Account object with all its details

+ Parameters
    + accountId (required, number, `1`) ... Numeric `id` of the Account to perform action with. Has example value.
    + connectorId (required, number, `1`) ... Numeric `id` of the Account Connector to perform action with. Has example value.

### Retrieve an Account Connector [GET]
+ Response 200 (application/json)

    + Body

            {
                "id": 2,
                "username": "elephantking24",
                "firstName": "George",
                "lastName": "Fapgar"
            }

### Remove an Account Connector [DELETE]
+ Response 204

# Group Connectors
Connectors related resources of the **Mogul API**

## Connectors Collection [/connectors]
### List all Connectors [GET]
+ Response 200 (application/json)

        [{
            "id": 1,
            "name": "Etsy Shop",
            "type": 1
        }, {
            "id": 2,
            "name": "Facebook",
            "type": 2
        }]

### Create an Connector [POST]
+ Request (application/json)

        {
            "name": "Etsy Shop",
            "type": 1
        }

+ Response 201 (application/json)

        {
            "id": 1,
            "name": "Etsy Shop",
            "type": 1
        }

## Connector [/connectors/{connectorId}]
A single Connector object with all its details

+ Parameters
    + connectorId (required, number, `1`) ... Numeric `id` of the Connector to perform action with. Has example value.

### Retrieve a Connector [GET]
+ Response 200 (application/json)

    + Body

            {
                "id": 1,
                "name": "Etsy Shop",
                "type": 1
            }

### Remove a Domain [DELETE]
+ Response 204

# Group Domains
Domains related resources of the **Mogul API**

## Domains Collection [/domains]
### List all Domains [GET]
+ Response 200 (application/json)

        [{
            "id": 1, "name": "www.foo.com"
        }, {
            "id": 2, "name": "www.bar.com"
        }]

### Create an Domain [POST]
+ Request (application/json)

        {
            "name": "www.foo.com"
        }

+ Response 201 (application/json)

        { "id": 3, "name": "www.foo.com" }

## Domain [/domains/{domainId}]
A single Domain object with all its details

+ Parameters
    + domainId (required, number, `1`) ... Numeric `id` of the Domain to perform action with. Has example value.

### Retrieve a Domain [GET]
+ Response 200 (application/json)
    + Body

            { "id": 2, "name": "www.foo.com" }

### Remove a Domain [DELETE]
+ Response 204

# Group Sites
Sites related resources of the **Mogul API**

## Sites Collection [/sites]
### List all Sites [GET]
+ Response 200 (application/json)

        [{
            "id": 1,
            "domains": [ 1, 2, 3 ],
            "title": "My Awesome Site"
            }, {
            "id": 2,
            "domains": [ 1, 2, 3 ],
            "title": "Shopping Emporium"
            }]

### Create a Site [POST]
+ Request (application/json)

        {
            "name": "My Awesome Site",
            "domains": [1, 2, 3],
            "description": "This site is the epitome of awesomeness."
        }

+ Response 201 (application/json)

        {
        "id": 3,
        "name": "My Awesome Site",
        "domains": [1, 2, 3],
        "description": "This site is the epitome of awesomeness."
        }

## Site [/sites/{siteId}]
A single Site object with all its details

+ Parameters
    + siteId (required, number, `1`) ... Numeric `id` of the Site to perform action with. Has example value.

### Retrieve a Site [GET]
+ Response 200 (application/json)
    + Body

            {
            "id": 1,
            "name": "My Awesome Site"
            "domains": [1, 2, 3],
            "description": "This is the epitome of awesomeness."
            }

### Remove a Site [DELETE]
+ Response 204

## Pages Collection [/sites/{siteId}/pages]
### List all Pages for a site [GET]
+ Parameters
    + siteId (required, number, `1`) ... Numeric `id` of the Site for which to retrieve pages. Has example value.

+ Response 200 (application/json)

        [{
        "id": 1, "title": "My Awesome Site"
        }, {
        "id": 2, "title": "Shopping Emporium"
        }]

### Create a Page [POST]
+ Request (application/json)

        {
        "title": "Shoes Kaboose"
        }

+ Response 201 (application/json)

        { "id": 3, "title": "Shoes Kaboose" }

## Page [/sites/{siteId}/pages/{pageId}]
A single page object with all its details

+ Parameters
    + siteId (required, number, `1`) ... Numeric `id` of the Site to perform action with. Has example value.
    + pageId (required, number, `1`) ... Numeric `id` of the Page to perform action with. Has example value.

### Retrieve a Page [GET]
+ Response 200 (application/json)
    + Body

            { "id": 2, "title": "Shoes Kaboose" }

### Remove a Page [DELETE]
+ Response 204

# Group Jobs
Job related resources of the **Mogul API**

Jobs represent units of work that are requested by the UI or other parts of the system.
All jobs are async.

## Jobs Collection [/jobs]
### List all Jobs [GET]
+ Response 200 (application/json)
    + Body

            [{
            "id": 1,
            "itemId": 1,
            "itemTypeId": 1,
            "actionId": 1,
            "statusId": 1,
            "entities":[
            {
            "id": 2,
            "itemId": 2,
            "itemTypeId": 2,
            "actionId": 2,
            "eventDate": "2015-02-28T20:16:12+00:00"
            }
            ]
            }, {
            "id": 4,
            "itemId": 1,
            "itemTypeId": 1,
            "actionId": 1,
            "statusId": 1,
            "entities":[
            {
            "id": 5,
            "itemId": 5,
            "itemTypeId": 2,
            "actionId": 2,
            "eventDate": "2015-02-28T20:16:12+00:00"
            }
            ]
            }]

### Create an Job [POST]
+ Request (application/json)

            {
        "itemId": 1,
        "itemTypeId": 1,
        "actionId": 1,
        "entities":[{
            "id": 2,
            "itemId": 2,
            "itemTypeId": 2,
            "actionId": 2,
            "eventDate": "2015-02-28T20:16:12+00:00"
            }
        ]
        }

+ Response 201 (application/json)

        {
        "id": 1,
        "itemId": 1,
        "itemTypeId": 1,
        "actionId": 1,
        "statusId": 1,
        "entities":[
        {
        "id": 2,
        "itemId": 2,
        "itemTypeId": 2,
        "actionId": 2,
        "eventDate": "2015-02-28T20:16:12+00:00"
        }
        ]
        }

## Job [/jobs/{jobId}]
A single Job object with all its details

+ Parameters
    + jobId (required, number, `1`) ... Numeric `id` of the Job to perform action with. Has example value.

### Retrieve an Job [GET]
+ Response 200 (application/json)

    + Body

            {
            "id": 1,
            "itemId": 1,
            "itemTypeId": 1,
            "actionId": 1,
            "statusId": 1,
            "entities":[
            {
            "id": 2,
            "itemId": 2,
            "itemTypeId": 2,
            "actionId": 2,
            "eventDate": "2015-02-28T20:16:12+00:00"
            }
            ]
            }

### Remove a Job [DELETE]
+ Response 204

# Group Insights
Insights related resources of the **Mogul API**

Insights are Mogul analytics. The name analytics is just clunky.

## Insights Collection [/insights]
### List all Jobs [GET]
+ Response 200 (application/json)

        [{
            "id": 1
        }]

### Create an Insight [POST]
+ Request (application/json)

        {}

+ Response 201 (application/json)

        {
            "id": 1
        }

## Insight [/insights/{insightId}]
A single Insight object with all its details

+ Parameters
    + insightId (required, number, `1`) ... Numeric `id` of the Insight to perform action with. Has example value.

### Retrieve an Insight [GET]
+ Response 200 (application/json)
    + Body

            {
                "id": 1
            }

### Remove an Insight [DELETE]
+ Response 204

# Group Applications
Applications related resources of the **Mogul API**

## Applications Collection [/applications]
### List all Applications [GET]
+ Response 200 (application/json)

        [{
            "id": 1
        }]

### Create an Application [POST]
+ Request (application/json)

        {}

+ Response 201 (application/json)

        {
            "id": 1
        }

## Application [/applications/{applicationId}]
A single Application object with all its details

+ Parameters
    + applicationId (required, number, `1`) ... Numeric `id` of the Application to perform action with. Has example value.

### Retrieve an Application [GET]
+ Response 200 (application/json)
    + Body

            {
                "id": 1
            }

### Remove an Application [DELETE]
+ Response 204
