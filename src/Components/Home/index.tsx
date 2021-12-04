import * as React from "react";
import styles from "./styles.module.css";
import wallet from "../../assets/vectors/wallet.svg";
import gift from "../../assets/vectors/gifting.svg";
import moneyBag from "../../assets/icons/money-bag.png";
import user from "../../assets/icons/user.png";
import Tip from "../Tooltip";
import Transfer from "../Transfer";
import { users } from "Utils/Types/users";

interface HomeProps {
  friends: users[];
  self: users | undefined;
  onChangeFriend: (friend: users | undefined) => void;
}

const HomeUI: React.FC<HomeProps> = ({ friends, self, onChangeFriend }) => {
  const roundBalance = (amount: number) => {
    let num = Math.floor(amount / 1000) * 1000;
    return String(num).replaceAll("0", "");
  };

  const sendToFriend = (index: number) => {
    onChangeFriend(friends[index]);
  };

  const sendFunds = () => {
    onChangeFriend(undefined);
  };
  
  return (
    <>
      {self && (
        <div className={styles.container}>
          <aside className={styles.sectionOne}>
            <div className={styles.profileWrap}>
              <div className={styles.ball}></div>
              <p className={styles.initials}>KW.</p>
            </div>
          </aside>
          <section className={styles.sectionTwo}>
            <section className={styles.heroWrap}>
              <img className={styles.gift} src={gift} alt="gifting" />
              <div>
                <h1 className={styles.title}>
                  Hey {self?.fname + " " + self?.lname} <span>👋🏽</span>
                </h1>
                <p className={styles.txt}>
                  You're steps away from putting a smile on the faces of your
                  friends. <br />
                  Send someone some money today!
                </p>
              </div>
            </section>

            <section className={styles.balanceWrap}>
              <div className={styles.balance}>
                <p className={styles.value}>
                  <span className={styles.label}>Total balance:</span>$
                  {roundBalance(self?.walletBalance)}k
                </p>

                <img src={moneyBag} alt="money bag" />
                <div className={styles.tip}>
                  !
                  <div className={styles.tipWrap}>
                    <Tip amount={self?.walletBalance ?? 0} />
                  </div>
                </div>
              </div>
            </section>
            <img className={styles.giftMobile} src={gift} alt="gifting" />
            <section className={styles.friendsContainer}>
              <h2 className={styles.title2}>See a friend below? Send funds!</h2>
              <p className={styles.txt2}>
                Don't want to search through a long list? We've curated a list
                of your top friends to make transfering money easier
              </p>
              <div className={styles.friendsWrapper}>
                {friends &&
                  friends.length > 0 &&
                  friends.map((item, index) => (
                    <div key={index} className={styles.friend}>
                      <div className={styles.userWrap}>
                        <img src={user} alt="search user" />{" "}
                        <p>
                          {item.fname} {item.lname}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          sendToFriend(index);
                        }}
                      >
                        Send funds
                      </button>
                    </div>
                  ))}
              </div>
            </section>
            <section className={styles.sendWrap}>
              <h2 className={styles.title3}>
                Can't find your intended recipient not above? Try here
              </h2>
              <button onClick={sendFunds}>Send funds</button>
            </section>
          </section>
          {/* <aside className={styles.sectionThree}>
            Transfer History
            <img src={wallet} />
          </aside> */}
        </div>
      )}
      <div>
        {/* <a href="https://www.streamlinehq.com">Free Money Bag PNG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Currency Exchange SVG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Gifting Online Gifting SVG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Search User 1 PNG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Business Deal SVG illustration by Streamline</a> */}
      </div>
    </>
  );
};

export default HomeUI;
