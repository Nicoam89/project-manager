import useAuthStore from "../../store/authStore";

const Header = () => {
  const user =
    useAuthStore(
      (state) => state.user
    );

  return (
    <header className="border-b p-4 flex justify-between">
      <h2 className="font-bold">
        Dashboard
      </h2>

      <span>
        {user?.name || "Usuario"}
      </span>
    </header>
  );
};

export default Header;