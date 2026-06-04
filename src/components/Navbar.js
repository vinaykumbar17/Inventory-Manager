import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "../firebase/firebase";

function Navbar() {

  const navigate = useNavigate();

  const [darkMode,
    setDarkMode] = useState(false);

  const [userEmail,
    setUserEmail] = useState("");

  const [currentTime,
    setCurrentTime] = useState(
      new Date()
    );
  const [statusMessage,
    setStatusMessage] = useState("");

  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        "darkMode"
      );

    if (savedTheme === "true") {

      setDarkMode(true);

      document.body.classList.add(
        "dark-mode"
      );
    }

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          if (user) {

            setUserEmail(
              user.email
            );
          }
        }
      );

    const timer = setInterval(() => {

      setCurrentTime(
        new Date()
      );

    }, 1000);

    return () => {

      unsubscribe();

      clearInterval(timer);
    };

  }, []);

  const handleLogout = async () => {

    try {

      await signOut(auth);
      setStatusMessage("Logged out successfully.");

      navigate("/");

    } catch (error) {

      console.log(error);
    }
  };

  const toggleDarkMode = () => {

    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "darkMode",
      newMode
    );

    if (newMode) {

      document.body.classList.add(
        "dark-mode"
      );

    } else {

      document.body.classList.remove(
        "dark-mode"
      );
    }
  };

  const today =
    currentTime.toLocaleDateString();

  const liveTime =
    currentTime.toLocaleTimeString();

  return (
    <div className="navbar">

      <div>

        <h2>
          Welcome 👋
        </h2>

        <p>{userEmail}</p>

        <p>{today}</p>

        <p>{liveTime}</p>
        {statusMessage ? (
          <p>{statusMessage}</p>
        ) : null}

      </div>

      <div className="navbar-actions">

        <button
          onClick={toggleDarkMode}
          style={{
            marginRight: "10px"
          }}
        >

          {
            darkMode
              ? "☀ Light"
              : "🌙 Dark"
          }

        </button>

        <button
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;