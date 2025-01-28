const http=require("node:http");
const PORT=3000;

const server = http.createServer((req, res) => {
    //const url = req.url;//الاشياء الي بدي ياها 
    //const method = req.method;//الاشياء الي بدي ياها 
    const {url, method}=req;

    console.log(method,url);

    if (url === "/hello" && method === "GET") {
      res.write(`<div> Welcome In Home Page</div>`);

      return res.end();
    }
    
   if (url === "/admin" && method === "GET") {
    res.write(`<div> Abdallh Wael Shatnawi</div>`);

    return res.end();
  }
  res.write(`<div>Not Found</div>`);

  return res.end();
});
server.listen(PORT, () => {
  console.log("Server is running on http://localhost: "+PORT);
});
