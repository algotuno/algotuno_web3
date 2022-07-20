import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import Review from './Review';

const steps = ['Shipping address', 'Payment details', 'Review your order'];
let price:number=0;

function getStepContent(step: number,sID:number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review sub={sID}/>;
    default:
      throw new Error('Unknown step');
  }
}

const theme = createTheme();

const postreq=(uid,sid)=>{
  return{
    "user_id" : 	uid,
    "subscription_plan_id"	: sid
  }
};

export default function Checkout(props) {
  
  const data = props.uID;
  const sID = parseInt(data.sID);
  const uID = data.uID;

  const [activeStep, setActiveStep] = React.useState(0);
 
  

  console.log(sID);
  if(sID === 5){
    price= 59;
  }
  else if(sID === 6){
    price=99;
  };

console.log(price);
  const handleNext = () => {
    setActiveStep(activeStep + 1);
    
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit=()=>{
     upgradeSubscription(uID,sID);
  };
  
  const upgradeSubscription = async (userID:string,sID:number) => {
        
    // const stocks:string= JSON.stringify(selected);
     
     
     const res = await fetch(`/api/subscription/update_user_subscription`, {
         method : 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(postreq(userID,sID))
     })
     .then(async res => {
       const data = await res.json();
       const message = data.message;
       return message;
     })
     .then(message => {
       console.log(message);
     })
     setTimeout(() => {
      document.location.href = '/account/user_settings';

  }, 4000);

 };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4, mt:12 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              
              <React.Fragment>
                {handleSubmit()}
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Purchase Successful.
                  Redirecting to the main page...
                </Typography>

              </React.Fragment>
              
            ) : (
              <React.Fragment>
                {getStepContent(activeStep,sID)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
            
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}