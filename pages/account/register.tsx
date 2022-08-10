import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Head from "next/head";

const useStyles = makeStyles(
  {
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      "& .MuiTextField-root": {
        width: "300px",
      },
    },
    textField: {
      padding: "0.5em",
    },
  },
  // this MuiExample_Component is required (do not remove, otherwise will throw CSS error)
  { name: "MuiExample_Component" }
);

const RegisterPage = () => {
  const classes = useStyles();
  // create state variables for each input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // status message
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeOut, sto] = useState<boolean>(false);

  useEffect(() => {
    // when the component is mounted, the alert is displayed for 3 seconds
    setTimeout(() => {
      sto(false);
    }, 3000);
  }, []);

  const registerUser = async () => {
    const res = await fetch(`/api/user/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        const message = data.message;
        console.log(res.status);
        if (res.status == 200) {
          setTimeout(() => {
            document.location.href = "/account/signin";
          }, 4000);
        }
        return message;
      })
      .then((message) => {
        setStatusMessage(message);
        sto(true);
        setIsLoading(false);
      });

    //setIsLoading(false);
    //return data.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await registerUser();
  };

  return (
    <div>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Typography style={{ marginTop: "4em" }} align="center" variant="h3">
        algotuno.io
      </Typography>
      <Typography align="center" variant="h6">
        Sign Up
      </Typography>
      <form className={classes.root} onSubmit={handleSubmit}>
        <Stack alignItems="center">
          <div className={classes.textField}>
            <TextField
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              label="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={classes.textField}>
            <TextField
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <br />
          <Stack alignItems="center">
            <Link href="/">Go Back</Link>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "1em" }}
            >
              Signup
            </Button>
          </Stack>

          {isLoading ? (
            <Box mt={3}>
              <CircularProgress size={24} /> awaiting response...
            </Box>
          ) : null}
          {statusMessage !== "" && (
            <Box mt={3}>
              <Alert
                severity={
                  statusMessage.toLowerCase().includes("success")
                    ? "success"
                    : "error"
                }
              >
                {statusMessage}
              </Alert>
            </Box>
          )}
        </Stack>
      </form>
    </div>
  );
};

export default RegisterPage;
