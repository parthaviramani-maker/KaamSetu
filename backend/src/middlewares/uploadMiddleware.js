import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import responseHandler from '../utils/responseHandler.js';

// ── Multer memory storage (no disk writes) ────────────────────────────────────
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, WEBP, GIF) are allowed'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter,
});

// ── Upload buffer → Cloudinary ────────────────────────────────────────────────
export const uploadToCloudinary = (buffer, folder = 'kaamsetu/misc', options = {}) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image', ...options },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });
};

// ── Delete from Cloudinary by publicId ───────────────────────────────────────
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return false;
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
            invalidate: true,
        });
        return result.result === 'ok' || result.result === 'not found';
    } catch (err) {
        console.error('[Cloudinary] Delete failed:', err.message);
        return false;
    }
};

// ── Middleware: upload single image field, attach to req.uploadedFile ─────────
// Usage: uploadSingleImage('avatar', 'kaamsetu/avatars', { ...cloudinaryOptions })
export const uploadSingleImage = (fieldName, folder, cloudinaryOptions = {}) => {
    return async (req, res, next) => {
        upload.single(fieldName)(req, res, async (err) => {
            if (err) {
                return responseHandler.badRequest(res, err.message);
            }
            if (!req.file) {
                return next(); // no file attached — controller will handle
            }
            try {
                const result = await uploadToCloudinary(req.file.buffer, folder, cloudinaryOptions);
                req.uploadedFile = result; // { url, publicId }
                next();
            } catch (uploadErr) {
                console.error('[Cloudinary] Upload error:', uploadErr);
                return responseHandler.internalServerError(res, 'Image upload failed');
            }
        });
    };
};

export default upload;
