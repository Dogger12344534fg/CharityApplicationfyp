import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
	cloudinary,
	params: async (req, file) => {
		let folder = 'setu';

		return {
			folder,
			allowed_formats: ["jpg", "png", "jpeg"],
			public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
			transformation: [{ width: 800, height: 800, crop: "limit" }],
		};
	},
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;
