const dateNow = require("../utils/dataNow");
const mongo = require("../database/mongo");

async function messageLog(from, msg) {

    const conn = await mongo.connection()
    const collection = conn.collection("images_data");

    const checkIsExistFrom = await collection.findOne({ sender: from })

    if(!checkIsExistFrom) {
        const data = {
            sender: from,
            messages: [
                {
                    text: msg,
                    date: dateNow()
                }
            ]
        }
        await collection.insertOne(data)
        return
    }

    await collection.updateOne({sender: from}, {
        $push: {
            messages: {
                text: msg,
                date: dateNow()
            }
        }
    })
}

module.exports = {messageLog};