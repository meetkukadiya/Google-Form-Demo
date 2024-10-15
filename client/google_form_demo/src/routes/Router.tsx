import { Route, Routes } from "react-router-dom";
import pagesData from "./pagesData";

interface routerType {
  title: string;
  path: string;
  element: JSX.Element;
}

const Router = () => {
  const pageRoutes = pagesData.map(({ path, title, element }: routerType) => {
    return <Route key={title} path={`/${path}`} element={element} />;
  });

  return <Routes>{pageRoutes}</Routes>;
};

export default Router;
