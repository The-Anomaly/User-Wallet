import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeUI, { HomeProps } from "Components/Home";
import "@testing-library/jest-dom/extend-expect";
import { mockedFriends, mockedRecent, mockedSelf } from "Utils/MockData";

export function renderHome(props: Partial<HomeProps> = {}) {
  const defaultProps: HomeProps = {
    friends: [],
    self: undefined,
    onChangeFriend() {
      return;
    },
    recentTransactions: [],
    reset() {
      return;
    },
  };
  return render(<HomeUI {...defaultProps} {...props} />);
}

describe("<Home />", () => {
  test("should display empty page if `self` is undefined", () => {
    const { queryByTestId } = renderHome({
      self: undefined,
    });

    const walletContainer = queryByTestId("wallet");

    expect(walletContainer).not.toBeInTheDocument();
  });

  test("should display page with user name and compact balance when `self` is defined", () => {
    const { queryByTestId } = renderHome({
      self: mockedSelf,
    });

    const walletContainer = queryByTestId("wallet");
    const username = queryByTestId("username");
    const balance = queryByTestId("balance");

    expect(walletContainer).toBeInTheDocument();
    expect(username).toHaveTextContent(/Test User/);
    expect(balance).toHaveTextContent(/12k/);
  });

  test("should display list of friends each with a `send funds` button to pre-select the friend as a recipient", () => {
    const onChangeFriend = jest.fn();
    const { queryAllByTestId } = renderHome({
      self: mockedSelf,
      friends: mockedFriends,
      onChangeFriend,
    });

    const friends = queryAllByTestId("friends");
    const name = queryAllByTestId("friend-name");
    const sendBtn = queryAllByTestId("friend-send");

    userEvent.click(sendBtn[0]);

    expect(friends[0]).toBeInTheDocument();
    expect(name[0]).toHaveTextContent("Abigail User");
    expect(onChangeFriend).toHaveBeenCalled();
  });

  test("should display button to send funds without pre-selecting a friend as a recipient", async () => {
    const onChangeFriend = jest.fn();
    const { findByTestId } = renderHome({
      self: mockedSelf,
      friends: mockedFriends,
      onChangeFriend,
    });

    const sendBtn = await findByTestId("alternative-send");

    userEvent.click(sendBtn);

    expect(onChangeFriend).toHaveBeenCalled();
  });

  test("should display empty state when there are no recent transactions and a `send funds` button ", async () => {
    const onChangeFriend = jest.fn();
    const { findByTestId, findByText, queryByTestId } = renderHome({
      self: mockedSelf,
      friends: mockedFriends,
      onChangeFriend,
      recentTransactions: [],
    });

    const recentContainer = await queryByTestId("recent-transactions");
    const sendBtn = await findByTestId("recent-send");
    const emptyImage = await findByTestId("recent-img");
    const text = await findByText("You have no recent transactions");

    userEvent.click(sendBtn);

    expect(recentContainer).not.toBeInTheDocument();
    expect(emptyImage).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(onChangeFriend).toHaveBeenCalled();
  });

  test("should display list of recent transactions", async () => {
    const { queryAllByTestId } = renderHome({
      self: mockedSelf,
      friends: mockedFriends,
      recentTransactions: mockedRecent,
    });

    const recentContainer = await queryAllByTestId("recent-transactions");
    const name = await queryAllByTestId("recent-name");
    const dollarAmount = await queryAllByTestId("recent-dollarAmount");
    const currencyAmount = await queryAllByTestId("recent-currencyAmount");

    expect(recentContainer[0]).toBeInTheDocument();
    expect(name[0]).toHaveTextContent(/Dada/);
    expect(dollarAmount[0]).toHaveTextContent("-$200");
    expect(currencyAmount[0]).toHaveTextContent("EUR 300");

    expect(recentContainer[1]).toBeInTheDocument();
    expect(name[1]).toHaveTextContent(/Elizabeth/);
    expect(dollarAmount[1]).toHaveTextContent("-$1,000");
    expect(currencyAmount[1]).toHaveTextContent("USD 1,000");
  });

  test("should reset all values and clear history when `reset` is clicked", async () => {
    const reset = jest.fn();
    const { findByTestId } = renderHome({
      self: mockedSelf,
      friends: mockedFriends,
      recentTransactions: mockedRecent,
      reset,
    });

    const resetBtn = await findByTestId("reset");

    userEvent.click(resetBtn);

    expect(reset).toHaveBeenCalled();
  });
});
