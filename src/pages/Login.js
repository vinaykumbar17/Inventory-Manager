import {
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  auth
} from "../firebase/firebase";

import "../styles/Login.css";

function Login() {

  const navigate =
    useNavigate();

  const [isSignup,
    setIsSignup] =
    useState(false);

  const [name,
    setName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [error,
    setError] =
    useState("");

  const [success,
    setSuccess] =
    useState("");

  const [isSubmitting,
    setIsSubmitting] =
    useState(false);

  const clearMessages =
    () => {

      setError("");

      setSuccess("");
    };

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setError("");

        setSuccess("");

      }, 3000);

    return () =>
      clearTimeout(timer);

  }, [error, success]);

  const getAuthErrorMessage =
    (message) => {

      if (
        message.includes(
          "auth/invalid-credential"
        )
      ) {

        return "Invalid email or password.";
      }

      if (
        message.includes(
          "auth/email-already-in-use"
        )
      ) {

        return "This email is already registered.";
      }

      if (
        message.includes(
          "auth/weak-password"
        )
      ) {

        return "Password should be at least 6 characters.";
      }

      if (
        message.includes(
          "auth/invalid-email"
        )
      ) {

        return "Please enter a valid email address.";
      }

      return "Something went wrong. Please try again.";
    };

  const handleLogin =
    async (e) => {

      e.preventDefault();

      clearMessages();

      if (
        !email.trim() ||
        !password.trim()
      ) {

        setError(
          "Please enter both email and password."
        );

        return;
      }

      setIsSubmitting(true);

      try {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setSuccess(
          "Login successful. Redirecting..."
        );

        setTimeout(() => {

          navigate(
            "/dashboard"
          );

        }, 1000);

      } catch (error) {

        setError(
          getAuthErrorMessage(
            error.message
          )
        );

      } finally {

        setIsSubmitting(false);
      }
    };

  const handleSignup =
    async (e) => {

      e.preventDefault();

      clearMessages();

      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {

        setError(
          "Please fill all required fields."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {

        setError(
          "Passwords do not match."
        );

        return;
      }

      if (
        password.length < 6
      ) {

        setError(
          "Password should be at least 6 characters."
        );

        return;
      }

      setIsSubmitting(true);

      try {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        setSuccess(
          "Account created successfully. Please login."
        );

        setIsSignup(false);

        setName("");

        setEmail("");

        setPassword("");

        setConfirmPassword("");

      } catch (error) {

        setError(
          getAuthErrorMessage(
            error.message
          )
        );

      } finally {

        setIsSubmitting(false);
      }
    };

  return (

    <div className="login-container">

      <div className="login-overlay" />

      <div className="login-box">

        <h1>
          Inventory Manager
        </h1>

        <p className="login-subtitle">
          Smart stock and billing management for modern retail.
        </p>

        {
          error ? (

            <div className="form-message error">
              {error}
            </div>

          ) : null
        }

        {
          success ? (

            <div className="form-message success">
              {success}
            </div>

          ) : null
        }

        {
          isSignup ? (

            <form
              onSubmit={
                handleSignup
              }
            >

              <div className="field-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="field-group">

                <label htmlFor="signup-email">
                  Email
                </label>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="field-group">

                <label htmlFor="signup-password">
                  Password
                </label>

                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="field-group">

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Retype password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                />

              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
              >

                {
                  isSubmitting
                    ? "Creating account..."
                    : "Create Account"
                }

              </button>

              <p className="switch-text">

                Already have an account?

                <span
                  onClick={() => {

                    setIsSignup(
                      false
                    );

                    clearMessages();

                  }}
                >
                  Login
                </span>

              </p>

            </form>

          ) : (

            <form
              onSubmit={
                handleLogin
              }
            >

              <div className="field-group">

                <label htmlFor="login-email">
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="field-group">

                <label htmlFor="login-password">
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
              >

                {
                  isSubmitting
                    ? "Logging in..."
                    : "Login"
                }

              </button>

              <p className="switch-text">

                Don't have an account?

                <span
                  onClick={() => {

                    setIsSignup(
                      true
                    );

                    clearMessages();

                  }}
                >
                  Signup
                </span>

              </p>

            </form>
          )
        }

      </div>

    </div>
  );
}

export default Login;