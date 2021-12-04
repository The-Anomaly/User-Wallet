import * as React from "react";
import styles from "./styles.module.css";

interface TipProps {
    amount: number
}

const Tip:React.FC<TipProps> = ({amount}) => {
  return (
    <>
      <div className={styles.body}>Your actual balance is <span>${amount.toLocaleString()}</span></div>
    </>
  );
};

export default Tip;
