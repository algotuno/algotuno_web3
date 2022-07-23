// pages/index.tsx
import Layout from "../components/layout";
import * as React from "react";
import loadable from "@loadable/component";
import Head from "next/head";
import { TickerTapeComponent } from "../components/index/TickerTape";
import { Container } from "@mui/material";
import BasicUserAuth from "../components/auth/BasicUserAuth";

const StocksList = loadable(() => import("../components/index/Table"));

export default function Page(props) {
  return (
    <Layout>
      <Head>
        <title>Home</title>
      </Head>

      <Container style={{ marginTop: "5.5em" }}>
        <TickerTapeComponent />
      </Container>

      <Container style={{ minHeight: "30em" }}>
        <StocksList />
      </Container>
    </Layout>
  );
}
