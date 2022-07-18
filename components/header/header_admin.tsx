import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"


export default function HeaderAdmin() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const buttonSize = { "height" : "4em" , "width" : "8em" };

<<<<<<< .merge_file_a16880
    const signOutAndRedirect = async () => {
        await Router.push('/').then(async () => {
            await signOut();
        });
    };

    return (
        <header>
            <div className={styles.navbar}>
                <span className={styles.logo}>algotuno.io [ Admin Portal ]</span>
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
                        <li className={styles.navItem}>
                            <Link href="/admin/settings/settings_management">
                                <a>Settings</a>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/main">
                                <a>Back to Main Page</a>
                            </Link>
                        </li>
                        {session ? (
                            <li className={styles.navItem}>
                                <a onClick={() => signOutAndRedirect()}><b>Log Out</b></a>
                            </li>
                        ) : <></>}
                    </ul>
                </nav>
            </div>
        </header>
    )
=======
  return (
    <header>
      <div className={styles.navbar}>
        <span className={styles.logo}>algotuno.io [ Admin Portal ]</span>
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
            <li className={styles.navItem}>
              <Link href="/">
                <a>Back to Home</a>
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/logout">
                <a>Log Out</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
>>>>>>> .merge_file_a33528
}
