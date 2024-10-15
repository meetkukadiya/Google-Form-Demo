import express from "express";

import {
  login,
  register,
  storeForm,
  getAllForms,
  deleteFormById,
  getFormDetailById,
  updateForm,
  getAllUserEmailForAccess,
  storeAccessList,
  getFormIdByEmail,
  responseToFormData,
  getAllResponsesByFormId,
  getRespondedAnswerbyEmailandFormId,
  getAccessListInForEditList,
  getRespondedFormIdByLoginUser,
  editFormResponse,
  uploadFiles,
  getAllImages,
} from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../controller/userController.js";

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
// route.post("/storeForm", authMiddleware, upload.array("files"), storeForm);
route.post("/storeForm", authMiddleware, storeForm);
route.post("/uploadfile", authMiddleware, upload.array("file"), uploadFiles);
// route.post("/uploadfile", authMiddleware, upload.single("file"), uploadFiles);
// route.get("/getFile/:fileName", authMiddleware, getAllImages); // Working For Single URL in parameter
route.get("/getFile/:fileName", getAllImages);
route.get("/formdetail", authMiddleware, getAllForms);
route.delete("/deleteform/:formID", authMiddleware, deleteFormById);
route.get("/getform/:editformId", authMiddleware, getFormDetailById);
route.put("/updateform/:updateformId", authMiddleware, updateForm);
route.get("/getalluseremail", authMiddleware, getAllUserEmailForAccess);
route.post("/addaccess", authMiddleware, storeAccessList);
route.post("/foraccessto", authMiddleware, getFormIdByEmail);
route.post("/formresponsestore", authMiddleware, responseToFormData);
route.get(
  "/getresponseformdatabyformid/:formId",
  authMiddleware,
  getAllResponsesByFormId
);
route.get(
  "/getresponsedata/:respondedBy/:responseFormId",
  authMiddleware,
  getRespondedAnswerbyEmailandFormId
);
route.post("/getaccesseduser", authMiddleware, getAccessListInForEditList);
route.post(
  "/getformidbyloginuser",
  authMiddleware,
  getRespondedFormIdByLoginUser
);
route.post(
  "/editresponseform/:formId/:userEmail",
  authMiddleware,
  editFormResponse
);

export default route;
