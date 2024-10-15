import { Navigate } from "react-router-dom";
import AddFormPage from "./pages/add_form/AddFormPage";
import UserPage from "./pages/user_page/UserPage";

const PrivateRoute = ({ isAdmin, isUser }: any) => {
  if (isAdmin) {
    return <AddFormPage />;
  } else if (isUser) {
    return <UserPage />;
  } else {
    return <Navigate to="/" replace />;
  }

  // todo : change contidition
  // Done : change contidition
};

export default PrivateRoute;
