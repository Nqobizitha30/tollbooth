const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
 
/*
const server = http.createServer(function(req,res){

    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end("hello world");

});

const PORT=process.env.PORT || 5000; 
server.listen(PORT,function(){
    console.log(`server started at port ${PORT}`)
});*/

let tollbooth_current_user;

const server = http.createServer(function(req,res){
   /* fs.readFile(path.join(__dirname, "public", "index.html"), function(err, page){
        if(err) {
            res.writeHead(400);
            res.end("oops!")

        }
        else {
            res.writeHead(200, {
            "Content-Type":"text/html"
            });
            res.end(page);
        }
    })*/
    switch (req.url) {
        case "/":
            
            fs.readFile(path.join(__dirname, "public", "index.html"), function(err, page){
                if(err) {
                    res.writeHead(400);
                    res.end("oops!")

                }
                else {
                    res.writeHead(200, {
                    "Content-Type":"text/html"
                    });
                    res.end(page);
                }
            });
            
            break;

        case "/css/style.css":
             fs.readFile(path.join(__dirname, "public", "css", "style.css"), function(err, data){
                if(err) {
                    res.writeHead(400);
                    res.end("oops!")

                }
                else {
                    res.writeHead(200, {
                    "Content-Type":"text/css"
                    });
                    res.end(data);
                }
            });
            
            break;
    
        case "/IMG/cars.jpg":
             fs.readFile(path.join(__dirname, "public", "IMG", "cars.jpg"), function(err, data){
                if(err) {
                    res.writeHead(400);
                    res.end("oops!")

                }
                else {
                    res.writeHead(200, {
                    "Content-Type":"image/jpg"
                    });
                    res.end(data);
                }
            });
            
            break;
        case "/api/users/login":
             if(req.method == "POST"){
                 let body = "";
                 req.on("data", function(data){
                     body += data;
                 });

                 req.on("end", function(){
                     const formData = qs.parse(body);
                     tollbooth_current_user = formData;
                     //redirect
                     
                 });
                 res.statusCode=302;
                     res.setHeader('Location','/profile');
                     return res.end();
             }
            
            break;

            case '/profile':
            fs.readFile(path.join(__dirname, "public", "home", "index.html"), function(err, page){
                if(err) {
                    res.writeHead(400);
                    res.end("oops!")

                }
                else {
                    res.writeHead(200, {
                    "Content-Type":"text/html"
                    });
                   return res.end(page);
                }
            });

            break;

            case '/tollbooth_current_user':
                res.writeHead(200, {
                    "Content-Type":"text/json"
                    });
                res.end(JSON.stringify(tollbooth_current_user));
                break;
        default:
            res.writeHead(404);
            res.end("page not found");
            break;
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT,function(){
    console.log(`server started at port ${PORT}`)
})