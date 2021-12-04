import * as React from "react";
import { Modal } from "react-bootstrap";
import styles from "./styles.module.css";
import success from "../../assets/vectors/success.svg";
interface TransferProps {
  show: boolean;
  closeModal: () => void;
}

const Transfer: React.FC<TransferProps> = ({ show, closeModal }) => {
  return (
    <>
      <Modal className={styles.transfer} show={show} onHide={closeModal}>
        <Modal.Body>
          <img className={styles.img} src={success} alt="shake hands" />
          <p className={styles.txt}>Transfer successful!</p>
          <button onClick={closeModal} className={styles.btn}>Close</button>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default Transfer;
