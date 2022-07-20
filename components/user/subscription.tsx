import * as React from 'react';
import { useEffect, useState } from 'react';
import axios_api from '../../config/axios_api';
import {
    Alert,
    Box,
    Button, Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    LinearProgress,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import AlertComponent from '../alert/alert_message';
import { AlignHorizontalCenter } from '@mui/icons-material';

let userID = "cl5kx0w9y0004ysv692x34doo";
let sID = 5;

const postreq=(userID,sID)=>{
    return{
      "user_id" : 	userID,
      "subscription_plan_id"	: sID
    }
  };

export default function DataGridDemo() {
    const [rows,setRows] = useState([]);  
    const [sub,setSub] = useState<string>();
    const [price,setPrice] = useState<number>();
    const [loading,setLoading]= useState<boolean>();
    const [userData,setUserData] = useState([]); 
    const [display, setDisplay] = useState<boolean>(false);
    const [status, setStatus] = useState<boolean>(null);
    const [message, setMessage] = useState("");
    
    const fetchSubscription = async () => {
        setLoading(true);
        const  {data} = await axios_api.get('/api/user/get_all_user');

        data.result.map((e)=>{
            if(e.id == userID){
                
                const subscription = e.Subscription[0].Subscription_Plan.planName;
                const cost =  e.Subscription[0].Subscription_Plan.price;
                setPrice(cost);
                setSub(subscription.toString());
                setUserData(e);

            }
        })
        setLoading(false);
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
         setDisplay(true);
         setMessage(message);
         setStatus(true);
            
           //sto(true);
           //setIsLoading(false);
         })
         setTimeout(() => {
             setStatus(null);
             setMessage("timed out");
             setDisplay(false);
             fetchSubscription();
         }, 2000);
     };
      useEffect(() => {
        fetchSubscription();

      }, []);

      let probutton:boolean;
      let fullbutton:boolean;

      (sub == "Pro"? probutton=true:probutton=false);

      (sub == "Full"? fullbutton=true:fullbutton=false);

  return (
    <div>
    <AlertComponent display={display} status={status} message={message} />
     <br />
    <Paper>
    <Box sx={{ height: 200, width: '100%' }}>
     
      <TableContainer style={{maxHeight:400}}>
                    {loading ? (
                    <LinearProgress style={{ backgroundColor: "black" }} />
                     ) : (
                        <Table style={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell align="left">Email</TableCell>
                                    <TableCell align="left">Subscription</TableCell>
                                    <TableCell align="left">Cost</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                  
                                <TableRow >
                                
                                <TableCell component="th" scope="row">
                                    {/*@ts-ignore */}
                                    {userData.username}
                                </TableCell>
                                {/*@ts-ignore */}
                                <TableCell align="left">{userData.email}</TableCell>
                                <TableCell align="left">{sub}</TableCell>
                                <TableCell align="left">${price} per month</TableCell>
                                    </TableRow> 
                           
                            </TableBody>
                        </Table>
                     )}
                    </TableContainer>
      <Grid container 
            spacing={12} 
            style={{ padding:5 } }
            
            alignItems="center"
            justifyContent="center">
        {/* Button Upgrade to Pro */}
        <Grid item xs={2} mt="10px"  >
            {/* <Button disabled={probutton} onClick={()=>{upgradeSubscription(userID,5)}}>Upgrade to Pro</Button> */}
            {/* document.location.href = `/stockpage?tickerSymbol=${row.tickerSymbol}&exchange=${row.exchange}` */}
            <Button disabled={probutton}
                variant='contained' 
                onClick={()=>document.location.href = `/checkout?uID=${userID}&sID=${5}`}>
                Upgrade to Pro
            </Button>
        </Grid>
        {/* Button Upgrade to Full Access */}
        <Grid item xs={2} alignContent="center">
        {/* <Button disabled={fullbutton} onClick={()=>{}}>Upgrade to Full Access</Button> */}
        <Button disabled={fullbutton} 
            variant='contained'
            onClick={()=>document.location.href = `/checkout?uID=${userID}&sID=${6}`}>
            Upgrade to Full Access
        </Button>
            {/* <AddUserBar setSearchQuery={val=>requestSearch(val)}  /> */}
        </Grid>
        </Grid>
    </Box>
    </Paper>
    </div>
  );
}
