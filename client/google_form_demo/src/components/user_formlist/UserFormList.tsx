import React, { useEffect, useState } from "react";
import "./UserFormList.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getCookie } from "typescript-cookie";
import { ChildProcess } from "child_process";
import { ClassificationType } from "typescript";
import {
  getAllForms,
  getFormIdByEmail,
  getRespondedFormIdByLoginUser,
} from "../../API";

interface FormDetail {
  _id: string;
  userEmail: string;
  formname: string;
}

interface FormResponseProps {
  handlerResponseToAdmin: (formId: string) => void;
  handleEdit: (formId: string) => void;
}

interface FormEditProps {}

const userEmail = getCookie("userEmail");

const UserFormList: React.FC<FormResponseProps> = ({
  handlerResponseToAdmin,
  handleEdit,
}) => {
  const [formDetail, setformDetail] = useState<FormDetail[]>([]);
  const [userAccess, setuserAccess] = useState<string[]>([]);
  const [editFormIds, setEditFormIds] = useState<{ responseFormId: string }[]>(
    []
  );

  console.log("Form Already Responsed ==> ", editFormIds);

  console.log("Form Details ", formDetail);

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

  useEffect(() => {
    const fetchUserFormId = async () => {
      if (!userEmail) return;
      try {
        const response = await getFormIdByEmail(userEmail);

        setuserAccess(response.data.formIds);
      } catch (error) {
        console.error("Error fetching User Form ID", error);
      }
    };

    fetchUserFormId();

    const fetchAlreadyRespondedForm = async () => {
      const userEmails = userEmail;
      try {
        const response = await getRespondedFormIdByLoginUser(userEmails);

        const fetchedData = response.data;

        setEditFormIds(fetchedData.respondedFormId);
      } catch (error) {}
    };

    fetchAlreadyRespondedForm();
  }, [userEmail]);

  // const handleEdit = (formId: string) => {
  //   console.log("Click on Form ID for Edit ", formId);
  // };

  const respondedFormIds = editFormIds.map((formids) => formids.responseFormId);

  console.log("User have that Form ID Access : ", userAccess);

  // const handlerResponseToAdmin = async (formId: string) => {
  //   console.log("Click on Response", formId);
  // };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <span className="font-semibold">Form Name</span>
            </TableCell>
            <TableCell align="left">
              <span className="font-semibold">Owner Email</span>
            </TableCell>
            <TableCell align="center">
              <span className="font-semibold">Response to Form</span>
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
                <span className="font-semibold">{form.formname}</span>
              </TableCell>
              <TableCell align="left" className="text-xs italic	">
                {form.userEmail}
              </TableCell>

              <TableCell align="center">
                {userAccess.includes(form._id) ? (
                  respondedFormIds.includes(form._id) ? (
                    <button
                      className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2"
                      onClick={() => handleEdit(form._id)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2"
                      onClick={() => handlerResponseToAdmin(form._id)}
                    >
                      Response
                    </button>
                  )
                ) : (
                  <button className="text-white bg-red-800 hover:bg-red-900 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2">
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

export default UserFormList;
