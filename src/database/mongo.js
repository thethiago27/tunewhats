const {MongoClient} = require('mongodb')
const log = require('../utils/log')

class Mongo {

    async connection() {
        const conn = new MongoClient("mongodb://localhost:27017/images_db")

        try {
            await conn.connect();

            return conn.db(process.env.MONGO_DB)
        } catch (err) {
            log.error(err)
        }

    }
}

module.exports = new Mongo()