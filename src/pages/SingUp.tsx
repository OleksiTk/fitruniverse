import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { signInWithGoogle, loginWithEmail } from "../firebase"; // Імпортуємо функції з firebase
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Очистка помилок при введенні
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
      email: "",
      password: "",
    };

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
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        // Використовуємо функцію loginWithEmail для входу через email та пароль
        const user = await loginWithEmail(formData.email, formData.password);
        toast.success("Login successful!");
        navigate("/profile"); // Після успішного входу перенаправляємо користувача на сторінку профілю
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);

    try {
      if (provider === "Google") {
        const user = await signInWithGoogle(); // Вхід через Google
        localStorage.setItem("userEmail", user.email); // Збереження email користувача в localStorage
        toast.success(`Signed in with ${provider}!`);
        navigate("/profile"); // Перенаправлення на профіль
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
            <h1 className="text-2xl font-bold mb-2">Sign-In</h1>
            <p className="text-gray-600">
              Track your runs and achieve your goals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
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
              Sign in with Google
            </Button>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link
              to="/register"
              className="ml-1 text-fitness-primary font-medium hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
