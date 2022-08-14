import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { useState } from "react";

const pro = [
  {
    name: "Pro Subsciption",
    desc: "Access upto 30 stocks",
    price: "$59.00",
  },
  { name: "GST", desc: "", price: "incl." },
];

const full = [
  {
    name: "Full Access Subsciption",
    desc: "Access upto 1000 stocks",
    price: "$99.00",
  },
  { name: "GST", desc: "", price: "incl." },
];

const addresses = ["1 MUI Drive", "Reactville", "Anytown", "99999", "USA"];
const payments = [
  { name: "Card type", detail: "Visa" },
  { name: "Card holder", detail: "Mr John Smith" },
  { name: "Card number", detail: "xxxx-xxxx-xxxx-1234" },
  { name: "Expiry date", detail: "04/2024" },
];

export default function Review(props) {
  const sID = props.sub;
  console.log(sID);

  let cost = 0;

  let rows = [];

  if (sID === 5) {
    rows = pro;
    cost = 59;
  } else if (sID === 6) {
    rows = full;
    cost = 99;
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {rows.map((row) => (
          <ListItem key={row.name} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={row.name} secondary={row.desc} />
            <Typography variant="body2">{row.price}</Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${cost}.00 per month
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {/* <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>John Smith</Typography>
          <Typography gutterBottom>{addresses.join(', ')}</Typography> */}
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          {/* <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography> */}
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                {/* <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid> */}
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
