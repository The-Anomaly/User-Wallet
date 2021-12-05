import * as React from "react";
import Transfer, { optionType } from "Components/Transfer";
import { users } from "Utils/Types/users";
import HomeUI from "Components/Home";
import axios from "axios";
import Success from "Components/Success";

const Home = () => {
  const [send, setSend] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<users[]>([]);
  const [friend, setFriend] = React.useState<users>();
  const [self, setSelf] = React.useState<users>();

  const users = localStorage.getItem("users");
  React.useEffect(() => {
    if (users) {
      setFriends(JSON.parse(users).slice(1, 4));
      setSelf(JSON.parse(users)[0]);
    }
  }, [users]);

  const sendFunds = (x: users | undefined) => {
    setSend(true);
    setFriend(x);
  };

  //

  const [currency, setCurrency] = React.useState("");
  const [rates, setRates] = React.useState({
    USD: 0,
    NGN: 0,
    EUR: 0,
  });

  const [balance, setBalance] = React.useState<number>(0);
  const [recipientOptions, setRecipientOptions] = React.useState<optionType[]>(
    []
  );
  const [success, setSuccess] = React.useState<boolean>(false);


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
      let ray: optionType[] = [];
      list.map((item: users) => {
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
      balance = self.walletBalance - convertCurrency(amount, currency);
      //   balance = self.walletBalance - convertedAmount;
    }
    return balance;
  };

  const sendAndUpdate = () => {
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
  };

  return (
    <>
    <Success show={success} closeModal={() => setSuccess(false)} />
      <Transfer
        show={send}
        closeModal={() => setSend(false)}
        friend={friend}
        self={self}
        recipientOptions={recipientOptions}
        onChangeCurrency={(x: string) => setCurrency(x)}
        onChangeBalance={(x: number) => setBalance(x)}
        convertCurrency={convertCurrency}
        balanceLeft={balanceLeft}
        sendAndUpdate={sendAndUpdate}
        showSuccess={(x: boolean) => setSuccess(x)}
      />
      <HomeUI
        friends={friends}
        self={self}
        onChangeFriend={(x) => sendFunds(x)}
      />
    </>
  );
};

export default Home;
