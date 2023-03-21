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
var sql = require("mssql");

var config = {
  user: "Cmontgomery",
  password: "1626Wlake@mmi!",
  server: "mtb-rainworx-auction-database.database.windows.net",
  database: "MTBAuctionHotfixDB",
};

let binarySearch = function (arr, x, start, end) {
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);

  // Compare mid with given key x
  if (arr[mid].Id === x) return arr[mid];

  // If element at mid is greater than x,
  // search in the left half of mid
  if (arr[mid].Id > x) return binarySearch(arr, x, start, mid - 1);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else return binarySearch(arr, x, mid + 1, end);
};

let binarySearchListing = function (arr, x, start, end) {
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);

  // Compare mid with given key x
  if (arr[mid].listing_id === x) return arr[mid];

  // If element at mid is greater than x,
  // search in the left half of mid
  if (arr[mid].listing_id > x) return binarySearch(arr, x, start, mid - 1);
  // If element at mid is smaller than x,
  // search in the right half of mid
  else return binarySearch(arr, x, mid + 1, end);
};

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

router.get("/all-data", async (req, res) => {
  const sessions = await firestore.collection("sessions");
  const data = await sessions.get();
  let table_values =
    "<a href='/session/popular-items'>Popular items</a><table><tr><th>Item</th><th>1st Most Similar</th><th>Similarity</th><th>2nd Most Similar</th><th>Similarity</th><th>3rd Most Similar</th><th>Similarity</th></tr>";
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
  let first_values = table_values;
  var config = {
    user: "Cmontgomery",
    password: "1626Wlake@mmi!",
    server: "mtb-rainworx-auction-database.database.windows.net",
    database: "MTBAuctionHotfixDB",
  };
  sql.connect(config, async (err) => {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    let time = new Date();
    let results = await request.query(
      "SELECT Id, Title FROM RWX_AuctionEvents ORDER BY Id ASC"
    );
    let total_items = "";
    results = results["recordset"];
    total_items = total_items["recordset"];
    const sessions = await firestore.collection("sessions");
    const data = await sessions.get();
    let table_values = "<table><tr><th>Item</th><th>Popularity</th>";
    let url_dict = {};
    let auctions = [];
    let used_ids = [];
    data.forEach((doc) => {
      if (doc.data().url.includes("Event/LotDetails")) {
        if (!(doc.data().url in url_dict)) {
          url_dict[doc.data().url] = 1;
        } else {
          url_dict[doc.data().url] = url_dict[doc.data().url] + 1;
        }
      } else if (
        doc.data().url.includes("Event/Details") &&
        !used_ids.includes(doc.data().url.substring(51, 58))
      ) {
        let auction = [0, 0];
        let added = false;
        let id = parseInt(doc.data().url.substring(51, 58));
        let result = binarySearch(results, id, 0, results.length - 1);
        if (result != false) {
          auction[0] = result.Title;
          auction[1] = result.Id;
          added = true;
        }
        if (added) {
          auctions.push(auction);
          used_ids.push(doc.data().url.substring(51, 58));
        }
      }
    });
    var items = Object.keys(url_dict).map(function (key) {
      return [key, url_dict[key]];
    });
    items = items.sort(function (first, second) {
      return second[1] - first[1];
    });
    items.forEach((url) => {
      let new_url =
        url[0] == null || url[0].includes("=") ? "" : url[0].slice(62);
      if (new_url != null && new_url.indexOf("?") != -1) {
        new_url = new_url.substring(0, new_url.indexOf("?"));
      }
      if (new_url != "" && !isNaN(url[1])) {
        table_values += "<tr>";
        if (new_url != null && new_url.indexOf("/") != -1) {
          new_url = new_url.substring(0, new_url.indexOf("/"));
        }
        table_values += `<th><a href='${url[0]}'>${new_url}</a></th>`;
        table_values += `<th>${url[1]}</th>`;
        table_values += "</tr>";
      }
    });
    table_values += `</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>`;
    let select = `<a href='/session/item-item-table'>Also Bought</a><form method='POST' ACTION='/session/all-data'><select onchange="this.form.submit()" name="auction">
      <option value="">All</option>`;
    auctions.forEach((auction) => {
      select += `<option value="${auction[1]}">${auction[0]}</option>`;
    });
    select += `</select></form>`;
    res.send(first_values + select + table_values);
  });
});

