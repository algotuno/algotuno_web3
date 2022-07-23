import Link from "next/link"
import {signOut, useSession} from "next-auth/react"
import styles from "./header.module.css"
import Router from "next/router";


export default function HeaderUser() {
    const {data: session, status} = useSession();
    const loading = status === "loading";
    const buttonSize = {"height": "4em", "width": "7em"};
    
    const signOutAndRedirect = async () => {
        await Router.push('/').then(async () => {
            
            await signOut();
        });
    };

    return (
        <header>
            <div className={styles.navbar}>
                <span className={styles.logo}>algotuno.io</span>
                <nav>
                    <ul className={styles.navItems}>
                        <li className={styles.navItem}>
                            <Link href="/main">
                                <a>Dashboard</a>
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link href="/charts">
                                <a>Markets</a>
                            </Link>
                        </li>
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
                        <li className={styles.navItem}>
                            <Link href="/about">
                                <a>Settings</a>
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
}