import React, { FC } from "react";
import { ReactComponent as DeleteBtn } from "../assets/icons/deletebtn.svg";

interface AnswerTypeProps {
  inputType: string;
  addOption: string[];
  onOptionChange: (index: number, value: string) => void;
  onDeleteOption: (index: number) => void;
}

const AnswerType: FC<AnswerTypeProps> = ({
  inputType,
  addOption,
  onOptionChange,
  onDeleteOption,
}) => {
  return (
    <div className="answer-type">
      {addOption.map((option, index) => (
        <div key={index} className="option-row">
          {inputType === "dropdown" && <h3>{index + 1}.</h3>}

          {(inputType === "radio" || inputType === "checkbox") && (
            <div>
              <input
                type={inputType}
                className="add-option-checkbox border-b-2 border-color:#808080"
                disabled
              />
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                className="add-option-checkbox"
                onChange={(e) => onOptionChange(index, e.target.value)}
                value={option}
              />
            </div>
          )}

          {inputType !== "radio" && inputType !== "checkbox" && (
            <input
              type="text"
              placeholder={
                inputType === "dropdown"
                  ? `Option ${index + 1}`
                  : inputType === "input"
                  ? "Short Question"
                  : inputType === "textarea"
                  ? "Paragraph Answer"
                  : "Question Type"
              }
              className={
                inputType === "dropdown"
                  ? "add-option-checkbox"
                  : inputType === "input"
                  ? "w-9/12	border-b-2 border-color:#808080 pb-2 "
                  : inputType === "textarea"
                  ? "w-9/12  border-b-2 border-color:#808080 pb-6"
                  : "add-option-checkbox"
              }
              onChange={(e) => onOptionChange(index, e.target.value)}
              value={option}
              disabled={!(inputType === "dropdown")}
            />
          )}

          {index !== 0 && (
            <button
              onClick={() => onDeleteOption(index)}
              className="delete-option-btn"
            >
              {/* // todo : move to assets */}
              {/* // done : move to assets */}

              <DeleteBtn />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnswerType;
