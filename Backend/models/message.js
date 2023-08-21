const mongoose = require ('mongoose')

const { Schema } = mongoose

const messageSchema = new Schema ({
    text : {type: String , required : true} ,
    senderId : { type: String, required: true},
    reciverId: { type: String, required: true}
},
    {timestamps : true}
)

module.exports = mongoose.model ("Message",messageSchema, "messages")