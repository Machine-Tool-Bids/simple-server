const express = require('express');
const {
        addSession,
        addUniqueSession,
        addUniqueSession2
    } = require('../controllers/sessionController');
const Session = require('../models/session');
const firebase = require('../db');
const firestore = firebase.firestore();

const router = express.Router();

router.get('/add', addUniqueSession);
router.post('/add', addUniqueSession);
router.post('/add2', addUniqueSession2);
router.get('/check/:url', async (req, res) => {
    const url = decodeURI(req.params.url);
    try {
        const sessions = await firestore.collection('sessions');
        const data = await sessions.get();
        let sessionsArray = [];
        let pages = [];
        if(data.empty) {
            res.status(404).send('No session record found');
        }else {
            data.forEach(doc => {
                if(doc.data().url === url) {
                    sessionsArray.push(doc.data().session);
                }
            });
            data.forEach(doc => {
                if(sessionsArray.includes(doc.data().session) && doc.data().url !== url) {
                    pages.push(doc.data().url)
                }
            });
            let first_common = mode(pages);
            pages = pages.filter(function(x) {
                return x !== first_common;
            });
            let second_common = mode(pages);
            pages = pages.filter(function(x) {
                return x !== second_common;
            });
            let third_common = mode(pages);
            res.send([first_common, second_common, third_common]);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/check2/:url', async (req, res) => {
    const url = decodeURI(req.params.url);
    try {
        const sessions = await firestore.collection('sessions2');
        const data = await sessions.get();
        let sessionsArray = [];
        let pages = [];
        if(data.empty) {
            res.status(404).send('No session record found');
        }else {
            data.forEach(doc => {
                if(doc.data().url === url) {
                    sessionsArray.push(doc.data().session);
                }
            });
            data.forEach(doc => {
                if(sessionsArray.includes(doc.data().session) && doc.data().url !== url) {
                    pages.push(doc.data().url)
                }
            });
            let first_common = mode(pages);
            pages = pages.filter(function(x) {
                return x !== first_common;
            });
            let second_common = mode(pages);
            pages = pages.filter(function(x) {
                return x !== second_common;
            });
            let third_common = mode(pages);
            res.send([first_common, second_common, third_common]);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}


module.exports = {
    routes: router
}