class UserModel {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    get id() {
        return this._id;
    }
}

module.exports = UserModel;
