import multer from "multer";
// multer is a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files in web applications (usually via forms).

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file"); // Middleware to accept one file with the field name "file".

// without this middleware every value that we are getting using req.body will be undefined