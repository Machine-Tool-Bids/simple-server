const express = require('express');
const {
        addSession,
        addUniqueSession,
    } = require('../controllers/sessionController');

const router = express.Router();

router.get('/add', addSession);
router.post('/add', addUniqueSession);


module.exports = {
    routes: router
}