import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserPlaces from "./UserPlaces";

const UserProfile = () => {
  const { id } = useParams(); // the user being viewed
  const loggedInUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);

        // Check if the logged-in user is already following
        if (data.user.followers.includes(loggedInUser._id)) {
          setIsFollowing(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [id, token, loggedInUser?._id]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing
        ? `/api/users/${id}/unfollow`
        : `/api/users/${id}/follow`;

      await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow w-full">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        User Profile
      </h2>

      {user ? (
        <div className="text-center">
          <div className="flex flex-col items-center mb-6">
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt="Profile"
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>

            {/* 👇 Follow/Unfollow Button (hide if it's your own profile) */}
            {loggedInUser?._id !== user._id && (
              <button
                onClick={handleFollowToggle}
                className={`mt-4 px-4 py-2 rounded-lg ${
                  isFollowing
                    ? "bg-gray-300 text-gray-700"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* Optional follower/following counts */}
          <div className="flex justify-center gap-6 mb-4 text-gray-600">
            <p>
              <strong>{user.followers?.length || 0}</strong> Followers
            </p>
            <p>
              <strong>{user.following?.length || 0}</strong> Following
            </p>
          </div>

          <div className="mt-8">
            <UserPlaces userId={user._id} />
          </div>
        </div>
      ) : (
        <p className="text-lg font-medium mb-6 text-center text-gray-600">
          No user profile found.
        </p>
      )}
    </div>
  );
};

export default UserProfile;
