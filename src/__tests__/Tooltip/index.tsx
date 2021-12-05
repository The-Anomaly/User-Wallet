import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Tip, { TipProps } from "Components/Tooltip";

export function renderTip(props: Partial<TipProps> = {}) {
  const defaultProps: TipProps = { amount: 0 };
  return render(<Tip {...defaultProps} {...props} />);
}

describe("<Tip />", () => {
  test("should display actual wallet balance", () => {
    const { queryByTestId } = renderTip({
      amount: 15489,
    });

    const balance = queryByTestId("actual-balance");
    const tip = queryByTestId("tip");

    expect(tip).toBeInTheDocument();
    expect(balance).toHaveTextContent(/15,489/);
  });
});
