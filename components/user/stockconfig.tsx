import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import {
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AlertComponent from "../alert/alert_message";
import axios_api from "../../config/axios_api";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { MouseEvent } from "react";
import { convertCompilerOptionsFromJson } from "typescript";

type Order = "asc" | "desc";
// interface EnhancedTableProps {
//   numSelected: number;
//   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   order: Order;
//   orderBy: string;
//   rowCount: number;
// }

interface BasicUserInterface {
  stockID: number;
  tickerSymbol: string;
  companyName: string;
  exchange: string;
}

const SearchBar = ({ setSearchQuery }) => (
  <form>
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <TextField
        id="search-bar"
        className="text"
        onInput={(e) => {
          /* @ts-ignore */
          setSearchQuery(e.target.value);
        }}
        label="Ticker Symbol"
        variant="outlined"
        placeholder="Search..."
        size="small"
        fullWidth
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "blue" }} />
      </IconButton>
    </div>
  </form>
);

const postreq = (userID, stocks) => {
  return {
    user_id: userID,
    stocks: stocks,
  };
};

export default function StockPriceListTable() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>();
  const [rows, setRows] = useState<BasicUserInterface[]>();
  const [searched, setSearched] = useState<string>("");
  const [display, setDisplay] = useState<boolean>(false);
  const [stat, setStatus] = useState<boolean>(null);
  const [message, setMessage] = useState("");
  const [limit, setLimit] = useState<number>();
  const [selected, setSelected] = React.useState([]);

  let userID;

  if (status === "authenticated") {
    userID = session.id;
  }

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const { data } = await axios_api.get("/api/stock/get_all_stocks");
      setRows(data.result);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchStocks();
    setSelected([]);
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/get_user_details`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userID,
        }),
      }).then(async (res) => {
        const data = await res.json();
        const values = data.result;
        const plan = values.Subscription[0].Subscription_Plan;
        setLimit(plan["watchlistLimit"]);

        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const requestSearch = async (searchedVal: string) => {
    if (searchedVal.trim().length === 0) {
      await fetchStocks();
    } else {
      const filteredRows = rows.filter((row) => {
        return row.tickerSymbol
          .toLowerCase()
          .includes(searchedVal.toLowerCase());
      });
      // only if results greater than 0, then continue the search, otherwise do not update the list
      if (filteredRows.length > 0) {
        setRows(filteredRows);
      } else {
        setRows([]);
      }
    }
  };

  const isSelected = (stockID: string) => selected.indexOf(stockID) !== -1;

  const resetSelection = () => {
    setSelected([]);
  };

  const handleClick = (
    event: MouseEvent<HTMLTableRowElement>,
    tickerSymbol: string,
    stockID: number
  ) => {
    setDisplay(false);
    if (selected.length < limit) {
      const selectedIndex = selected.indexOf(stockID.toString());
      let newSelected: string[] = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, stockID.toString());
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    } else {
      setDisplay(true);
      setMessage("Limit reached for your plan");
    }
    setTimeout(() => {
      setStatus(null);
      setDisplay(false);
    }, 5000);
  };

  const updateUserStockList = async (userID: string) => {
    // const stocks:string= JSON.stringify(selected);
    setDisplay(true);
    setMessage("Loading...");
    const res = await fetch(`/api/watchlist/update_watchlist`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postreq(userID, selected)),
    })
      .then(async (res) => {
        const data = await res.json();
        const message = data.message;
        return message;
      })
      .then((message) => {
        setDisplay(true);
        setMessage(`${selected.length} stocks added to watchlist`);
        setStatus(true);

        //sto(true);
        //setIsLoading(false);
      });
    setTimeout(() => {
      setStatus(null);
      setMessage("timed out");
      setDisplay(false);
    }, 3000);
  };
  interface EnhancedTableToolbarProps {
    numSelected: number;
  }

  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props;

    return (
      <Toolbar
      // sx={{
      //   pl: { sm: 2 },
      //   pr: { xs: 1, sm: 1 },
      // }}
      >
        {numSelected > 0 ? (
          <div>
            <Grid container spacing={1} mt={1}>
              <Grid item xs={4} alignContent="left">
                <Typography fontSize={14}>
                  {numSelected} / {limit} selected
                </Typography>
              </Grid>
              <Grid item xs={8} alignContent="right">
                <Button
                  disabled={false}
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => {
                    resetSelection();
                  }}
                >
                  Reset Selection
                </Button>
              </Grid>
            </Grid>
          </div>
        ) : (
          <></>
        )}
      </Toolbar>
    );
  };

  return (
    <div>
      <div>
        <Paper>
          <Box pt={0.0} pl={2.5} pb={1} pr={2.5}>
            {/*** if no items to display do not display the search bar ***/}
            {rows !== undefined && rows.length > 0 ? (
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <SearchBar setSearchQuery={(val) => requestSearch(val)} />
                  </Grid>

                  <Grid item xs={2}>
                    <Button
                      disabled={false}
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        updateUserStockList(userID.toString());
                      }}
                    >
                      Add to Watchlist
                    </Button>
                  </Grid>
                  <Grid item xs={4} alignContent="left">
                    <AlertComponent
                      display={display}
                      status={stat}
                      message={message}
                    />
                  </Grid>

                  <Grid item xs={4} alignContent="right">
                    <p style={{ textAlign: "right", marginTop: "-0.25em" }}>
                      *Basic users can make up to 3 updates per month. <br></br>
                      *Pro users can make up to 12 updates per month.
                    </p>
                    {/* <Typography textAlign="right">
                     
                      
                    </Typography> */}
                  </Grid>
                </Grid>

                {/* <Grid item xs={2} mt={2}></Grid> */}

                <EnhancedTableToolbar numSelected={selected.length} />
              </div>
            ) : (
              <br />
            )}
          </Box>
          {/*** if no items to display do not display the table ***/}
          {loading ? (
            <LinearProgress style={{ backgroundColor: "black" }} />
          ) : rows !== undefined && rows.length > 0 ? (
            <TableContainer style={{ maxHeight: 350 }}>
              <Table style={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        // indeterminate={numSelected > 0 && numSelected < rowCount}
                        // checked={rowCount > 0 && numSelected === rowCount}
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell> */}
                    <TableCell>No.</TableCell>
                    <TableCell>Ticker Symbol</TableCell>
                    <TableCell>StockID</TableCell>
                    <TableCell align="right">Exchange</TableCell>
                    {/* <TableCell align="right">Status</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.stockID.toString());
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) =>
                          handleClick(event, row.tickerSymbol, row.stockID)
                        }
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.tickerSymbol}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell component="th" scope="row">
                          {row.tickerSymbol}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.stockID}
                        </TableCell>
                        <TableCell align="right">{row.exchange}</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div style={{ margin: "5em" }}>
              <h3 style={{ textAlign: "center" }}>
                <b>No data to display</b>
              </h3>
              {
                /*** add padding ***/
                Array.from(Array(5).keys()).map((index) => {
                  return <br key={index} />;
                })
              }
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
}
