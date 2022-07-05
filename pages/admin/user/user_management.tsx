import {Box, Container, Tab, Tabs} from "@mui/material";
import {TabContext, TabPanel} from "@mui/lab";
import * as React from "react";
import LayoutHeader from "../../../components/layout_header";

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
            <Container maxWidth="xl">
                <Box style={{marginTop: "7.5em"}}/>


                <Box sx={{width: '100%', bgcolor: '#cfe8fc', height: '80vh'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Super User" style={styles.tab_styling}/>
                        <Tab label="Basic User" style={styles.tab_styling}/>
                    </Tabs>

                    <TabContext value={value.toString()}>
                        {/* navigation 1 */}
                        <TabPanel value="0">
                            Item One
                        </TabPanel>
                        {/* navigation 1 */}
                        <TabPanel value="1">
                            Item Two
                        </TabPanel>
                    </TabContext>
                </Box>

                <Box style={{marginBottom: "7.5em"}}/>
            </Container>
        </LayoutHeader>
    );
}

const styles = {
    tab_styling: {
        fontSize: "16px",
    }
};