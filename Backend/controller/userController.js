const User = require('../models/user')
const userDTO = require('../dto/userDto')

const userController = {
    // get all user
    async getAll (req,res, next) {
        try{
            const users = await User.find({}).lean();

            // console.log(users)

            const userDto = users.map(user => new userDTO(user)); // Using map to transform each user
        
            return res.status(200).json({ users:userDto });
        }
        catch(error){
            return next (error)
        }
    }
}

module.exports = userController;