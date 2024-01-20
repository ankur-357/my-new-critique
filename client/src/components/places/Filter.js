import React from "react";

const Filter = ({ selectedCategory, handleCategoryChange }) => {
  const categories = [
    { label: "All", value: "" },
    { label: "Restaurants and Cafes", value: "restaurants-cafes" },
    { label: "Hotels and Accommodations", value: "hotels-accommodations" },
    { label: "Schools and Colleges", value: "schools-colleges" },
    { label: "Electronics and Gadgets", value: "electronics-gadgets" },
    { label: "Movies and TV Shows", value: "movies-tv-shows" },
    { label: "Books", value: "books" },
    { label: "Travel Destinations", value: "travel-destinations" },
    { label: "Events and Concerts", value: "events-concerts" },
    { label: "Fitness and Health Services", value: "fitness-health-services" },
    { label: "Online Services", value: "online-services" },
    { label: "Automobiles", value: "automobiles" },
    { label: "Fashion and Apparel", value: "fashion-apparel" },
    { label: "Software and Apps", value: "software-apps" },
    { label: "Home Appliances", value: "home-appliances" },
    { label: "DIY Products and Tools", value: "diy-products-tools" },
    { label: "Art and Galleries", value: "art-galleries" },
    { label: "Music Albums and Artists", value: "music-albums-artists" },
    { label: "Tech Gadgets", value: "tech-gadgets" },
    { label: "Outdoor Activities", value: "outdoor-activities" },
    { label: "Home Decor and Furniture", value: "home-decor-furniture" },
  ];
  


  return (
    <div className="flex flex-wrap justify-center mb-4">
      {categories.map((category) => (
        <button
          key={category.value}
          className={`px-3 py-1 my-1 rounded-md ${selectedCategory === category.value
            ? "bg-primary text-secondary"
            : "bg-gray-200"
            } mr-2`}
          onClick={() => handleCategoryChange(category.value)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default Filter;
