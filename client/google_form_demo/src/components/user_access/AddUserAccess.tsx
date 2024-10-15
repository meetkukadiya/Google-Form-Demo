import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { boolean } from "yup";
import toast from "react-hot-toast";
import {
  getAccessListInForEditList,
  getAllUserEmailForAccess,
  storeAccessList,
} from "../../API";

interface EditFormProps {
  formId: string | null;
  formname: string | null;
  handleClearSidebar: () => void;
}

interface UserEmailList {
  _id: string;
  email: string;
}

interface CheckboxProps {
  checked: boolean | null;
}

const AddUserAccess: React.FC<EditFormProps> = ({
  formId,
  formname,
  handleClearSidebar,
}) => {
  const [userEmailList, setuserEmailList] = useState<UserEmailList[]>([]);
  const [alreadyRespondedUser, setAlreadyRespondedUser] = useState<string[]>(
    []
  );
  const [checkedEmails, setCheckedEmails] = useState<string[]>([]);
  const [removedEmails, setRemovedEmails] = useState<string[]>([]);

  console.log("Unchecked Emails ==> ", removedEmails);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUserEmailForAccess();
        setuserEmailList(response.data.userList);
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    };

    const fetchrespondedUserlist = async () => {
      try {
        const response = await getAccessListInForEditList(formId);

        console.log("Form Id in User ++++> ", formId);

        const emails = response.data;

        setAlreadyRespondedUser(emails);
        setCheckedEmails(emails);

        console.log("Already Responded User", response.data);
      } catch (error) {
        console.error("Error fetching forms", error);
      }
    };

    fetchUsers();
    fetchrespondedUserlist();
  }, [formId]);

  console.log("Already Responded User Email :", alreadyRespondedUser);

  const handleCheckboxChange = (email: string) => {
    setCheckedEmails((selectedEmail) => {
      if (selectedEmail.includes(email)) {
        setRemovedEmails((uncheck) => {
          if (!uncheck.includes(email)) {
            return [...uncheck, email];
          }
          return uncheck;
        });

        return selectedEmail.filter((item) => item !== email);
      } else {
        setRemovedEmails((uncheck) => {
          return uncheck.filter((item) => item !== email);
        });

        return [...selectedEmail, email];
      }
    });
  };

  console.log("Checked Emails:", checkedEmails, " in " + formId);

  const handleSubmit = async () => {
    const accesslist = {
      formId: formId,
      userEmails: checkedEmails,
      removedEmails: removedEmails,
    };
    console.log("Access List:", accesslist);

    try {
      const response = await storeAccessList(accesslist);

      if (response.status === 201) {
        console.log("Successfully added Access List");
        toast.success("Successfully added Access List");
      } else if (response.status === 200) {
        console.log("Successfully updated accesslist");
        toast.success("Successfully updated accesslist");
      } else if (response.status === 500) {
        console.log("Error while adding Access List");
        toast.error("Error while adding Access List");
      } else {
        console.log("Error");
      }
      window.location.assign("/");
    } catch (error) {
      console.log(error);
    }
  };

  //   setCheckedEmails((prev) => {
  //     if (prev.includes(email)) {
  //       return prev.filter((item) => item !== email);
  //     } else {
  //       return [...prev, email];
  //     }
  //   });

  //   console.log("Checked Emails:", checkedEmails);

  //   console.log("Checked or Not", checked);

  //   console.log("All Users Email", userEmailList);

  console.log("Form ID in Access Page : " + formId);
  return (
    <>
      <div className="flex flex-col w-6/12">
        <div className="flex justify-left">
          <button
            className="bg-red-500 mb-5  hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded"
            onClick={handleClearSidebar}
          >
            Close
          </button>
        </div>
        <h1 className="flex text-4xl mb-5 justify-center">{formname}</h1>
        <TableContainer
          component={Paper}
          className="border-solid border-4 border-violet-300		"
        >
          <Table sx={{ minWidth: 250 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Access</TableCell>
                <TableCell align="left">Access Email</TableCell>
              </TableRow>
              <TableRow></TableRow>
            </TableHead>
            <TableBody>
              {userEmailList.map((emaillist) => (
                <TableRow
                  key={emaillist._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" className="text-xs font-semibold">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      //   value={emaillist.email}
                      name={emaillist.email}
                      //   label={emaillist.email}
                      checked={checkedEmails.includes(emaillist.email)}
                      onChange={() => handleCheckboxChange(emaillist.email)}
                    />
                  </TableCell>
                  <TableCell align="left" className="text-xs font-semibold">
                    {emaillist.email}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex text-xs mb-5 justify-center mt-5">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={handleSubmit}
          >
            Add Access
          </button>
        </div>
      </div>
    </>
    // <div>
    //   Add Access to User
    //   {userEmailList.map((emaillist) => (
    //     <div key={emaillist._id}>{emaillist.email}</div>
    //   ))}
    // </div>
  );
};

export default AddUserAccess;
