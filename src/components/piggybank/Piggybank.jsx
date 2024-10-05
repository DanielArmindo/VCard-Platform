import { useEffect, useState } from "react";
import "../../assets/piggybank.css";
import {
  BsFillPiggyBankFill,
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
  BsCurrencyEuro,
} from "react-icons/bs";
import { useLoaderData } from "react-router-dom";
import {
  updateSavings as updateSavingsApi,
  updateSpareChange,
} from "../../assets/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { verfIsNumber } from "../../assets/utils";

const Piggybank = () => {
  const user = useSelector((state) => state.user);
  const dataPromise = useLoaderData();
  const [piggybank, setPiggybank] = useState({});
  const [value, setValue] = useState(0);
  const [disableSpare,setDisableSpare] = useState(false)
  const [disableDeposit,setDisableDeposit] = useState(false)

  useEffect(() => {
    dataPromise?.data.then((data) => {
      setPiggybank(data);
    });
  }, [dataPromise]);

  const updateSavings = async (type) => {
    setDisableDeposit(prev=>!prev)
    if (!verfIsNumber(value)) {
      toast.error("Value must be a number!!");
      return;
    }

    const response = await updateSavingsApi({
      id: user.id,
      type: type,
      data: value,
    });

    const message =
      typeof response === "string"
        ? response
        : "The piggy bank savings were not updated due to unknown errors!";

    switch (response) {
      case true:
        toast.info(
          `${value} have been ${type === "credit" ? "added to" : "removed from"} the piggy bank.`,
        );
        setPiggybank((prev) => ({
          ...prev,
          balance:
            type === "credit"
              ? parseInt(prev.balance) + parseInt(value)
              : parseInt(prev.balance) - parseInt(value),
        }));
        setValue(0);
        break;
      default:
        toast.error(message);
        break;
    }
    setDisableDeposit(prev=>!prev)
  };

  const spare_changeStatus = async () => {
    setDisableSpare(prev => !prev)
    const response = await updateSpareChange({
      id: user.id,
      data: !piggybank.spare_change,
    });

    const message =
      typeof response === "string"
        ? response
        : "The Spare Change status was not updated due to unknown errors!";

    switch (response) {
      case true:
        toast.info(`Spare Changes has been updated`);
        setPiggybank((prev) => ({
          ...prev,
          spare_change: !prev.spare_change,
        }));
        break;
      default:
        toast.error(message);
        break;
    }

    setDisableSpare(prev => !prev)
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="mx-2">
          <h3 className="mt-4">Piggy Bank Vault</h3>
        </div>
      </div>
      <hr />
      <div className="row mx-1 d-flex flex-column">
        <div className="col-md-12 mt-4 pt-4 pb-4 d-flex justify-content-around align-items-center div-img-background rounded">
          <div className="col-md-4 text-center flip-horizontal">
            <BsFillPiggyBankFill size={80} />
          </div>
          <div className="col-md-4 d-flex flex-column text-center">
            <span className="custom-font">{piggybank?.balance}€</span>
            <span>Total Acumulado</span>
          </div>
          <div className="col-md-4 d-flex flex-column text-center">
            <span
              className={
                piggybank?.spare_change
                  ? "text-success custom-font"
                  : "custom-font"
              }
            >
              {piggybank?.spare_change ? "Ativado" : "Desativado"}
            </span>
            <span>Spare change</span>
          </div>
        </div>
        <div className="d-flex p-0 justify-content-between">
          <div className="bg rounded mt-4 p-4 d-flex flex-column align-items-center justify-content-start w-25 m-1">
            <div className="w-100 mb-3">
              <h5>Manage your Savings</h5>
            </div>
            <button
              className="btn btn-light text-dark m-1 w-100 d-flex justify-content-center align-items-center"
              onClick={() => updateSavings("credit")}
              disabled={disableDeposit}
            >
              <BsFillArrowUpCircleFill size={20} className="text-success" />
              &nbsp;Reforçar
            </button>
            <div className="input-group">
              <span className="input-group-text">
                <BsCurrencyEuro size={20} />
              </span>
              <input
                className="form-control input-font"
                id="inputAmount"
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <button
              className="btn btn-light text-dark m-1 w-100 d-flex justify-content-center align-items-center"
              onClick={() => updateSavings("debit")}
              disabled={disableDeposit}
            >
              <BsFillArrowDownCircleFill size={20} className="text-danger" />
              &nbsp;Retirar
            </button>
          </div>
          <div className="bg rounded mt-4 p-4 d-flex flex-column justify-content-start w-75 m-1">
            <div className="w-100 mb-3">
              <h5>Spare Change feature</h5>
            </div>
            <p>
              Esta funcionalidade permite arredondar o valor das transações e
              meter o valor excedente para o mealheiro.
            </p>
            <p>Para ativar esta funcionalidade, clique no botão abaixo.</p>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="switchSpareChange"
                name="spare_change"
                checked={piggybank?.spare_change ?? false}
                onChange={spare_changeStatus}
                disabled={disableSpare}
              />
              <label className="form-check-label" htmlFor="switchSpareChange">
                Spare Change Feature
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Piggybank;
