import axios from "axios";
import { socket } from "./sockets";

const apiDomain = import.meta.env.VITE_API_DOMAIN;

export const api = axios.create({
  baseURL: apiDomain + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============= Related to User
export async function login(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    sessionStorage.setItem("tokken", response.data.access_token);
    api.defaults.headers.common.Authorization =
      "Bearer " + response.data.access_token;
    return true;
  } catch (error) {
    clearTokken();
    if (error.response && error.response.status) {
      return error.response.data?.msg;
    }
    return false;
  }
}

export async function logout() {
  try {
    await api.post("logout");
    clearTokken();
    return true;
  } catch (error) {
    return false;
  }
}

export function clearTokken() {
  sessionStorage.removeItem("tokken");
  api.defaults.headers.common.Authorization = "";
}

export async function changeCredentials(credentials, options) {
  try {
    const url = !options.changePassword
      ? `vcards/${options.id}/confirmation_code`
      : `users/${options.id}/password`;

    await api.patch(url, credentials);
    clearTokken();
    return true;
  } catch (error) {
    if (error.response && error.response.status) {
      return error.response.status;
    }
    return false;
  }
}

// ============= Related to VCards

export async function createVcard(data) {
  try {
    await api.post("/vcards", data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function getVcard(id) {
  try {
    const response = await api.get("vcards/" + id);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function getVcards(page = 1, params = "") {
  try {
    const filter = params ? `&${params}` : "";
    const response = await api.get(`vcards?page=${page}${filter}`);
    return { vcards: response.data.data, meta: response.data.meta };
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function patchVcard(obj) {
  try {
    await api.patch("vcards/" + obj.id, obj.data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function putVcard(obj) {
  try {
    await api.put("vcards/" + obj.id, obj.data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function deleteVcard(obj) {
  try {
    if (obj.user_type === "A") {
      await api.delete("vcards/" + obj.id);
    } else {
      await api.delete("vcards/" + obj.id, { data: obj.data });
    }
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.data?.message;
    }
    return false;
  }
}

// ============= Related to Categories

export async function getCategories(obj) {
  let url = "";
  try {
    switch (obj.type) {
      case "V":
        url = `vcards/${obj.id}/categories`;
        break;
      default:
        url = "default-categories";
        break;
    }
    const response = await api.get(url);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function getCategory(obj) {
  let url = "";
  try {
    switch (obj.type) {
      case "V":
        url = `categories/`;
        break;
      default:
        url = "default-categories/";
        break;
    }
    const response = await api.get(url + obj.id);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function deleteCategory(obj) {
  try {
    const url = obj.type === "V" ? "categories" : "default-categories";
    await api.delete(url + "/" + obj.id);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function createCategory(obj) {
  try {
    const url = obj.type === "V" ? "categories" : "default-categories";
    await api.post(url, obj.data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function updateCategory(obj) {
  try {
    const url = obj.type === "V" ? "categories/" : "default-categories/";
    await api.put(url + obj.id, obj.data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

// ============= Related to Statistics

export async function getStatistics(obj) {
  let url = "";
  try {
    switch (obj.type) {
      case "V":
        url = `vcards/${obj.id}/statistics`;
        break;
      default:
        url = "admins/statistics";
        break;
    }
    const response = await api.get(url);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

// ============= Related to Piggybank

export async function getPiggybank(id) {
  try {
    const response = await api.get(`vcards/${id}/piggybank`);
    return response.data.Mealheiro;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function updateSavings(obj) {
  try {
    await api.patch(`vcards/${obj.id}/piggybank/${obj.type}`, {
      value: obj.data,
    });
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.data?.message;
    }
    return false;
  }
}

export async function updateSpareChange(obj) {
  try {
    await api.patch(`vcards/${obj.id}/piggybank/sparechange`, {
      spare_change: obj.data,
    });
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.data?.message;
    }
    return false;
  }
}

// ============= Related to Admins

export async function getAdmins() {
  try {
    const response = await api.get("admins");
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function getAdmin(id) {
  try {
    const response = await api.get("admins/" + id);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function createAdmin(data) {
  try {
    await api.post("admins", data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function updateAdmin(data) {
  try {
    await api.put("admins/" + data.id, data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function deleteAdmin(id) {
  try {
    await api.delete("admins/" + id);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

// ============= Related to Transactions

export async function getTransactions(id, page = 1, params = "") {
  try {
    const filter = params ? `&${params}` : "";
    const response = await api.get(
      `vcards/${id}/transactions?page=${page}${filter}`,
    );
    return { transactions: response.data.data, meta: response.data.meta };
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response;
    }
    return false;
  }
}

export async function getTransaction(id) {
  try {
    const response = await api.get("transactions/" + id);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status) {
      throw err.response;
    }
    throw false;
  }
}

export async function postTransaction(obj) {
  try {
    let response;
    if (obj.type === "A") {
      response = await api.post("transactions/credit", obj.data);
    } else {
      response = await api.post("transactions/debit", obj.data);
    }
    socket.emit("newTransaction", response.data.data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.data?.message;
    }
    return false;
  }
}

export async function patchTransaction(obj) {
  try {
    await api.patch("transactions/" + obj.id, obj.data);
    return true;
  } catch (err) {
    if (err.response && err.response.status) {
      return err.response.data?.message;
    }
    return false;
  }
}
