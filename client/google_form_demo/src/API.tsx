import apiService from "./apiService";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginValues {
  email: string;
  password: string;
}

export const userLogin = async (values: LoginValues) => {
  try {
    const response = await apiService.post("/login", values);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const userRegister = async (values: RegisterValues) => {
  try {
    const response = await apiService.post("/register", values);
    return response;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const storeForm = async (formSubmit: any) => {
  try {
    const response = await apiService.post("/storeForm", formSubmit);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getAllImages = async (fileName: any) => {
  try {
    const response = await apiService.get(`/getFile/${fileName}`);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// export const getAllImages = async (imageUrls: string[]) => {
//   try {
//     const response = await apiService.post("/getFile", { imageUrls });
//     return response;
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     throw error;
//   }
// };

export const uploadFile = async (fileUploadData: any) => {
  try {
    const response = await apiService.post("/uploadfile", fileUploadData);
    // console.log("Hit the Response", response);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getAllForms = async () => {
  try {
    const response = await apiService.get("/formdetail");
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const deleteFormById = async (formID: string) => {
  try {
    const response = await apiService.delete(`/deleteform/${formID}`);
    return response;
  } catch (error) {
    console.error("Delete Form failed:", error);
    throw error;
  }
};

export const getFormDetailById = async (formId: string) => {
  try {
    const response = await apiService.get(`/getform/${formId}`);
    return response;
  } catch (error) {
    console.error("Get Form Details failed:", error);
    throw error;
  }
};

export const updateForm = async (formId: any, formData: any) => {
  try {
    const response = await apiService.put(`/updateform/${formId}`, {
      formData,
    });
    return response;
  } catch (error) {
    console.error("Update Form failed:", error);
    throw error;
  }
};

export const getAllUserEmailForAccess = async () => {
  try {
    const response = await apiService.get("/getalluseremail");
    return response;
  } catch (error) {
    console.error("Get AllUser Email For Access failed:", error);
    throw error;
  }
};

export const storeAccessList = async (accesslist: any) => {
  try {
    const response = await apiService.post("/addaccess", accesslist);
    return response;
  } catch (error) {
    console.error("Store AccessList failed:", error);
    throw error;
  }
};

export const getFormIdByEmail = async (userEmail: string) => {
  try {
    const response = await apiService.post("/foraccessto", { userEmail });
    return response;
  } catch (error) {
    console.error("Have not fetch form ", error);
    throw error;
  }
};

export const responseToFormData = async (formResponse: any) => {
  try {
    const response = await apiService.post("/formresponsestore", {
      formResponse,
    });
    return response;
  } catch (error) {
    console.error("Not Fetched Form List", error);
    throw error;
  }
};

export const getAllResponsesByFormId = async (formId: any) => {
  try {
    const response = await apiService.get(
      `/getresponseformdatabyformid/${formId}`
    );
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getRespondedAnswerbyEmailandFormId = async ({
  respondedBy,
  responseFormId,
}: {
  respondedBy: string;
  responseFormId: string | null;
}) => {
  try {
    const response = await apiService.get(
      `/getresponsedata/${respondedBy}/${responseFormId}`
    );
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getAccessListInForEditList = async (formId: string | null) => {
  try {
    const response = await apiService.post("/getaccesseduser", { formId });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const getRespondedFormIdByLoginUser = async (
  userEmails: string | undefined
) => {
  try {
    const response = await apiService.post("/getformidbyloginuser", {
      userEmails,
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const editFormResponse = async ({
  formId,
  userEmail,
  formResponse,
}: {
  formId: string | null;
  userEmail: string | undefined;
  formResponse: any;
}) => {
  try {
    const response = await apiService.post(
      `/editresponseform/${formId}/${userEmail}`,
      {
        formResponse,
      }
    );
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
