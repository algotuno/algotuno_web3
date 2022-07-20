import * as React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { makeStyles } from "@mui/styles";
import axios_api from '../../config/axios_api';
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@mui/material"
import { useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Co2Sharp } from '@mui/icons-material';
let userID = "cl5kx0w9y0004ysv692x34doo";

export let watchliststorage=[];

const postreq=(userID)=>{
  return{
    "user_id" : 	userID
  }
};

export default function StocksList (props){
  const [stocks, setStocks] = useState([]);
  const [userList, setUserList] = useState([]);
  //const [wishlist,setWishlist] = useState(watchliststorage);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [display, setDisplay] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(null);
  const [message, setMessage] = useState("");
  
  //const [page, setPage] = useState(1);

  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    },
  });
  const classes = useStyles();


  const fetchStocks = async () => {
    setLoading(true);
    const  {data} = await axios_api.get('/api/stock/get_all_stocks');
    //console.log(data);
    
    setStocks(data.result);
    setLoading(false);
    fetchUserStocks();
  };


 

  const fetchUserStocks= async()=>{
    try{
      const res = await fetch(`/api/watchlist/get_watchlist`, {
        method : 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postreq(userID))
    })
    .then(async res => {
      const data = await res.json();
      const stocklist = data.result;
      return stocklist;
     
      // stocklist.map((e)=>{
      //   stockL.append(e.stockID)
      //   //setUserList(stocksl)
      // });
      //setUserList(data.result);
      // stocklist.forEach((e)=>{
      //   console.log(e.stockID)
        
      // })
      
      //return stocklist;
    })
  
    .then(stocklist => {
    setDisplay(true);
    setMessage("Success");
    setStatus(true);
    setUserList(stocklist);
    //console.log(stocklist);
      //sto(true);
      //setIsLoading(false);
    })
  
    
    setTimeout(() => {
         setStatus(null);
        setMessage("null");
        // setDisplay(false);
    }, 3000);
    }
    catch(error){
      console.log(error)
    }
};

useEffect(() => {
  fetchStocks();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);





  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
        
      }  
    },
  });

  const handleSearch = () => {
    return stocks.filter(
      (stock) =>
      stock.companyName.toLowerCase().includes(search) ||
      stock.tickerSymbol.toLowerCase().includes(search)
    );
  };

  let userStocks = stocks.filter(o1 => userList.some(o2 => o1.stockID === o2.stockID));
  console.log(userStocks);

  return(
    <ThemeProvider theme={darkTheme}  >
      <Container  style={{ textAlign: "left" }}>
          <Typography
            variant="h4"
            style={{ margin: 18, fontFamily: "Montserrat" }}
          >
            Stock Prices by Market Cap
          </Typography>

          <Typography
          variant='subtitle1'
            style={{ margin: 18, fontFamily: "Montserrat" }}
          >
          <WarningAmberIcon sx={{ fontSize: 15 }}/> Pricing data updated on daily basis. Currency in USD.
          </Typography>

          <TableContainer component={Paper}  style={{maxHeight:400}}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "black" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#575757" }}>
                <TableRow >
                  {["Ticker", "Price","Exchange", "24h Change", "% Change"].map((head) => (
                    <TableCell
                      style={{
                        color: "white",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Ticker" ? "left" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {/* Data for table */}
              <TableBody >
                {userStocks.map((row,index) => {
                    
                    //const profit = row.price_change_percentage_24h > 0;
    
                      return(

                      <TableRow
                        className={classes.row}
                        key={row.tickerSymbol}
                      >
                        {/* ticker */}
                        <TableCell
                        onClick={() => document.location.href = `/stockpage?tickerSymbol=${row.tickerSymbol}&exchange=${row.exchange}`}
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                            backgroundColor: "#8A8A8A",
                            
                          }}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 17,
                              }}
                            >
                              {row.tickerSymbol}
                            </span>
                            <span style={{ color: "white",
                                          fontSize: 12, }}>
                              {row.companyName}
                            </span>
                          </div>
                        </TableCell>
                        {/* Price */}
                        <TableCell align="right" style={{ backgroundColor: "#8A8A8A" }} >
                          {/* {tickerSymbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))} */}
                          <div><span style={{ color: "white" }}>
                              ${parseFloat(row.latestPrice).toFixed(2)}
                            </span></div>
                        </TableCell>
                        {/* Exchange */}
                        <TableCell align="right"style={{ backgroundColor: "#8A8A8A" }}>
                          {/* {tickerSymbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))} */}
                          <div><span style={{ color: "white" }}>
                              {row.exchange}
                            </span></div>
                        </TableCell>
                        {/* 24h change */}
                        <TableCell
                          align="right"
                          style={{
                            //color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                            backgroundColor: "#8A8A8A"
                          }}
                        >
                          <div><span style={{ color: "white" }}>
                          {parseFloat(row.priceChange).toFixed(2)}
                          </span>
                          </div>
                          {/* {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}% */}
                        </TableCell>
                        {/* marketcap */}
                        <TableCell
                        align="right"
                        style={{
                          //color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                          fontWeight: 500,
                          backgroundColor: "#8A8A8A"
                        }}>

                          <div><span style={{ color: "white" }}>
                          {parseFloat(row.percentChange).toFixed(2)}
                          </span>
                          </div>
                        </TableCell>
                        {/* <TableCell align="right"style={{ backgroundColor: "#8A8A8A" }}>
                          {/* {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M */}
                        {/* </TableCell>  */}
                          {/* wishlist */}
                          {/* <TableCell align="right"
                          style={{ backgroundColor: "#8A8A8A" }}
                          onClick={() =>handleAddToWishlist(row.tickerSymbol,row.exchange)}
                          > */}
                           {/* {symbol}{" "}
                           {numberWithCommas(
                             row.market_cap.toString().slice(0, -6)
                           )}
                           M */}
                          {/* <FavoriteIcon sx={{ fontSize: "large" }}/>
                          
                         </TableCell> */}
                         </TableRow>
                    )}
                    

                  )}
                
                 
              {/* })} */}
              </TableBody>
              </Table>
          )}
        </TableContainer>     
          
      </Container>
    </ThemeProvider>
    
  )

}

