import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../lib/api";
import { setAuth } from "../lib/auth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(data);
      setAuth(response.data.token, response.data.user);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Sign in to your account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          disabled={isLoading}
          required
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <div className="relative">
          <Input
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            error={errors.password?.message}
            disabled={isLoading}
            required
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