router.post("/all-data", async (req, res) => {
  const sessions = await firestore.collection("sessions");
  const data = await sessions.get();
  let table_values =
    "<a href='/session/popular-items'>Popular items</a><table><tr><th>Item</th><th>1st Most Similar</th><th>Similarity</th><th>2nd Most Similar</th><th>Similarity</th><th>3rd Most Similar</th><th>Similarity</th></tr>";
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
  let first_values = table_values;
  if (req.body.auction == "") {
    sql.connect(config, async (err) => {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();

      // query to the database and get the records
      let time = new Date();
      let results = await request.query(
        "SELECT Id, Title FROM RWX_AuctionEvents ORDER BY Id ASC"
      );
      let total_items = "";
      results = results["recordset"];
      total_items = total_items["recordset"];
      const sessions = await firestore.collection("sessions");
      const data = await sessions.get();
      let table_values = "<table><tr><th>Item</th><th>Popularity</th>";
      let url_dict = {};
      let auctions = [];
      let used_ids = [];
      data.forEach((doc) => {
        if (doc.data().url.includes("Event/LotDetails")) {
          if (!(doc.data().url in url_dict)) {
            url_dict[doc.data().url] = 1;
          } else {
            url_dict[doc.data().url] = url_dict[doc.data().url] + 1;
          }
        } else if (
          doc.data().url.includes("Event/Details") &&
          !used_ids.includes(doc.data().url.substring(51, 58))
        ) {
          let auction = [0, 0];
          let added = false;
          let id = parseInt(doc.data().url.substring(51, 58));
          let result = binarySearch(results, id, 0, results.length - 1);
          if (result != false) {
            auction[0] = result.Title;
            auction[1] = result.Id;
            added = true;
          }
          if (added) {
            auctions.push(auction);
            used_ids.push(doc.data().url.substring(51, 58));
          }
        }
      });
      var items = Object.keys(url_dict).map(function (key) {
        return [key, url_dict[key]];
      });
      items = items.sort(function (first, second) {
        return second[1] - first[1];
      });
      items.forEach((url) => {
        let new_url =
          url[0] == null || url[0].includes("=") ? "" : url[0].slice(62);
        if (new_url != null && new_url.indexOf("?") != -1) {
          new_url = new_url.substring(0, new_url.indexOf("?"));
        }
        if (new_url != "" && !isNaN(url[1])) {
          table_values += "<tr>";
          if (new_url != null && new_url.indexOf("/") != -1) {
            new_url = new_url.substring(0, new_url.indexOf("/"));
          }
          table_values += `<th><a href='${url[0]}'>${new_url}</a></th>`;
          table_values += `<th>${url[1]}</th>`;
          table_values += "</tr>";
        }
      });
      table_values += `</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>`;
      let select = `<a href='/session/item-item-table'>Also Bought</a><form method='POST' ACTION='/session/all-data'><select onchange="this.form.submit()" name="auction">
        <option value="">All</option>`;
      auctions.forEach((auction) => {
        select += `<option value="${auction[1]}">${auction[0]}</option>`;
      });
      select += `</select></form>`;
      res.send(select + table_values);
    });
  } else {
    sql.connect(config, async (err) => {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();

      // query to the database and get the records
      let time = new Date();
      let results = await request.query(
        "SELECT Id, Title FROM RWX_AuctionEvents ORDER BY Id ASC"
      );
      let total_items = "";
      total_items = await request.query(
        `SELECT listing_id FROM vw_lot_result WHERE AuctionEventID=${req.body.auction} ORDER BY listing_id ASC`
      );
      results = results["recordset"];
      total_items = total_items["recordset"];
      const sessions = await firestore.collection("sessions");
      const data = await sessions.get();
      let table_values = "<table><tr><th>Item</th><th>Popularity</th>";
      let url_dict = {};
      let auctions = [];
      let used_ids = [];
      data.forEach((doc) => {
        if (doc.data().url.includes("Event/LotDetails")) {
          if (
            binarySearchListing(
              total_items,
              parseInt(doc.data().url.substring(54, 61)),
              0,
              total_items.length - 1
            )
          ) {
            if (!(doc.data().url in url_dict)) {
              url_dict[doc.data().url] = 1;
            } else {
              url_dict[doc.data().url] = url_dict[doc.data().url] + 1;
            }
          }
        } else if (
          doc.data().url.includes("Event/Details") &&
          !used_ids.includes(doc.data().url.substring(51, 58))
        ) {
          let auction = [0, 0];
          let added = false;
          let id = parseInt(doc.data().url.substring(51, 58));
          let result = binarySearch(results, id, 0, results.length - 1);
          if (result != false) {
            auction[0] = result.Title;
            auction[1] = result.Id;
            added = true;
          }
          if (added) {
            auctions.push(auction);
            used_ids.push(doc.data().url.substring(51, 58));
          }
        }
      });
      var items = Object.keys(url_dict).map(function (key) {
        return [key, url_dict[key]];
      });
      items = items.sort(function (first, second) {
        return second[1] - first[1];
      });
      items.forEach((url) => {
        let new_url =
          url[0] == null || url[0].includes("=") ? "" : url[0].slice(62);
        if (new_url != null && new_url.indexOf("?") != -1) {
          new_url = new_url.substring(0, new_url.indexOf("?"));
        }
        if (new_url != "" && !isNaN(url[1])) {
          table_values += "<tr>";
          if (new_url != null && new_url.indexOf("/") != -1) {
            new_url = new_url.substring(0, new_url.indexOf("/"));
          }
          table_values += `<th><a href='${url[0]}'>${new_url}</a></th>`;
          table_values += `<th>${url[1]}</th>`;
          table_values += "</tr>";
        }
      });
      table_values += `</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>`;
      let select = `<a href='/session/item-item-table'>Also Bought</a><form method='POST' ACTION='/session/all-data'><select onchange="this.form.submit()" name="auction">
        <option value="">All</option>`;
      auctions.forEach((auction) => {
        if (req.body.auction == auction[1]) {
          select += `<option value="${auction[1]}" selected>${auction[0]}</option>`;
        } else {
          select += `<option value="${auction[1]}">${auction[0]}</option>`;
        }
      });
      select += `</select></form>`;
      res.send(first_values + select + table_values);
    });
  }
});

