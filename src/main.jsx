import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Movie } from "./pages/Movie.jsx";
import { TVShow } from "./pages/TVShow.jsx";
import { Genre } from "./pages/Genre.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Detail } from "./pages/Detail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/movie",
    element: <Movie />,
  },
  {
    path: "/tv",
    element: <TVShow />,
  },
  {
    path: "/genre",
    element: <Genre />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/:category/:id",
    element: <Detail />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
