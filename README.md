## 🌐 REST APIs Docs & Implementation

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
	"username": "yash123", 
	"password": "Default@123", 
}
```

Example of successful response: 

```json
{
    "user": {
        "_id": "62990b42c5c7eefcdac0c130",
        "username": "yashdixit123",
        "email": "yash@attentioun.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inlhc2hkaXhpdDEyMyIsImlhdCI6MTY1NDQyMTcxNn0.hreNIh_vbQDKws4U2Hcs1PENC0eHKuGiim7DAH4X9NE",
        "ban": false,
        "verified": false
    }
}
```

**Implementation Steps:** 

1. Do schema validation of request using ***joi.*** 
2. Check for user in Database & compare hashed password (using ***bcrypt***)
3. Sign new access token, and save it in database. 
4. Return response, delete hashed password.

### **💥 Create Thought API**

> **POST /thought/**
> 

> **OAuth 2.0**
> 

```
// Body raw (json)
// @required
thought: - should be minimum of 5 characters & maximum of 350. 
				 - ex: "I am not feeling well today."

anonymous: - should be a boolean 
					 - required 
					 - ex: false, true
```

Example of Request: 
Body Raw (JSON): 

```json

{
		"thought": "I am not feeling too well today.",  
		"anonymous": false
}
```

Example of successful response: 

```json
{
    "message": "thought created",
    "id": "629b2032ea6ded56374b9c70"
}
```

### **💥 Add Reply to Thought API**

> **POST /reply/**
> 

> **OAuth 2.0**
> 

```
// Body raw (json)
// @required
reply: - should be minimum of 5 characters & maximum of 350. 
				 - ex: "Things get better."

anonymous: - should be a boolean 
					 - required 
					 - ex: false, true

thoughtId: - must be a valid thoughtId present in the database. 
```

Example of Request: 
Body Raw (JSON): 

```json

