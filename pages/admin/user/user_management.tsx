import { Box, Container, Tab, Tabs } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import * as React from "react";
import LayoutHeader from "../../../components/layout_header";
import SuperUserTable from "../../../components/admin/user/super_user_table";
import BasicUserTable from "../../../components/admin/user/basic_user_table";
import Head from "next/head";

export default function Page() {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <LayoutHeader>
      <Head>
        <title>User Management</title>
      </Head>
      <Container maxWidth="xl">
        <Box
          sx={{
            width: "100%",
            bgcolor: "#cfe8fc",

            marginTop: "5.5em",
            marginBottom: "5em",
          }}
        >
          <h1 style={{ textAlign: "center" }}>User Management</h1>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Super User" style={styles.tab_styling} />
            <Tab label="Basic User" style={styles.tab_styling} />
          </Tabs>

          <TabContext value={value.toString()}>
            {/* navigation 1 */}
            <TabPanel value="0">
              <SuperUserTable />
            </TabPanel>
            {/* navigation 1 */}
            <TabPanel value="1">
              <BasicUserTable />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
    </LayoutHeader>
  );
}

const styles = {
  tab_styling: {
    fontSize: "16px",
  },
};
