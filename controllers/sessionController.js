"use strict";

const firebase = require("../db");
const Session = require("../models/session");
const firestore = firebase.firestore();

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
      database: "MTBAuctionHotfixDB_clone",
    };
    sql.connect(config, async (err) => {
      if (err) console.log(err);
      // create Request object
      var request = new sql.Request();
      const sessions = await firestore.collection("sessions");
      let mySessions = await request.query(
        `SELECT from dbo.ClickTracking WHERE sessionId=${req.query.time} AND trackingUrl=${req.query.url}`
      );
      let changedSession = false;
      console.log(req.query.session);
      if (mySessions != null) {
        await request.query(
          `UPDATE from dbo.ClickTracking WHERE sessionId=${req.query.time} AND trackingUrl=${req.query.url} SET endTime=${req.query.time})`
        );
      } else {
        await request.query(
          `INSERT into dbo.ClickTracking (${req.query.time},${req.query.time},${req.query.user},${req.query.url},${req.query.session})`
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
