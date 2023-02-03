"use strict";

const firebase = require("../db");
const Session = require("../models/session");
const firestore = firebase.firestore();

const addSession = async (req, res, next) => {
  try {
    const data = {
      id: 1,
      session: "",
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
    const result = {
      id: req.query.id,
      session: req.query.session,
      user: req.query.user,
      url: req.query.url,
      start: req.query.time,
      end: req.query.time,
    };
    let finished = false;
    await firestore
      .collection("sessions")
      .where("session", "==", req.query.session)
      .where("url", "==", req.query.url)
      .get()
      .then((snapshot) => {
        snapshot.forEach((element) => {
          finished = true;
          firestore
            .collection("sessions")
            .doc(element.id)
            .update({ end: req.query.time });
        });
      });
    if (!finished) {
      await firestore.collection("sessions").doc().set(result);
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
