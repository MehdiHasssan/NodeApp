const mongoose = require ('mongoose');


const {Schema} = mongoose;

const RefreshTokenSchema = Schema({
    token : {type : String, required: true},
    userId : { type : mongoose.SchemaTypes.ObjectId, ref : 'User' }
},
{timestamps : true}
)

module.exports = mongoose.model("RefreshToken",RefreshTokenSchema, 'tokens' )