{
    "thoughtId": "629b2032ea6ded56374b9c70", 
    "reply": "Take care. Things get better with time.",
    "anonymous": false
}
```

Example of successful response: 

```json
{
    "message": "success",
    "id": "629b2032ea6ded56374b9c70"
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Do schema validation of request using ***joi.*** 
3. If anonymous: 
    - Don’t save username in database, only store userId.
    
    If not anonymous: 
    
    - Save username along with userId in the database.
    
    Also save thoughtId.
    
4. Return response.

### **💥 Get Thoughts**

> **GET /thought/**
> 

> **OAuth 2.0**
> 

Fetches all the thoughts that have been posted. 

This query has pagination implemented - you can use limit & skip filters. Although, by default it limits to 10 & skips 0. 

```
// Optional 
// Body raw (json) 
limit: Number. Should be greater than 0. 
skip: Number. Should be greater than or equal to 0. 
```

Example of successful response: 

```json
{
    "thoughts": [
        {
            "_id": "629b2032ea6ded56374b9c70",
            "thought": "Feeling great after grabbing job opportunity.",
            "userId": "62990b42c5c7eefcdac0c130",
            "anonymous": false,
            "status": "PUBLISHED",
            "username": "yashdixit123"
        }
    ]
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Verify if limit & skip are valid. If they are undefined use limit as 10 & skip as 0. 
3. Query database for thoughts - no filter. And then apply limit and skip. 
4. Return response.

### **💥 Get Thought And Corresponding Replies API**

> **GET /thought/id**
> 

> **OAuth 2.0**
> 

Fetches thought using a thoughtId. Also returns the replies of teh corresponding thought. 

```
// Query paramters
// @required
thoughtId: - must be a valid thoughtId present in the database. 
```

Example of Request: 

```json
Query : 

{
    "thoughtId": "629b2032ea6ded56374b9c70"
}
```

Example of successful response: 

```json
{
    "thoughts": {
        "_id": "629b2032ea6ded56374b9c70",
        "thought": "I'm not feeling too good.",
        "userId": "62990b42c5c7eefcdac0c130",
        "anonymous": false,
        "status": "PUBLISHED",
        "username": "yashdixit123",
        "replies": [
            {
                "_id": "629b20afea6ded56374b9c71",
                "thoughtId": "629b2032ea6ded56374b9c70",
                "reply": "keep going, things get well with time. ",
                "userId": "629b2010ea6ded56374b9c6f",
                "anonymous": false,
                "status": "PUBLISHED",
                "username": "yash12345"
            },
            {
                "_id": "629b20e0ea6ded56374b9c72",
                "thoughtId": "629b2032ea6ded56374b9c70",
                "reply": "take care.",
                "userId": "629b2010ea6ded56374b9c6f",
                "anonymous": false,
                "status": "PUBLISHED",
                "username": "yash12345"
            },
            {
                "_id": "629b215eea6ded56374b9c73",
                "thoughtId": "629b2032ea6ded56374b9c70",
                "reply": "thank you!",
                "userId": "62990b42c5c7eefcdac0c130",
                "anonymous": false,
                "status": "PUBLISHED",
                "username": "yashdixit123"
            }
        ]
    }
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Do schema validation of request.
3. Do the aggregation query for getting replies which correspond to the thoughtId. 
    - This gets done by using aggregation pipeline in mongodb: 
        - First use $match (for getting specific thought) on thoughts collections.
        - Then use $lookup (same as JOIN) and join on replies table.
    
    ![Our Aggregation Pipeline](./images/aggregation-query.jpg)
    
4. Return response.


### **💥 Get Own Thoughts**

> **GET /thought/self**
> 

> **OAuth 2.0**
> 

> **No Parameters Required**
> 

Fetches all your own thoughts - be it anonymous and non-anonymous (can only be accessed by you) 

Example of successful response: 

```json
{
    "thoughts": [
        {
            "_id": "629b2032ea6ded56374b9c70",
            "thought": "Feeling great after grabbing job opportunity.",
            "userId": "62990b42c5c7eefcdac0c130",
            "anonymous": false,
            "status": "PUBLISHED",
            "username": "yashdixit123"
        }
    ]
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Get UserId from authentication middleware’s passed on request. 
3. Query database for thoughts corresponding to specific userId.  
4. Return response.

### **💥 Get Thoughts By Username**

> **GET /thought/username**
> 

> **OAuth 2.0**
> 

> **Query parameters: username (required)**
> 

Fetches all the non-anonymous thoughts for a particular username. 

Example of successful response: 

```json
{
    "thoughts": [
        {
            "_id": "629b2032ea6ded56374b9c70",
            "thought": "Feeling great after grabbing job opportunity.",
            "userId": "62990b42c5c7eefcdac0c130",
            "anonymous": false,
            "status": "PUBLISHED",
            "username": "yashdixit123"
        }
    ]
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Verify if username is valid & proceed on with query.
3. Query database for thoughts corresponding to specific username.  
4. Return response.



### **💥 Delete Thought API**

> **DELETE /thought/**
> 

> **OAuth 2.0**
> 

> **Query parameters: thoughtId (required and should belong to user)**
> 

Deletes the thought & its replies with given thought Id - which should belong to the user. 

Expected response in case everything is correct: 

```json
{
		"message": "success"
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Check if thoughtId is a valid string. 
3. Query database for deleting: This includes two steps, and is a ACID transaction: 
    - Delete One on thoughts collection (send userId too, to ensure it belongs to him)
        - If this fails or doesn’t delete, ROLLBACK & return error.
    - Delete Many on replies collection (with all the replies which have same thoughtId)
        - If this fails - ROLLBACK & return error.
4. Return response.

### **💥 Delete Reply API**

> **DELETE /reply/**
> 

> **OAuth 2.0**
> 

> **Query parameters: replyId (required and should belong to user)**
> 

Deletes the reply with replyId - which should belong to the user. 

Expected response in case everything is correct: 

```json
{
		"message": "success"
}
```

**Implementation Steps:** 

1. Go through Authentication middleware. 
2. Check if replyId is a valid string. 
3. Query database for deleting includes querying with replyId & userId to ensure that reply belongs to user. 
4. Return response.



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

![Our Aggregation Pipeline For Get Replies & Thoughts API](./images/aggregation-query.jpg)
