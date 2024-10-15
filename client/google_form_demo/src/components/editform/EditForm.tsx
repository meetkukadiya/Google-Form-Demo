import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ReactComponent as CancelBtn } from "../../assets/icons/cancelbtn.svg";
import { getFormDetailById, updateForm } from "../../API";
import { ReactComponent as DeleteBtn } from "../../assets/icons/deletebtn.svg";

interface EditFormProps {
  formId: string | null;
  handleClearSidebar: () => void;
}

interface InitialValues {
  formname: string;
  formdescription: string;
  questions: {
    questionNumber: number;
    questionText: string;
    inputType: string;
    options: string[];
    isRequired: boolean;
  }[];
}

const EditForm: React.FC<EditFormProps> = ({ formId, handleClearSidebar }) => {
  const [formData, setFormData] = useState<any>(null);

  const FormSchema = Yup.object().shape({
    formname: Yup.string()
      .required("Please enter form name")
      .min(3, "Name is too short")
      .max(25, "Please enter short form name"),
    formdescription: Yup.string(),
    questions: Yup.array()
      .of(
        Yup.object().shape({
          questionText: Yup.string().required("Please enter the question"),
          inputType: Yup.string().required("Please select input type"),

          options: Yup.array().when("inputType", {
            is: (type: string) => {
              console.log(type);
              return (
                type === "checkbox" || type === "radio" || type === "dropdown"
              );
            },
            then: (schema) =>
              schema.of(Yup.string().required("Please enter a option")),
            otherwise: (schema) => schema.of(Yup.string()),
          }),

          isRequired: Yup.boolean(),
        })
      )
      .required("Please add at least one question"),
  });

  console.log("Edit Form Props ", formId);

  console.log("Form Data in Edit Form", formData);

  useEffect(() => {
    const fetchFormData = async () => {
      if (formId) {
        try {
          const response = await getFormDetailById(formId);

          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching form data", error);
        }
      }
    };

    fetchFormData();
  }, [formId]);

  const initialValues: InitialValues = {
    formname: formData?.formname || "",
    formdescription: formData?.formdescription || "",
    questions: formData?.questions || [],
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  const handleEditSubmit = async (
    values: InitialValues,
    setSubmitting: any
  ) => {
    try {
      console.log("Form Values", values, setSubmitting);

      const formData = {
        formId,
        ...values,
      };

      const response = await updateForm(formId, formData);

      if (response.status === 400) {
        console.log("Please fill all required fields");
        toast.error("Please fill all required fields");
      }
      if (response.status === 200) {
        console.log("Form Updated successfully :", formData);
        toast.success("Form Submitted successfully");
      } else {
        console.error("An error occurred while submitting the form.");
        toast.error("An error occurred while submitting the form.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the  data.", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div>{/* <h2>Edit Form: {formData.formname}</h2> */}</div>
      <div className="all-form-details">
        <div className="add-formname">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={FormSchema}
            // onClick={handleSubmit}
            onSubmit={handleEditSubmit}
            // onSubmit={(values, { resetForm }) => {
            //   console.log("Form values: ", values);
            // }}
          >
            {({ values, errors, touched, isValid }) => {
              //   console.log("Valid or Not ===> ", values);
              return (
                <Form>
                  <div className="form-container">
                    <div className="form-contain">
                      <div className="flex justify-center bg-[#673ab7] w-full mb-4 p-3 text-amber-50 text-xl font-bold	">
                        Edit Form
                      </div>
                      <button
                        className="bg-red-500 mb-5  hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
                        onClick={handleClearSidebar}
                      >
                        Close
                      </button>
                      <div className="form-name">
                        <Field
                          type="text"
                          name="formname"
                          placeholder="Please Enter Form Name"
                          className={`formname-row 
                  ${
                    errors.formname && touched.formname ? "input-error" : null
                  }`}
                        />
                        <ErrorMessage
                          name="formname"
                          component="span"
                          className="error"
                        />

                        <Field
                          type="text"
                          name="formdescription"
                          placeholder="Form description"
                          className={`formname-row 
                  ${
                    errors.formdescription && touched.formdescription
                      ? "input-error"
                      : null
                  }`}
                        />
                        <ErrorMessage
                          name="formdescription"
                          component="span"
                          className="error"
                        />
                      </div>

                      <div className="add-form-question">
                        <FieldArray name="questions">
                          {({ insert, remove, push }) => (
                            <div>
                              {values.questions.map((question, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col ps-4 border-solid border-2 border-l-8 border-indigo-500 rounded-xl mb-3 gap-2 shadow-md	"
                                >
                                  {/* Question Number */}
                                  <h3>Question {index + 1}</h3>
                                  <div className="flex flex-row w-full">
                                    <div className="question-input w-7/12">
                                      {/* Enter Question */}
                                      <Field
                                        name={`questions.${index}.questionText`}
                                        placeholder={`Enter Question ${
                                          index + 1
                                        } `}
                                        type="text"
                                        className={`h-9 p-2 outline-none border-b w-full 
                                ${
                                  `errors.questions.${index}.questionText` &&
                                  `touched.questions.${index}.questionText`
                                    ? "input-error"
                                    : null
                                }`}
                                      />
                                      <ErrorMessage
                                        name={`questions.${index}.questionText`}
                                        component="div"
                                        className="field-error text-red-600"
                                      />
                                    </div>

                                    <div className="input-type ml-10">
                                      <Field
                                        as="select"
                                        name={`questions.${index}.inputType`}
                                        className={`w-35 h-9
                                ${
                                  `errors.questions.${index}.inputType` &&
                                  `touched.questions.${index}.inputType`
                                    ? "input-error"
                                    : null
                                }`}
                                      >
                                        <option value="" disabled>
                                          Select Que. Type
                                        </option>
                                        <option value="text">
                                          Short Answer
                                        </option>
                                        <option value="textarea">
                                          Paragraph Answer
                                        </option>
                                        <option value="checkbox">
                                          Checkbox
                                        </option>
                                        <option value="radio">Radio</option>
                                        <option value="dropdown">
                                          Dropdown
                                        </option>
                                      </Field>
                                      <ErrorMessage
                                        name={`questions.${index}.inputType`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </div>
                                  </div>

                                  {(values.questions[index].inputType ===
                                    "text" ||
                                    values.questions[index].inputType ===
                                      "textarea") && (
                                    <div>
                                      <input
                                        type={
                                          values.questions[index].inputType ===
                                          "text"
                                            ? "text"
                                            : values.questions[index]
                                                .inputType === "textarea"
                                            ? "textarea"
                                            : ""
                                        }
                                        placeholder={
                                          values.questions[index].inputType ===
                                          "text"
                                            ? "Short Answer"
                                            : values.questions[index]
                                                .inputType === "textarea"
                                            ? "Paragraph Answer"
                                            : values.questions[index].inputType
                                        }
                                        className={
                                          values.questions[index].inputType ===
                                          "text"
                                            ? "p-3 border-b-2 border-indigo-500 w-7/12 mb-3"
                                            : values.questions[index]
                                                .inputType === "textarea"
                                            ? "p-6 border-b-2 border-indigo-500 w-7/12 mb-3"
                                            : ""
                                        }
                                        disabled
                                      />
                                    </div>
                                  )}

                                  {!(
                                    values.questions[index].inputType ===
                                      "textarea" ||
                                    values.questions[index].inputType === "text"
                                  ) && (
                                    <FieldArray
                                      name={`questions.${index}.options`}
                                    >
                                      {({
                                        remove: removeOption,
                                        push: pushOption,
                                      }) => (
                                        <div>
                                          {values.questions[index].options.map(
                                            (option, optionIndex) => (
                                              <div key={optionIndex}>
                                                {!(
                                                  values.questions[index]
                                                    .inputType === "dropdown"
                                                ) && (
                                                  <input
                                                    type={
                                                      values.questions[index]
                                                        .inputType
                                                    }
                                                    className="mr-3 border-b-2"
                                                    disabled={
                                                      values.questions[index]
                                                        .inputType ===
                                                        "radio" ||
                                                      values.questions[index]
                                                        .inputType ===
                                                        "checkbox"
                                                    }
                                                  />
                                                )}

                                                <Field
                                                  name={`questions.${index}.options.${optionIndex}`}
                                                  placeholder={`Enter Option ${
                                                    optionIndex + 1
                                                  }`}
                                                  type="text"
                                                  className={`outline-none border-b pb-1 focus:border-b-2 focus:border-indigo-500 w-5/12 ${
                                                    `errors.questions.${index}.options.${optionIndex}` &&
                                                    `touched.questions.${index}.options.${optionIndex}`
                                                      ? "input-error"
                                                      : null
                                                  }`}
                                                />
                                                {!(optionIndex === 0) && (
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      removeOption(optionIndex)
                                                    }
                                                  >
                                                    <CancelBtn />
                                                  </button>
                                                )}
                                                <ErrorMessage
                                                  name={`questions.${index}.options.${optionIndex}`}
                                                  component="div"
                                                  className="field-error text-red-600"
                                                />
                                              </div>
                                            )
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => pushOption("")}
                                            className="mt-3 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                          >
                                            Add Option
                                          </button>
                                        </div>
                                      )}
                                    </FieldArray>
                                  )}

                                  <div className="flex flex-row gap-5">
                                    <div className="required-checkbox">
                                      <Field
                                        type="checkbox"
                                        name={`questions.${index}.isRequired`}
                                      />
                                      <label>Required</label>
                                    </div>
                                    <div>
                                      {!(index === 0) && (
                                        <button
                                          type="button"
                                          onClick={() => remove(index)}
                                        >
                                          <DeleteBtn />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() =>
                                  push({
                                    questionNumber: values.questions.length + 1,
                                    questionText: "",
                                    inputType: "text",
                                    options: [""],
                                    isRequired: false,
                                  })
                                }
                                className="flex  mt-5 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                              >
                                Add Question
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      </div>
                      <button
                        type="submit"
                        className={`${
                          isValid && Object.keys(touched).length > 0
                            ? "bg-blue-500 mb-5 w-1/2 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            : "bg-blue-200 mb-5 w-1/2 hover:bg-blue-100 cursor-not-allowed	 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                        }`}
                        disabled={!isValid && Object.keys(touched).length > 0}
                      >
                        Update Form
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

export default EditForm;
