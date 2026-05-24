import mongoose from "mongoose";

const goodsDonationSchema = new mongoose.Schema(
	{
		// Basic donation info
		campaign: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Campaign",
			required: true,
		},

		donor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		// Goods details
		items: [
			{
				name: {
					type: String,
					required: true,
					trim: true,
				},
				category: {
					type: String,
					enum: [
						"food",
						"clothing",
						"medical",
						"shelter",
						"education",
						"electronics",
						"household",
						"other",
					],
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				unit: {
					type: String,
					enum: ["pieces", "kg", "liters", "boxes", "bags", "sets", "units"],
					default: "pieces",
				},
				estimatedValue: {
					type: Number,
					required: true,
					min: 0,
				},
				condition: {
					type: String,
					enum: ["new", "like-new", "good", "fair"],
					default: "good",
				},
				description: {
					type: String,
					trim: true,
				},
				images: [
					{
						url: String,
						publicId: String,
					},
				],
			},
		],

		// Logistics - Using existing Location model
		pickupLocation: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Location",
			required: true,
		},

		deliveryMethod: {
			type: String,
			enum: ["pickup", "drop-off", "courier"],
			required: true,
		},

		preferredPickupTime: {
			type: Date,
		},

		// Contact info
		contactInfo: {
			phone: {
				type: String,
				required: true,
			},
			alternatePhone: String,
			email: String,
			preferredContactMethod: {
				type: String,
				enum: ["phone", "email", "both"],
				default: "phone",
			},
		},

		// Status tracking
		status: {
			type: String,
			enum: [
				"pending", // Just submitted
				"verified", // Admin verified the donation
				"scheduled", // Pickup/delivery scheduled
				"collected", // Items collected
				"delivered", // Items delivered to campaign
				"completed", // Donation process complete
				"cancelled", // Donation cancelled
				"rejected", // Admin rejected
			],
			default: "pending",
		},

		// Admin fields
		verifiedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},

		verifiedAt: {
			type: Date,
		},

		rejectionReason: {
			type: String,
		},

		// Logistics tracking
		scheduledPickupDate: {
			type: Date,
		},

		actualPickupDate: {
			type: Date,
		},

		deliveryDate: {
			type: Date,
		},

		courierInfo: {
			name: String,
			phone: String,
			trackingNumber: String,
		},

		// Notes and communication
		donorNotes: {
			type: String,
			trim: true,
		},

		adminNotes: {
			type: String,
			trim: true,
		},

		// Totals
		totalEstimatedValue: {
			type: Number,
			default: 0,
		},

		totalItems: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

// Calculate totals before saving
goodsDonationSchema.pre("save", async function () {
	if (this.items && this.items.length > 0) {
		this.totalEstimatedValue = this.items.reduce(
			(sum, item) => sum + (item.estimatedValue || 0),
			0,
		);
		this.totalItems = this.items.reduce(
			(sum, item) => sum + (item.quantity || 0),
			0,
		);
	}
});

// Indexes for better query performance
goodsDonationSchema.index({ campaign: 1, status: 1 });
goodsDonationSchema.index({ donor: 1, createdAt: -1 });
goodsDonationSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("GoodsDonation", goodsDonationSchema);
