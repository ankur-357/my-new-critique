import axios from "axios";
import { BASE_URL } from "../config/url";

export const getAllPlaces = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/places`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch places");
  }
};

export const getPlaceReviews = async (placeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/places/place/${placeId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.reviews;
  } catch (error) {
    throw new Error("Failed to fetch place reviews");
  }
};
