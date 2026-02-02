import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/Home/Home";
import { NotFoundPage } from "./pages/NotFound";
import Layout from "./layout/Layout";


const routes = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
        {
          path: "/",
          Component: HomePage,
        },
        {
          path: "*",
          Component: NotFoundPage,
        }
    ],
  },
]);

export default routes;