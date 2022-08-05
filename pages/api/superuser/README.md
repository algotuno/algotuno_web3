## Overview
Added the following scripts:
- add_superuser.ts
- delete_superuser.ts
- get_all_superuser.ts
- get_one_superuser.ts

#### NOTICE
Some endpoints expect an authorization key in the Headers of each request. The authorization key must be indicated in the Headers as "authorization" : "NEXT_PUBLIC_API_SECRET_KEY **INSERT SECRET KEY**"

#### Usage
## add_superuser.ts
To add a superuser, send a POST request to the **/api/superuser/add_superuser** endpoint with the body contents as such:

Example:

```
{
    "username"      :   "test123"
}
```

## delete_superuser.ts
To delete a superuser, send a POST request to the **/api/superuser/add_superuser** endpoint with the body contents as such:

Example:

```
{
    "username"      :   "test123"
}
```

## get_all_superuser.ts
To get all superusers, send a GET request to the **/api/superuser/get_all_superuser** endpoint.

## get_one_superuser.ts
To get the details of one superuser, send a GET request to the **/api/superuser/get_one_superuser** endpoint with the body contents as such:

Example:
```
{
    "user_id"       :   "userid123"
}
```

