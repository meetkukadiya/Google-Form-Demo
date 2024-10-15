import User from "../model/userModel.js";
import Form from "../model/formModel.js";
import AccessList from "../model/accesslistModel.js";
import FormResponseData from "../model/formResponseModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const register = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already exisits. Please Login");
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role || "user",
      });
      await user.save();
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
};

export const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    console.log("Password is valid", passwordIsValid);

    const token = jwt.sign(
      { email: user.email, role: user.role, name: user.name },
      process.env.SECRET_KEY,
      {
        expiresIn: 43200, // 12 hours
      }
    );
    console.log("Token generated", token);
    let authorities = [];
    const role = await user.role;
    console.log("Role ", role);
    authorities.push("ROLE_" + role.toUpperCase());

    // req.session.token = token;
    return res.status(200).send({
      //   id: user.id,
      name: user.name,
      email: user.email,
      role: authorities,
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// const PORT = process.env.PORT || 6000;

export const uploadFiles = async (req, res) => {
  const uploadedFiles = req.files;

  // console.log("Uploaded File", uploadedFiles);

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // const fileUrls = uploadedFiles(
  //   (file) =>
  //     `http://localhost:${process.env.PORT || 6000}/upload/${file.filename}`
  // );

  // const fileUrls = uploadedFiles.map(
  //   (file) =>
  //     `http://localhost:${process.env.PORT || 6000}/upload/${file.filename}`
  // );
  const fileUrls = uploadedFiles.map((file) => `${file.filename}`);

  // console.log("File URL Before Response ", fileUrls);

  return res.json({
    success: 1,
    file_urls: fileUrls,
  });
};

export const storeForm = async (req, res) => {
  const { formname, formdescription, questions, userEmail } = req.body;
  // const questions = req.body.questions ? JSON.parse(req.body.questions) : [];

  // console.log("Form Name for Store Form ==>", formname);
  // console.log("Form Questions for Store Form ==>", questions);
  // console.log("Form User Email for Store Form ==>", userEmail);

  if (!formname || !questions || !userEmail) {
    return res.status(400).json({ message: "Missing form data" });
  }

  // const parsedQuestions = JSON.parse(questions);

  const formattedQuestions = questions.map((question, index) => {
    // const fileUrl =
    //   req.files && req.files[index]
    //     ? `http://localhost:${process.env.PORT || 6000}/upload/${
    //         req.files[index].filename
    //       }`
    //     : null;

    // File Upload start

    // const uploadedFiles = req.file;
    // console.log(req.file);

    // const fileUrls = `http://localhost:${process.env.PORT || 6000}/upload/${
    //   req.file.filename
    // }`;

    /*
    const uploadedFile = req.files[index];
    const fileUrl = uploadedFile
      ? `http://localhost:${process.env.PORT || 6000}/upload/${
          uploadedFile.filename
        }`
      : null;
      */

    // return res.json({
    //   success: 1,
    //   file_urls: fileUrls,
    // });

    // File Upload End

    return {
      ...question,
      // file_urls: fileUrl,
    };
  });

  try {
    const newForm = new Form({
      formname,
      formdescription,
      questions: formattedQuestions,
      userEmail,
    });

    // console.log("New Form Data ", newForm);
    await newForm.save();
    res
      .status(201)
      .json({ message: "Form stored successfully", formID: newForm._id });
  } catch (error) {
    console.error("Error storing form:", error);
    res.status(500).json({ message: "Error storing form", error });
  }
};

// export const getAllImage = async (req, res) => {
//   /*
//   const uploadDir = path.join(__dirname, "upload");
//   */

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const fullServerPath = __dirname;

//   const finalServerPath = fullServerPath.replace(/\/?controller$/, "");

//   const uploadPath = path.join(finalServerPath, "/upload/");

//   console.log("Upload path : ==> ", uploadPath);

//   const { fileUrl } = req.body;

//   const fileName = fileUrl.split("/").pop();

//   const FinalFileUrl = path.join(uploadPath, fileName);

//   console.log("Final File folder path ==> ", FinalFileUrl);

//   fs.access(FinalFileUrl, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     res.sendFile(FinalFileUrl, (err) => {
//       if (err) {
//         return res.status(500).json({ message: "Error sending file" });
//       }
//     });
//   });
// };

// export const getAllImages = async (req, res) => {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const fullServerPath = __dirname.replace(/\/?controller$/, "");
//   const uploadPath = path.join(fullServerPath, "/upload/");

//   const { fileUrls } = req.body; // Expecting an array of URLs

//   try {
//     const filePaths = fileUrls.map((fileUrl) => {
//       const fileName = fileUrl.split("/").pop();
//       return path.join(uploadPath, fileName);
//     });

//     const results = await Promise.all(
//       filePaths.map((filePath) =>
//         fs.promises
//           .access(filePath, fs.constants.F_OK)
//           .then(() => ({ path: filePath, exists: true }))
//           .catch(() => ({ path: filePath, exists: false }))
//       )
//     );

//     const existingFiles = results.filter((file) => file.exists);
//     if (existingFiles.length === 0) {
//       return res.status(404).json({ message: "No files found" });
//     }

//     res.json(existingFiles.map((file) => file.path));
//   } catch (error) {
//     console.error("Error accessing files:", error);
//     return res.status(500).json({ message: "Error accessing files" });
//   }
// };

export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({}, "formname userEmail");

    res.status(200).json({ message: "Forms retrieved successfully", forms });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving forms", error });
  }
};

