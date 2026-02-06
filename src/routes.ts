import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/Home/Home";
import { SearchPage } from "./pages/Search/Search";
import { NotFoundPage } from "./pages/NotFound/NotFound";
import { BookDetailPage } from "./pages/BookDetail/BookDetail";
import Layout from "./layout/Layout";
import { AdvancedSearchPage } from "./pages/AdvancedSearch";


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
          path: "/advanced-search",
          Component: AdvancedSearchPage,
        },
        {
          path: "/books/:bookId",
          Component: BookDetailPage,
        },
        {
          path: "*",
          Component: NotFoundPage,
        },
    ],
  },
]);

export default routes;