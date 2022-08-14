import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import styles from "./header.module.css";
import Router from "next/router";
import { Button, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const buttonSize = { height: "4em", width: "8em" };
  let email;
  if (status === "authenticated") {
    email = session.user.email;
  }
  const signOutAndRedirect = async () => {
    await Router.push("/");
    await signOut();
  };

  return (
    <header>
      <div className={styles.navbar}>
        <span
          className={styles.logo}
          onClick={() =>
            session
              ? (document.location.href = "/main")
              : (document.location.href = "/")
          }
          style={{ cursor: "pointer" }}
        >
          algotuno.io
        </span>
        <nav>
          <ul className={styles.navItems}>
            {session ? (
              <li className={styles.navItem}>
                <a style={{ color: "grey", fontSize: 14 }}>&#128100;{email}</a>
              </li>
            ) : (
              <></>
            )}
            {session ? (
              <li className={styles.navItem}>
                <Link href="/main">
                  <a>Dashboard</a>
                </Link>
              </li>
            ) : (
              <></>
            )}
            {session ? (
              <li className={styles.navItem}>
                <Link href="/charts">
                  <a>Markets</a>
                </Link>
              </li>
            ) : (
              <></>
            )}
            <li className={styles.navItem}>
              <Link href="/pricing">
                <a>Pricing</a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about">
                <a>About Us</a>
              </Link>
            </li>

            {session ? (
              <li className={styles.navItem}>
                <Link href="/account/user_settings">
                  <a>Settings</a>
                </Link>
              </li>
            ) : (
              <></>
            )}
            {session ? (
              <li className={styles.navItem}>
                <a
                  onClick={() => signOutAndRedirect()}
                  style={{ cursor: "pointer" }}
                >
                  Log Out
                </a>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
