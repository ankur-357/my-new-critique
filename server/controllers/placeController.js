import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Place from "../models/Place.js";
import Review from "../models/Review.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";

// @desc    Get all places
// @route   GET /api/places
// @access  Public
export const getPlaces = asyncHandler(async (req, res) => {
  try {
    const places = await Place.find({})
      .populate({
        path: "reviews",
      })
      .populate("user", "name profileImage");
    if (places.length > 0) {
      res.status(200).json({ message: "Places found", places });
    } else {
      res.status(404).json({ message: "No places found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get a place by ID
// @route   GET /api/places/:id
// @access  Public
export const getPlaceById = asyncHandler(async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate([
      { path: "reviews" },
    ]);

    if (place) {
      let count = place.viewCount;
      count = count + 1;
      place.viewCount = count;
      await place.save();
      res.status(200).json({ message: "Place found", place });
    } else {
      res.status(404).json({ message: "Place not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all places by a user
// @route   GET /api/places/myPlaces
// @access  Private
export const getUserPlaces = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate("places");
    res.status(200).json(user.places);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch user's places", message: error.message });
  }
};

// @desc    Add a new place
// @route   POST /api/places
// @access  Private
export const addPlace = asyncHandler(async (req, res) => {
  const { title, author, description, summary, category } = req.body;

  if (!title || !author || !description || !summary) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const place = new Place({
      title,
      author,
      description,
      summary,
      category,
      user: req.userId,
    });

    if (req.file) {
      // Uploading the cover image to AWS S3
      await uploadImage(req.file, "cover-images", place._id);

      // Setting the cover image URL in the place model
      place.coverImage = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/cover-images/${place._id}/${req.file.originalname}`;
    }

    const createdPlace = await place.save();
    res.status(201).json(createdPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a place
// @route   PUT /api/places/:id
// @access  Private
export const updatePlace = asyncHandler(async (req, res) => {
  const { title, author, description, summary } = req.body;

  try {
    const place = await Place.findById(req.params.id);

    if (place) {
      place.title = title || place.title;
      place.author = author || place.author;
      place.description = description || place.description;
      place.summary = summary || place.summary
      if (req.file) {
        // Upload the cover image to AWS S3
        await uploadCoverImage(req.file, place._id);

        // Set the cover image URL in the place model
        place.coverImage = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${req.file.originalname}`;
      }

      const updatedPlace = await place.save();
      res.status(201).json({ message: "Place updated", place: updatedPlace });
    } else {
      res.status(404).json({ message: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a place
// @route   DELETE /api/places/:id
// @access  Private
export const deletePlace = asyncHandler(async (req, res) => {
  try {
    const placeId = await Place.findById(req.params.id);

    if (!placeId) {
      return res.status(404).json({ message: "Place not found" });
    }

    const place = await Place.findByIdAndDelete(placeId);
    const places = await Place.find({ places: place.places });
    return res.status(200).json({ message: "Place deleted", places });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete your review", error: error.message });
  }
});

// @desc    Get reviews for a place
// @route   GET /api/places/:placeId/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  try {
    const placeId = req.params.placeId;
    if (!placeId) {
      return res.status(400).json({ message: "Place ID not received!" });
    }

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place Not Found!" });
    }

    const reviews = await Place.findById(placeId).populate([
      { path: "reviews", populate: { path: "user" } },
    ]);
    return res.status(200).json({ message: "Reviews sent", reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Add a review to a place
// @route   POST /api/places/:id/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const place = await Place.findById(req.params.id);

    if (place) {
      const userId = req.userId;

      const newReview = await Review.create({
        comment,
        rating,
        user: userId,
        place: req.params.id,
      });
      const place = await Place.findById(req.params.id).populate([
        { path: "reviews", populate: { path: "user" } },
      ]);
      return res.status(200).json({
        message: "Review created",
        review: newReview,
        reviews: place.reviews,
      });
    }

    return res.status(404).json({ message: "Place not found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

// @desc    Update a place review
// @route   PUT /api/places/:id/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;

  try {
    const review = await Review.findById(req.params.reviewId);

    if (review) {
      review.comment = comment;
      review.rating = rating;

      await review.save();
      res.status(200).json({ message: "Review updated", review });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a place review
// @route   DELETE /api/places/:id/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const reviewId = req.params.reviewId;
    await Review.findByIdAndDelete(reviewId);

    res.status(201).json({ message: "Review removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete review", error: error.message });
  }
});
