## 🛫 Dependencies/Packages Used:

In NodeJS you can import packages using npm: 

**How?**

- npm init -y
    - Initialized package.json & all the multiple options yes (due to -y)
- npm install <package_name>
    - Once package.json is initialized - this command can be used throughout the project for importing new projects.

**Packages:** 

📦 **[dotenv](https://www.npmjs.com/package/dotenv)**

- Used for reading environment variables through multiple environments.
- This package is used in *config.js* and all the environment variables are distributed through that file.

📦 **[express](https://www.npmjs.com/package/express)**

- framework for providing routing in a simple, subtle way (creating REST APIs)

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
