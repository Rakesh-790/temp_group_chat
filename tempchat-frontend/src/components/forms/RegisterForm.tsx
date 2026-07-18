import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../service/auth.service";
import { useAuthStore } from "../../store/auth.store";
import type { MessageResponse } from "../../types/auth.types";
import { registerSchema, type RegisterFormData, } from "../../validation/auth.validation";
import toast from "react-hot-toast";

const RegisterForm = () => {
    const navigate = useNavigate();

    const setUser = useAuthStore((state) => state.setUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const registerMutation = useMutation({
        mutationFn: registerUser,

        onSuccess: (response) => {
            toast.success(response.message);
            setUser(response.user);
            navigate("/");
        },

        onError: (error: AxiosError<MessageResponse>) => {
            toast.error(
                error.response?.data.message ?? "Registration failed"
            );
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
        >
            <div>
                <label
                    htmlFor="username"
                    className="mb-1 block text-sm font-medium"
                >
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username")}
                    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.username.message}
                    </p>
                )}
            </div>

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

            <button
                type="submit"
                disabled={registerMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {registerMutation.isPending
                    ? "Creating Account..."
                    : "Register"}
            </button>
        </form>
    );
};

export default RegisterForm;