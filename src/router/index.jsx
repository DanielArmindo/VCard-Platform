import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
//Imports Loaders and Actions
import {
  changeConfirmCodeAction,
  changePasswordAction,
  createAdmin,
  createCategory,
  loginAction,
  transactionAction,
  vcardAction,
} from "./actions";
import {
  adminLoader,
  adminsLoader,
  categoriesLoader,
  categoryLoader,
  changeConfirmCodeLoader,
  changePasswordLoader,
  loginLoader,
  piggybankLoader,
  statisticsLoader,
  transactionLoader,
  transactionsLoader,
  vcardLoader,
  vcardsLoader,
} from "./loaders";
//Imports of components
import Layout from "../components/Layout";
import NotFound from "../views/NotFound";
import Home from "../views/Home";
import Login from "../components/auth/Login";
import Error from "../components/Error";
import VCard from "../components/vcards/VCard";
import ChangeCredentials from "../components/auth/ChangeCredentials";
import Categories from "../components/categories/Categories";
import Category from "../components/categories/Category";
import Statistics from "../components/statistics/Statistics";
import Admins from "../components/admins/Admins";
import Admin from "../components/admins/Admin";
import Vcards from "../components/vcards/Vcards";
import Piggybank from "../components/piggybank/Piggybank";
import Transactions from "../components/transactions/Transactions";
import Transaction from "../components/transactions/Transaction";

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Error />}>
      <Route index element={<Home />} />
      <Route
        path="login"
        element={<Login />}
        action={loginAction}
        loader={loginLoader}
      />
      <Route
        path="credentials/password"
        action={changePasswordAction}
        loader={changePasswordLoader}
        element={<ChangeCredentials changeConfirmationCode={false} />}
      />
      <Route
        path="credentials/confirmation_code"
        action={changeConfirmCodeAction}
        loader={changeConfirmCodeLoader}
        element={<ChangeCredentials changeConfirmationCode={true} />}
      />

      <Route path="vcards" loader={vcardsLoader} element={<Vcards />} />
      <Route
        path="vcards/:id"
        element={<VCard />}
        action={vcardAction}
        loader={vcardLoader}
      />
      <Route
        path="transactions"
        loader={transactionsLoader}
        element={<Transactions />}
      />
      <Route
        path="transactions/:id"
        loader={transactionLoader}
        action={transactionAction}
        element={<Transaction />}
      />
      <Route path="admins" element={<Admins />} loader={adminsLoader} />
      <Route
        path="admins/:id"
        element={<Admin />}
        action={createAdmin}
        loader={adminLoader}
      />
      <Route
        path="categories"
        element={<Categories />}
        loader={categoriesLoader}
      />
      <Route
        path="categories/:id"
        action={createCategory}
        element={<Category />}
        loader={categoryLoader}
      />
      <Route
        path="statistics"
        element={<Statistics />}
        loader={statisticsLoader}
      />
      <Route
        path="piggybank"
        element={<Piggybank />}
        loader={piggybankLoader}
      />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);
