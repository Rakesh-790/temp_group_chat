import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../service/auth.service";
import { useAuthStore } from "../../store/auth.store";
import type { MessageResponse } from "../../types/auth.types";
import { loginSchema, type LoginFormData } from "../../validation/auth.validation";
import toast from "react-hot-toast";

const LoginForm = () => {
    const navigate = useNavigate();

    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useMutation({
        mutationFn: loginUser,

        onSuccess: (response) => {
            toast.success(response.message);

            setUser(response.user);

            navigate("/");
        },

        onError: (error: AxiosError<MessageResponse>) => {
            toast.error(
                error.response?.data.message ?? "Login failed"
            );
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
        >
            <div>
                <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium"
                >
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="text-right">
                <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                >
                    Forgot Password?
                </Link>
            </div>

            <button
                type="submit"
                disabled={loginMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loginMutation.isPending
                    ? "Signing In..."
                    : "Login"}
            </button>
        </form>
    );
};

export default LoginForm;