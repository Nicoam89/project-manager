import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col pt-28 lg:pt-0">
          <Header />

          <main className="flex-1 overflow-auto px-6 py-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;