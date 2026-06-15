import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaIdBadge, FaUserCog } from "react-icons/fa";

import { updateProfile } from "../api/auth";
import MainLayout from "../layouts/MainLayout";
import useAuthStore from "../store/authStore";

const ProfileSettings = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [reset, user]);

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const updatedUser = await updateProfile(data);

      setUser(updatedUser);
      setSuccessMessage("Perfil actualizado correctamente.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "No se pudo actualizar el perfil. Intenta de nuevo."
      );
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Configuración
        </p>

        <h1 className="pm-page-title">
          Perfil de usuario
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Administra la información básica asociada a tu cuenta y mantén tus datos de contacto actualizados.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
            <FaUserCog />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Resumen del perfil
          </h2>

          <dl className="mt-5 space-y-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <FaIdBadge />
                Nombre
              </dt>
              <dd className="mt-2 font-semibold text-slate-900">
                {user?.name || "Sin nombre"}
              </dd>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <FaEnvelope />
                Email
              </dt>
              <dd className="mt-2 break-all font-semibold text-slate-900">
                {user?.email || "Sin email"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Datos personales
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Estos datos se usarán para identificar tu sesión dentro de A.M.O. iQ.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
            {successMessage ? (
              <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-name">
                Nombre completo
              </label>
              <input
                id="profile-name"
                type="text"
                className="pm-input mt-2"
                placeholder="Tu nombre"
                {...register("name", {
                  required: "El nombre es obligatorio",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres",
                  },
                })}
              />
              {errors.name ? (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                className="pm-input mt-2"
                placeholder="tu@email.com"
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email inválido",
                  },
                })}
              />
              {errors.email ? (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="pm-button pm-button-primary"
              >
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </MainLayout>
  );
};

export default ProfileSettings;
