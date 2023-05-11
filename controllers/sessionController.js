"use strict";

const firebase = require("../db");
const Session = require("../models/session");
const firestore = firebase.firestore();
var sql = require("mssql");

const addSession = async (req, res, next) => {
  try {
    const data = {
      id: 1,
      user: "Bob",
      url: "google.com",
      duration: 100,
    };
    await firestore.collection("sessions").doc().set(data);
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addUniqueSession = async (req, res, next) => {
  try {
    var config = {
      user: "Cmontgomery",
      password: "1626Wlake@mmi!",
      server: "mtb-rainworx-auction-database.database.windows.net",
      database: "MTBAuctionDatabase_clone",
    };
    function getSQLtimestamp() {
      var date;
      date = new Date();
      date =
        date.getUTCFullYear() +
        "-" +
        ("00" + (date.getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("00" + date.getUTCDate()).slice(-2) +
        " " +
        ("00" + date.getUTCHours()).slice(-2) +
        ":" +
        ("00" + date.getUTCMinutes()).slice(-2) +
        ":" +
        ("00" + date.getUTCSeconds()).slice(-2) +
        "." +
        ("00" + date.getUTCMilliseconds()).slice(-3);
      return date;
    }
    sql.connect(config, async (err) => {
      if (err) console.log(err);
      // create Request object
      var request = new sql.Request();
      const date = "2023-04-07 16:27:59.210";
      console.log(date)
      let mySessions = await request.query(
        `SELECT * from dbo.ClickTracking WHERE sessionId='${req.query.session}' AND trackingUrl='${req.query.url}'`
      );
      if (mySessions.recordset && mySessions.recordset.length > 0) {
        await request.query(
          `UPDATE dbo.ClickTracking SET endTime='${date}' WHERE sessionId='${req.query.session}' AND trackingUrl='${req.query.url}'`
        );
        res.send("Updated");
      } else {
        await request.query(
          `INSERT into dbo.ClickTracking (endTime, startTime, sessionId, trackingUrl, loginUser) VALUES ('${date}','${date}',${req.query.session},'${req.query.url}','${req.query.user}')`
        );
        res.send("Record saved successfuly");
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addUniqueSession2 = async (req, res, next) => {
  try {
    const sessions = await firestore.collection("sessions2");
    let mySessions = await sessions.get();
    let changedSession = false;
    console.log(req.query.session);
    if (req.query.session != "undefined") {
      await mySessions.forEach((doc) => {
        if (
          doc.data().session === req.query.session &&
          doc.data().url === req.query.url
        ) {
          doc.ref.update({
            end: req.query.time,
          });
          changedSession = true;
        }
      });
      if (!changedSession) {
        let data = {
          start: req.query.time,
          end: req.query.time,
          user: req.query.user,
          url: req.query.url,
          session: req.query.session,
        };
        await firestore.collection("sessions2").doc().set(data);
      }
      res.send("Record saved successfuly");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addSession,
  addUniqueSession,
  addUniqueSession2,
};
