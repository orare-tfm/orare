// src/app/reset-success/page.tsx
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { app } from '../firebase'; // Ajusta la importación según tu configuración

const ResetSuccess = () => {
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const oobCode = searchParams.get('oobCode'); // Obtener el `oobCode` de los parámetros de búsqueda

    if (oobCode) {
      const auth = getAuth(app);

      // Verificar el código de restablecimiento de contraseña
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {
          // Código válido, listo para restablecer la contraseña
        })
        .catch((error) => {
          // Manejar el error
          setError('El código de restablecimiento de contraseña no es válido o ha expirado.');
        });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const oobCode = searchParams.get('oobCode'); // Obtener el `oobCode` de los parámetros de búsqueda
    const auth = getAuth(app);

    try {
      await confirmPasswordReset(auth, oobCode as string, newPassword);
      setSuccess(true);
      // Redirigir a la página de éxito después de 2 segundos
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error) {
      setError('Error al restablecer la contraseña. Asegúrate de que el código sea correcto.');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-400">
          Restablecer Contraseña
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {success ? (
          <div className="text-center">
            <p className="text-green-500 text-sm">¡Tu contraseña ha sido restablecida con éxito!</p>
            <p className="text-gray-600 text-sm">Serás redirigido a la página de inicio de sesión en breve.</p>
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-400">
                  Nueva Contraseña
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-2 block w-full rounded-md border bg-gray-100 border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-cyan-600 text-gray-100 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Restablecer Contraseña
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const ResetSuccessPage = () => {
    return (
      <Suspense>
        <ResetSuccess />
      </Suspense>
    );
  };

export default ResetSuccessPage;
