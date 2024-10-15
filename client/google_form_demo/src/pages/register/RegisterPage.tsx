import React, { useState } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
// import styled from "styled-components";
import * as Yup from "yup";
import { GlobalStyle } from "../../Styles/globalStyles";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Navbar from "../../components/navbar/Navbar";
import { userRegister } from "../../../src/API";

interface InitialValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

const baseUrl = process.env.BASE_URL;

console.log("Base URL of API ", baseUrl);

function RegisterPage() {
  const initialValues: InitialValues = {
    name: "",
    email: "",
    password: "",
    role: "",
  };

  const SignInSchema = Yup.object().shape({
    name: Yup.string().min(2).max(25).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),

    password: Yup.string()
      .required("Please enter your password")
      .min(6, "Password is too short - should be 6 chars minimum"),
    role: Yup.string().required("Please select a role"),
  });

  console.log("Values : ==> ");

  const navigate = useNavigate();

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: any
  ) => {
    try {
      // Log the form values
      console.log("Form Values: ", values);

      const response = await userRegister(values);

      if (response.status === 201) {
        console.log("Register successfully :", values);
        navigate("/login");
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
        validationSchema={SignInSchema}
        // onSubmit={(values: initialValues) => {
        //   console.log(values);
        // }}
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
                    <h1 className="heading">Register</h1>
                  </div>
                  <div className="all-input">
                    <div className="form-row">
                      <label htmlFor="name">Name</label>
                      <Field
                        type="name"
                        name="name"
                        id="name"
                        placeholder="Please enter a name"
                        className={`form-input ${
                          errors.name && touched.name ? "input-error" : null
                        }`}
                      />
                      <ErrorMessage
                        name="name"
                        component="span"
                        className="error"
                      />
                    </div>

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

                    <div className="form-row">
                      <label htmlFor="role">Role</label>
                      <Field as="select" className="form-input" name="role">
                        <option value="" disabled>
                          Select a Role
                        </option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                      </Field>
                      <ErrorMessage
                        name="role"
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
                        Register
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

export default RegisterPage;
