const express = require('express')
const dbConnect = require('./database/index')
const { PORT } = require('./config/index')
const router = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const Message = require('./models/message')

const http = require('http') // Import the http module
const socketIo = require('socket.io') // Import socket.io

const app = express()

const server = http.createServer(app) // Create an http server instance from your Express app
const io = socketIo(server) // Pass the http server instance to socket.io

app.use(cookieParser())
const port = PORT

const userSockets = {}

// Increase the maximum payload size to 10MB (adjust as needed)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(express.json())

app.use(router)

dbConnect()

io.on('connection', (socket) => {
  console.log('a user connected')

  // When a user provides their ID, save their socket.
  socket.on('register', (userId) => {
    userSockets[userId] = socket
  })

  socket.on('message', async (messageData) => {
    try {
      const newMessage = new Message({
        text: messageData.text,
        senderId: messageData.senderId,
        reciverId: messageData.reciverId,
      })
      await newMessage.save()

      // Emit the success event back to the sender
      socket.emit('message_saved', {
        success: true,
        message: 'Message saved successfully',
      })

      // Emit message to a targeted user
      const targetSocket = userSockets[messageData.reciverId]
      if (targetSocket) {
        targetSocket.emit('message', messageData)
      }
    } catch (error) {
      console.error('Error saving message:', error)
      socket.emit('error_saving_message', error.message)
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
    // Remove user's socket from userSockets mapping
    for (let userId in userSockets) {
      if (userSockets[userId] === socket) {
        delete userSockets[userId]
      }
    }
  })
})

app.use('/storage', express.static('storage'))

app.use(errorHandler)

app.get('/', (req, res) => res.json({ msg: 'Hello World' }))

server.listen(port, console.log(` app is running on ${port}`))
