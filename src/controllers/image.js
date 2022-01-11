const mongo = require("../database/mongo");
const dateNow = require("../utils/dataNow");

async function saveImage(data, mimetype, filename, from) {
    const conn = await mongo.connection()
    const collection = conn.collection("images_data");

    const hasMediaStorage = await collection.findOne({
        sender: from
    })

    if (hasMediaStorage) {
        await collection.updateOne({
            sender: from
        }, {
            $set: {
                image: {
                    base64: data,
                    mimetype: mimetype,
                    filename: filename,
                    date: dateNow()
                }
            }
        })
        return
    }

    await collection.insertOne({
        sender: from,
        image: {
            base64: data,
            mimetype: mimetype,
            filename: filename,
            date: dateNow()
        }
    })
}

async function getLastImage(from) {

    const conn = await mongo.connection()
    const collection = conn.collection("images_data");

    return await collection.findOne({ sender: from })

}

module.exports = {saveImage, getLastImage}