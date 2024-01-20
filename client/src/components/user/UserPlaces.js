import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserPlaces } from "../../redux/placeSlice";

const UserPlaces = () => {
  const dispatch = useDispatch();
  const userPlaces = useSelector((state) => state.places.userPlaces);

  useEffect(() => {
    dispatch(fetchUserPlaces());
  }, [dispatch]);


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Places</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userPlaces.length > 0 ? (
          userPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center"
            >
              <img
                src={place.coverImage}
                alt={place.title}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="text-xl font-semibold">{place.title}</h4>
                <p className="text-gray-500">{place.author}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No places found.</p>
        )}
      </div>
    </div>
  );
};

export default UserPlaces;
