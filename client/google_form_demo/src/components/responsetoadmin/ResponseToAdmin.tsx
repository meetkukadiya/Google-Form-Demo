import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
// import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getCookie } from "typescript-cookie";
import toast from "react-hot-toast";
import { getAllImages, getFormDetailById, responseToFormData } from "../../API";

interface ResponseToAdminProps {
  formId: string | null;
  handleEditFormClean: () => void;
}

interface Question {
  questionNumber: number | null;
  questionText: string;
  inputType: string;
  options: string[];
  isRequired: boolean;
  answer?: string | string[];
  file_urls?: string | string[];
}

interface FormData {
  formname: string;
  formdescription: string;
  questions: Question[];
}
interface FormValues {
  questions: { answer?: string | string[] }[];
}

interface ImageResponses {
  [key: number]: string | string[];
}

const ResponseToAdmin: React.FC<ResponseToAdminProps> = ({
  formId,
  handleEditFormClean,
}) => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [finalSchema, setFinalSchema] =
    useState<Yup.ObjectSchema<FormValues> | null>(null);
  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>(
    {}
  );
  const [imageResponses, setImageResponses] = useState<any[]>([]);

  console.log("Image response ==> ", imageResponses);

  const respondedBy = getCookie("userEmail");

  console.log("Login User email that Response to form", respondedBy);

  const handleSubmit = async (values: any, setSubmitting: any) => {
    try {
      const formResponse = {
        respondedBy: respondedBy,
        answers: { ...values },
        responseFormId: formId,
      };

      const response = await responseToFormData(formResponse);

      if (response.status === 201) {
        console.log("Form Responded successfully", formResponse);
        toast.success("Form Responded successfully");
      } else {
        console.error("An error occurred:", response.data.message);
        toast.error(
          response.data.message ||
            "An error occurred while responding the form."
        );
      }
    } catch (error) {
      console.error("An error occurred while responding the  data.", error);
    } finally {
      setSubmitting(false);
    }

    // console.log("Form submission", formResponse);
  };

  console.log("Final Initial Values", initialValues);

  console.log("Validation Schema", finalSchema);

  // const FormSchema = Yup.object().shape({
  //   questions: Yup.array()
  //     .of(
  //       Yup.object().shape({
  //         answer: Yup.string().required("Answer is required"),
  //       })
  //     )
  //     .required("Please Enter an answer"),
  // });

  useEffect(() => {
    const fetchFormData = async () => {
      if (formId) {
        try {
          const response = await getFormDetailById(formId);

          const fetchedData = response.data;
          setFormData(fetchedData);

          let schema: any = {};
          const initialValues: any = {};

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
          setInitialValues(initialValues);
          console.log("Schema validation", finalSchema);

          const QuestionTypes = fetchedData.questions.map(
            (question: any) => question.inputType === "text"
          );

          // const allFileNames = fetchedData.questions.flatMap((question: any) =>
          //   Array.isArray(question.file_urls)
          //     ? question.file_urls
          //     : question.file_urls
          //     ? [question.file_urls]
          //     : []
          // );

          // console.log("File URLs For Response to Admin ==> ", allFileNames);
          fetchedData.questions.map((question: any, index: number) => {
            const fileName = question.file_urls;

            console.log("All Urls for question ==>  ", fileName);
          });

          const fileName = "file_1728032722732.png";

          const imagesResponse = await getAllImages(fileName);
          setImageResponses(imagesResponse.data);

          console.log("Fetched form data: ", response.data);

          console.log("Question numbers : ==> ", QuestionTypes);
        } catch (error) {
          console.error("Error fetching form data", error);
        }
      }
    };

    fetchFormData();
  }, [formId]);

  // const initialValues = {
  //   questions:
  //     formData?.questions.map((question: Question) => ({
  //       answer: question.inputType === "checkbox" ? [] : "",
  //     })) || [],
  // };
  // console.log("Initial values: ", initialValues);

  if (!formData) {
    return <div>Loading...</div>;
  }

  console.log("Form Data For Response :", formData);

  return (
    <>
      <div className="all-form-details">
        <div className="add-formname">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={finalSchema}
            onSubmit={handleSubmit}
            // onSubmit={handleEditSubmit}
            // onSubmit={(values, { resetForm }) => {
            //   console.log("Form values: ", values);
            // }}
          >
            {({ values, errors, touched, isValid }) => {
              // console.log("Form Entered Value  ===> ", values);
              // console.log("Form Error  ===> ", errors);
              // console.log("Is Touched ==> ", touched);

              return (
                <Form>
                  <div className="form-container">
                    <div className="form-contain">
                      <div className="flex justify-center bg-[#673ab7] w-full mb-4 p-3 text-amber-50 text-xl font-bold	">
                        Response to Form
                      </div>
                      <button
                        className="bg-red-500 mb-5  hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                        onClick={handleEditFormClean}
                      >
                        Back
                      </button>
                      <div className="form-name">
                        <div className="formname-row font-bold text-xl">
                          {formData.formname}
                        </div>
                        <div className="formname-row text-l font-medium	">
                          {formData.formdescription}
                        </div>
                      </div>

                      {formData.questions.map(
                        (question: any, index: number) => (
                          <div
                            key={index}
                            className="flex flex-col ps-4 mt-4 w-11/12 border-solid border-2 border-l-8 border-indigo-500 rounded-xl mb-3 gap-2 shadow-md"
                          >
                            <div className="flex flex-row w-full">
                              <div className="question-input w-8/12">
                                <h3 className="font-bold">
                                  Question {index + 1}{" "}
                                  {question.isRequired === true && (
                                    <span className="text-red-600">*</span>
                                  )}
                                </h3>

                                {/* {question} */}
                                <div className="my-2">
                                  <p className="text-l font-medium">
                                    {question.questionText}
                                  </p>

                                  {question.file_urls && (
                                    <div className="mt-2 mb-2">
                                      {/* <h3>{question.file_urls}</h3> */}
                                      <img
                                        src={`${process.env.REACT_APP_BASE_URL}/getFile/${question.file_urls}`}
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col align-center mb-2">
                                  {question.inputType === "text" && (
                                    <div>
                                      <Field
                                        name={question.questionNumber}
                                        type="text"
                                        placeholder="Enter short answer"
                                        className="p-2 border-b-2 border-indigo-500 w-full mb-3 outline-none"
                                        required={question.isRequired === true}
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
                                        type="textarea"
                                        placeholder="Enter long answer"
                                        className="py-5 px-2 border-b-2 border-indigo-500 w-full mb-3 outline-none"
                                        required={question.isRequired === true}
                                      />
                                      <ErrorMessage
                                        name={question.questionNumber}
                                        component="div"
                                        className="field-error text-red-600"
                                      />
                                    </div>
                                  )}
                                  {/* {question.inputType === "checkbox" && (
                                    <div>
                                    question.options.map(
                                      (option: string, optionindex: string) => (
                                        <div key={optionindex}>
                                          <Field
                                            name={question.questionNumber}
                                            type="checkbox"
                                            value={option}
                                            label={option}
                                            required={
                                              question.isRequired === true
                                            }
                                          />
                                          <span className="ml-2">{option}</span>
                                          </div> ))}
                                          <ErrorMessage
                                            name={question.questionNumber}
                                            component="div"
                                            className="field-error text-red-600"
                                          />
                                        </div>
                                        )}
                                       */}

                                  {question.inputType === "checkbox" && (
                                    <div>
                                      {question.options.map(
                                        (
                                          option: string,
                                          optionIndex: number
                                        ) => (
                                          <div key={optionIndex}>
                                            <label>
                                              <Field
                                                name={question.questionNumber}
                                                type="checkbox"
                                                value={option}
                                                label={option}
                                                // required={
                                                //   question.isRequired === true
                                                // }
                                              />
                                              <span className="ml-2 select-none	">
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
                                    question.options.map(
                                      (option: string, i: string) => (
                                        <div key={i}>
                                          <label>
                                            <Field
                                              name={question.questionNumber}
                                              type="radio"
                                              value={option}
                                              label={option}
                                              required={
                                                question.isRequired === true
                                              }
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
                                      )
                                    )}
                                  {question.inputType === "dropdown" && (
                                    <div className="mb-2">
                                      <Field
                                        name={question.questionNumber}
                                        as="select"
                                        required={question.isRequired}
                                        defaultValue=""
                                      >
                                        <option value="" disabled>
                                          Select an option
                                        </option>
                                        {question.options.map(
                                          (option: string, index: number) => (
                                            <option key={index} value={option}>
                                              {option}
                                            </option>
                                          )
                                        )}
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
                          </div>
                        )
                      )}

                      <button
                        type="submit"
                        className={`${
                          isValid && Object.keys(touched).length > 0
                            ? "bg-blue-500 mb-5 w-1/2 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            : "bg-blue-200 mb-5 w-1/2 hover:bg-blue-100 cursor-not-allowed	 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                        }`}
                        disabled={!isValid && Object.keys(touched).length > 0}
                      >
                        Submit Form
                      </button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ResponseToAdmin;