router.get("/item-item-table", async (req, res) => {
  sql.connect(config, async (err) => {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    let time = new Date();
    let results = await request.query(
      "SELECT sessionId, trackingUrl FROM dbo.ClickTracking"
    );
    let table_values =
      "<a href='/session/popular-items'>Popular items</a><table><tr><th>Item</th><th>1st Most Similar</th><th>Similarity</th><th>2nd Most Similar</th><th>Similarity</th><th>3rd Most Similar</th><th>Similarity</th></tr>";
    let url_array = [];
    results.forEach((result) => {
      if (
        !url_array.includes(result.trackingUrl) &&
        result.trackingUrl.includes("Event/LotDetails")
      ) {
        url_array.push(result.trackingUrl);
      }
    });
    results.forEach((result) => {
      let sessionsArray = [];
      let pages = [];
      results.forEach((result) => {
        if (result.trackingUrl === url) {
          sessionsArray.push(result.sessionId);
        }
      });
      results.forEach((result) => {
        if (
          sessionsArray.includes(result.sessionId) &&
          result.trackingUrl !== url
        ) {
          pages.push(result.trackingUrl);
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
    let total_items = "";
    results = results["recordset"];
  });
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

router.get("/popular-items", async (req, res) => {
  sql.connect(config, async (err) => {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    let time = new Date();
    let results = await request.query(
      "SELECT Id, Title FROM RWX_AuctionEvents ORDER BY Id ASC"
    );
    let total_items = "";
    results = results["recordset"];
    total_items = total_items["recordset"];
    const sessions = await firestore.collection("sessions");
    const data = await sessions.get();
    let table_values = "<table><tr><th>Item</th><th>Popularity</th>";
    let url_dict = {};
    let auctions = [];
    let used_ids = [];
    data.forEach((doc) => {
      if (doc.data().url.includes("Event/LotDetails")) {
        if (!(doc.data().url in url_dict)) {
          url_dict[doc.data().url] = 1;
        } else {
          url_dict[doc.data().url] = url_dict[doc.data().url] + 1;
        }
      } else if (
        doc.data().url.includes("Event/Details") &&
        !used_ids.includes(doc.data().url.substring(51, 58))
      ) {
        let auction = [0, 0];
        let added = false;
        let id = parseInt(doc.data().url.substring(51, 58));
        let result = binarySearch(results, id, 0, results.length - 1);
        if (result != false) {
          auction[0] = result.Title;
          auction[1] = result.Id;
          added = true;
        }
        if (added) {
          auctions.push(auction);
          used_ids.push(doc.data().url.substring(51, 58));
        }
      }
    });
    var items = Object.keys(url_dict).map(function (key) {
      return [key, url_dict[key]];
    });
    items = items.sort(function (first, second) {
      return second[1] - first[1];
    });
    items.forEach((url) => {
      let new_url =
        url[0] == null || url[0].includes("=") ? "" : url[0].slice(62);
      if (new_url != null && new_url.indexOf("?") != -1) {
        new_url = new_url.substring(0, new_url.indexOf("?"));
      }
      if (new_url != "" && !isNaN(url[1])) {
        table_values += "<tr>";
        if (new_url != null && new_url.indexOf("/") != -1) {
          new_url = new_url.substring(0, new_url.indexOf("/"));
        }
        table_values += `<th><a href='${url[0]}'>${new_url}</a></th>`;
        table_values += `<th>${url[1]}</th>`;
        table_values += "</tr>";
      }
    });
    table_values += `</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>`;
    let select = `<a href='/session/item-item-table'>Also Bought</a><form method='POST' ACTION='/session/popular-items'><select onchange="this.form.submit()" name="auction">
      <option value="">All</option>`;
    auctions.forEach((auction) => {
      select += `<option value="${auction[1]}">${auction[0]}</option>`;
    });
    select += `</select></form>`;
    res.send(select + table_values);
  });
});

router.post("/popular-items", async (req, res) => {
  if (req.body.auction == "") {
    sql.connect(config, async (err) => {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();

      // query to the database and get the records
      let time = new Date();
      let results = await request.query(
        "SELECT Id, Title FROM RWX_AuctionEvents ORDER BY Id ASC"
      );
      let total_items = "";
      results = results["recordset"];
      total_items = total_items["recordset"];
      const sessions = await firestore.collection("sessions");
      const data = await sessions.get();
      let table_values = "<table><tr><th>Item</th><th>Popularity</th>";
      let url_dict = {};
      let auctions = [];
      let used_ids = [];
      data.forEach((doc) => {
        if (doc.data().url.includes("Event/LotDetails")) {
          if (!(doc.data().url in url_dict)) {
            url_dict[doc.data().url] = 1;
          } else {
            url_dict[doc.data().url] = url_dict[doc.data().url] + 1;
          }
        } else if (
          doc.data().url.includes("Event/Details") &&
          !used_ids.includes(doc.data().url.substring(51, 58))
        ) {
          let auction = [0, 0];
          let added = false;
          let id = parseInt(doc.data().url.substring(51, 58));
          let result = binarySearch(results, id, 0, results.length - 1);
          if (result != false) {
            auction[0] = result.Title;
            auction[1] = result.Id;
            added = true;
          }
          if (added) {
            auctions.push(auction);
            used_ids.push(doc.data().url.substring(51, 58));
          }
        }
      });
      var items = Object.keys(url_dict).map(function (key) {
        return [key, url_dict[key]];
      });
      items = items.sort(function (first, second) {
        return second[1] - first[1];
      });
      items.forEach((url) => {
        let new_url =
          url[0] == null || url[0].includes("=") ? "" : url[0].slice(62);
        if (new_url != null && new_url.indexOf("?") != -1) {
          new_url = new_url.substring(0, new_url.indexOf("?"));
        }
        if (new_url != "" && !isNaN(url[1])) {
          table_values += "<tr>";
          if (new_url != null && new_url.indexOf("/") != -1) {
            new_url = new_url.substring(0, new_url.indexOf("/"));
          }
          table_values += `<th><a href='${url[0]}'>${new_url}</a></th>`;
          table_values += `<th>${url[1]}</th>`;
          table_values += "</tr>";
        }
      });
      table_values += `</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>`;
      let select = `<a href='/session/item-item-table'>Also Bought</a><form method='POST' ACTION='/session/popular-items'><select onchange="this.form.submit()" name="auction">
        <option value="">All</option>`;
      auctions.forEach((auction) => {
        select += `<option value="${auction[1]}">${auction[0]}</option>`;
      });
      select += `</select></form>`;
      res.send(select + table_values);
    });
  } else {
    sql.connect(config, async (err) => {
      if (err) console.log(err);

      // create Request object
      var request = new sql.Request();

      // query to the database and get the records
      let time = new Date();
      let results = await request.query(
        "SELECT Id, Title FROM RWX_AuctionEvents ORDER BY Id ASC"
      );
      let total_items = "";
      total_items = await request.query(
        `SELECT listing_id FROM vw_lot_result WHERE AuctionEventID=${req.body.auction} ORDER BY listing_id ASC`
      );
      results = results["recordset"];
      total_items = total_items["recordset"];
      const sessions = await firestore.collection("sessions");
      const data = await sessions.get();
      let table_values = "<table><tr><th>Item</th><th>Popularity</th>";
      let url_dict = {};
      let auctions = [];
      let used_ids = [];
      data.forEach((doc) => {
        if (doc.data().url.includes("Event/LotDetails")) {
          if (
            binarySearchListing(
              total_items,
              parseInt(doc.data().url.substring(54, 61)),
              0,
              total_items.length - 1
            )
          ) {
            if (!(doc.data().url in url_dict)) {
              url_dict[doc.data().url] = 1;
            } else {
              url_dict[doc.data().url] = url_dict[doc.data().url] + 1;
            }
          }
        } else if (
          doc.data().url.includes("Event/Details") &&
          !used_ids.includes(doc.data().url.substring(51, 58))
        ) {
          let auction = [0, 0];
          let added = false;
          let id = parseInt(doc.data().url.substring(51, 58));
          let result = binarySearch(results, id, 0, results.length - 1);
          if (result != false) {
            auction[0] = result.Title;
            auction[1] = result.Id;
            added = true;
          }
          if (added) {
            auctions.push(auction);
            used_ids.push(doc.data().url.substring(51, 58));
          }
        }
      });
      var items = Object.keys(url_dict).map(function (key) {
        return [key, url_dict[key]];
      });
      items = items.sort(function (first, second) {
        return second[1] - first[1];
      });
      items.forEach((url) => {
        let new_url =
          url[0] == null || url[0].includes("=") ? "" : url[0].slice(62);
        if (new_url != null && new_url.indexOf("?") != -1) {
          new_url = new_url.substring(0, new_url.indexOf("?"));
        }
        if (new_url != "" && !isNaN(url[1])) {
          table_values += "<tr>";
          if (new_url != null && new_url.indexOf("/") != -1) {
            new_url = new_url.substring(0, new_url.indexOf("/"));
          }
          table_values += `<th><a href='${url[0]}'>${new_url}</a></th>`;
          table_values += `<th>${url[1]}</th>`;
          table_values += "</tr>";
        }
      });
      table_values += `</table><style>table { font-size: 12px; } table, th, tr { border: 1px solid black; border-collapse: collapse; font-weight: 400; } tr:first-of-type th {font-weight: bold; } </style>`;
      let select = `<a href='/session/item-item-table'>Also Bought</a><form method='POST' ACTION='/session/popular-items'><select onchange="this.form.submit()" name="auction">
        <option value="">All</option>`;
      auctions.forEach((auction) => {
        if (req.body.auction == auction[1]) {
          select += `<option value="${auction[1]}" selected>${auction[0]}</option>`;
        } else {
          select += `<option value="${auction[1]}">${auction[0]}</option>`;
        }
      });
      select += `</select></form>`;
      res.send(select + table_values);
    });
  }
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
