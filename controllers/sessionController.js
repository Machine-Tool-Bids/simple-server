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
    let sessions = await sessions.get();
    let changedSession = false;
    await sessions.forEach((doc) => {
      if (sessions.data().session === req.query.session) {
        doc.update({
          end: req.query.time,
          user: req.query.user,
          end: req.query.end,
          url: req.query.url,
          session: req.query.session,
        });
        changedSession = true;
      }
    });
    if(!changedSession) {
        let data = {
        start: req.query.time,
        end: req.query.time,
        user: req.query.user,
        url: req.query.url,
        session: req.query.session,
        };
        await firestore.collection("sessions").doc().set(data);
    }
    res.send("Record saved successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addSession,
  addUniqueSession,
};
