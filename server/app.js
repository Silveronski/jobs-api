require('dotenv').config();
require('express-async-errors'); // async erros will automatically be caught and passed to the error handling middleware
                                 // without the need to catch the error or do 'next()'

const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const connectToDb = require('./db/connect');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authenticateUser = require('./middleware/authentication');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
// app.set('trust proxy', 1); uncomment if hosted on a platform that uses reverse proxy
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1000, // Limit each IP to 300 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use(errorHandler);
app.use(notFound);

connectToDb();

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});