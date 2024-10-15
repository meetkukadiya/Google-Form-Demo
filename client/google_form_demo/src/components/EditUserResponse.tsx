import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getCookie } from "typescript-cookie";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  editFormResponse,
  getFormDetailById,
  getRespondedAnswerbyEmailandFormId,
} from "../API";

interface ResponseToAdminProps {
  formId: string | null;
  handleEditFormClean: () => void;
}

const baseUrl = process.env.baseURL;

console.log("Base URL of API ", baseUrl);

interface Question {
  questionNumber: string;
  questionText: string;
  inputType: string;
  options: string[];
  isRequired: boolean;
  answer?: string | string[];
}

interface QuestionData {
  formname: string;
  formdescription: string;
  questions: Question[];
}

interface FormValues {
  questions: { answer?: string | string[] }[];
}

const EditUserResponse: React.FC<ResponseToAdminProps> = ({
  formId,
  handleEditFormClean,
}) => {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [answerData, setAnswerData] = useState<any>(null);
  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>(
    {}
  );
  const [finalSchema, setFinalSchema] =
    useState<Yup.ObjectSchema<FormValues> | null>(null);
  const [checkRespondedEmail, setCheckRespondedEmail] = useState<
    string | undefined
  >();

  //   console.log("Update Form Schema ", finalSchema);

  useEffect(() => {
    const userEmail = getCookie("userEmail");
    setCheckRespondedEmail(userEmail);
  }, []);

  useEffect(() => {
    if (checkRespondedEmail && formId) {
      const fetchAnswer = async () => {
        try {
          //todo: use base url from env and use interceptor
          //done: use base url from env and use interceptor

          const response = await getRespondedAnswerbyEmailandFormId({
            respondedBy: checkRespondedEmail,
            responseFormId: formId,
          });
          const fetchedData = response.data;

          const answers = fetchedData.answers[0];
          const initialValues: { [key: string]: any } = {};
          Object.keys(answers).forEach((questionNumber) => {
            initialValues[questionNumber] = answers[questionNumber];
          });

          setAnswerData(fetchedData);
          setInitialValues(initialValues);
        } catch (error) {
          console.error("Error fetching answers", error);
        }
      };

      fetchAnswer();
    }
  }, [checkRespondedEmail, formId]);

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (formId) {
        try {
          const response = await getFormDetailById(formId);
          setQuestionData(response.data);

          const fetchedData = response.data;

          let schema: any = {};

          const YupValidateSchema = fetchedData.questions.map(
            (question: any) => {
              if (question.inputType === "text") {
                schema[question.questionNumber] = question.isRequired
                  ? Yup.string()
                      .required("Please enter answer is required")
                      .min(4, "Please enter a valid short answer")
                  : Yup.string().min(4, "Please enter a valid short answer");

                initialValues[question.questionNumber] = "";
              } else if (question.inputType === "textarea") {
                schema[question.questionNumber] = question.isRequired
                  ? Yup.string()
                      .required("Select Atleast one Value :")
                      .min(10, "Please Enter Valid Long Answer")
                  : Yup.string().min(10, "Please Enter Valid Long Answer");

                initialValues[question.questionNumber] = "";
              } else if (question.inputType === "radio") {
                schema[question.questionNumber] = question.isRequired
                  ? Yup.string().required("Select Atleast one Value :")
                  : Yup.string();

                initialValues[question.questionNumber] = "";
              } else if (question.inputType === "checkbox") {
                schema[question.questionNumber] = question.isRequired
                  ? Yup.array()
                      .required("Select Atleast one Value :")
                      .min(1, "Please select at least one Value")
                  : Yup.array();

                initialValues[question.questionNumber] = [];
              } else if (question.inputType === "dropdown") {
                schema[question.questionNumber] = question.isRequired
                  ? Yup.string().required("Select Atleast one Value :")
                  : Yup.string();

                initialValues[question.questionNumber] = "";
              }
            }
          );
          const finalSchema: any = Yup.object().shape(schema);
          setFinalSchema(finalSchema);
          console.log("Schema validation", finalSchema);
        } catch (error) {
          console.error("Error fetching form data", error);
        }
      }
    };

    fetchQuestionData();
  }, [formId]);

  const handleEditForm = async (values: any, setSubmitting: any) => {
    try {
      const formResponse = {
        answers: { ...values },
      };

      const response = await editFormResponse({
        formId,
        userEmail: checkRespondedEmail,
        formResponse,
      });

      console.log(
        "Form Details for Edit Response Data ",
        formId,
        checkRespondedEmail
      );

      if (response.status === 200) {
        console.log("Form Responded successfully", formResponse);
        toast.success("Form Responde Updated successfully");
        handleEditFormClean();
      } else if (response.status === 404) {
        console.error("Have not fetch during update !", response.data.message);
        toast.error(
          response.data.message || "Have not fetch data during update !"
        );
      }
    } catch (error) {
      console.error("An error occurred while responding the  data.", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="all-form-details mt-5 w-full mb-6">
        <div className="add-formname">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={finalSchema}
            // onSubmit={(values, { resetForm }) => {
            //   console.log("Form values: ", values);
            // }}
            onSubmit={handleEditForm}
          >
            {({ values, errors, touched, isValid }) => {
              //   console.log("Form Values updated", values);
              //   console.log("Form Error: ", errors);
              return (
                <Form>
                  <div className="form-container">
                    <div className="form-contain mb-5">
                      <div className="flex justify-center bg-[#673ab7] w-full mb-4 p-3 text-amber-50 text-xl font-bold	">
                        Edit Form
                      </div>
                      <div className="flex justify-start">
                        <button
                          className="bg-red-500 mb-5  hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                          onClick={handleEditFormClean}
                        >
                          Back
                        </button>
                      </div>
                      <div className="flex justify-end"></div>
                      <div className="form-name">
                        <div className="formname-row font-bold text-xl">
                          {questionData?.formname}
                        </div>
                        <div className="formname-row text-l font-medium">
                          {questionData?.formdescription}
                        </div>
                      </div>
                      {questionData?.questions.map((question, index) => (
                        <div
                          key={index}
                          className="flex flex-col ps-4 mt-4 w-11/12 border-2 border-indigo-500 rounded-xl mb-3 shadow-md"
                        >
                          <div className="question-input w-8/12">
                            <h3 className="font-bold">
                              Question {index + 1}{" "}
                              {question.isRequired && (
                                <span className="text-red-600">*</span>
                              )}
                            </h3>
                            <p className="my-2 text-l font-medium">
                              {question.questionText}
                            </p>
                            <div className="flex flex-col align-center mb-2">
                              {question.inputType === "text" && (
                                <div>
                                  <Field
                                    name={question.questionNumber}
                                    type="text"
                                    placeholder="Enter short answer"
                                    className="p-2 border-b-2 border-indigo-500 w-full mb-3 outline-none"
                                    required={question.isRequired}
                                  />
                                  <ErrorMessage
                                    name={question.questionNumber}
                                    component="div"
                                    className="field-error text-red-600"
                                  />
                                </div>
                              )}
                              {question.inputType === "textarea" && (
                                <div>
                                  <Field
                                    name={question.questionNumber}
                                    as="textarea"
                                    placeholder="Enter long answer"
                                    className="py-5 px-2 border-b-2 border-indigo-500 w-full mb-3 outline-none"
                                    required={question.isRequired}
                                  />
                                  <ErrorMessage
                                    name={question.questionNumber}
                                    component="div"
                                    className="field-error text-red-600"
                                  />
                                </div>
                              )}
                              {question.inputType === "checkbox" && (
                                <div>
                                  {question.options.map(
                                    (option: string, optionIndex: number) => (
                                      <div key={optionIndex}>
                                        <label>
                                          <Field
                                            name={question.questionNumber}
                                            type="checkbox"
                                            value={option}
                                            label={option}
                                          />
                                          <span className="ml-2 select-none">
                                            {option}
                                          </span>
                                        </label>
                                      </div>
                                    )
                                  )}
                                  <ErrorMessage
                                    name={question.questionNumber}
                                    component="div"
                                    className="field-error text-red-600"
                                  />
                                </div>
                              )}
                              {question.inputType === "radio" &&
                                question.options.map((option, i) => (
                                  <div key={i}>
                                    <label>
                                      <Field
                                        type="radio"
                                        name={question.questionNumber}
                                        value={option}
                                      />
                                      <span className="ml-2 select-none">
                                        {option}
                                      </span>
                                    </label>
                                    <ErrorMessage
                                      name={question.questionNumber}
                                      component="div"
                                      className="field-error text-red-600"
                                    />
                                  </div>
                                ))}
                              {question.inputType === "dropdown" && (
                                <div>
                                  <Field
                                    as="select"
                                    name={question.questionNumber}
                                    required={question.isRequired}
                                  >
                                    <option
                                      value=""
                                      disabled={question.isRequired}
                                    >
                                      Select an option
                                    </option>
                                    {question.options.map((option, index) => (
                                      <option key={index} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </Field>
                                  <ErrorMessage
                                    name={question.questionNumber}
                                    component="div"
                                    className="field-error text-red-600"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="submit"
                        className={`${
                          isValid && Object.keys(touched).length > 0
                            ? "bg-blue-500 mb-5 w-1/2 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            : "bg-blue-200 mb-5 w-1/2 hover:bg-blue-100 cursor-not-allowed	 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                        }`}
                        disabled={!isValid && Object.keys(touched).length > 0}
                      >
                        Update Response
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditUserResponse;
