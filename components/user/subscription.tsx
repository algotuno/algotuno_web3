import * as React from "react";
import { useEffect, useState } from "react";
import axios_api from "../../config/axios_api";
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  LinearProgress,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import AlertComponent from "../alert/alert_message";
import { AlignHorizontalCenter, ContactPage } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import Head from "next/head";

// const { data: session, status } = useSession();

const postreq = (userID, sID) => {
  return {
    user_id: userID,
    subscription_plan_id: sID,
  };
};

export default function DataGridDemo() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState([]);
  const [sub, setSub] = useState<string>();
  const [loading, setLoading] = useState<boolean>();
  const [userData, setUserData] = useState([]);
  const [display, setDisplay] = useState<boolean>(false);
  const [stat, setStatus] = useState<boolean>(null);
  const [message, setMessage] = useState("");

  let userID;

  if (status === "authenticated") {
    userID = session.id;
  } else if (status === "unauthenticated") {
    return <p>Not signed in</p>;
  }

  // const fetchSubscription = async () => {
  //   setLoading(true);
  //   const { data } = await axios_api.get("/api/user/get_all_user");
  //   data.result.map((e) => {
  //     if (e.id == userID) {
  //       const subscription = e.Subscription[0].Subscription_Plan.planName;
  //       const cost = e.Subscription[0].Subscription_Plan.price;
  //       setPrice(cost);
  //       setSub(subscription.toString());
  //       setUserData(e);
  //     }
  //   });

  // };

  const fetchUserDetails = async () => {
    const res = await fetch(`/api/user/get_user_details`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userID,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        const message = data.message;
        const values = data.result;
        //
        const subsc = values.Subscription[0].Subscription_Plan.planName;
        const plan = values.Subscription[0].Subscription_Plan;
        setSub(subsc.toString());
        setUserData(values);
        setSubscription(plan);

        setLoading(false);
        return message;
      })
      .then((message) => {
        setDisplay(true);
        setMessage("Loading completed");
        setStatus(true);
        //console.log(userdata.Subscription);
        //sto(true);
        //setIsLoading(false);
      });
    setTimeout(() => {
      setStatus(null);
      setMessage("timed out");
      setDisplay(false);
    }, 1000);
  };

  const upgradeSubscription = async (userID: string, sID: number) => {
    // const stocks:string= JSON.stringify(selected);

    const res = await fetch(`/api/subscription/update_user_subscription`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postreq(userID, sID)),
    })
      .then(async (res) => {
        const data = await res.json();
        const message = data.message;
        return message;
      })
      .then((message) => {
        setDisplay(true);
        setMessage("Successfully changed Subscription");
        setStatus(true);

        //sto(true);
        //setIsLoading(false);
      });
    setTimeout(() => {
      setStatus(null);
      setMessage("timed out");
      setDisplay(false);
      //fetchSubscription();
      fetchUserDetails();
    }, 2000);
  };
  useEffect(() => {
    //fetchSubscription();
    fetchUserDetails();
  }, []);

  let probutton: boolean;
  let fullbutton: boolean;
  let basicbutton: boolean;
  sub == "Basic" ? (basicbutton = true) : (basicbutton = false);

  sub == "Pro" ? (probutton = true) : (probutton = false);

  sub == "Full" ? (fullbutton = true) : (fullbutton = false);

  const confirmSub = (sID) => {
    document.location.href = `/checkout?uID=${userID}&sID=${sID}`;
  };

  return (
    <div>
      <AlertComponent display={display} status={stat} message={message} />
      <Head>
        <title>Manage Subscription</title>
      </Head>

      <br />
      <Paper>
        <Box sx={{ height: 200, width: "100%" }}>
          <TableContainer style={{ maxHeight: 400 }}>
            {loading ? (
              <LinearProgress style={{ backgroundColor: "black" }} />
            ) : (
              <Table style={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Subscription</TableCell>
                    <TableCell align="left">Watchlist Limit</TableCell>
                    <TableCell align="left">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {/*@ts-ignore */}
                      {userData.username}
                    </TableCell>
                    {/*@ts-ignore */}
                    <TableCell align="left">{userData.email}</TableCell>
                    <TableCell align="left">
                      {subscription["planName"]}
                    </TableCell>
                    <TableCell align="left">
                      {subscription["watchlistLimit"]}
                    </TableCell>
                    <TableCell align="left">
                      ${subscription["price"]} per month
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TableContainer>
          <Grid
            container
            spacing={2}
            style={{ padding: 5 }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={3} mt="8px">
              <h4>Upgrade/Downgrade your plan:</h4>
            </Grid>

            <Grid item xs={2} mt="10px">
              {/* <Button disabled={probutton} onClick={()=>{upgradeSubscription(userID,5)}}>Upgrade to Pro</Button> */}
              {/* document.location.href = `/stockpage?tickerSymbol=${row.tickerSymbol}&exchange=${row.exchange}` */}

              <Button
                disabled={basicbutton}
                variant="contained"
                fullWidth
                onClick={() => {
                  if (window.confirm(confirmMessageBasic))
                    upgradeSubscription(userID.toString(), 4);
                }}
              >
                Basic <br /> $0
              </Button>
            </Grid>
            {/* Button Upgrade to Pro */}
            <Grid item xs={2} mt="10px">
              {/* <Button disabled={probutton} onClick={()=>{upgradeSubscription(userID,5)}}>Upgrade to Pro</Button> */}
              {/* document.location.href = `/stockpage?tickerSymbol=${row.tickerSymbol}&exchange=${row.exchange}` */}
              <Button
                disabled={probutton}
                variant="contained"
                fullWidth
                onClick={() => {
                  {
                    if (window.confirm(confirmMessagePro)) confirmSub(5);
                  }
                }}
              >
                Pro <br /> $59 / month
              </Button>
            </Grid>
            {/* Button Upgrade to Full Access */}
            <Grid item xs={2} mt="10px">
              {/* <Button disabled={fullbutton} onClick={()=>{}}>Upgrade to Full Access</Button> */}
              <Button
                disabled={fullbutton}
                fullWidth
                variant="contained"
                onClick={() => {
                  {
                    if (window.confirm(confirmMessageFull)) confirmSub(6);
                  }
                }}
              >
                Full Access <br /> $99 / month
              </Button>
              {/* <AddUserBar setSearchQuery={val=>requestSearch(val)}  /> */}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
}
const confirmMessageBasic = "Downgrade to Free Subscription?";

const confirmMessagePro =
  "Purchase Pro Access subscription for $59.00 per month?";
const confirmMessageFull =
  "Purchase Full Access subscription for $99.00 per month?";
