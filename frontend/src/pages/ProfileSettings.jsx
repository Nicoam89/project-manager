import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaBirthdayCake,
  FaBriefcase,
  FaEnvelope,
  FaIdBadge,
  FaUserCog,
  FaVenusMars,
} from "react-icons/fa";

import { updateProfile } from "../api/auth";
import FormField from "../components/forms/FormField";
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
      age: user?.age || "",
      sex: user?.sex || "",
      profession: user?.profession || "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      age: user?.age || "",
      sex: user?.sex || "",
      profession: user?.profession || "",
    });
  }, [reset, user]);

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
       const { user: updatedUser } = await updateProfile(data);

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

     </div>

      <div className="grid gap-6 lg:grid-cols-3">
         <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:col-span-1">
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

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <FaBirthdayCake />
                Edad
              </dt>
              <dd className="mt-2 font-semibold text-slate-900">
                {user?.age ? `${user.age} años` : "Sin edad"}
              </dd>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <FaVenusMars />
                Sexo
              </dt>
              <dd className="mt-2 font-semibold capitalize text-slate-900">
                {user?.sex ? user.sex.replaceAll("-", " ") : "Sin sexo"}
              </dd>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
              <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <FaBriefcase />
                Profesión
              </dt>
              <dd className="mt-2 font-semibold text-slate-900">
                {user?.profession || "Sin profesión"}
              </dd>
            </div>
          </dl>
        </section>


        <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Datos personales
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Estos datos ayudan a segmentar usuarios y comprender mejor el público objetivo dentro de A.M.O. iQ.
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

                        <FormField
              id="profile-name"
              label="Nombre completo"
              required
              error={errors.name?.message}
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  type="text"
                  className="pm-input"
                  placeholder="Tu nombre"
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 2,
                      message:
                        "El nombre debe tener al menos 2 caracteres",
                    },
                  })}
                />
              )}
            </FormField>

            <FormField
              id="profile-email"
              label="Email"
              required
              error={errors.email?.message}
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  type="email"
                  className="pm-input"
                  placeholder="tu@email.com"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Email inválido",
                    },
                  })}
                />
              )}
            </FormField>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                id="profile-age"
                label="Edad"
                error={errors.age?.message}
              >
                {(fieldProps) => (
                  <input
                    {...fieldProps}
                    type="number"
                    min="13"
                    max="120"
                    className="pm-input"
                    placeholder="Ej. 32"
                    {...register("age", {
                      min: {
                        value: 13,
                        message: "La edad mínima es 13 años",
                      },
                      max: {
                        value: 120,
                        message: "La edad máxima es 120 años",
                      },
                    })}
                  />
                )}
              </FormField>

              <FormField
                id="profile-sex"
                label="Sexo"
              >
                {(fieldProps) => (
                  <select
                    {...fieldProps}
                    className="pm-input"
                    {...register("sex")}
                  >
                    <option value="">Seleccionar</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="no-binario">No binario</option>
                    <option value="prefiero-no-decir">Prefiero no decir</option>
                    <option value="otro">Otro</option>
                  </select>
                )}
              </FormField>
            </div>

            <FormField
              id="profile-profession"
              label="Profesión"
              error={errors.profession?.message}
            >
              {(fieldProps) => (
                <input
                  {...fieldProps}
                  type="text"
                  className="pm-input"
                  placeholder="Ej. Diseñadora UX"
                  {...register("profession", {
                    maxLength: {
                      value: 80,
                      message:
                        "La profesión no puede superar 80 caracteres",
                    },
                  })}
                />
              )}
            </FormField>

            <div className="flex justify-stretch border-t border-slate-100 pt-5 sm:justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="pm-button pm-button-primary w-full sm:w-auto"
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


