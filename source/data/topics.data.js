const TopicModel = require('../models/topic.model.js');
const { ObjectId } = require('mongodb');

class TopicsData {
    constructor(db) {
        this.db = db;
        this.collection = this.db.collection('topics');
    }
    
    addTopic(title, author, originalPost) {
        const newTopic = new TopicModel(title, author, { postText: originalPost, author });

        return this.collection.insert(newTopic)
            .then((insertResult) => insertResult.ops[0]);
    }
    
    getAll() {
        const result = this.collection
            .find({}, {}).toArray();
        
        return Promise.resolve(result);
    }
    
    get(id) {
        return this.collection
            .findOne({ _id: new ObjectId(id) });
    }
    
    addPostToTopic(topicId, postText, author) {
        return this.get(topicId)
            .then((topic) => {
                topic.posts.push({ postText, author });
                return this.collection.updateOne({ _id: new ObjectId(topicId) }, topic);
            });
    }
}

function init(db) {
    return new TopicsData(db);
}

module.exports = init;
