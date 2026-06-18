import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import semua router
import authRoutes from './routes/authRoutes';
import supplierRoutes from './routes/supplierRoutes';
import criteriaRoutes from './routes/criteriaRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import rankingRoutes from './routes/rankingRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Pemetaan Alamat API Endpoint Utama
app.use('/api/auth', authRoutes);           // Contoh: /api/auth/register
app.use('/api/suppliers', supplierRoutes);   // Contoh: /api/suppliers
app.use('/api/criteria', criteriaRoutes);     // Contoh: /api/criteria
app.use('/api/assessment', assessmentRoutes); // Contoh: /api/assessment
app.use('/api/users', userRoutes);           // Contoh: /api/users
app.use('/api/ranking', rankingRoutes);       // Contoh: /api/ranking
app.use('/api/roles', roleRoutes);           // Contoh: /api/roles


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});