export const deleteFormById = async (req, res) => {
  const { formID } = req.params;

  if (!formID) {
    return res.status(400).json({ message: "Not fetch form Details." });
  }

  try {
    const deletedForm = await Form.findByIdAndDelete(formID);

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ message: "Form deleted successfully", formID });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form", error });
  }
};

// ########  Comment For Initial Logic of Upload the File Start  ############

// export const getFormDetailById = async (req, res) => {
//   try {
//     const formId = req.params.editformId;
//     // console.log("Edit Form ID ", formId);
//     const form = await Form.findById(formId);

//     if (!form) {
//       return res.status(404).json({ message: "Form not found" });
//     }

//     // console.log("File Url from User ==> ", fileUrls);

//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     const fullServerPath = __dirname;
//     const finalServerPath = fullServerPath.replace(/\/?controller$/, "");
//     const uploadPath = path.join(finalServerPath, "/upload/");
//     // console.log("Upload path : ==> ", uploadPath);

//     await form.questions.map(async (question) => {
//       if (Array.isArray(question.file_urls)) {
//         const responses = await Promise.all(
//           question.file_urls.map(async (fileUrl) => {
//             const fileName = fileUrl.split("/").pop();
//             const finalFileUrl = path.join(uploadPath, fileName);

//             return new Promise((resolve) => {
//               fs.access(finalFileUrl, fs.constants.F_OK, (err) => {
//                 if (err) {
//                   resolve({ fileUrl, found: false });
//                 } else {
//                   resolve({ fileUrl, found: true, finalFileUrl });
//                 }
//               });
//             });
//           })
//         );

//         //   question.file_urls = responses
//         //     .filter((response) => response.found)
//         //     .map((response) => response.finalFileUrl);
//         // }`

//         question.file_urls = responses.map((response) =>
//           response.found ? response.finalFileUrl : response.fileUrl
//         );
//       }

//       console.log("File URLs ======> ", question.file_urls);
//     });

//     // if (
//     //   form.questions.every(
//     //     (question) =>
//     //       !Array.isArray(question.file_urls) || question.file_urls.length === 0
//     //   )
//     // ) {
//     //   return res.status(404).json({ message: "No files found" });
//     // }

//     // form.questions.forEach((question) => {
//     //   if (Array.isArray(question.file_urls)) {
//     //     question.file_urls = question.file_urls
//     //       .map((fileUrl) =>
//     //         filesToSend.find((finalUrl) =>
//     //           finalUrl.endsWith(fileUrl.split("/").pop())
//     //         )
//     //       )
//     //       .filter((url) => url !== undefined);
//     //   }
//     // });

//     console.log("Form Values with new Link ==> ", form);

//     res.status(200).json(form);

//     // res.status(200).json(form);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// ########  Comment For Initial Logic of Upload the File End  ############

