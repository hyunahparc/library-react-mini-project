import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/Home/Home";
import { SearchPage } from "./pages/Search/Search";
import { NotFoundPage } from "./pages/NotFound/NotFound";
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
          path: "/search",
          Component: SearchPage,
        },
                {
          path: "*",
          Component: NotFoundPage,
        },
    ],
  },
]);

export default routes;