"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const studentRoutes = require("./routes/student-routes");
const sessionRoutes = require("./routes/session-routes");
var sql = require("mssql");
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api", studentRoutes.routes);
app.use("/session", sessionRoutes.routes);

app.get("/", function (req, res) {
  // config for your database
  var config = {
    user: "Cmontgomery",
    password: "1626Wlake@mmi!",
    server: "mtb-rainworx-auction-database.database.windows.net",
    database: "MTBAuctionDatabase_clone",
  };

  // connect to your database
  sql.connect(config, function (err) {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query("select * from vw_lot_result", function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

app.listen(config.port, () =>
  console.log("App is listening on url http://localhost:" + config.port)
);
