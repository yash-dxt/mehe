## 🌐 REST APIs Documentation

### **💥 Signup API**

> **POST /auth/signup**
> 

> Authorization not required.
> 

```
// Body raw (json)
// @required
username: - should be minimum of 3 characters & maximum 25 characters
	- only lowercase alphabets & numericals allowed
	- ex: dwight12, yash20, jimpam420

password: - should contain a maximum of 100 characters & minimum of 8 characters
	- ex: yash123456789

email: - should be a valid email 
	- ex: yashdixitsq@gmail.com
```

Example of Request: 
Body Raw (JSON)

```json
{
	"username": "yash123", 
	"password": "Default@123", 
	"email": "yashdixitsq@gmail.com"
}
```

Example of successful response: 

```json
{
    "message": "user created",
    "id": "6299f058cd0adfd0eac06686",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InTY1NDI1NTcwNH0.eo6kPn38msOoZV6mOtF0LhzTk2pn_R8"
}
```
**Implementation Steps:** 

1. Do schema validation of request using ***joi.*** 
2. Hash the password & sign access token (***jsonwebtoken***) for saving in database. 
3. Save the details of user in Database (check database designs) 
4. Return success.


### **💥 Login API**

> **POST /auth/login**
> 

> Authorization not required.
> 

```
// Body raw (json)
// @required
username: - should be minimum of 3 characters & maximum 25 characters
					- only lowercase alphabets & numericals allowed
					- ex: dwight12, yash20, jimpam420

password: - should contain a maximum of 100 characters & minimum of 8 characters
					- ex: yash123456789
```

Example of Request: 
Body Raw (JSON)
```json

{
	"username": 'yash123', 
	"password": 'Default@123', 
}
```

Example of successful response: 

```json
{
    "user": {
        "_id": "62990b42c5c7eefcdac0c130",
        "username": "yashdixit123",
        "email": "yash@attentioun.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inlhc2hkaXhpdDEyMyIsImlhdCI6MTY1NDE5NzA1OH0.HAslReqcoWdGVPRqUDmI7xA0J1iqBGasXWafAFZTDTM",
        "ban": false,
        "verified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inlhc2hkaXhpdDEyMyIsImlhdCI6MTY1NDI1OTgzN30.iOpmM-tXJOakv08nMvXhISsMqwnAyxXEHENutgo_0qI"
}
```

**Implementation Steps:** 

1. Do schema validation of request using ***joi.*** 
2. Check for user in Database & compare hashed password (using ***bcrypt***)
3. Sign new access token, and save it in database. 
4. Return response, delete hashed password.


---
## 🛫 Dependencies/Packages Used:

In NodeJS you can import packages using npm: 

**How?**

- **npm init -y**
    - Initialized package.json & all the multiple options yes (due to -y)
- **npm install <package_name>**
    - Once package.json is initialized - this command can be used throughout the project for importing new projects.

### Packages:

**Security Related Packages:** 

📦 **[joi](https://www.npmjs.com/package/joi)**

- Using this for schema validation
- It is used in utils/joi/ folder & used to validate incoming schema.
- List thought by Specific User API

📦 **[bcryptjs](https://www.npmjs.com/package/bcryptjs)**

- Encrypting passwords & checking them when the user is logging in. We’ll be using the async method in this package.

📦 **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**

- For Signing & verifying access tokens. We’re keeping one login - i.e. - one access token stored in the database.

**Core Packages (Database & Routing):** 

📦 **[express](https://www.npmjs.com/package/express)**

- framework for providing routing in a simple, subtle way (creating REST APIs)

📦 **[mongodb](https://www.npmjs.com/package/mongodb)**

- I’ll be using the MongoDB driver instead of an ORM.
- Will be writing native queries for mongo.

**Miscellaneous Packages:** 

📦 **[dotenv](https://www.npmjs.com/package/dotenv)**

- Used for reading environment variables through multiple environments.
- This package is used in *config.js* and all the environment variables are distributed through that file.

📦 **[express-async-errors](https://www.npmjs.com/package/express-async-errors)**

- This is a hack for solving errors which will get uncaught if you have asynchronous functions. If you don’t use this. Express won’t detect async errors and the request would timeout. It’s pretty useful.
---
## 💽 Database Design

![Database Design ](./images/database-design.jpg)

We’ve got three collections, so far: 

*t**houghts*** & ***replies*** collection is linked to the ***users*** table using the username. 

Both, ***thought*** and ***replies*** have a status, which is one of the following - 

- PUBLISHED
- DRAFT
- REMOVED
- DELETED

**Some internals on indexing of MongoDB:** 

- In MongoDB the indexes come built in with the **_id** (the created at time can also be derived from them) so in each collections we’ll have that **_id**. Also, this **_id** is always unique.
- Other than this we can have unique indexes (MongoDB also supports those) on **username** field in **users** collection.

✨ MongoDB supports many many indexes. You can use **MongoDB Compass** to get an awesome view of Explain Plan to see if the indexes you intended to use are being used properly or not in your queries.
