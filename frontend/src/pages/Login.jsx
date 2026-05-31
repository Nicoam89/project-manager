import { useForm } from "react-hook-form";
import api from "../api/axios";

import useAuthStore from "../store/authStore";

const Login = () => {
  const { register, handleSubmit } =
    useForm();

  const loginStore =
    useAuthStore(
      (state) => state.login
    );

  const onSubmit = async (data) => {
    try {
      const response =
        await api.post(
          "/auth/login",
          data
        );

      loginStore(
        {
          id: response.data._id,
          name: response.data.name,
          email:
            response.data.email,
        },
        response.data.token
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
    >
      <input
        placeholder="Email"
        {...register("email")}
      />

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;