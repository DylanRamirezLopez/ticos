const dns = require('dns');
dns.setServers(['10.239.246.135', '8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const Sentry = require('@sentry/node');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const setupSocket = require('./socket');

dotenv.config();

// ─── #3: Sentry Error Tracking ───
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.2,
  });
}

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const storyRoutes = require('./routes/stories');
const commentRoutes = require('./routes/comments');
const echoRoutes = require('./routes/echo');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const telemetryMiddleware = require('./middleware/telemetry');
const { seedAdmin } = require('./controllers/admin');

const app = express();
const server = http.createServer(app);

// ─── #1: Seguridad - Proxy trust ───
app.set('trust proxy', 1);

// ─── #5: CORS Estricto ───
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://ticos-beryl.vercel.app',
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── #3: Helmet (seguridad HTTP headers) ───
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// ─── Compresión ───
app.use(compression());

// ─── #4: Rate Limiting global ───
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

// ─── #4: Rate Limiting estricto para auth ───
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── #4: Rate Limit para Echo ───
const echoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Too many echoes, slow down.' },
});
app.use('/api/echo', echoLimiter);

// ─── #2: Mongo Sanitize (previene NoSQL injection) ───
app.use(mongoSanitize());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

connectDB();

app.use(express.json({ limit: '10kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Telemetría (captura cada request) ───
app.use('/api/', telemetryMiddleware());

// ─── Seed admin user ───
seedAdmin();

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/echo', echoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TICOS API is running', environment: process.env.NODE_ENV || 'development' });
});

// ─── #3: Sentry error handler ───
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// ─── #3: Error handler global ───
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
