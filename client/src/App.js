import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import PlaceDetail from "./components/places/PlaceDetail";
import UserProfile from "./components/user/UserProfile";
import NotFoundPage from "./pages/NotFoundPage";
import PlaceForm from "./components/places/PlaceForm";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import PlaceUser from "./components/places/PlaceUser";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-right"></Toaster>
      </div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/user" element={<ProtectedRoute />}>
            <Route path="place/new" element={<PlaceForm />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/place/:placeId" element={<PlaceDetail />} />
          <Route path="/place/profile/:userId" element={<PlaceUser />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
