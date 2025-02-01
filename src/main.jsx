import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Movie } from "./pages/Movie.jsx";
import { TVShow } from "./pages/TVShow.jsx";
import { Genre } from "./pages/Genre.jsx";
import { Person } from "./pages/Person.jsx";
import { Detail } from "./pages/Detail.jsx";
import { Search } from "./pages/Search.jsx";

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
    path: "/person/:id",
    element: <Person />,
  },
  {
    path: "/:category/:id",
    element: <Detail />,
  },
  {
    path: "/search",
    element: <Search />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
