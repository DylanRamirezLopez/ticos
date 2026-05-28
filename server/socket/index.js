const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    socket.join(socket.user._id.toString());

    socket.on('join-conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave-conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('join-post', (postId) => {
      socket.join(`post-${postId}`);
    });

    socket.on('leave-post', (postId) => {
      socket.leave(`post-${postId}`);
    });

    socket.on('typing', ({ receiverId }) => {
      io.to(receiverId).emit('user-typing', {
        userId: socket.user._id,
        username: socket.user.username,
      });
    });

    socket.on('stop-typing', ({ receiverId }) => {
      io.to(receiverId).emit('user-stop-typing', {
        userId: socket.user._id,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = setupSocket;
