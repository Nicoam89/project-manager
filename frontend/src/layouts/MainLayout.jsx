import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-blue-700 focus:shadow"
      >
        Saltar al contenido principal
      </a>

      <div className="flex min-h-screen min-w-0">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col pt-24 sm:pt-28 lg:pt-0">
          <Header />

          <main
            id="main-content"
            className="flex-1 overflow-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8"
          >
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
