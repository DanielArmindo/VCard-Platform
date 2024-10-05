import { Navigate, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error.message, error.status, error.statusText);
  //Send toast to give error if necessary
  return <Navigate to="/" />;
};

export default Error;
