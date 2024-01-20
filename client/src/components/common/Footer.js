import React from "react";
import { Link } from "react-router-dom";
import {
  BsFillJournalBookmarkFill,
  BsTwitter,
  BsInstagram,
  BsLinkedin,
  BsGithub,
} from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="border-t-2 border-black bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between p-8">
          <Link to="/" className="flex justify-center items-center">
            <div className="flex items-center">
              <img alt="hello" src="critiquecraze-high-resolution-logo-black-transparent.png" height={200} width={200} />
            </div>
          </Link>
          <div className="text-center md:text-left text-gray-700 py-4 md:py-0">
            Made with ❤️ by{" "}
            <a
              href="https://tourtalks.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:underline"
            >
              Ankur kumar
            </a>
          </div>
          <div className="flex items-center justify-center md:justify-end space-x-4">
            <a
              href="https://github.com/ankur-357"
              className="text-primary hover:text-primary-dark"
            >
              <BsGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/ankur-kumar-tiwari-233647190?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              className="text-primary hover:text-primary-dark"
            >
              <BsLinkedin size={18} />
            </a>
            <a
              href="https://twitter.com/xtylishkur"
              className="text-primary hover:text-primary-dark"
            >
              <BsTwitter size={18} />
            </a>
            <a
              href="https://www.instagram.com/ankur_k_tiwari/"
              className="text-primary hover:text-primary-dark"
            >
              <BsInstagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
