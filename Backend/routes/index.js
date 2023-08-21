const express = require ('express')
const postController = require('../controller/postController')
const authController = require('../controller/auth')
const auth = require('../middleware/auth')
const userController = require('../controller/userController')
const messageController = require('../controller/messageController')

const router  = express.Router()

// user
//register 
router.post ('/register',authController.register)

//login 
router.post ('/login', authController.login)
//logout
router.post('/logout', auth,authController.logout)

//Refresh
router.get('/refresh',authController.refresh)

// create post  
router.post('/posts',postController.create)

// get all post 
router.get('/posts/get_all_posts' , postController.getAll)

// get post by id 
router.get('/posts/:id' , postController.getById)

// update post
router.put ('/update_posts' ,postController.update)

// delete post 
router.delete('/delete_posts/:id' , postController.delete)

// user list 
router.get('/all_users', userController.getAll)

// get messages 
// router.post('/get_messages', messageController.postMessage)


module.exports = router