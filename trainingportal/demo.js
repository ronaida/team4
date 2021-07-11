var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "demo1234",
  database:"Instructor"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE TABLE request(username,beltname)", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});
