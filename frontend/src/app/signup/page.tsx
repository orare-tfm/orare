"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {} from "../firebase";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { auth, createUserDocumentFromAuth } from "../firebase";
import { postalCodes, churches } from "../utils";
import axios from "axios";
import Select from "react-select";

type OptionType = {
  value: string;
  label: string;
};

export default function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [postalCode, setPostalCode] = useState<OptionType | null>(null);
  const [address, setAddress] = useState<string>("");
  const [church, setChurch] = useState<OptionType | null>(null);
  const router = useRouter();
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail) || newEmail === "");
  };

  const signup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createUserDocumentFromAuth(
        userCredential.user,
        postalCode?.value || "",
        address,
        church?.value || ""
      );
      //console.log(userCredential.user.uid);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createUser`, {
        userId: userCredential.user.uid,
        email: userCredential.user.email,
        postalCode: postalCode?.value,
        address,
        church: church?.value,
      });

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/chat",
      });

      if (result?.error) {
        console.error(result.error);
      } else {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const postalCodeOptions = postalCodes.map((code) => ({
    value: code,
    label: code,
  }));

  const churchOptions = churches
    .sort((a, b) => a.parroquia.localeCompare(b.parroquia))
    .map((church) => ({
      value: church.parroquia,
      label: church.parroquia,
    }));

  const style = {
    control: (base: any) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };




  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
            Regístrate
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-400"
              >
                Correo elegrónico*
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  required
                  placeholder="example@upc.com"
                  className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 bg-gray-100 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              {!isValidEmail && email !== "" && (
                <p className="mt-2 text-sm text-red-400">
                  Por favor, introduce una dirección de correo electrónico
                  válida.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-400"
                >
                  Contraseña*
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Al menos 8 caracteres"
                  className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 bg-gray-100 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {password.length > 0 && password.length < 8 && (
              <p className="mt-2 text-sm first-line:text-red-400">
                La contraseña debe tener al menos 8 caracteres.
              </p>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="passwordAgain"
                  className="block text-sm font-medium leading-6 text-gray-400"
                >
                  Confirma contraseña*
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="passwordAgain"
                  name="passwordAgain"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  required
                  placeholder="Repetir la contraseña"
                  className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 bg-gray-100 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {password != passwordAgain && (
              <p className="mt-2 text-sm text-red-400">
                La confirmacion debe ser igual a la contraseña.
              </p>
            )}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium leading-6 text-gray-400"
                >
                  Código Postal*
                </label>
              </div>
              <div className="mt-2">
                <Select
                  styles={style}
                  id="postalCode"
                  name="postalCode"
                  options={postalCodeOptions}
                  onChange={setPostalCode}
                  placeholder="Seleccione un código postal"
                  isClearable
                  isSearchable
                  className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 bg-gray-100 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-400"
                >
                  Dirección
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="address"
                  name="address"
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 bg-gray-100 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="church"
                  className="block text-sm font-medium leading-6 text-gray-400"
                >
                  Iglesia local*
                </label>
              </div>
              <div className="mt-2">
                <Select
                  styles={style}
                  id="church"
                  name="church"
                  options={churchOptions}
                  onChange={setChurch}
                  placeholder="Seleccione una iglesia"
                  isClearable
                  isSearchable
                  className="pl-2 block w-full rounded-md border border-gray-300 py-1.5 bg-gray-100 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={
                  !email ||
                  !isValidEmail ||
                  !password ||
                  !passwordAgain ||
                  password.length < 8 ||
                  password !== passwordAgain ||
                  !postalCode ||
                  !church
                }
                onClick={signup}
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-cyan-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Registrarse
              </button>
            </div>
            <p className="text-sm  text-red-400">* Campos Obligatorios</p>
          </div>
        </div>
      </div>
    </>
  );
}
