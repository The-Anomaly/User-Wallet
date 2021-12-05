import { history } from "Utils/Types/history";
import { users } from "Utils/Types/users";

export const mockedSelf: users = {
  id: "abc",
  fname: "Test",
  lname: "User",
  walletBalance: 12_344,
};

export const mockedFriends: users[] = [
  {
    id: "abc",
    fname: "Abigail",
    lname: "User",
    walletBalance: 10_314,
  },
  {
    id: "abc",
    fname: "Babajide",
    lname: "User",
    walletBalance: 31_339,
  },
  {
    id: "abc",
    fname: "Catharine",
    lname: "User",
    walletBalance: 98_115,
  },
];

export const mockedRecent: history[] = [
  {
    name: "Dada User",
    dollarAmount: 200,
    currencyAmount: 300,
    currency: "EUR",
  },
  {
    name: "Elizabeth User",
    dollarAmount: 1000,
    currencyAmount: 1000,
    currency: "USD",
  },
];
