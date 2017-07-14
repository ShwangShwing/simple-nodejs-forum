const UserModel = require('../models/user.model.js');
const { ObjectId } = require('mongodb');

class UsersData {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('users');
    }

    addUser(username, password) {
        return this.checkIfUserExist(username)
            .then((doesUserExist) => {
                if (doesUserExist) {
                    throw new Error('User already exists');
                }

                // plain text password, brato
                const newUser = new UserModel(username, password);

                return this.collection.insert(newUser)
                    .then((insertResult) => {
                        const insertedUserWithoutThePassword = insertResult.ops[0];
                        insertedUserWithoutThePassword.password = '';
                        return insertedUserWithoutThePassword;
                    });
            });
    }

    checkIfUserExist(username) {
        return this.collection
            .findOne({ username })
            .then((foundUser) => {
                if (foundUser) {
                    return true;
                }

                return false;
            });
    }

    checkValidUserUsername(username, password) {
        return this.collection
            .findOne({ username })
            .then((foundUser) => {
                if (!foundUser) {
                    throw new Error('User not found');
                }

                if (foundUser.password !== password) {
                    throw new Error('Invalid password');
                }

                const userWithoutThePassword = foundUser;
                userWithoutThePassword.password = '';
                return userWithoutThePassword;
            });
    }

    get(id) {
        return this.collection
            .findOne({ _id: new ObjectId(id) })
            .then((foundUser) => {
                const userWithoutThePassword = foundUser;
                userWithoutThePassword.password = '';
                return userWithoutThePassword;
            });
    }
}

function init(db) {
    return new UsersData(db);
}

module.exports = init;
