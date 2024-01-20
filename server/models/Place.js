import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      // required: true,
      default: 4.5,
    },
    category: {
      type: String,
      required: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

PlaceSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "place",
});

export default mongoose.model("Place", PlaceSchema);
