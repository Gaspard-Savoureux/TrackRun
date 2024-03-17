import multer from 'multer';
import {NextFunction, Request, Response} from 'express';
import * as fs from 'node:fs';
import * as console from 'node:console';
import {err} from 'drizzle-kit/cli/views';

// Set up storage directory (adjust path as needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/'); // make sure this uploads directory exists
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.gpx');
  }
});

// Adjust the fileFilter to include the req parameter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if ( file.mimetype === 'application/gpx+xml'
    || file.mimetype === 'application/octet-stream' && file.originalname.endsWith('.gpx')
    || file.mimetype === 'text/xml' && file.originalname.endsWith('.gpx') ) {
    cb(null, true);
  } else {
    new Error('Please upload only GPX files.');
    cb(null, false);
  }
};

export const deletefile = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error(err);
  }
};

// Then, when configuring multer, everything else remains the same
export const upload = multer({ storage, fileFilter });
