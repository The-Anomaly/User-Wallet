import * as React from "react";
import styles from "./styles.module.css";

export interface TipProps {
  amount: number;
}

const Tip: React.FC<TipProps> = ({ amount }) => {
  return (
    <>
      <div data-testid="tip" className={styles.body}>
        Your actual balance is <span data-testid="actual-balance">${amount.toLocaleString()}</span>
      </div>
    </>
  );
};

export default Tip;
