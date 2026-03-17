import multer from 'multer';
import path from 'path';

// এই লগটি সার্ভার স্টার্ট হওয়ার সময় টার্মিনালে আসবে (যদি ইমপোর্ট ঠিক থাকে)
console.log(">>> [System] Multer Middleware File Loaded");

// মেমোরি স্টোরেজ ব্যবহার করছি কারণ আমরা 'sharp' দিয়ে ইমেজ প্রসেস করব
const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    // এই লগটি কেবল রিকোয়েস্ট আসলে এবং ফাইল থাকলে প্রিন্ট হবে
    console.log(">>> [Multer] Checking file type for:", file.originalname);
   
    const allowedTypes = /jpeg|jpg|png|webp/; 
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        console.log(">>> [Multer] File type is valid.");
        return cb(null, true);
    } else {
        console.error(">>> [Multer] Error: Invalid file type!");
        cb(new Error('Only images (jpg, png, webp) are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // ৫ মেগাবাইট লিমিট
    }, 
    fileFilter: fileFilter
});

// মিডলওয়্যার অবজেক্টটি ঠিকমতো তৈরি হয়েছে কিনা তা চেক করার লগ
console.log(">>> [System] Multer Instance Created & Ready");

export default upload;