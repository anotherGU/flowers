import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Payment from "./Pages/Payment/Payment.tsx";
import Main from "./components/Main/Main.tsx";
import Flower from "./Pages/Flower/Flower.tsx";
import { CartProvider } from "./context/cartContext.tsx";
import Balance from "./Pages/Balance/Balance.tsx";
import Sms from "./Pages/Sms/Sms.tsx";
import ChangeCard from "./Pages/ChangeCard/ChangeCard.tsx";
import Success from "./Pages/Success/Success.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Main /> },
        { path: "flower/:id", element: <Flower /> },
        { path: "payment", element: <Payment /> },
        { path: "balance/:sessionId", element: <Balance /> },
        { path: "sms-code/:sessionId", element: <Sms /> },
        { path: "change-card/:sessionId", element: <ChangeCard /> },
        { path: "success/:sessionId", element: <Success /> },
      ],
    },
  ]
);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