// Get the Form with uploaded file
export const getFormDetailById = async (req, res) => {
  try {
    const formId = req.params.editformId;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);
    // const fullServerPath = __dirname;
    // const finalServerPath = fullServerPath.replace(/\/?controller$/, "");
    // const uploadPath = path.join(finalServerPath, "/upload/");

    // await Promise.all(
    //   form.questions.map(async (question) => {
    //     if (Array.isArray(question.file_urls)) {
    //       const responses = await Promise.all(
    //         question.file_urls.map(async (fileUrl) => {
    //           const fileName = fileUrl.split("/").pop();
    //           const finalFileUrl = path.join(uploadPath, fileName);

    //           return new Promise((resolve) => {
    //             fs.access(finalFileUrl, fs.constants.F_OK, (err) => {
    //               if (err) {
    //                 resolve({ fileUrl, found: false });
    //               } else {
    //                 resolve({ fileUrl, found: true, finalFileUrl });
    //               }
    //             });
    //           });
    //         })
    //       );

    //       question.file_urls = responses
    //         .filter((response) => response.found)
    //         .map((response) => response.finalFileUrl);

    //       if (question.file_urls.length === 0) {
    //         question.file_urls = question.file_urls[0] || null;
    //       }
    //     } else {
    //       if (question.file_urls) {
    //         const fileUrl = question.file_urls;
    //         const finalFileUrl = path.join(
    //           uploadPath,
    //           fileUrl.split("/").pop()
    //         );

    //         await new Promise((resolve) => {
    //           fs.access(finalFileUrl, fs.constants.F_OK, (err) => {
    //             question.file_urls = err ? null : finalFileUrl;
    //             resolve();
    //           });
    //         });
    //       } else {
    //         question.file_urls = null;
    //       }
    //     }

    //     // console.log("File URLs ======> ", question.file_urls);
    //   })
    // );

    console.log("Form Data ==> ", form);

    res.status(200).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Working API for pass file name in parameter Start ############
export const getAllImages = async (req, res) => {
  const { fileName } = req.params;

  // console.log("file Name  : ==> ", fileName);

  if (!fileName) {
    return res.status(400).send("File not found");
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const fullServerPath = __dirname;
  const finalServerPath = fullServerPath.replace(/\/?controller$/, "");
  const uploadPath = path.join(finalServerPath, "/upload/");
  ("");

  const filePath = path.join(uploadPath, fileName);

  // console.log("File path for access ==> ", filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("File not found");
    }

    res.sendFile(filePath);
  });
};

// Working API for pass file name in parameter End ############

// API to get images by file names
// export const getAllImages = async (req, res) => {
//   const fileNames = req.body;

//   console.log("All File Names ==> ", fileNames);

//   if (!Array.isArray(fileNames) || fileNames.length === 0) {
//     return res
//       .status(400)
//       .send("fileNames is required and must be a non-empty array");
//   }

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   const finalServerPath = __dirname.replace(/\/?controller$/, "");
//   const uploadPath = path.join(finalServerPath, "/upload/");

//   const images = [];

//   for (const fileName of fileNames) {
//     const filePath = path.join(uploadPath, fileName);

//     try {
//       await fs.promises.access(filePath, fs.constants.F_OK);
//       const imageData = await fs.promises.readFile(filePath);
//       const base64Image = imageData.toString("base64");
//       images.push(`data:image/png;base64,${base64Image}`);
//     } catch (err) {
//       console.warn(`File not found: ${fileName}`);
//     }
//   }

//   if (images.length === 0) {
//     return res.status(404).send("No valid files found");
//   }

//   res.json(images);
// };

export const updateForm = async (req, res) => {
  // const { formId } = req.params;
  const { formname, formdescription, questions, formId, userEmail } = req.body;

  // console.log("Form ID in Server", formId);

  if (!formname && !questions && !userEmail) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { formname, formdescription, questions }
      // { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res
      .status(200)
      .json({ message: "Form updated successfully", form: updatedForm });
  } catch (error) {
    res.status(500).json({ message: "Error updating form", error });
  }
};

export const getAllUserEmailForAccess = async (req, res) => {
  try {
    const userList = await User.find({ role: "user" }, "email");

    res.status(200).json({
      message: "User emails retrieved successfully",
      userList,
    });
  } catch (error) {
    console.error("Error retrieving user emails:", error);
    res.status(500).json({
      message: "Error retrieving user emails",
      error: error.message,
    });
  }
};

// Store and Update the Access list #####

