import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaces, addPlace } from "../../redux/placeSlice";
import { Rings } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the Quill styles

const PlaceForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.places.loading);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [category, setCategory] = useState("");

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
    toast.success("Cover image uploaded successfully");
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };
  const handleSummaryChange = (value) => {
    setSummary(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("summary", summary);
    formData.append("coverImage", coverImage);
    formData.append("category", category);

    try {
      await dispatch(addPlace(formData));
      dispatch(fetchPlaces());
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Rings
          height="80"
          width="80"
          color="#21BF73"
          radius="6"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="rings-loading"
        />
      </div>
    );
  }
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-black">Add your review</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 border-2 border-primary rounded-lg p-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-black"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="border text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-white border-black placeholder-gray-500 text-black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Type place title"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="author"
                className="block mb-2 text-sm font-medium text-black"
              >
                Author
              </label>
              <input
                type="text"
                name="author"
                id="author"
                className="bg-white border border-black text-black text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 placeholder-gray-500 caret-black block w-full p-2.5"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Place author"
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-black"
              >
                Description
              </label>
              <ReactQuill
                value={description}
                onChange={(e) => handleDescriptionChange(e)}
                modules={modules}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="summary"
                className="block mb-2 text-sm font-medium text-black"
              >
                Summary
              </label>
              <ReactQuill
                value={summary}
                onChange={(e) => handleSummaryChange(e)}
                modules={modules}
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-black"
              >
                Category
              </label>
              <select
                id="category"
                className="bg-white border border-black text-black text-sm rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="restaurants-cafes">Restaurants and Cafes</option>
                <option value="hotels-accommodations">Hotels and Accommodations</option>
                <option value="schools-colleges">Schools and Colleges</option>
                <option value="electronics-gadgets">Electronics and Gadgets</option>
                <option value="movies-tv-shows">Movies and TV Shows</option>
                <option value="books">Books</option>
                <option value="travel-destinations">Travel Destinations</option>
                <option value="events-concerts">Events and Concerts</option>
                <option value="fitness-health-services">Fitness and Health Services</option>
                <option value="online-services">Online Services</option>
                <option value="automobiles">Automobiles</option>
                <option value="fashion-apparel">Fashion and Apparel</option>
                <option value="software-apps">Software and Apps</option>
                <option value="home-appliances">Home Appliances</option>
                <option value="diy-products-tools">DIY Products and Tools</option>
                <option value="art-galleries">Art and Galleries</option>
                <option value="music-albums-artists">Music Albums and Artists</option>
                <option value="tech-gadgets">Tech Gadgets</option>
                <option value="outdoor-activities">Outdoor Activities</option>
                <option value="home-decor-furniture">Home Decor and Furniture</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="coverImage"
                className="block mb-2 text-sm font-medium text-black"
              >
                Cover Image
              </label>
              <input
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/*"
                className="bg-white border border-black text-black text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-primary rounded-lg focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Add your review
          </button>
        </form>
      </div>
    </section>
  );
};

export default PlaceForm;
