import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import HeaderAdmin from "./header/header_admin";
import * as React from "react";
import HeaderUser from './header/header_user';


export function LayoutAdmin({children}) {
    return (
        <>
            <HeaderAdmin/>
            <main>
                {children}
            </main>
            <Footer/>
        </>
    )
}

export function LayoutUser({children}) {
    return (
        <>
            <HeaderUser/>
            <main>
                {children}
            </main>
            <Footer/>
        </>
    )
}