export const storeAccessList = async (req, res) => {
  const { formId, userEmails, removedEmails } = req.body;

  if (!formId || !userEmails) {
    return res.status(400).json({ message: "Missing form ID or user emails" });
  }

  try {
    const existingAccessList = await AccessList.findOne({ formId });

    if (existingAccessList) {
      const existingEmails = new Set(existingAccessList.userEmails);

      const newEmails = userEmails.filter(
        (email) => !existingEmails.has(email)
      );

      if (newEmails.length > 0) {
        existingAccessList.userEmails.push(...newEmails);
      }

      if (removedEmails && removedEmails.length > 0) {
        existingAccessList.userEmails = existingAccessList.userEmails.filter(
          (email) => !removedEmails.includes(email)
        );
      }

      await existingAccessList.save();
      return res.status(200).json({
        message: "Access List updated successfully",
        accessListID: existingAccessList._id,
      });
    } else {
      const accessList = new AccessList({
        formId,
        userEmails,
      });

      await accessList.save();
      return res.status(201).json({
        message: "Access List stored successfully",
        accessListID: accessList._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error storing access list", error });
  }
};

export const getFormIdByEmail = async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ message: "Please Login first!" });
  }

  try {
    const formAccess = await AccessList.find({ userEmails: userEmail });

    if (formAccess.length === 0) {
      return res
        .status(404)
        .json({ message: "No access found for this email." });
    }

    const formIds = formAccess.map((email) => email.formId);

    res.status(200).json({
      message: "Access Form List Received",
      formIds,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving Access Form List",
      error: error.message,
    });
  }
};

export const responseToFormData = async (req, res) => {
  const { respondedBy, answers, responseFormId } = req.body;

  if (!respondedBy || !responseFormId) {
    return res.status(400).json({ message: "Please login first" });
  } else if (!answers) {
    return res.status(400).json({ message: "Please fill up form first" });
  }

  try {
    const responseData = new FormResponseData({
      respondedBy,
      answers,
      responseFormId,
    });
    await responseData.save();

    res.status(201).json({ message: "Your Responded successfully !" });
  } catch (error) {
    res.status(500).json({ message: "Error storing form", error });
  }
};

export const getAllResponsesByFormId = async (req, res) => {
  const { formId } = req.params;

  if (!formId) {
    return res.status(400).json({ message: "Please provide form ID" });
  }
  try {
    const formResponses = await FormResponseData.find(
      {
        responseFormId: formId,
      },
      "respondedBy"
    );

    console.log("Show form Access", formResponses);
    return res.status(200).json(formResponses);
  } catch (error) {
    console.error("Error retrieving form responses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRespondedAnswerbyEmailandFormId = async (req, res) => {
  const { respondedBy, responseFormId } = req.params;

  if (!respondedBy || !responseFormId) {
    return res
      .status(400)
      .json({ message: "Please provide both respondedBy and responseFormId" });
  }

  try {
    const response = await FormResponseData.findOne({
      respondedBy,
      responseFormId,
    });

    if (!response) {
      return res
        .status(404)
        .json({ message: "No responses found for this user and form ID" });
    }

    return res.status(200).json({ answers: response.answers });
  } catch (error) {
    console.error("Error retrieving answers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAccessListInForEditList = async (req, res) => {
  const { formId } = req.body;

  if (!formId) {
    return res.status(400).json({ message: "Form ID is required" });
  }

  try {
    const accessList = await AccessList.findOne({ formId });

    if (!accessList) {
      return res
        .status(404)
        .json({ message: "No access list found for this form ID" });
    }
    res.status(200).json(accessList.userEmails);
  } catch (error) {
    console.error("Error retrieving user emails:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRespondedFormIdByLoginUser = async (req, res) => {
  const { userEmails } = req.body;

  if (!userEmails) {
    return res.status(400).json({ message: "Please login first" });
  }

  try {
    const respondedFormId = await FormResponseData.find(
      { respondedBy: userEmails },
      "responseFormId"
    );

    return res.status(200).json({
      message: "Form ID retrieved by login user successfully",
      respondedFormId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieve by login user", error });
  }
};

export const editFormResponse = async (req, res) => {
  const { answers } = req.body;
  const { formId, userEmail } = req.params;

  if (!formId || !userEmail) {
    return res.status(400).json({ message: "Please login first" });
  }
  if (!answers) {
    return res.status(400).json({ message: "Please fill up the form first" });
  }

  try {
    const responseData = await FormResponseData.findOneAndUpdate(
      { respondedBy: userEmail, responseFormId: formId },
      { answers },
      { new: true, runValidators: true }
    );

    if (!responseData) {
      return res.status(404).json({ message: "Response not found" });
    }

    res
      .status(200)
      .json({ message: "Response updated successfully!", responseData });
  } catch (error) {
    res.status(500).json({ message: "Error updating response", error });
  }
};

export default upload;
