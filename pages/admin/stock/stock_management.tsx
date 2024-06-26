import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { BASE_URL } from "../../../config/db_prod_checker";
import { createTheme } from "@mui/material/styles";
import LayoutHeader from "../../../components/layout_header";
import { Grid, Tab, Tabs, TextField } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import StockPriceListTable from "../../../components/admin/stock/stock_price_list_table";
import MLPriceListTable from "../../../components/admin/stock/ml_price_list_table";
import Head from "next/head";

const theme = createTheme();

export default function Page() {
  function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = () => {
    setActiveStep(activeStep + 1);
    console.log("button pressed");
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <LayoutHeader>
      <Head>
        <title>Stocks Configuration</title>
      </Head>
      <Container maxWidth="xl">
        {/* <Box style={{marginTop: "5.5em"}}/> */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "#cfe8fc",

            marginTop: "5.5em",
            marginBottom: "5em",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Stock Management</h1>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Stock Price List" style={styles.tab_styling} />
            <Tab label="ML Price List" style={styles.tab_styling} />
          </Tabs>
          <TabContext value={value.toString()}>
            <TabPanel value="0">
              <StockPriceListTable />
            </TabPanel>
            <TabPanel value="1">
              <MLPriceListTable />
            </TabPanel>
          </TabContext>
        </Box>

        {/* <Box style={{marginBottom: "7.5em"}}/> */}
      </Container>
    </LayoutHeader>
  );
}

const styles = {
  tab_styling: {
    fontSize: "16px",
  },
};
