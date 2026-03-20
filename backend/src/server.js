import cors from 'cors';
import express from 'express';
import { PORT, FRONTEND_URL } from './config/config.js';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import responseHandler from './utils/responseHandler.js';
import seedAdmin from './utils/seedAdmin.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow Postman / curl (no origin) + listed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
    try {
        return responseHandler.success(res, '✅ KaamSetu API is running');
    } catch (error) {
        return responseHandler.error(res, error?.message);
    }
});

// All API routes
app.use('/api/v1', routes);

// 404 fallback
app.use('*', (req, res) => {
    return responseHandler.notFound(res, `Route ${req.originalUrl} not found`);
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        await seedAdmin(); // Auto-create admin if none exists

        app.listen(PORT, () => {
            console.log(`✅ KaamSetu API running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error starting server:', error.message);
        process.exit(1);
    }
};

startServer();
