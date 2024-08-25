// src/app/auth/signin/page.tsx

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Usamos useCallback para que el efecto solo se ejecute cuando el estado de la sesión cambia
  const redirectToHome = useCallback(() => {
    if (status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router]);

  useEffect(() => {
    redirectToHome();
  }, [redirectToHome]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear any existing errors
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/chat",
      });
      if (result?.error) {
        setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      } else {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
          Accede a tu cuenta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSignIn} className="space-y-6">
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
                aria-describedby="email-error"
                className="pl-2 block w-full rounded-md border bg-gray-100 border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Contraseña
              </label>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => router.push("/reset-password")}
                  className="cursor-pointer font-semibold text-cyan-600 hover:text-indigo-400"
                >
                  Olvidaste tu contraseña?
                </button>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-describedby="password-error"
                className="pl-2 block w-full rounded-md border bg-gray-100 border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!email || !password}
              className="disabled:opacity-40 flex w-full justify-center rounded-md bg-cyan-600 text-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Ingresar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Aún no eres miembro?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="font-semibold leading-6 text-cyan-600 hover:text-indigo-400"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
