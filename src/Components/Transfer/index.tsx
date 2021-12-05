import * as React from "react";
import { Modal } from "react-bootstrap";
import styles from "./styles.module.css";
import Select, { SingleValue } from "react-select";
import { users } from "Utils/Types/users";
import { history } from "Utils/Types/history";

interface TransferProps {
  show: boolean;
  closeModal: () => void;
  friend?: users;
  self: users | undefined;
  recipientOptions: optionType[];
  onChangeCurrency: (x: string) => void;
  onChangeBalance: (x: number) => void;
  convertCurrency: (amount: number, currencyTo: string) => number;
  balanceLeft: (amount: number) => number;
  sendAndUpdate: (transaction: history) => void;
  showSuccess: (x: boolean) => void;
}

export interface optionType {
  value: string;
  label: string;
}

export const initialState: optionType = {
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
  recipientOptions,
  onChangeCurrency,
  onChangeBalance,
  convertCurrency,
  balanceLeft,
  sendAndUpdate,
  showSuccess,
}) => {
  const [currency, setCurrency] = React.useState(initialState);
  const [recipient, setRecipient] = React.useState(initialState);
  const [amount, setAmount] = React.useState<string>("");
  const [convertedAmount, setConvertedAmount] = React.useState<number>(0);
  const [balance, setBalance] = React.useState<number>(0);
  const [confirm, setConfirm] = React.useState<boolean>(false);

  const handleChangeCurrency = (val: SingleValue<optionType>) => {
    if (val) {
      setCurrency(val);
      onChangeCurrency(val?.value);
    }
  };

  const handleChangeRecipient = (val: SingleValue<optionType>) => {
    if (val) {
      setRecipient(val);
    }
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAmount(value);
    onChangeBalance(balanceLeft(parseInt(value)));
    setConvertedAmount(convertCurrency(parseInt(value), currency.value));
    setBalance(balanceLeft(parseInt(value)));
  };

  React.useEffect(() => {
    if (self) {
      setBalance(self.walletBalance);
    }
  }, [self]);

  React.useEffect(() => {
    setAmount("");
    setConvertedAmount(0);
  }, [currency.value]);

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
    let transaction: history = {
        name: recipient.value,
        dollarAmount: convertedAmount,
        currencyAmount: amount,
        currency: currency.value
    }
    sendAndUpdate(transaction);
    setConfirm(false);
    setCurrency(initialState);
    setRecipient(initialState);
    setAmount("");
    setConvertedAmount(0);
    closeModal();
    return showSuccess(true);
  };

  return (
    <>
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
                    className={balance < 0 ? styles.red : ""}
                  />
                  {currency?.value === "USD" && (
                    <p className={styles.note}>
                      Balance left: {balance < 0 ? 0 : balance}
                    </p>
                  )}
                </div>
              ) : (
                ""
              )}
              {currency.value && currency?.value !== "USD" ? (
                <div className={styles.inputWrap}>
                  <label>Amount in USD</label>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={convertedAmount === 0 ? "" : convertedAmount}
                    readOnly
                  />
                  <p className={styles.note}>
                    Balance left: {balance > convertedAmount ? balance : 0}
                  </p>
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
              <button
                disabled={
                  balance < 0 || !recipient.value || !currency.value || !amount
                }
                onClick={send}
                className={styles.btn}
              >
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
              {currency.value !== "USD" && (
                <div className={styles.inputWrap}>
                  <label>Amount in {currency.value}</label>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    readOnly
                  />
                </div>
              )}
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
