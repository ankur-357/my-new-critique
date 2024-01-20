import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPlaces } from "../../redux/placeSlice";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineRateReview } from "react-icons/md";
import { toast } from "react-hot-toast";
import Search from "./Search";
import Filter from "./Filter";
import ReactPaginate from "react-paginate";
import { Rings } from "react-loader-spinner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles


const PlaceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const places = useSelector((state) => state.places.places);
  const loading = useSelector((state) => state.places.loading);
  const isAuthenticated = useSelector((state) => state.auth.user);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  const calculateAverageRating = () => {
    if (!places.reviews || places.reviews.length === 0) return 0;

    const sumOfRatings = places.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    console.log(sumOfRatings);
    return sumOfRatings / places.reviews.length;
  };

  const averageRating = calculateAverageRating();
  console.log(averageRating);

  useEffect(() => {
    dispatch(fetchPlaces(searchQuery));
  }, [dispatch, searchQuery]);


  useEffect(() => {
    if (searchQuery) {
      const filteredPlaces = places.filter(
        (place) =>
          place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredPlaces);
    } else {
      setSearchResults([]);
    }
  }, [places, searchQuery]);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  const filteredPlaces = selectedCategory
    ? places.filter((place) => place.category === selectedCategory)
    : places;

  const pageCount = Math.ceil(
    (searchQuery ? searchResults : filteredPlaces).length / itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
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


  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold m-4 text-center">Public Review</h2>
        <div className="flex justify-center m-4">
          {isAuthenticated ? (
            <Link
              to="/user/place/new"
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              Add New Review
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
            >
              Login to Add Your Review
            </Link>
          )}
        </div>
      </div>

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Filter
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {(searchQuery ? searchResults : filteredPlaces)
          ?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
          .map((place) => (
            <div
              key={place._id}
              className="rounded-lg overflow-hidden border border-primary transition duration-300 ease-in-out transform hover:scale-105"
            >
              <img
                className="h-64 w-full object-cover object-center"
                src={place.coverImage}
                alt="place"
              />
              <div className="p-6">
                <h2 className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-widest">
                  {place.category}
                </h2>
                <h1 className="text-lg font-medium text-gray-900 mb-3">
                  {place.title}
                </h1>
                <p className="mb-3 leading-relaxed">
                  <ReactQuill
                    value={place.summary}
                    readOnly
                    theme="snow"
                    modules={{ toolbar: false }}
                  />
                </p>

                <p>
                  {place.rating >= 0 && ( // Display average rating section
                    <div className="mb-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className={`${index < place.rating
                              ? "text-yellow-500"
                              : "text-gray-400"
                              }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-600">
                          {place.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </p>

                <div className="flex items-center flex-wrap justify-between">
                  <Link
                    to={`/place/${place._id}`}
                    className="inline-flex items-center text-secondary bg-primary px-4 py-2 rounded-sm cursor-pointer transition duration-300 ease-in-out hover:bg-primary-light hover:text-white"
                  >
                    Read More
                    <svg
                      className="w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                  <div className="mt-3 md:mt-0">
                    <span className="inline-flex items-center mr-3 text-gray-400 leading-none text-sm border-r-2 border-gray-200 pr-3 py-1">
                      <svg
                        className="w-4 h-4 mr-1"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {place.viewCount}
                    </span>
                    <span className="inline-flex items-center text-gray-400 leading-none text-sm">
                      <MdOutlineRateReview className="w-4 h-4 mr-1" />
                      {place.reviews.length}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <Link to={`/place/profile/${place.user.id}`}>
                    <img
                      className="w-8 h-8 rounded-full mr-2 cursor-pointer"
                      src={place.user.profileImage}
                      alt="user"
                    />
                  </Link>
                  <div>
                    <Link
                      to={`/place/profile/${place.user.id}`}
                      className="text-sm font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleUserClick(place.user.id)}
                    >
                      {place.user.name}
                    </Link>
                    <p className="text-xs text-gray-400">
                      {new Date(place.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mt-4">
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          containerClassName="flex mt-4 justify-center"
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          activeClassName="text-primary"
          disabledClassName="text-gray-500 cursor-not-allowed"
          pageClassName="px-2 cursor-pointer"
          previousClassName="px-2 cursor-pointer"
          nextClassName="px-2 cursor-pointer"
          breakClassName="px-2"
        />
      </div>
    </div>
  );
};

export default PlaceList;
