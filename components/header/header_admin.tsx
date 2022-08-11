import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./header.module.css";
import Router from "next/router";

export default function HeaderAdmin() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const buttonSize = { height: "4em", width: "7em" };
  //comment
  const signOutAndRedirect = async () => {
    await Router.push("/").then(async () => {
      ///this is test comment
      await signOut();
    });
  };

  return (
    <header>
      <div className={styles.navbar}>
        <span className={styles.logo}>algotuno.io [Admin Portal]</span>
        <nav>
          <ul className={styles.navItems}>
            <li className={styles.navItem}>
              <Link href="/admin/main">
                <a>Dashboard</a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/admin/stock/stock_management">
                <a>Stock Management</a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/admin/user/user_management">
                <a>User Management</a>
              </Link>
            </li>
            {/* <li className={styles.navItem}>
                            <Link href="/admin/settings/settings_management">
                                <a>Settings</a>
                            </Link>
                        </li> */}
            <li className={styles.navItem}>
              <Link href="/main">
                <a>Back to Main Page</a>
              </Link>
            </li>
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
