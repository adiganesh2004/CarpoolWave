var mysql = require('mysql');
var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

var app = express();
var server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


var con=mysql.createConnection({
    host: "localhost",
    user : "root",
    password : "root123",
    database : "carpool"
})


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());
app.use(limiter);

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./public/carpool.html'));
  });



  app.post('/add', function(req,res){
    con.connect(function(err){
        if (err) throw err;
        console.log("connected");
        var sql = "INSERT INTO userdetails(username, password) VALUES(?,?)";
        var todo =[req.body.username,req.body.password];
        con.query(sql,todo,(function(err) {
            if (err) {
              return console.log(err.message);
            }
    }))
   
        console.log("Sign up did successfully");
        res.send("Sign up did successfully");
      });
  
    });

    app.post('/retrieve', function(req,res){
      con.connect(function(err){
        if (err) throw err;
        console.log("connected");
        var source =req.body.source;
        var destination =req.body.destination;
        var sql = "select * from carpooldetails where sourceplace =" +mysql.escape(source) +"and destination ="+mysql.escape(destination);
        
        con.query(sql,(error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          console.log(results);
        });
          res.send(` Route available`);
          console.log("Entry displayed successfully");
        });
      });
 

server.listen(3000, function(){
    console.log("server is listening on port: 3000");
  });