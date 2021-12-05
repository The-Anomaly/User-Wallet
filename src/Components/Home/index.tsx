import * as React from "react";
import styles from "./styles.module.css";
import empty from "../../assets/vectors/empty.svg";
import gift from "assets/vectors/gifting.svg";
import moneyBag from "assets/icons/money-bag.png";
import user from "assets/icons/user.png";
import Tip from "Components/Tooltip";
import { users } from "Utils/Types/users";
import { history } from "Utils/Types/history";

export interface HomeProps {
  friends: users[];
  self: users | undefined;
  onChangeFriend: (friend: users | undefined) => void;
  recentTransactions: history[];
}

const HomeUI: React.FC<HomeProps> = ({
  friends,
  self,
  onChangeFriend,
  recentTransactions,
}) => {
  const roundBalance = (amount: number) => {
    return Math.floor(amount / 1000);
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
        <div data-testid="wallet" className={styles.container}>
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
                <h1 className={styles.title} data-testid="username">
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
                  <span className={styles.label}>Total balance:</span>
                  <span data-testid="balance">
                    ${roundBalance(self?.walletBalance)}k
                  </span>
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
                    <div
                      data-testid="friends"
                      key={index}
                      className={styles.friend}
                    >
                      <div className={styles.userWrap}>
                        <img src={user} alt="search user" />{" "}
                        <p data-testid="friend-name">
                          {item.fname} {item.lname}
                        </p>
                      </div>
                      <button
                        data-testid="friend-send"
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
                Can't find your intended recipient above? Try here
              </h2>
              <button data-testid="alternative-send" onClick={sendFunds}>
                Send funds
              </button>
            </section>
          </section>
          <aside className={styles.sectionThree}>
            <h3 className={styles.historyTtl}>Recent Transactions</h3>
            {recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.map((item, index) => (
                <div
                  data-testid="recent-transactions"
                  key={index}
                  className={styles.historyItem}
                >
                  <p data-testid="recent-name" className={styles.historyTxt1}>{item.name}</p>
                  <div>
                    <p data-testid="recent-dollarAmount" className={styles.historyTxt2}>-${item.dollarAmount}</p>
                    <p data-testid="recent-currencyAmount" className={styles.historyTxt3}>
                      {item.currency} {item.currencyAmount}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.historyEmpty}>
                <img data-testid="recent-img" src={empty} alt="empty" />

                <p>You have no recent transactions</p>
                <button data-testid="recent-send" onClick={sendFunds}>
                  Send funds
                </button>
              </div>
            )}
            {/* <div className={styles.historyItem}>
              <p className={styles.historyTxt1} >Name</p> 
              <div>
                <p className={styles.historyTxt2} >-$4000</p>
                <p className={styles.historyTxt3} >NGN 2333</p>
              </div>
            </div> */}
          </aside>
        </div>
      )}
      <div>
        {/* Attribution Links */}
        {/* <a href="https://www.streamlinehq.com">Free Money Bag PNG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Currency Exchange SVG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Gifting Online Gifting SVG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Search User 1 PNG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Business Deal SVG illustration by Streamline</a> */}
        {/* <a href="https://www.streamlinehq.com">Free Currency Exchange SVG illustration by Streamline</a> */}
      </div>
    </>
  );
};

export default HomeUI;
