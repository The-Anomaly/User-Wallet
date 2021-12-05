import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { users } from "Utils/Types/users";
import Home from "./Pages/Home";

const App = () => {
  const userList: users[] = [
    {
      id: "abc",
      fname: "John",
      lname: "Doe",
      walletBalance: 51243,
    },
    {
      id: "def",
      fname: "Marilyn",
      lname: "Monroe",
      walletBalance: 31851,
    },
    {
      id: "ghi",
      fname: "Jason",
      lname: "Statam",
      walletBalance: 15000,
    },
    {
      id: "jkl",
      fname: "Musa",
      lname: "Oni",
      walletBalance: 12311,
    },
    {
      id: "mno",
      fname: "Tunde",
      lname: "Badmus",
      walletBalance: 135850,
    },
    {
      id: "pqr",
      fname: "Yemisi",
      lname: "Williams",
      walletBalance: 85850,
    },
    {
      id: "stu",
      fname: "Chiamaka",
      lname: "Ezekwesili",
      walletBalance: 25800,
    },
    {
      id: "vwx",
      fname: "Janet",
      lname: "Jackson",
      walletBalance: 150041,
    },
    {
      id: "yz",
      fname: "Joe",
      lname: "Biden",
      walletBalance: 850,
    },
  ];

  React.useEffect(() => {
    let users = localStorage.getItem("users");
    // localStorage.setItem("users", JSON.stringify(userList));
    if (!users) {
      localStorage.setItem("users", JSON.stringify(userList));
    } else {
      console.log(JSON.parse(users));
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};
export default App;
