const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, JPG, PNG) are allowed'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.get('/', (req, res) => {
    res.json({
        message: 'Pneumonia Detection API',
        version: '1.0.0',
        endpoints: {
            predict: 'POST /predict - Upload X-ray image for prediction'
        }
    });
});

app.post('/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = req.file.path;
    const pythonScript = path.join(__dirname, '..', 'model', 'predict.py');
    
    const pythonPath = process.env.PYTHON_PATH || 'python';
    
    const pythonProcess = spawn(pythonPath, [pythonScript, imagePath]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        if (code !== 0) {
            console.error('Python error:', errorString);
            return res.status(500).json({
                error: 'Prediction failed',
                details: errorString || 'Unknown error occurred'
            });
        }

        try {
            const result = JSON.parse(dataString);
            res.json(result);
        } catch (error) {
            console.error('JSON parse error:', error);
            res.status(500).json({
                error: 'Failed to parse prediction result',
                details: dataString
            });
        }
    });

    pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        res.status(500).json({
            error: 'Failed to start prediction process',
            details: 'Ensure Python is installed and accessible'
        });
    });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size too large. Maximum 10MB allowed' });
        }
        return res.status(400).json({ error: err.message });
    }
    
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/predict`);
});
