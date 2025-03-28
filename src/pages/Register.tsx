import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import {
  signInWithGoogle,
  registerWithEmail,
  loginWithEmail,
} from "../firebase";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error message when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        // Заміна на реєстрацію через email
        const user = await registerWithEmail(
          formData.name,
          formData.email,
          formData.password
        );
        toast.success("Registration successful!");
        navigate("/profile-setup");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);

    try {
      if (provider === "Google") {
        const user = await signInWithGoogle();
        localStorage.setItem("userEmail", user.email);
        toast.success(`Signed in with ${provider}!`);
        navigate("/profile-setup");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto max-w-md px-4 pt-32 pb-20">
        <div className="mb-8 animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="glass-panel p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600">
              Track your runs and achieve your goals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? "border-red-500" : ""}`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`input-field ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              leftIcon={<FaGoogle className="h-5 w-5 text-[#4285F4]" />}
              onClick={() => handleSocialLogin("Google")}
              disabled={isLoading}
            >
              Google
            </Button>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <Link
              to="/singup"
              className="ml-1 text-fitness-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
