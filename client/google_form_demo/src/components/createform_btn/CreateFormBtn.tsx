import React from "react";
import "./CreateFormBtn.css";

function CreateFormBtn({
  handleCreateFormbtn,
}: {
  handleCreateFormbtn: () => void;
}) {
  return (
    <div>
      <button onClick={handleCreateFormbtn} className="createbtn">
        Create Form
      </button>
    </div>
  );
}

export default CreateFormBtn;
