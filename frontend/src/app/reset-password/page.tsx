"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Te hemos enviado un enlace para restablecer tu contraseña si el correo está registrado."
      );
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      setError(
        "Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde."
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
          Recupera tu contraseña
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleResetPassword} className="space-y-6">
          {message && (
            <div className="text-green-500 text-sm text-center">{message}</div>
          )}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-400"
            >
              Correo electrónico
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-2 block w-full rounded-md border bg-gray-100 border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-cyan-600 text-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Enviar enlace de recuperación
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Regresa a{" "}
          <button
            onClick={() => router.push("/signin")}
            className="font-semibold leading-6 text-cyan-600 hover:text-indigo-400"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
