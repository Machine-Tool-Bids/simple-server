const express = require("express");
const {
  addSession,
  addUniqueSession,
  addUniqueSession2,
} = require("../controllers/sessionController");
const Session = require("../models/session");
const firebase = require("../db");
const firestore = firebase.firestore();

const router = express.Router();

router.get("/add", addUniqueSession);
router.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});
router.post("/add", addUniqueSession);
router.post("/add2", addUniqueSession2);
router.get("/check/:url", async (req, res) => {
  const url = decodeURI(req.params.url);
  try {
    const sessions = await firestore.collection("sessions");
    const data = await sessions.get();
    let sessionsArray = [];
    let pages = [];
    if (data.empty) {
      res.status(404).send("No session record found");
    } else {
      data.forEach((doc) => {
        if (doc.data().url === url) {
          sessionsArray.push(doc.data().session);
        }
      });
      data.forEach((doc) => {
        if (
          sessionsArray.includes(doc.data().session) &&
          doc.data().url !== url
        ) {
          pages.push(doc.data().url);
        }
      });
      let first_common = mode(pages);
      pages = pages.filter(function (x) {
        return x !== first_common;
      });
      let second_common = mode(pages);
      pages = pages.filter(function (x) {
        return x !== second_common;
      });
      let third_common = mode(pages);
      res.send([first_common, second_common, third_common]);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/check2/:url", async (req, res) => {
  const url = decodeURI(req.params.url);
  try {
    const sessions = await firestore.collection("sessions2");
    const data = await sessions.get();
    let sessionsArray = [];
    let pages = [];
    if (data.empty) {
      res.status(404).send("No session record found");
    } else {
      data.forEach((doc) => {
        if (doc.data().url === url) {
          sessionsArray.push(doc.data().session);
        }
      });
      data.forEach((doc) => {
        if (
          sessionsArray.includes(doc.data().session) &&
          doc.data().url !== url
        ) {
          pages.push(doc.data().url);
        }
      });
      let first_common = mode(pages);
      pages = pages.filter(function (x) {
        return x !== first_common;
      });
      let second_common = mode(pages);
      pages = pages.filter(function (x) {
        return x !== second_common;
      });
      let third_common = mode(pages);
      res.send([first_common, second_common, third_common]);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/check3", async (req, res) => {
  const url = req.body.url;
  try {
    const sessions = await firestore.collection("sessions");
    const data = await sessions.get();
    let sessionsArray = [];
    let pages = [];
    if (data.empty) {
      res.status(404).send("No session record found");
    } else {
      data.forEach((doc) => {
        if (doc.data().url === url) {
          sessionsArray.push(doc.data().session);
        }
      });
      data.forEach((doc) => {
        if (
          sessionsArray.includes(doc.data().session) &&
          doc.data().url !== url
        ) {
          pages.push(doc.data().url);
        }
      });
      pages = pages.filter(function (x) {
        return x.includes("Event/LotDetails");
      });
      let first_common = mode(pages);
      pages = pages.filter(function (x) {
        return x !== first_common;
      });
      let second_common = mode(pages);
      pages = pages.filter(function (x) {
        return x !== second_common;
      });
      let third_common = mode(pages);
      res.send(`
        <p>1. ${first_common}</p>
        <p>2. ${second_common}</p>
        <p>3. ${third_common}</p>`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/item-item-table", async (req, res) => {
  const sessions = await firestore.collection("sessions");
  const data = await sessions.get();
  let table_values =
    "<table><tr><th>Item</th><th>1st Most Similar</th><th>Similarity</th><th>2nd Most Similar</th><th>Similarity</th><th>3rd Most Similar</th><th>Similarity</th></tr>";
  let url_array = [];
  data.forEach((doc) => {
    if (
      !url_array.includes(doc.data().url) &&
      doc.data().url.includes("Event/LotDetails")
    ) {
      url_array.push(doc.data().url);
    }
  });
  url_array.forEach((url) => {
    let sessionsArray = [];
    let pages = [];
    data.forEach((doc) => {
      if (doc.data().url === url) {
        sessionsArray.push(doc.data().session);
      }
    });
    data.forEach((doc) => {
      if (
        sessionsArray.includes(doc.data().session) &&
        doc.data().url !== url
      ) {
        pages.push(doc.data().url);
      }
    });
    pages = pages.filter(function (x) {
      return x.includes("Event/LotDetails");
    });
    let first_common = "";
    let first_count = "";
    let second_common = "";
    let second_count = "";
    let third_common = "";
    let third_count = "";
    if (mode(pages) != null) {
      [first_common, first_count] = mode(pages);
    }
    pages = pages.filter(function (x) {
      return x !== first_common && !x.includes("=");
    });
    if (mode(pages) != null) {
      [second_common, second_count] = mode(pages);
    }
    pages = pages.filter(function (x) {
      return x !== second_common;
    });
    if (mode(pages) != null) {
      [third_common, third_count] = mode(pages);
    }
    let new_url = url == null || url.includes("=") ? "" : url.slice(62);
    let new_first_common = first_common == null ? "" : first_common.slice(62);
    let new_second_common =
      second_common == null ? "" : second_common.slice(62);
    let new_third_common = third_common == null ? "" : third_common.slice(62);
    if (
      new_url != "" &&
      new_first_common != "" &&
      new_second_common != "" &&
      new_third_common != ""
    ) {
      table_values += "<tr>";
      if (new_url != null && new_url.indexOf("?") != -1) {
        new_url = new_url.substring(0, new_url.indexOf("?"));
      }
      if (new_first_common.indexOf("?") != -1) {
        new_first_common = new_first_common.substring(
          0,
          new_first_common.indexOf("?")
        );
      }
      if (new_second_common.indexOf("?") != -1) {
        new_second_common = new_second_common.substring(
          0,
          new_second_common.indexOf("?")
        );
      }
      if (new_third_common.indexOf("?") != -1) {
        new_third_common = new_third_common.substring(
          0,
          new_third_common.indexOf("?")
        );
      }
      table_values += `<th><a href='${url}'>${new_url}</a></th>`;
      table_values += `<th><a href='${first_common}'>${new_first_common}</a></th>`;
      table_values += `<th>${first_count}</th>`;
      table_values += `<th><a href='${second_common}'>${new_second_common}</a></th>`;
      table_values += `<th>${second_count}</th>`;
      table_values += `<th><a href='${third_common}'>${new_third_common}</a></th>`;
      table_values += `<th>${third_count}</th>`;
      table_values += "</tr>";
    }
  });
  table_values +=
    "</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>";
  res.send(table_values);
});

router.get("/auction-item-table", async (req, res) => {
  const sessions = await firestore.collection("sessions");
  const data = await sessions.get();
  let table_values =
    "<table><tr><th>Auction</th><th>1st Most Popular</th><th>Popularity</th><th>2nd Most Popular</th><th>Popularity</th><th>3rd Most Popular</th><th>Popularity</th></tr>";
  let url_array = [];
  data.forEach((doc) => {
    if (
      !url_array.includes(doc.data().url) &&
      doc.data().url.includes("Event/Details")
    ) {
      url_array.push(doc.data().url);
    }
  });
  url_array.forEach((url) => {
    let sessionsArray = [];
    let pages = [];
    data.forEach((doc) => {
      if (doc.data().url === url) {
        sessionsArray.push(doc.data().session);
      }
    });
    data.forEach((doc) => {
      if (
        sessionsArray.includes(doc.data().session) &&
        doc.data().url !== url
      ) {
        pages.push(doc.data().url);
      }
    });
    pages = pages.filter(function (x) {
      return x.includes("Event/LotDetails");
    });
    let first_common = "";
    let first_count = "";
    let second_common = "";
    let second_count = "";
    let third_common = "";
    let third_count = "";
    if (mode(pages) != null) {
      [first_common, first_count] = mode(pages);
    }
    pages = pages.filter(function (x) {
      return x !== first_common && !x.includes("=");
    });
    if (mode(pages) != null) {
      [second_common, second_count] = mode(pages);
    }
    pages = pages.filter(function (x) {
      return x !== second_common;
    });
    if (mode(pages) != null) {
      [third_common, third_count] = mode(pages);
    }
    let new_url = url == null || url.includes("=") ? "" : url.slice(59);
    let new_first_common = first_common == null ? "" : first_common.slice(62);
    let new_second_common =
      second_common == null ? "" : second_common.slice(62);
    let new_third_common = third_common == null ? "" : third_common.slice(62);
    if (
      new_url != "" &&
      new_first_common != "" &&
      new_second_common != "" &&
      new_third_common != ""
    ) {
      table_values += "<tr>";
      if (new_url != null && new_url.indexOf("/") != -1) {
        new_url = new_url.substring(0, new_url.indexOf("/"));
      }
      if (new_first_common.indexOf("?") != -1) {
        new_first_common = new_first_common.substring(
          0,
          new_first_common.indexOf("?")
        );
      }
      if (new_second_common.indexOf("?") != -1) {
        new_second_common = new_second_common.substring(
          0,
          new_second_common.indexOf("?")
        );
      }
      if (new_third_common.indexOf("?") != -1) {
        new_third_common = new_third_common.substring(
          0,
          new_third_common.indexOf("?")
        );
      }
      table_values += `<th><a href='${url}'>${new_url}</a></th>`;
      table_values += `<th><a href='${first_common}'>${new_first_common}</a></th>`;
      table_values += `<th>${first_count}</th>`;
      table_values += `<th><a href='${second_common}'>${new_second_common}</a></th>`;
      table_values += `<th>${second_count}</th>`;
      table_values += `<th><a href='${third_common}'>${new_third_common}</a></th>`;
      table_values += `<th>${third_count}</th>`;
      table_values += "</tr>";
    }
  });
  table_values +=
    "</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>";
  res.send(table_values);
});

function mode(array) {
  if (array.length == 0) return null;
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return [maxEl, maxCount];
}

module.exports = {
  routes: router,
};
