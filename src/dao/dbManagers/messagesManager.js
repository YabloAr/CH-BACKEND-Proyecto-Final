import messageModel from './../models/messages.js';

export default class Messages {
    constructor() {
        console.log('dbManager: messagesManager.js. Conectado a Mongo Atlas Db.')
    }

    saveMessage = async (message) => {
        try {
            await messageModel.create(message)
            return { status: 'Success.', message: 'Message added.' }
        } catch (error) { console.error('Error creating messages from db', error.message) }
    }

    getAllMessages = async () => {
        try {
            const messages = await messageModel.find()
            return messages
        } catch (error) { console.error('Error getting messages from db', error.message) }
    }
}