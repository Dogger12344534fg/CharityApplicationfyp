import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (value) {
          if (!Array.isArray(value) || value.length !== 2) return false;
          const [lng, lat] = value;
          return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
        },
        message: (props) =>
          `${props.value} is not a valid [longitude, latitude] coordinate!`,
      },
    },
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  { timestamps: true }
);
// Index for geospatial queries
locationSchema.index({ coordinates: "2dsphere" });

const Location = mongoose.model("Location", locationSchema);
export default Location;
