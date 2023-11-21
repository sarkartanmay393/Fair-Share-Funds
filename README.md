# FairShareFunds


### Server Routes

```md
Endpoint            Methods   Rule                      
------------------  --------  --------------------------
createroomresource  POST      /api/room                 
entryresource       GET       /                         
loginresource       POST      /api/login                
roomresource        GET, PUT  /api/room/<string:room_id>
signupresource      POST      /api/signup               
static              GET       /static/<path:filename>   
userresource        GET, PUT  /api/user
```