import React, { useEffect, useState } from "react";
import "./FormList.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import toast from "react-hot-toast";
import { getCookie } from "typescript-cookie";
import { deleteFormById, getAllForms } from "../../API";

interface FormDetail {
  _id: string;
  userEmail: string;
  formname: string;
}

interface FormListProps {
  handleEditForm: (formID: string) => void;
  handleAccessForm: (formID: string, formname: string) => void;
  handleResponses: (formID: string, formname: string) => void;
}

const FormList: React.FC<FormListProps> = ({
  handleEditForm,
  handleAccessForm,
  handleResponses,
}) => {
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await getAllForms();

        setformDetail(response.data.forms);
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    };
    fetchForms();
  }, []);

  const handleDeleteForm = async (formID: string) => {
    console.log("Form ID", formID);

    try {
      const response = await deleteFormById(formID);

      if (response.status === 200) {
        setformDetail(formDetail.filter((form) => form._id !== formID));
        console.log("Successfully deleted Form");
        toast.success("Successfully deleted Form");
      }
    } catch (error) {
      console.error("Error deleting form", error);
    }
  };

  const [formDetail, setformDetail] = useState<FormDetail[]>([]);

  const isSelfUser = getCookie("userEmail");

  return (
    <TableContainer
      component={Paper}
      className="border-solid border-3 rounded-md border-neutral-200 	"
    >
      <Table sx={{ minWidth: 250 }} aria-label="simple table ">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <span className="font-semibold">Form Name</span>
            </TableCell>
            <TableCell align="left">
              <span className="font-semibold">Owner Email</span>
            </TableCell>
            <TableCell align="center">
              <span className="font-semibold">Edit</span>
            </TableCell>
            <TableCell align="center">
              <span className="font-semibold">Delete</span>
            </TableCell>
            <TableCell align="center">
              <span className="font-semibold">Add Access</span>
            </TableCell>
            <TableCell align="center">
              <span className="font-semibold">Show Responses</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formDetail.map((form) => (
            <TableRow
              key={form._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" className="text-xs font-semibold">
                <span className="font-semibold text-s">{form.formname}</span>
              </TableCell>
              <TableCell align="left" className="text-xs italic">
                {form.userEmail}
              </TableCell>
              <TableCell align="center">
                {isSelfUser === form.userEmail && (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handleEditForm(form._id)}
                  >
                    Edit
                  </button>
                )}
                {isSelfUser !== form.userEmail && (
                  <button className="text-white bg-red-800 hover:bg-red-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700">
                    No Access
                  </button>
                )}
              </TableCell>
              <TableCell align="center">
                {isSelfUser === form.userEmail && (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handleDeleteForm(form._id)}
                  >
                    Delete
                  </button>
                )}
                {isSelfUser !== form.userEmail && (
                  <button className="text-white bg-red-800 hover:bg-red-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700">
                    No Access
                  </button>
                )}
              </TableCell>
              <TableCell align="center">
                {isSelfUser === form.userEmail && (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handleAccessForm(form._id, form.formname)}
                  >
                    Add Access
                  </button>
                )}
                {isSelfUser !== form.userEmail && (
                  <button className="text-white bg-red-800 hover:bg-red-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700">
                    No Access
                  </button>
                )}
              </TableCell>
              <TableCell align="center">
                {isSelfUser === form.userEmail && (
                  <button
                    className="text-white bg-gray-800 hover:bg-gray-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    onClick={() => handleResponses(form._id, form.formname)}
                  >
                    Show Responses
                  </button>
                )}
                {isSelfUser !== form.userEmail && (
                  <button className="text-white bg-red-800 hover:bg-red-900  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 dark:bg-red-800 dark:hover:bg-red-700 dark:focus:ring-red-700 dark:border-red-700">
                    No Access
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FormList;
