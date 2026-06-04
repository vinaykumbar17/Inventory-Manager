import { useEffect, useState } from "react";

import {
  Navigate
} from "react-router-dom";

import {
  onAuthStateChanged
} from "firebase/auth";

import { auth } from "../firebase/firebase";

function ProtectedRoute({ children }) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  if (loading) {

    return <h2>Loading...</h2>;
  }

  if (!user) {

    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;