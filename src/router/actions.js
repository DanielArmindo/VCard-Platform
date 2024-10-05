import {
  changeCredentials,
  createVcard,
  login,
  createCategory as createCategoryApi,
  updateCategory,
  createAdmin as createAdminApi,
  updateAdmin,
  patchVcard,
  putVcard,
  postTransaction,
  patchTransaction,
} from "../assets/api";
import * as utils from "../assets/utils";
import store from "../stores";
import { clear as clearUser, getUser } from "../stores/user";
import { clear as clearVcard } from "../stores/vcard";
import { getVcard } from "../stores/vcard";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";
import { socket } from "../assets/sockets";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  let error = {};

  !utils.verfPassword(password) &&
    (error.password = "Password dever ter no minimo 3 caracteres");
  !utils.verfUsername(username) &&
    (error.username =
      "Username deve ser um numero de telefone começando em 9 com 9 digitos ou um email");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const connected = await login({ username, password });
  if (connected === true) {
    store.dispatch(getUser());
    toast.success("Successful Login!");
    return redirect("/");
  } else {
    const message =
      typeof connected === "string" ? connected : "Unable to login";
    toast.error(message);
  }

  return null;
}

export async function vcardAction({ request, params }) {
  const user = store.getState().user;
  const formData = await request.formData();

  const requestData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone_number: formData.get("phone_number"),
    photo_url: formData.get("photo_url"),
    deletePhotoOnTheServer: formData.get("photoServer") === "on" ? true : false,
    base64ImagePhoto: formData.get("base64"),
    confirmation_code: formData.get("confirmCode"),
    max_debit: parseInt(formData.get("max_debit")),
    blocked: formData.get("blocked") === "on" ? 1 : 0,
  };

  let error = {};
  let response = null;

  //Create New Vcard
  if (params.id === "new") {
    !utils.verfPhoneNumber(requestData.phone_number) &&
      (error.phone = "Deve começar com 9 e ter 9 digitos");
    !utils.verfEmail(requestData.email) &&
      (error.email = "Deve ser do formato de email");
    !utils.verfPassword(requestData.password) &&
      (error.password = "Password dever ter no minimo 3 caracteres");
    !utils.verfConfirmCode(requestData.confirmation_code) &&
      (error.code = "Code deve ter 3 digitos");
    !utils.verfStringNotEmpty(requestData.name) &&
      (error.name = "Vcard name cannot be empty!!");

    if (Object.keys(error).length !== 0) {
      return error;
    }

    response = await createVcard({
      phone_number: requestData.phone_number,
      name: requestData.name,
      email: requestData.email,
      password: requestData.password,
      confirmation_code: requestData.confirmation_code,
      base64ImagePhoto: requestData.base64ImagePhoto,
    });

    switch (response) {
      case true:
        toast.success(`Vcard was registered successfully.`);
        await login({
          username: requestData.phone_number,
          password: requestData.password,
        });
        store.dispatch(getUser());
        return redirect("/");
      case 422:
        toast.error(`Vcard was not registered due to validation errors!`);
        break;
      default:
        toast.error(`Vcard was not registered due to unknown server error!`);
        break;
    }
  } else {
    //When Update Vcard by Admin or by owner Vcard
    if (user.user_type === "A") {
      !utils.verfIsNumber(requestData.max_debit) &&
        (error.max_debit = "Must be a Number");

      if (Object.keys(error).length !== 0) {
        return error;
      }

      response = await patchVcard({
        id: params.id,
        data: {
          max_debit: requestData.max_debit,
          blocked: requestData.blocked,
        },
      });
    } else {
      !utils.verfEmail(requestData.email) &&
        (error.email = "Must be email format");
      !utils.verfStringNotEmpty(requestData.name) &&
        (error.name = "Vcard name cannot be empty!!");

      if (Object.keys(error).length !== 0) {
        return error;
      }

      response = await putVcard({
        id: params.id,
        data: {
          name: requestData.name,
          email: requestData.email,
          base64ImagePhoto: requestData.base64ImagePhoto,
          deletePhotoOnTheServer: requestData.deletePhotoOnTheServer,
        },
      });
    }

    switch (response) {
      case true:
        toast.success(`Vcard #${params.id} was updated successfully.`);
        user.user_type === "V" && store.dispatch(getUser());
        //Sockets
        requestData.blocked
          ? socket.emit("blockedVCard", user, { phone_number: params.id })
          : formData.get("whoEmit")
            ? socket.emit("maxDebitUpdated", {
                phone_number: params.id,
                max_debit: requestData.max_debit,
              })
            : null;

        return user.user_type === "A" ? redirect("/vcards") : redirect("/");
      case 422:
        toast.error(
          `Vcard #${params.id} was not updated due to validation errors!`,
        );
        break;
      default:
        toast.error(
          `Vcard #${params.id} was not updated due to unknown server error!`,
        );
        break;
    }
  }

  return null;
}

