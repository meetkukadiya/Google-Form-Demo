import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import {
  getAllResponsesByFormId,
  getFormDetailById,
  getRespondedAnswerbyEmailandFormId,
} from "../API";

interface EditFormProps {
  formId: string | null;
  formname: string | null;
  handleClearSidebar: () => void;
}

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

const ShowResponses: React.FC<EditFormProps> = ({
  formId,
  formname,
  handleClearSidebar,
}) => {
  const [questionData, setquestionData] = useState<QuestionData | null>(null);
  const [showFormResponse, setshowFormResponse] = useState(false);
  const [formRespondedEmail, setformRespondedEmail] = React.useState<any[]>([]);
  const [answerData, setanswerData] = React.useState<any[]>([]);
  const [initialValues, setInitialValues] = useState<{ [key: string]: any }>(
    {}
  );
  const [checkRespondedEmail, setcheckRespondedEmail] =
    React.useState<string>("");

  console.log("Check selected Email", checkRespondedEmail);
  console.log("Set Question Data : ", questionData);
  console.log("Set Answer Data : ", answerData);

  // Can show the All Responded emailId

  useEffect(() => {
    const fetchForms = async () => {
      try {
        //todo: use base url from env and use interceptor
        //done: use base url from env and use interceptor

        const response = await getAllResponsesByFormId(formId);
        const fetchedData = await response.data;

        setformRespondedEmail(fetchedData);
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    };
    fetchForms();

    // Get Answers

    const fetchAnswer = async () => {
      try {
        const response = await getRespondedAnswerbyEmailandFormId({
          respondedBy: checkRespondedEmail,
          responseFormId: formId,
        });

        const fetchedData = await response.data;

        const answers = fetchedData.answers[0];

        const initialValues: { [key: string]: any } = {};
        Object.keys(answers).forEach((questionNumber) => {
          initialValues[questionNumber] = answers[questionNumber];
        });

        setanswerData(fetchedData);
        setInitialValues(initialValues);

        console.log("Fetch Answers :===>>", fetchedData);
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    };
    fetchAnswer();

    const fetchQuestionData = async () => {
      if (formId) {
        try {
          const response = await getFormDetailById(formId);

          const fetchedData = response.data;
          setquestionData(fetchedData);

          console.log("Fetched Questions: ===> ", response.data);
        } catch (error) {
          console.error("Error fetching form data", error);
        }
      }
    };
    fetchQuestionData();

    console.log("Current Form ID ", formId);
  }, [formId, checkRespondedEmail]);

  const handleCheckResponses = (respondedBy: string) => {
    console.log("Selected Email for Check response", respondedBy);
    setcheckRespondedEmail(respondedBy);
    setshowFormResponse(true);
  };

  const handleCloseCheckResponse = () => {
    setshowFormResponse(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <div>
          <button
            className="bg-red-500 mb-5  hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
            onClick={handleClearSidebar}
          >
            Close
          </button>
        </div>
      </div>
      <div>
        Response of : <span className="font-bold">{formname}</span>{" "}
      </div>
      <div className="w-7/12">
        <TableContainer component={Paper} className="mt-3">
          <Table sx={{ minWidth: 300 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Responded By</TableCell>
                <TableCell align="center">Check Form Responses</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formRespondedEmail.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" className="text-xs font-semibold">
                    {user.respondedBy}
                  </TableCell>

                  <TableCell align="center">
                    <button
                      className="text-white bg-blue-800 hover:bg-blue-900 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-700 dark:border-blue-700"
                      onClick={() => handleCheckResponses(user.respondedBy)}
                    >
                      Check Response
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {showFormResponse && (
        <div className="all-form-details mt-5 w-full mb-6">
          <div className="add-formname">
            <Formik
              initialValues={initialValues}
              enableReinitialize
              onSubmit={(values, { resetForm }) => {
                console.log("Form values: ", values);
              }}
            >
              {({ values, errors, touched, isValid }) => {
                // console.log("Form Entered Value  ===> ", values);
                console.log("Form Error  ===> ", errors);
                return (
                  <Form>
                    <div className="form-container">
                      <div className="form-contain mb-5">
                        <div className="flex justify-center bg-[#673ab7] w-full mb-4 p-3 text-amber-50 text-xl font-bold	">
                          Response of {checkRespondedEmail}
                        </div>
                        <div className="flex justify-end">
                          <button
                            className="text-white bg-red-800 hover:bg-red-900 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700"
                            onClick={handleCloseCheckResponse}
                          >
                            Close
                          </button>
                        </div>
                        <div className="form-name">
                          <div className="formname-row font-bold text-xl">
                            {questionData?.formname}
                          </div>
                          <div className="formname-row text-l font-medium	">
                            {questionData?.formdescription}
                          </div>
                        </div>

                        {questionData?.questions.map(
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

                                  <div className="my-2">
                                    <p className="text-l font-medium">
                                      {question.questionText}
                                    </p>
                                  </div>
                                  <div className="flex flex-col align-center mb-2">
                                    {question.inputType === "text" && (
                                      <div>
                                        <Field
                                          name={question.questionNumber}
                                          type="text"
                                          placeholder="Enter short answer"
                                          className="p-2 border-b-2 border-indigo-500 w-full mb-3 outline-none"
                                          required={
                                            question.isRequired === true
                                          }
                                          disabled
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
                                          required={
                                            question.isRequired === true
                                          }
                                          disabled
                                        />
                                      </div>
                                    )}

                                    {question.inputType === "checkbox" && (
                                      <div>
                                        {question.options.map(
                                          (
                                            option: string,
                                            optionIndex: number
                                          ) => (
                                            <div key={optionIndex}>
                                              <Field
                                                name={question.questionNumber}
                                                type="checkbox"
                                                value={option}
                                                label={option}
                                                disabled
                                              />
                                              <span className="ml-2">
                                                {option}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}

                                    {question.inputType === "radio" &&
                                      question.options.map(
                                        (option: string, i: string) => (
                                          <div key={i}>
                                            <Field
                                              name={question.questionNumber}
                                              type="radio"
                                              value={option}
                                              label={option}
                                              required={
                                                question.isRequired === true
                                              }
                                              disabled
                                            />
                                            <span className="ml-2">
                                              {option}
                                            </span>
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
                                          disabled
                                        >
                                          <option value="" disabled>
                                            Select an option
                                          </option>
                                          {question.options.map(
                                            (option: string, index: number) => (
                                              <option
                                                key={index}
                                                value={option}
                                              >
                                                {option}
                                              </option>
                                            )
                                          )}
                                        </Field>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowResponses;
