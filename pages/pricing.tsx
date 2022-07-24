import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Layout from "../components/layout";
import session from "./api/examples/session";
import { useSession } from "next-auth/react";

const tiers = [
  {
    title: "Free",
    price: "0",
    description: ["View upto 3 stocks", "View upto 2 prediction results"],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
  },
  {
    title: "Pro",
    subheader: "Most popular",
    price: "59",
    description: ["View upto 12 stocks", "View upto 2 prediction results"],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    title: "Full Access",
    price: "99",
    description: [
      "View upto 100 stocks ",
      "Access to all existing prediction models",
      "Users can have ML model tailored for them",
    ],
    buttonText: "Contact us",
    buttonVariant: "outlined",
  },
];

function PricingContent() {
  const { data: session, status } = useSession();

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          li: { margin: 0, padding: 0, listStyle: "none" },
          ul: { padding: 0 },
        }}
      />
      <CssBaseline />
      {/* Hero unit */}
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 12, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Pricing
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          Choose from our plans catered for all types of users.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              // xs={12}
              // sm={tier.title === 'Full Access' ? 12 : 6}
              sm={6}
              md={4}
            >
              <Card style={{ height: "350px" }}>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: "center",
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                    >
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  {/* <Link href='/checkout'>
                  
                  </Link> */}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {session ? (
        <></>
      ) : (
        <Container sx={{ pt: 5, pb: 6 }}>
          <Typography align="center">
            <Button
              variant="contained"
              style={{ width: 400 }}
              href="/account/register"
            >
              SIGN UP NOW
            </Button>
          </Typography>
        </Container>
      )}
      <Container sx={{ pb: 6 }}></Container>
    </React.Fragment>
  );
}

export default function Pricing() {
  return (
    <Layout>
      <PricingContent />
    </Layout>
  );
}
