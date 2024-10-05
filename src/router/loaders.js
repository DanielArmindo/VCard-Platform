import { defer, redirect } from "react-router-dom";
import store from "../stores";
import {
  getAdmins,
  getCategories,
  getCategory,
  getStatistics,
  getAdmin,
  getVcards,
  getVcard,
  getPiggybank,
  getTransactions,
  getTransaction,
} from "../assets/api";
import { verfIsNumber, verfPhoneNumber } from "../assets/utils";

export function loginLoader() {
  if (!(store.getState().user === null)) {
    return redirect("/");
  }
  return null;
}

export function changePasswordLoader() {
  if (store.getState().user === null) {
    return redirect("/");
  }
  return null;
}

export function changeConfirmCodeLoader() {
  if (!(store.getState().user?.user_type === "V")) {
    return redirect("/");
  }
  return null;
}

// ================== Vcards
export function vcardLoader({ params }) {
  const user = store.getState().user;
  if (params.id === "new") {
    if (user !== null) {
      return redirect("/");
    }
    return { create: true };
  } else {
    if (
      !verfPhoneNumber(params.id) ||
      (user.user_type === "V" && user.id !== parseInt(params.id))
    ) {
      return redirect("/");
    }
    return defer({ vcard: getVcard(params.id), create: false });
  }
}

export function vcardsLoader() {
  const user = store.getState().user;
  if (user === null || user.user_type !== "A") {
    return redirect("/");
  }
  return defer({ vcards: getVcards() });
}

// ================== Categories
export async function categoriesLoader() {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }
  const categoriesPromise = getCategories({
    type: user.user_type,
    id: user.id,
  });
  return defer({ categories: categoriesPromise });
}

export async function categoryLoader({ params }) {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }
  if (params.id === "new") {
    return null;
  }
  if (verfIsNumber(params.id)) {
    return defer({
      category: getCategory({ type: user.user_type, id: params.id }),
    });
  }

  return redirect("/");
}

// ================== Statistics
export function statisticsLoader() {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }

  const request = {
    type: user.user_type,
    id: user.id,
  };

  const response = getStatistics(request);

  return defer({ statistics: response });
}

// ================== Piggybank
export function piggybankLoader() {
  const user = store.getState().user;
  if (user === null || user.user_type !== "V") {
    return redirect("/");
  }

  return defer({ data: getPiggybank(user.id) });
}

// ================== Admins
export function adminsLoader() {
  const user = store.getState().user;
  if (user === null || user.user_type !== "A") {
    return redirect("/");
  }

  return defer({ admins: getAdmins() });
}

export function adminLoader({ params }) {
  const user = store.getState().user;
  if (user === null || user.user_type !== "A") {
    return redirect("/");
  }
  if (params.id === "new") {
    return defer({ edit: false });
  }
  if (verfIsNumber(params.id)) {
    if (user.id !== parseInt(params.id)) {
      return redirect("/");
    }
    return defer({
      admin: getAdmin(params.id),
      edit: true,
    });
  }

  return redirect("/");
}

// ================== Transactions
export function transactionsLoader() {
  const user = store.getState().user;
  if (user === null || user.user_type !== "V") {
    return redirect("/");
  }

  return defer({ transactions: getTransactions(user.id) });
}

export function transactionLoader({ params }) {
  const user = store.getState().user;
  if (user === null) {
    return redirect("/");
  }
  if (params.id === "new") {
    return defer({
      operation: "insert",
      categories: getCategories({ type: user.user_type, id: user.id }),
    });
  }
  if (verfIsNumber(params.id)) {
    if (user.user_type !== "V") {
      return redirect("/");
    }
    return defer({
      transaction: getTransaction(params.id),
      categories: getCategories({ type: user.user_type, id: user.id }),
      operation: "update",
    });
  }

  return redirect("/");
}
