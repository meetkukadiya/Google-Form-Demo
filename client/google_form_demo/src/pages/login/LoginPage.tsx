import React from "react";
import * as Yup from "yup";
import "./LoginPage.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "typescript-cookie";
import Navbar from "../../components/navbar/Navbar";
import { userLogin } from "../../API";

const baseUrl = process.env.BASE_URL;
console.log("Base URL of API ", baseUrl);

interface InitialValues {
  email: string;
  password: string;
}

function LoginPage() {
  const initialValues: InitialValues = {
    email: "",
    password: "",
  };

  const LogInSchema = Yup.object().shape({
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string()
      .required("Please enter your password")
      .min(6, "Password is too short - should be 6 chars minimum"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: any
  ) => {
    try {
      // Log the form values
      console.log("Form Values: ", values);

      const response = await userLogin(values);

      if (response.status === 200) {
        console.log("Login successfully :", values);
        const userToken = response.data.token;
        const userName = response.data.name;
        const userEmail = response.data.email;
        const userRole = response.data.role[0];

        const isAdmin = (await response.data.role[0]) === "ROLE_ADMIN";
        const isUser = (await response.data.role[0]) === "ROLE_USER";

        console.log("Admin Login is ==> :", isAdmin);
        console.log("User Login is ==> :", isUser);

        // Set the Token in Cookie
        setCookie("authToken", userToken, { expires: 3 });
        setCookie("userName", userName, { expires: 3 });
        setCookie("userEmail", userEmail, { expires: 3 });
        setCookie("userRole", userRole, { expires: 3 });
        console.log("User token :", userToken);
        console.log("All Response :", response.data);

        const NavigateByRole = isUser
          ? "/userpage"
          : isAdmin
          ? "/addform"
          : "/";

        console.log("Navigate By Role ==>", NavigateByRole);
        if (isUser) {
          window.location.assign("/userpage");
          // navigate("/userpage");
          console.log("Redirect to User Page ");
        }
        if (isAdmin) {
          window.location.assign("/addform");

          // navigate("/addform");
          console.log("Redirect to Admin Page ");
        }

        await navigate(NavigateByRole);
      } else {
        console.error("An error occurred while submitting the form.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the form.", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Formik
        initialValues={initialValues}
        validationSchema={LogInSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const { errors, touched, isValid, dirty } = formik;
          return (
            <>
              <Form className="register-container">
                <div
                  className={
                    !(dirty && isValid) ? "container-alert" : "container"
                  }
                >
                  <div>
                    <h1 className="heading">Login</h1>
                  </div>
                  <div className="all-input">
                    <div className="form-row">
                      <label htmlFor="email">Email</label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Please enter your email"
                        className={`form-input 
                ${errors.email && touched.email ? "input-error" : null}`}
                      />
                      <ErrorMessage
                        name="email"
                        component="span"
                        className="error"
                      />
                    </div>

                    <div className="form-row">
                      <label htmlFor="password">Password</label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Please enter your password"
                        className={`form-input ${
                          errors.password && touched.password
                            ? "input-error"
                            : null
                        }`}
                      />
                      <ErrorMessage
                        name="password"
                        component="span"
                        className="error"
                      />
                    </div>

                    <div className="re-btn">
                      <button
                        type="submit"
                        className={
                          !(dirty && isValid) ? "disablebtn" : "enablebtn"
                        }
                        disabled={!(dirty && isValid)}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default LoginPage;
