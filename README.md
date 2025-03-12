# 🚀 Next.js Chat App Workshop  

## 📌 Prerequisites  
Before we start, ensure you have the following installed:  

1. [Node.js](https://nodejs.org/en/download)    - Required for running Next.js  
2. [Git](https://git-scm.com/downloads)  - To clone the project repository  
3. [VS Code](https://code.visualstudio.com/)  - Recommended code editor  
4. [PocketBase](https://pocketbase.io/) - Lightweight backend (Download & extract)  

---

## 🛠️ Getting Started  

### **1. Fork & Clone the Repository**  

1. Go to **GitHub Repository**
2. Click **Fork** → Copy your forked repo URL.  
3. Open a terminal and run:  

   ```
   git clone <your-forked-repo-url>
   cd chat-app
   npm install
   ```
  
   
## **2. Run Next.js Locally**
Start the Next.js development server:

  ```
  npm run dev
  ```

✅ Open http://localhost:3000/ to check if it’s running.



## **3. Set Up PocketBase**
Download **PocketBase** → https://pocketbase.io/

Extract the ZIP file.

Open a terminal in the **PocketBase (backend) folder** and run:

 ```
  ./pocketbase serve
 ```

Open http://127.0.0.1:8090 in your browser.




## **4. Import Database Schema**
In the **PocketBase Admin Panel**, go to **Settings** > **Import Collection**.

Upload the `pb_schema.json` file from this repo.

Confirm the collections (users, messages, replies) are successfully imported.




## **5. Run the Chat App**
Open http://localhost:3000.

Log in using your test account.

Send messages and see real-time updates! 🎉
