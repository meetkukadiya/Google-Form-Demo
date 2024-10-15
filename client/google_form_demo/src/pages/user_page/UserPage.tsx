import React, { useState } from "react";
import "./UserPage.css";
import Navbar from "../../components/navbar/Navbar";
import UserFormList from "../../components/user_formlist/UserFormList";
import ResponseToAdmin from "../../components/responsetoadmin/ResponseToAdmin";
import EditUserResponse from "../../components/EditUserResponse";

function UserPage() {
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  console.log("Current Form ID in User Page ", currentFormId);
  const [showresponseForm, setshowresponseForm] = useState(false);

  const [showeditForm, setshoweditForm] = useState(Boolean(false));

  const handleResponseToAdminClick = (formId: string) => {
    console.log("Form Id IN User Page ", formId);
    setCurrentFormId(formId);
    setshowresponseForm(true);
    setshoweditForm(false);
  };

  const handleEditFormIdClick = (formId: string) => {
    console.log("Edit Form Id for Edit the Form", formId);
    setCurrentFormId(formId);
    setshoweditForm(true);
    setshowresponseForm(false);
  };

  const handleEditFormClean = () => {
    setshoweditForm(false);
    setshowresponseForm(false);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="formpage bg-purple-50">
        <div className="sidebar1 border-r-4 border-gray-800 ">
          <div className="formlist ">
            <UserFormList
              handlerResponseToAdmin={handleResponseToAdminClick}
              handleEdit={handleEditFormIdClick}
            />
          </div>
        </div>
        {showresponseForm && (
          <div className="add-form">
            {showresponseForm && (
              <ResponseToAdmin
                formId={currentFormId}
                handleEditFormClean={handleEditFormClean}
              />
            )}
          </div>
        )}
        {showeditForm && (
          <div className="add-form">
            {showeditForm && (
              <EditUserResponse
                formId={currentFormId}
                handleEditFormClean={handleEditFormClean}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default UserPage;
