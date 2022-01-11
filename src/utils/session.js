const path = require('path');
const fs = require('fs');
const log = require('../utils/log')

function getSession() {
    let sessionConfig;

    const SESSION_PATH = path.join(__dirname, '../session/sessions.json');

    if (fs.existsSync(SESSION_PATH)) {
        sessionConfig = JSON.parse(String(fs.readFileSync(SESSION_PATH)))
        return sessionConfig
    }

    return false
}

async function createSession(session) {
    const SESSION_PATH = path.resolve(__dirname, '../session/sessions.json');

    fs.writeFileSync(SESSION_PATH, JSON.stringify(session));
    log.system('session file created');
}

module.exports = { getSession, createSession }