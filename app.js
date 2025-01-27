const http=require("node:http");

const server = http.createServer((req, res) => {
    const url = req.url;//الاشياء الي بدي ياها 
    const method = req.method;//الاشياء الي بدي ياها 

    if (url === "/hello" && method === "GET") {
      res.write("Hello World");
      return res.end();
    }
    
   if (url === "/admin" && method === "GET") {
    res.write("Abdallh Wael Shatnawi");
    return res.end();
  }
res.write("Not faond");
  return res.end();
});
server.listen(3000, () => console.log("server is running on port 3000"));
