import Footer from "../components/footer/footer";
import HeaderAdmin from "./header/header_admin";
import * as React from "react";

export default function LayoutHeader({children}) {
    return (
        <span style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
        }}>
          <HeaderAdmin/>
          <main style={{flex: 1}}>{children}</main>
          <Footer/>
        </span>
    );
}
