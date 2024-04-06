import Link from "next/link";
import styles from "./footer.module.css";
import { useSession } from "next-auth/react";
import SuperUserAuth from "../auth/SuperUserAuth";
import { useEffect, useState } from "react";

export default function Footer() {
  const { data: session, status } = useSession();
  const [display, setDisplay] = useState<boolean>(false);

  useEffect(() => {
    validateUser(status);
  }, []);

  //superuser logic
  const validateUser = async (status) => {
    let userID: string;
    if (status == "authenticated") {
      userID = session.id.toString();
    }

    //console.log(userID);
    const res = await fetch(`/api/superuser/get_all_superuser`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      //const message = data.message;
      const values = data.result;
      if (values !== null) return;

      for (var i = 0; i < values.length; i++) {
        let user = values[i].userID.toString();
        //console.log(user);
        if (user == userID) {
          console.log("superuser detected");
          setDisplay(true);
          break;
        }
      }
      //console.log(userID);
    });
  };

  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="https://github.com/algotuno/algotuno_web3">GitHub</a>
        </li>
        {display ? (
          <li className={styles.navItem}>
            <Link href="/admin/main">
              <a>Admin Portal</a>
            </Link>
          </li>
        ) : (
          <></>
        )}
        {/* {session ? (
          <li className={styles.navItem}>
            <Link href="/account/user_settings">
              <a>Settings</a>
            </Link>
          </li>
        ) : (
          <></>
        )} */}
        <li className={styles.navItem}>
          <span>Algotuno® 2022. All Rights Reserved</span>
        </li>
      </ul>
    </footer>
  );
}
