class Session {
    constructor(id, user, url, duration ) {
        this.id = id;
        this.user = user;
        this.url = url;
        this.duration = duration;
    }
}

module.exports = Session;