import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;