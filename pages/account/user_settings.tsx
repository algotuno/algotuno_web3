import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { createTheme } from "@mui/material/styles";
import { Grid, Tab, Tabs, TextField } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import EnhancedTable from "../../components/user/subscription";
import StockPriceListTable from "../../components/user/stockconfig";
import Layout from "../../components/layout";
import BasicUserAuth from "../../components/auth/BasicUserAuth";

const theme = createTheme();

export default function Page() {
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
    <Layout>
      <Container maxWidth="xl">
        <Head>
          <title>Settings</title>
        </Head>

        <BasicUserAuth>
          <Box
            sx={{
              width: "100%",
              bgcolor: "#cfe8fc",

              marginTop: "5.5em",
              marginBottom: "5em",
            }}
          >
            <h1 style={{ textAlign: "center" }}>User Settings</h1>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Stock Configuration" style={styles.tab_styling} />
              <Tab label="Subscription management" style={styles.tab_styling} />
            </Tabs>
            <TabContext value={value.toString()}>
              <TabPanel value="0">
                <StockPriceListTable />
              </TabPanel>
              <TabPanel value="1">
                <EnhancedTable />
              </TabPanel>
            </TabContext>
          </Box>
        </BasicUserAuth>
      </Container>
    </Layout>
  );
}

const styles = {
  tab_styling: {
    fontSize: "16px",
  },
};