export async function changePasswordAction({ request }) {
  const formData = await request.formData();

  const requestData = {
    current_password: formData.get("current_password"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  };

  const options = {
    changePassword: true,
    id: store.getState().user.id,
  };

  let error = {};

  !utils.verfPassword(requestData.current_password) &&
    (error.currentPassword =
      "Current Password dever ter no minimo 3 caracteres");
  !utils.verfPassword(requestData.password) &&
    (error.password = "Password dever ter no minimo 3 caracteres");
  !utils.verfPassword(requestData.password_confirmation) &&
    (error.passwordConfirmation =
      "Password Confirmation dever ter no minimo 3 caracteres");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const response = await changeCredentials(requestData, options);

  switch (response) {
    case true:
      store.dispatch(clearUser());
      store.dispatch(clearVcard());
      toast.success("Credentials Changed Successfully!");
      return redirect("/");
    case 422:
      toast.error(
        "Credentials have not been changed due to validation errors!",
      );
      break;
    default:
      toast.error(
        "Credentials have not been changed due to unknown server error!",
      );
      break;
  }

  return null;
}

export async function changeConfirmCodeAction({ request }) {
  const formData = await request.formData();

  const requestData = {
    current_password: formData.get("current_password"),
    confirmation_code: formData.get("confirmation_code"),
    confirmation_code_confirmation: formData.get(
      "confirmation_code_confirmation",
    ),
  };

  const options = {
    changePassword: false,
    id: store.getState().user.id,
  };

  let error = {};

  !utils.verfPassword(requestData.current_password) &&
    (error.currentPassword =
      "Current Password dever ter no minimo 3 caracteres");
  !utils.verfConfirmCode(requestData.confirmation_code) &&
    (error.confirmation_code = "Confirmation Code deve conter 3 digitos");
  !utils.verfConfirmCode(requestData.confirmation_code_confirmation) &&
    (error.confirmation_code_confirmation =
      "Confirmation Code Confirmation deve conter 3 digitos");

  if (Object.keys(error).length !== 0) {
    return error;
  }

  const response = await changeCredentials(requestData, options);

  switch (response) {
    case true:
      store.dispatch(clearUser());
      store.dispatch(clearVcard());
      toast.success("Credentials Changed Successfully!");
      return redirect("/");
    case 422:
      toast.error(
        "Credentials have not been changed due to validation errors!",
      );
      break;
    default:
      toast.error(
        "Credentials have not been changed due to unknown server error!",
      );
      break;
  }

  return null;
}

export async function createCategory({ request, params }) {
  const formData = await request.formData();

  //Inserting Category
  if (params.id === "new") {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Category name cannot be empty!!");

    if (formData.get("type") !== "C" && formData.get("type") !== "D") {
      error.type = "The category type must be between C or D";
    }

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const user = store.getState().user;
    const data = {
      type: user.user_type,
      data: {
        vcard: user.user_type === "V" ? user.id : null,
        name: formData.get("name"),
        type: formData.get("type"),
      },
    };
    const response = await createCategoryApi(data);

    switch (response) {
      case true:
        toast.success(
          `Category ${formData.get("name")} was created successfully!`,
        );
        return redirect("/categories");
      case 422:
        toast.error("Category was not created due to validation errors!");
        break;
      default:
        toast.error("Category was not created due to unknown server error!");
        break;
    }
  }

  //Edit Category
  if (utils.verfIsNumber(params.id)) {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Category name cannot be empty!!");

    if (formData.get("type") !== "C" && formData.get("type") !== "D") {
      error.type = "The category type must be between C or D";
    }

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const user = store.getState().user;
    const data = {
      type: user.user_type,
      id: params.id,
      data: {
        vcard: user.user_type === "V" ? user.id : null,
        name: formData.get("name"),
        type: formData.get("type"),
        id: params.id,
      },
    };

    const response = await updateCategory(data);
    switch (response) {
      case true:
        toast.success(
          `Category ${formData.get("name")} was updated successfully!`,
        );
        return redirect("/categories");
      case 422:
        toast.error(
          `Category #${params.id} was not updated due to validation errors!`,
        );
        break;
      default:
        toast.error(
          `Category #${params.id} was not updated due to unknown server error!`,
        );
        break;
    }
  }
  return null;
}

export async function createAdmin({ request, params }) {
  const formData = await request.formData();

  //Inserting Admin
  if (params.id === "new") {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Name cannot be empty!!");

    !utils.verfEmail(formData.get("email")) &&
      (error.email = "Must be email format!!");

    !utils.verfPassword(formData.get("password")) &&
      (error.password = "The password must be at least 3 characters long!!");

    !utils.verfPassword(formData.get("passwordConfirmation")) &&
      (error.passwordConfirmation =
        "The password confirmation must be at least 3 characters long!!");

    if (Object.keys(error).length !== 0) {
      return error;
    }

    if (formData.get("passwordConfirmation") !== formData.get("password")) {
      toast.error(
        "The password and confirmation password fields must be the same!",
      );
      return null;
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirmation: formData.get("passwordConfirmation"),
    };
    const response = await createAdminApi(data);

    switch (response) {
      case true:
        toast.success(
          `Admin '${formData.get("name")}' was created successfully!`,
        );
        return redirect("/admins");
      case 422:
        toast.error("Admin was not created due to validation errors!");
        break;
      default:
        toast.error("Admin was not created due to unknown server error!");
        break;
    }
  }

  //Edit Admin
  if (utils.verfIsNumber(params.id)) {
    let error = {};

    !utils.verfStringNotEmpty(formData.get("name")) &&
      (error.name = "Name cannot be empty!!");

    !utils.verfEmail(formData.get("email")) &&
      (error.email = "Must be email format!!");

    if (Object.keys(error).length !== 0) {
      return error;
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      id: params.id,
    };

    const response = await updateAdmin(data);
    switch (response) {
      case true:
        toast.success("Admin #" + params.id + " was updated successfully.");
        return redirect("/admins");
      case 422:
        toast.error(
          "Admin #" + params.id + " was not updated due to validation errors!",
        );
        break;
      default:
        toast.error(
          "Admin #" +
            params.id +
            " was not updated due to unknown server error!",
        );
        break;
    }
  }
  return null;
}

export async function transactionAction({ request, params }) {
  const formData = await request.formData();
  const user = store.getState().user;

  let error = {};
  let response = null;
  let arrayPaymentType = ["MBWAY", "PAYPAL", "IBAN", "MB", "VISA"];
  user.user_type === "V" && arrayPaymentType.push("VCARD");

  const requestData = {
    confirmation_code: formData.get("confirmation_code"),
    payment_type: formData.get("payment_type"),
    payment_reference: formData.get("payment_reference"),
    description:
      formData.get("description") === "" ? null : formData.get("description"),
    category_id:
      formData.get("category_id") === "" ? null : formData.get("category_id"),
    value: formData.get("value"),
  };

  //Inserting transaction
  if (params.id === "new") {
    // By user
    if (user.user_type === "V") {
      if (!utils.verfConfirmCode(requestData.confirmation_code)) {
        toast.error("Code must have 3 digits");
        return null;
      }
      arrayPaymentType.indexOf(requestData.payment_type) === -1 &&
        (error.payment_type =
          "Payment type must be one of the types indicated");

      if (parseFloat(requestData.value) <= 0.0) {
        error.value = "Value must be a number above 0";
      }

      if (Object.keys(error).length !== 0) {
        return error;
      }

      const updatedRequestData = {
        ...requestData,
        value: parseFloat(requestData.value),
        category_id:
          requestData.category_id !== null
            ? parseInt(requestData.category_id)
            : null,
      };

      response = await postTransaction({
        type: user.user_type,
        data: updatedRequestData,
      });
    } else {
      //By Admin
      arrayPaymentType.indexOf(requestData.payment_type) === -1 &&
        (error.payment_type =
          "Payment type must be one of the types indicated");

      if (parseFloat(requestData.value) <= 0.0) {
        error.value = "Value must be a number above 0";
      }

      !utils.verfPhoneNumber(formData.get("vcard")) &&
        (error.vcard = "It must start with 9 and have 9 digits!!");

      if (Object.keys(error).length !== 0) {
        return error;
      }

      const updatedRequestData = {
        payment_type: requestData.payment_type,
        payment_reference: requestData.payment_reference,
        vcard: formData.get("vcard"),
        value: parseFloat(requestData.value),
        description: requestData.value,
      };

      response = await postTransaction({
        type: user.user_type,
        data: updatedRequestData,
      });
    }

    if (response === true) {
      toast.success("Transaction Performed");
      //Update the store vcard for V users
      user.user_type === "V" && store.dispatch(getVcard(user.id));
      return redirect("/transactions");
    } else {
      const message =
        typeof response === "string"
          ? response
          : "Error to perform transaction";
      toast.error(message);
    }
  }

  if (utils.verfIsNumber(params.id)) {
    response = await patchTransaction({
      id: params.id,
      data: {
        description: requestData.description,
        category_id:
          requestData.category_id !== null
            ? parseInt(requestData.category_id)
            : null,
      },
    });

    if (response === true) {
      toast.success("Transaction Updated");
      return redirect("/transactions");
    } else {
      const message =
        typeof response === "string" ? response : "Error to Update transaction";
      toast.error(message);
    }
  }

  return null;
}
