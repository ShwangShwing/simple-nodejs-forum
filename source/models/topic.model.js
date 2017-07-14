class TopicModel {
    constructor(title, author, initialPost) {
        this.title = title;
        this.author = author;
        this.posts = [initialPost];
    }

    get id() {
        return this._id;
    }
}

module.exports = TopicModel;
