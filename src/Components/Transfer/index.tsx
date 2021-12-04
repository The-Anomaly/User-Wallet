import * as React from "react";
import { Modal } from "react-bootstrap";
import styles from "./styles.module.css";
import Select, { SingleValue } from "react-select";
import axios from "axios";
import { users } from "Utils/Types/users";
import Success from "../Success";

interface TransferProps {
  show: boolean;
  closeModal: () => void;
  friend?: users;
  self: users | undefined;
}

interface optionType {
  value: string;
  label: string;
}

let initialState: optionType = {
  value: "",
  label: "",
};

const currencyOptions: optionType[] = [
  {
    value: "USD",
    label: "USD",
  },
  {
    value: "NGN",
    label: "NGN",
  },
  {
    value: "EUR",
    label: "EUR",
  },
];

const Transfer: React.FC<TransferProps> = ({
  show,
  closeModal,
  friend,
  self,
}) => {
  const [currency, setCurrency] = React.useState(initialState);
  const [recipient, setRecipient] = React.useState(initialState);
  const [amount, setAmount] = React.useState<string>("");
  const [rates, setRates] = React.useState({
    USD: 0,
    NGN: 0,
    EUR: 0,
  });
  const [recipientOptions, setRecipientOptions] = React.useState<optionType[]>(
    []
  );
  const [convertedAmount, setConvertedAmount] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<number>(0);
  const [confirm, setConfirm] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);

  const handleChangeCurrency = (val: SingleValue<optionType>) => {
    val && setCurrency(val);
  };

  const handleChangeRecipient = (val: SingleValue<optionType>) => {
    val && setRecipient(val);
  };

  //   const handleChangeAmount = (e: Event) => {
  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    //
    // console.log(e.keyCode)
    const { value } = e.target;
    if (balance < convertedAmount) {
      console.log("not enough");
      console.log(balance);
      console.log(convertedAmount);
      return;
    }
    // if(e.key === "Backspace") {
    //     e.preventDefault();
    //     alert('Prevent page from going back');
    // }
    setAmount(value);
    setConvertedAmount(convertCurrency(parseInt(value), currency.value));
    setBalance(balanceLeft(parseInt(value)));
  };

  const roundToSixDecimals = (num: number): number => {
    return Math.round(num * 1000000) / 1000000;
  };

  const getRate = () => {
    const YOUR_ACCESS_KEY = "c1f244c974be138df12e40029e8f646e";
    axios
      .get(
        `http://api.exchangeratesapi.io/v1/latest?access_key=${YOUR_ACCESS_KEY}&symbols=USD,EUR,NGN`
      )
      .then((response) => {
        console.log(response);
        console.log(response.data.rates);
        // base rate = EUR
        let rates = response.data.rates;

        // base rate = USD
        let newRates = {
          USD: 1,
          NGN: roundToSixDecimals(rates.USD / rates.NGN),
          EUR: roundToSixDecimals(rates.USD / rates.EUR),
        };

        //
        console.log(rates, "base EUR");
        console.log(newRates, "base USD");
        setRates(newRates);
        localStorage.setItem("rates", JSON.stringify(newRates));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  React.useEffect(() => {
    if (self) {
      setBalance(self.walletBalance);
    }
  }, [self]);

  React.useEffect(() => {
    let rates = localStorage.getItem("rates");
    const usersList = localStorage.getItem("users");

    if (usersList) {
      let list = JSON.parse(usersList);
      console.log(list);
      let ray: optionType[] = [];
      list.map((item: users) => {
        console.log(item);
        return ray.push({
          value: `${item?.fname} ${item?.lname}`,
          label: `${item?.fname} ${item?.lname}`,
        });
      });

      setRecipientOptions(ray);
    }

    // getRate();
    if (!rates) {
      getRate();
    } else {
      setRates(JSON.parse(rates));
      console.log(JSON.parse(rates));
    }
  }, []);

  React.useEffect(() => {
    if (friend) {
      setRecipient({
        value: `${friend?.fname} ${friend?.lname}`,
        label: `${friend?.fname} ${friend?.lname}`,
      });
    } else {
      setRecipient(initialState);
    }
  }, [friend]);

  const convertCurrency = (amount: number, currencyTo: string): number => {
    let value: number = 1;
    if (currencyTo === "USD" || currencyTo === "NGN" || currencyTo === "EUR") {
      value = amount * rates[currencyTo];
    }
    return roundToSixDecimals(value);
  };

  const balanceLeft = (amount: number): number => {
    let balance = 0;
    if (self) {
      balance = self.walletBalance - convertCurrency(amount, currency.value);
      //   balance = self.walletBalance - convertedAmount;
    }
    return balance;
  };

  const send = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfirm(true);
  };
  const edit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfirm(false);
  };

  const confirmSend = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(Math.round(balance));
    const users = localStorage.getItem("users");
    if (self && users) {
      let list = JSON.parse(users);
      let newSelf: users = {
        id: self?.id,
        fname: self?.fname,
        lname: self?.lname,
        walletBalance: Math.round(balance),
      };
      list.splice(0, 1, newSelf);
      console.log(newSelf);
      console.log(list);
      localStorage.setItem("users", JSON.stringify(list));
    }
    setConfirm(false);
    setCurrency(initialState);
    setRecipient(initialState);
    setAmount("");
    setConvertedAmount(0);
    closeModal();
    return setSuccess(true);
  };

  return (
    <>
      <Success show={success} closeModal={() => setSuccess(false)} />
      <Modal className={styles.transfer} show={show} onHide={closeModal}>
        <button onClick={closeModal} className={styles.closeBtn}>
          &times;
        </button>
        <Modal.Title>{confirm ? "Confirm Transfer" : "Send funds"}</Modal.Title>
        <Modal.Body>
          {!confirm ? (
            <form>
              <div className={styles.inputWrap}>
                <label>Currency</label>
                <Select
                  options={currencyOptions}
                  className={styles.walletDropdown}
                  classNamePrefix="transferSelect"
                  placeholder="Select Currency"
                  isSearchable={true}
                  value={currency.value ? currency : null}
                  onChange={(val) => handleChangeCurrency(val)}
                  // name="zone"
                  // data-testid="zone"
                />
              </div>
              {currency.value ? (
                <div className={styles.inputWrap}>
                  <label>Amount in {currency?.value}</label>
                  <input
                    type="text"
                    placeholder="Enter amount to send"
                    value={amount}
                    onChange={handleChangeAmount}
                  />
                </div>
              ) : (
                ""
              )}
              {currency?.value !== "USD" ? (
                <div className={styles.inputWrap}>
                  <label>Amount in USD</label>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={convertedAmount}
                    readOnly
                  />
                  <p className={styles.note}>Balance left: {balance}</p>
                </div>
              ) : (
                ""
              )}
              {(amount || recipient.value) && (
                <div className={styles.inputWrap}>
                  <label>Recipient</label>
                  <Select
                    options={recipientOptions}
                    className={styles.walletDropdown}
                    classNamePrefix="transferSelect"
                    placeholder="Select Recipient"
                    isSearchable={true}
                    value={recipient.value ? recipient : null}
                    onChange={(val) => handleChangeRecipient(val)}
                    // name="zone"
                    // data-testid="zone"
                  />
                </div>
              )}
              <button onClick={send} className={styles.btn}>
                Send
              </button>
            </form>
          ) : (
            <form>
              <div className={styles.inputWrap}>
                <label>Currency</label>
                <input
                  type="text"
                  placeholder="Currency"
                  value={currency.value}
                  readOnly
                />
              </div>
              <div className={styles.inputWrap}>
                <label>Amount in {currency.value}</label>
                <input
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  readOnly
                />
              </div>
              <div className={styles.inputWrap}>
                <label>Amount in USD</label>
                <input
                  type="text"
                  placeholder="Amount"
                  value={convertedAmount}
                  readOnly
                />
              </div>
              <div className={styles.inputWrap}>
                <label>Recipient</label>
                <input
                  type="text"
                  placeholder="Recipient"
                  value={recipient.value}
                  readOnly
                />
              </div>
              <div className={styles.btnSec}>
                <button onClick={edit} className={styles.btn}>
                  Edit
                </button>
                <button onClick={confirmSend} className={styles.btn}>
                  Confirm
                </button>
              </div>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Transfer;
