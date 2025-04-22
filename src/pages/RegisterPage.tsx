import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authAPI } from "../lib/api";
import { setAuth } from "../lib/auth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "faculty";
};

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      role: "student",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      // Remove confirmPassword as it's not needed in the API call
      const { confirmPassword, ...registerData } = data;
      const response = await authAPI.register(registerData);
      setAuth(response.data.token, { ...registerData, id: "" });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create an account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          error={errors.name?.message}
          disabled={isLoading}
          required
          {...register("name", {
            required: "Name is required",
          })}
        />

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

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "confirmPassword"}
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            disabled={isLoading}
            required
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                value="student"
                {...register("role")}
              />
              <span className="ml-2 text-gray-700">Student</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-blue-600"
                value="faculty"
                {...register("role")}
              />
              <span className="ml-2 text-gray-700">Faculty</span>
            </label>
          </div>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
