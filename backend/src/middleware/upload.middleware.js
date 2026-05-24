import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		let folder = 'setu';
		const sanitizedName = file.originalname.split('.')[0].replace(/\s+/g, '_').replace(/[^a-zA-Z0-9-_]/g, '');

		return {
			folder,
			allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
			public_id: `${Date.now()}-${sanitizedName}`,
			transformation: [{ width: 800, height: 800, crop: "limit" }],
		};
	},
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
