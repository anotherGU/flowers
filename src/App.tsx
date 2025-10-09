import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
