import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { clear as clearUser } from "../stores/user";
import { clear as clearVcard, getVcard } from "../stores/vcard";
import RequestTransactionToast from "../components/global/RequestTransactionToast";

const wsConnection = import.meta.env.VITE_WS_CONNECTION;

export const socket = io(wsConnection);

// ================== Admins

export function adminSocket(navigate, user, dispatch) {
  const onDeletedAdmin = (deletedAdmin) => {
    if (deletedAdmin.id === user.id) {
      toast.error(`You have been deleted by an administrator!`);
      dispatch(clearUser());
      navigate("/login");
    } else if (user.user_type === "A") {
      toast.error(`Administrator ${user.name} has been deleted!`);
    }
  };

  socket.on("deletedAdmin", onDeletedAdmin);

  const cleanup = () => {
    socket.off("deletedAdmin", onDeletedAdmin);
  };

  return { socket, cleanup };
}

// ================== Vcards

export function vcardSocket(navigate, user, dispatch) {
  const onBlockedVCard = (blockedVCard) => {
    if (parseInt(blockedVCard.phone_number) === user.id) {
      toast.error(`You have been blocked by an administrator!`);
      dispatch(clearUser());
      dispatch(clearVcard());
      navigate("/login");
    } else if (user.user_type === "A") {
      toast.error(`${blockedVCard.name} has been blocked!`);
    }
  };

  const onDeletedVCard = (deletedVCard) => {
    if (parseInt(deletedVCard.phone_number) === user.id) {
      toast.error(`You have been deleted by an administrator!`);
      dispatch(clearUser());
      dispatch(clearVcard());
      navigate("/login");
    } else if (user.user_type === "A") {
      toast.error(`VCard ${deletedVCard.name} has been deleted!`);
    }
  };

  const maxDebitUpdated = (vcard) => {
    toast.info(
      `Your maximum debit has been updated to ${vcard.max_debit}€ by an administrator!`,
    );
    dispatch(getVcard(user.id));
  };

  socket.on("blockedVCard", onBlockedVCard);
  socket.on("deletedVCard", onDeletedVCard);
  socket.on("maxDebitUpdated", maxDebitUpdated);

  const cleanup = () => {
    socket.off("blockedVCard", onBlockedVCard);
    socket.off("deletedVCard", onDeletedVCard);
    socket.off("maxDebitUpdated", maxDebitUpdated);
  };

  return { socket, cleanup };
}

// ================== Transactions

export function transactionSocket(user, dispatch) {
  const newTransaction = (transaction) => {
    toast.info(
      `Received ${transaction.value}€ from ${transaction.sender_name ?? transaction.payment_reference}!`,
    );
    dispatch(getVcard(user.id));
  };

  const moneyRequestDeclined = (userRequest, userResponse, value) => {
    toast.error(`${userResponse} declined your request for ${value}€!`);
  };

  const moneyRequest = (requester, responder, transactionValue) => {
    showCustomToast(requester, responder, transactionValue,dispatch);
  };

  socket.on("newTransaction", newTransaction);
  socket.on("moneyRequestDeclined", moneyRequestDeclined);
  socket.on("moneyRequest", moneyRequest);

  const cleanup = () => {
    socket.off("newTransaction", newTransaction);
    socket.off("moneyRequestDeclined", moneyRequestDeclined);
    socket.off("moneyRequest", moneyRequest);
  };

  return { socket, cleanup };
}

// utils
const showCustomToast = (requester, responder, transactionValue,dispatch) => {
  toast(
    <RequestTransactionToast
      message={`${requester} is requesting ${transactionValue}€ from you!`}
      close={() => toast.clear()}
      requester={requester}
      responder={responder}
      transactionValue={transactionValue}
      dispatch={dispatch}
    />,
    {
      ToastComponent: RequestTransactionToast,
      timeout: 5000,
      hideProgressBar: false,
      type: "info",
      closeOnClick: false,
      position: "top-right",
      closeButton: false,
    },
  );
};
