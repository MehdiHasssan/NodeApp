const Message = require('../models/message')

const messageController ={
    //post message controller 
    async postMessage (req,res,next) {

        const {text, senderId,reciverId} = req.body

        try {
            const message = new Message({ text, senderId, reciverId });
            await message.save();

            res.status(201).json({ success: true, message });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to save the message' });
        }

    }
}

module.exports = messageController;