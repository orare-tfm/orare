import React from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: "url('/praying.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero min-h-screen">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Bienvenido a Oraré</h1>
            <p className="mb-5">
              Descubre la paz a través de la Oración para una vida equilibrada y
              plena.
            </p>

            <button
              onClick={() => router.push("signin")}
              className="btn btn-primary font-semibold leading-6 hover:text-indigo-300"
            >
              Ingresa aquí
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
