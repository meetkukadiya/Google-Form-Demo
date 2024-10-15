import React, { useState } from "react";
import "./CreateForm.css";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { getCookie } from "typescript-cookie";
import toast from "react-hot-toast";
import AddUserAccess from "../user_access/AddUserAccess";
import { storeForm, uploadFile } from "../../API";
import { ReactComponent as DeleteBtn } from "../../assets/icons/deletebtn.svg";
import { ReactComponent as CancelBtn } from "../../assets/icons/cancelbtn.svg";
// import { FileUploader } from "react-drag-drop-files";

interface InitialValues {
  formname: string;
  formdescription: string;
  userEmail: string | undefined;
  questions: {
    questionNumber: number;
    questionText: string;
    file: File | null;
    file_urls: string | null;
    inputType: string;
    options: string[];
    isRequired: boolean;
  }[];
}

interface AdminResponseProps {
  handleClearSidebar: () => void;
}

const CreateForm: React.FC<AdminResponseProps> = ({ handleClearSidebar }) => {
  const [accesslist, setAccesslist] = useState(false);
  const [currentFormId, setcurrentFormId] = useState<string>("");
  const [currentFormName, setcurrentFormName] = useState<string>("");

  const initialValues: InitialValues = {
    formname: "",
    formdescription: "",
    userEmail: "",
    questions: [
      {
        questionNumber: 1,
        questionText: "",
        file: null,
        file_urls: null,
        inputType: "text",
        options: [""],
        isRequired: false,
      },
    ],
  };

  const [dragActive, setDragActive] = React.useState(false);
  // const fileTypes = ["JPG", "PNG", "GIF", "PDF"];

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

          options: Yup.array().when(" ", {
            is: (type: string) => {
              console.log("Question Data ==> ", type);
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

  const handleSubmit = async (values: InitialValues, setSubmitting: any) => {
    // try {
    //   const userEmail = getCookie("userEmail");

    //   const formData = {
    //     ...values,
    //     userEmail,
    //   };
    //   console.log("Submitted Form Values ===>?>", formData);

    try {
      const userEmail = getCookie("userEmail") ?? "";
      const formData = new FormData();

      formData.append("formname", values.formname);
      formData.append("formdescription", values.formdescription);
      formData.append("userEmail", userEmail);

      // Comment for upload the file ###############################

      // Upload the File
      // const fileUploadData = new FormData();
      // const fileIndices: (number | null)[] = [];

      // values.questions.forEach((question, index) => {
      //   // console.log("File Data =======>", question.file);
      //   // if (question.file) {
      //   //   fileUploadData.append(`file`, question.file);
      //   // }
      //   // if (question.file) {
      //   //   fileUploadData.append(`file`, question.file);
      //   //   fileUploadIndexMap.push(index);
      //   //   fileUploadIndexMap.push(null);
      //   // }

      //   if (question.file) {
      //     fileUploadData.append("file", question.file);

      //     fileIndices.push(question.questionNumber - 1);
      //   } else {
      //     fileIndices.push(null);
      //   }
      //   console.log("File Indexes for upload ==>", fileIndices);
      // });

      // // console.log("File Response after upload ==> ", fileUploadData);

      // const fileResponse = await uploadFile(fileUploadData);

      // console.log("Upload Response :==> ", fileResponse);

      // if (!fileResponse || fileResponse.success !== 1) {
      //   throw new Error("File upload failed");
      // }
      // const fileUrls = fileResponse.file_urls || [];

      // values.questions.forEach((question, index) => {
      //   const uploadIndex = fileIndices[index];

      //   console.log("Question before URL assignment:", question);

      //   question.file_urls =
      //     uploadIndex !== null ? fileUrls[uploadIndex] || null : null;

      //   console.log("Updated question with file URL:", question);
      // });

      // Comment For Upload the file  ############################

      const fileUploadData = new FormData();
      const fileIndices: number[] = [];

      // For File index
      values.questions.forEach((question, index) => {
        if (question.file) {
          fileUploadData.append("file", question.file);
          fileIndices.push(question.questionNumber - 1);
        }
        // else {
        //   // fileIndices.push(null);
        // }

        // const uploadIndex = fileIndices[index];
        // console.log("file index for for file upload ", fileIndices);
      });

      const fileResponse = await uploadFile(fileUploadData);

      if (!fileResponse || fileResponse.success !== 1) {
        throw new Error("File upload failed");
      }

      // const fileUrls = fileResponse.file_urls || [];
      const fileUrls: string[] = fileResponse.file_urls || [];

      console.log("File URL for upload: ", fileUrls);

      // console.log("Response of File Url: ==> ", fileUrls);

      // Append questions and their files
      values.questions.forEach((question, index) => {
        formData.append(
          `questions[${index}].questionNumber`,
          question.questionNumber.toString()
        );
        formData.append(
          `questions[${index}].questionText`,
          question.questionText
        );
        formData.append(`questions[${index}].inputType`, question.inputType);
        formData.append(
          `questions[${index}].isRequired`,
          question.isRequired.toString()
        );

        question.file_urls = null;

        // const uploadIndex = fileIndices[index];
        const uploadIndex = fileIndices.indexOf(question.questionNumber - 1);

        if (uploadIndex !== -1) {
          question.file_urls = fileUrls[uploadIndex];

          // console.log(
          //   `File link of question ${question.questionNumber} ==> `,
          //   question.file_urls
          // );

          formData.append(
            `questions[${question.questionNumber}].file_urls`,
            question.file_urls
          );

          // console.log("Appended file URL for question:", fileUrls[1]);
        }

        // }

        question.options.forEach((option, optionIndex) => {
          formData.append(
            `questions[${index}].options[${optionIndex}]`,
            option
          );
        });
      });

      const formSubmit = {
        ...values,
        userEmail: userEmail,
      };

      // console.log("Form Submit Email ", userEmail);

      // console.log("Form Data After for Submit ==> ", formSubmit);

      const formresponse = await storeForm(formSubmit);
      // const response = await uploadFile(file);
      console.log("Response after the Store Form ==> ", formresponse);

      if (formresponse.status === 400) {
        console.log("Please fill all required fields");
        toast.error("Please fill all required fields");
      }
      if (formresponse.status === 201) {
        console.log(
          "Form Submitted successfully :",
          formData,
          formresponse.data.formID
        );
        const currentFormId = formresponse.data.formID;
        setcurrentFormId(currentFormId);
        const currentFormName = values.formname;
        setcurrentFormName(currentFormName);
        console.log(
          "Current Form Name and Form ID :",
          currentFormName,
          currentFormId
        );

        toast.success("Form Submitted successfully");
        // navigate("/addform");

        setAccesslist(true);
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

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <>
      <div className="all-form-details">
        {!accesslist && (
          <div className="add-formname">
            <Formik
              initialValues={initialValues}
              validationSchema={FormSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isValid, setFieldValue }) => {
                console.log("Valid or Not ===> ", touched);
                console.log("Form Values ===> ", values);
                // console.log("Form Field Touched  ===> ", touched);
                return (
                  <Form>
                    <div className="form-container">
                      <div className="form-contain">
                        <div className="flex justify-center bg-[#673ab7] w-full mb-4 p-3 text-amber-50 text-xl font-bold	">
                          Create Form{" "}
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
                          errors.formname && touched.formname
                            ? "input-error"
                            : null
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

                                    <div className="flex flex-col w-6/12">
                                      {/* <FileUploader
                                        id={`questions.${index}.file`}
                                        name={`questions.${index}.file`}
                                        handleChange={(
                                          event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          const files =
                                            event.currentTarget?.files;
                                          if (files && files.length > 0) {
                                            const file = files[0];
                                            setFieldValue(
                                              `questions.${index}.file`,
                                              file
                                            );

                                            console.log(
                                              "Check the Files ==> ",
                                              files
                                            );

                                            console.log(
                                              "Uploaded File Name :==> ",
                                              file
                                            );
                                          }
                                        }}
                                        types={fileTypes}
                                        className="w-10 h-15"
                                      /> */}

                                      <input
                                        id={`questions.${index}.file`}
                                        name={`questions.${index}.file`}
                                        title="Question Reference"
                                        type="file"
                                        onDragEnter={handleDrag}
                                        onChange={(
                                          event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          const files =
                                            event.currentTarget.files;
                                          if (files && files.length > 0) {
                                            const file = files[0];
                                            setFieldValue(
                                              `questions.${index}.file`,
                                              file
                                            );

                                            console.log(
                                              "Uploaded File Name :==> ",
                                              file
                                            );
                                          }
                                        }}
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                                      />
                                    </div>

                                    {(values.questions[index].inputType ===
                                      "text" ||
                                      values.questions[index].inputType ===
                                        "textarea") && (
                                      <div>
                                        <input
                                          type={
                                            values.questions[index]
                                              .inputType === "text"
                                              ? "text"
                                              : values.questions[index]
                                                  .inputType === "textarea"
                                              ? "textarea"
                                              : ""
                                          }
                                          placeholder={
                                            values.questions[index]
                                              .inputType === "text"
                                              ? "Short Answer"
                                              : values.questions[index]
                                                  .inputType === "textarea"
                                              ? "Paragraph Answer"
                                              : values.questions[index]
                                                  .inputType
                                          }
                                          className={
                                            values.questions[index]
                                              .inputType === "text"
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
                                      values.questions[index].inputType ===
                                        "text"
                                    ) && (
                                      <FieldArray
                                        name={`questions.${index}.options`}
                                      >
                                        {({
                                          remove: removeOption,
                                          push: pushOption,
                                        }) => (
                                          <div>
                                            {values.questions[
                                              index
                                            ].options.map(
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
                                                        removeOption(
                                                          optionIndex
                                                        )
                                                      }
                                                    >
                                                      <CancelBtn className="h-5 w-5" />
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
                                            <DeleteBtn className="h-6 w-6" />
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
                                      questionNumber:
                                        values.questions.length + 1,
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
                          Submit Form
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}

        {accesslist && (
          <div className="flex flex-col">
            <div className="flex justify-center font-bold text-3xl	text-green-600">
              Your Form is Submitted Successfully !
            </div>
            <div className="flex justify-center mt-7">
              <AddUserAccess
                formId={currentFormId}
                formname={currentFormName}
                handleClearSidebar={handleClearSidebar}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateForm;
