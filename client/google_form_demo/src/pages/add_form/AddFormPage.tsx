import React, { useState } from "react";
import "./AddFormPage.css";
import CreateFormBtn from "../../components/createform_btn/CreateFormBtn";
import FormList from "../../components/formlist/FormList";
import CreateForm from "../../components/createform/CreateForm";
import Navbar from "../../components/navbar/Navbar";
import EditForm from "../../components/editform/EditForm";
import AddUserAccess from "../../components/user_access/AddUserAccess";
import ShowResponses from "../../components/ShowResponses";

function AddFormPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showaccessPage, setshowaccessPage] = useState(false);
  const [showresponsePage, setshowresponsePage] = useState(false);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [currentFormName, setCurrentFormName] = useState<string | null>(null);

  const handleCreateFormClick = () => {
    setShowCreateForm(true);
    setShowEditForm(false);
    setshowaccessPage(false);
    setshowresponsePage(false);
  };

  const handleEditFormClick = (formID: string) => {
    console.log("Clicked form ID : ", formID);
    setCurrentFormId(formID);
    setShowEditForm(true);
    setShowCreateForm(false);
    setshowaccessPage(false);
    setshowresponsePage(false);
  };

  const handleAccessFormClick = (formID: string, formname: string) => {
    console.log("Add Access to Form ", formID);
    setCurrentFormId(formID);
    setCurrentFormName(formname);
    setshowaccessPage(true);
    setShowEditForm(false);
    setShowCreateForm(false);
    setshowresponsePage(false);
  };

  const handleResponsesClick = (formID: string, formname: string) => {
    // console.log(console.log("Check Response from User Side  ", formID));
    setCurrentFormId(formID);
    setCurrentFormName(formname);
    setshowresponsePage(true);
    setshowaccessPage(false);
    setShowEditForm(false);
    setShowCreateForm(false);
  };

  const handleClearSidebar = () => {
    setshowresponsePage(false);
    setshowaccessPage(false);
    setShowEditForm(false);
    setShowCreateForm(false);
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="formpage bg-purple-50">
        <div className="sidebar border-r-4 border-gray-800  ">
          <div className="create-btn">
            <CreateFormBtn handleCreateFormbtn={handleCreateFormClick} />
          </div>
          <div className="formlist">
            <FormList
              handleEditForm={handleEditFormClick}
              handleAccessForm={handleAccessFormClick}
              handleResponses={handleResponsesClick}
            />
          </div>
        </div>
        {showCreateForm && (
          <div className="add-form">
            {showCreateForm && (
              <CreateForm handleClearSidebar={handleClearSidebar} />
            )}
          </div>
        )}
        {showEditForm && (
          <div className="add-form">
            {showEditForm && (
              <EditForm
                formId={currentFormId}
                handleClearSidebar={handleClearSidebar}
              />
            )}
          </div>
        )}
        {showaccessPage && (
          <div className="add-form">
            {showaccessPage && (
              <AddUserAccess
                formId={currentFormId}
                formname={currentFormName}
                handleClearSidebar={handleClearSidebar}
              />
            )}
          </div>
        )}
        {showresponsePage && (
          <div className="add-form">
            {showresponsePage && (
              <ShowResponses
                formId={currentFormId}
                formname={currentFormName}
                handleClearSidebar={handleClearSidebar}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default AddFormPage;
