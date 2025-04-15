## contact management Server 
## Live Hosting Url : https://contract-management-server.vercel.app/
## Local Computer SetUp 
# Routing Api for Cyclic deployment and how to run the application locally
# step 1 : npm git -clone https://github.com/Rana16468/contact-management-server.git
# step 2 :  cd contact-management-server
# step 3 : npm i
# step 4: npm run dev
# step 3: Run Project development stages : npm run start:dev
# step 4: postman Application test my API , here is My development statges API
  # 1 .POST  http://localhost:3050/api/v1/contract/
  # 2 .GET http://localhost:3050/api/v1/contract/
  # 3 .GET http://localhost:3050/api/v1/contract/6677794bdba63a80a5a08479
  # 4 .PATCH  http://localhost:3050/api/v1/contract/6677794bdba63a80a5a08479
  # 5 .DELETE  http://localhost:3050/api/v1/contract/66777a3bce7c0180a7e0939f
  # 6 .PATCH  http://localhost:3050/api/v1/favorite/contract/6677794bdba63a80a5a08479

  ### After Hosting 
  # 1 .POST https://contract-management-server.vercel.app/api/v1/contract/
  # 2 .GET https://contract-management-server.vercel.app/api/v1/contract/
  # 3 .GET https://contract-management-server.vercel.app/api/v1/contract/6677794bdba63a80a5a08479
  # 4 .PATCH  https://contract-management-server.vercel.app/api/v1/contract/6677794bdba63a80a5a08479
  # 5 .DELETE  https://contract-management-server.vercel.app/api/v1/contract/66777a3bce7c0180a7e0939f
  # 6 .PATCH  https://contract-management-server.vercel.app/api/v1/favorite/contract/6677794bdba63a80a5a08479

  ###   technology
  # 1 Node
  # 2 Express
  # 3 Mongoose
  # 4 Type Script