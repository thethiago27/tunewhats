const qrcode = require('qrcode-terminal')
const {Client, MessageMedia} = require('whatsapp-web.js')
const mongo = require("./database/mongo");
const {saveImage, getLastImage} = require('./controllers/image')
const {messageLog} = require('./controllers/message')
const {checkIsGroup, checkIsMe} = require('./utils/checkIsGroup')
const {getSession, createSession} = require('./utils/session')
const log = require('./utils/log')
const audioRecognition = require('./utils/audioRecognition')

const client = new Client({
    session: getSession()
})

client.initialize()

mongo.connection().then(() => console.log("Mongo Work")).catch(err => console.log(err));

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', async (session) => {

    if (!getSession()) {
        await createSession(session)
        return
    }

    log.system('Recuperando sessão antiga...');
});

client.on('ready', () => {
    log.system('READY');
});

client.on('message', async (msg) => {

    if (msg.from === "status@broadcast" || checkIsGroup(msg.from) || msg.from === "status@wabot") return

    const chat = await msg.getChat();

    if (msg.hasMedia) {
        const caption = await msg.downloadMedia()

        try {

            if (caption.mimetype === "audio/ogg; codecs=opus") {

                await chat.sendStateTyping()

                const textInAudio = await audioRecognition(caption.data)

                await chat.clearState()

                await msg.reply(`Você disse: _*${textInAudio}*_`)

                return
            }

            await saveImage(caption.data, caption.mimetype, caption.filename, msg.from)
            log.whatsapp('Image salva')

        } catch (e) {
            log.error(e)
        }
        return
    }

    await messageLog(msg.from, msg.body)

})

client.on('message_revoke_everyone', async (after, before) => {

    if (after.from === "status@broadcast" || checkIsGroup(after.from) || checkIsMe(after.from)) return

    if (before.hasMedia) {

        const logImage = await getLastImage(before.from);

        const {image} = logImage

        const media = await new MessageMedia(image.mimetype, image.base64, image.filename)
        await client.sendMessage(after.from, media, {caption: 'Aqui esta a foto que você apagou'})
    }

    await client.sendMessage(after.from, `Sua mensagem deletada: *${before.body}*`);
});

client.on('disconnected', (reason) => {
    log.whatsapp('Client was logged out', reason);
});

