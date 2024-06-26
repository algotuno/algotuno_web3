## Overview
Added the following scripts:
- add_or_update_settings.ts
- delete_settings.ts
- get_all_settings.ts

#### NOTICE
Some endpoints expect an authorization key in the Headers of each request. The authorization key must be indicated in the Headers as "authorization" : "NEXT_PUBLIC_API_SECRET_KEY **INSERT SECRET KEY**"

#### Usage
## add_or_update_setting.ts
To add/update a setting, send a POST request to the **/api/settings/add_or_update_settings** endpoint with the body contents as such:

Example:

```
{
    "setting_name" : "testconf", 
    "setting_value": "testval" 
}
```

## delete_setting.ts
To delete a setting, send a POST request to the **/api/settings/delete_settings** endpoint with the body contents as such:

Example:

```
{
    "setting_id"    :   3
}
```

OR 

```
{
    "setting_name"   :   "testconf"
}
```

## get_all_setting.ts
To get all settings, send a GET request to the **/api/settings/get_all_settings** endpoint.