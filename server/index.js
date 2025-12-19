import express from 'express';
import cors from 'cors';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Database initialization
let db;
(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, 'database.sqlite'),
            driver: sqlite3.Database
        });

        await db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        submittedAt TEXT,
        status TEXT,
        packageId TEXT,
        businessName TEXT,
        businessType TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        googleMapsLink TEXT,
        aboutUs TEXT,
        services TEXT, -- stored as JSON string
        workingHours TEXT,
        socialLinks TEXT, -- stored as JSON string
        language TEXT,
        primaryColor TEXT,
        themeStyle TEXT,
        specialNotes TEXT,
        logoUrl TEXT,
        imageUrls TEXT -- stored as JSON string
      )
    `);

        console.log('Connected to SQLite database');
    } catch (err) {
        console.error('Error opening database', err);
    }
})();

// API Routes

// GET all submissions
app.get('/api/submissions', async (req, res) => {
    try {
        const submissions = await db.all('SELECT * FROM submissions ORDER BY submittedAt DESC');
        // Parse JSON fields
        const parsed = submissions.map(sub => ({
            ...sub,
            services: JSON.parse(sub.services || '[]'),
            socialLinks: JSON.parse(sub.socialLinks || '{}'),
            imageUrls: JSON.parse(sub.imageUrls || '[]')
        }));
        res.json(parsed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new submission
app.post('/api/submissions', upload.array('files'), async (req, res) => {
    try {
        const data = JSON.parse(req.body.data);
        const files = req.files || [];

        // Process uploaded files
        const uploadedUrls = files.map(f => `http://localhost:${PORT}/uploads/${f.filename}`);

        // If logic: The frontend usually separates logo and other images, or sends them all together.
        // For simplicity in this demo backend, we'll append ANY new uploads to the imageUrls list,
        // or if a specific field 'logo' was used in a real formdata separation we'd handle it.
        // Here we'll just treat all uploads as generic images or logos based on client logic, 
        // but the client sends a big JSON with metadata.
        // Let's assume the client sends file blobs and we return URLs, OR the client uploads first then submits metadata.
        // STRATEGY: Mixed. We'll stick to a simple strategy: The client sends a multipart form with 'data' (json) and 'files' (binary).
        // We add the new file URLs to the data.imageUrls array.

        const finalImageUrls = [...(data.imageUrls || []), ...uploadedUrls];

        const submission = {
            ...data,
            imageUrls: JSON.stringify(finalImageUrls),
            services: JSON.stringify(data.services || []),
            socialLinks: JSON.stringify(data.socialLinks || {}),
            status: 'Submitted',
            submittedAt: new Date().toISOString()
        };

        await db.run(`
      INSERT INTO submissions (
        id, submittedAt, status, packageId, businessName, businessType, phone, email, address, 
        googleMapsLink, aboutUs, services, workingHours, socialLinks, language, primaryColor, 
        themeStyle, specialNotes, logoUrl, imageUrls
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            submission.id, submission.submittedAt, submission.status, submission.packageId,
            submission.businessName, submission.businessType, submission.phone, submission.email,
            submission.address, submission.googleMapsLink, submission.aboutUs, submission.services,
            submission.workingHours, submission.socialLinks, submission.language, submission.primaryColor,
            submission.themeStyle, submission.specialNotes, submission.logoUrl, submission.imageUrls
        ]);

        res.json({ success: true, id: submission.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PUT update submission
app.put('/api/submissions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Fetch current to merge safely if needed, or just build dynamic query
        // Dynamic update query builder
        const fields = Object.keys(updates).filter(k => k !== 'id');
        if (fields.length === 0) return res.json({ success: true });

        const setClause = fields.map(f => `${f} = ?`).join(', ');
        const values = fields.map(f => {
            const val = updates[f];
            return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
        });

        await db.run(`UPDATE submissions SET ${setClause} WHERE id = ?`, [...values, id]);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload route for standalone file uploads (e.g. from Admin Dashboard changing a logo)
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
