npm install
npm install @babel/helper-compilation-targets --save-dev

RESET_DB=true npm run dev

npx kill-port 8080


Webpage with queries
https://docs.mongodb.com/manual/reference/operator/query/gt/


RESET_DB=true MONGO_URL="mongodb+srv://myUser:myuserpassword@cluster0.prpaq.mongodb.net/happyThoughts?retryWrites=true&w=majority" npm run dev