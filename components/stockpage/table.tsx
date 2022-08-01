import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface Column {
  id: "1d" | "7d" | "30d";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "1d", label: "1 Day", minWidth: 50 },
  { id: "7d", label: "7 Day", minWidth: 50 },
  {
    id: "30d",
    label: "30 Day",
    minWidth: 50,
  },
];
const comparePrice = (lastprice, predicted) => {
  if (lastprice < predicted) {
    return true;
  } else {
    return false;
  }
};

const StickyHeadTable = (props) => {
  let status: boolean = false;
  let font1: boolean = false;
  let font7: boolean = false;
  let font30: boolean = false;
  let modelID, data, onedayprediction, sevendayprediction, thirtydayprediction;

  if ("results" in props.pData) {
    data = props.pData.results;
    if (data.length > 0) {
      status = true;

      modelID = props.pData.results[0].MLModelID;

      onedayprediction = parseFloat(data[0].Price).toFixed(2);
      sevendayprediction = parseFloat(data[1].Price).toFixed(2);
      thirtydayprediction = parseFloat(data[2].Price).toFixed(2);
      font1 = comparePrice(props.lastprice, onedayprediction);
      font7 = comparePrice(props.lastprice, sevendayprediction);
      font30 = comparePrice(props.lastprice, thirtydayprediction);
    }
  } else {
    status = false;
    data = undefined;
  }

  let model = "";
  let modeldesc = "";

  if (modelID == 1) {
    model = "A";
    modeldesc = "Long Short-Term Memory (LSTM)";
  } else {
    model = "B";
    modeldesc = "Random Forests";
  }

  return (
    <Paper
      sx={{
        height: "370px",
        width: "540px",
        overflow: "hidden",
        backgroundColor: "#DFDFDF",
      }}
    >
      {data !== undefined && data.length > 0 ? (
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={6}
                  style={{ backgroundColor: "#9E9E9E", fontSize: 17 }}
                >
                  Model {model}
                  <div style={{ color: "white" }}>{modeldesc}</div>
                </TableCell>
              </TableRow>
              <TableRow
                sx={{
                  "& th": {
                    fontSize: "1rem",
                    color: "rgba(96, 96, 96)",
                  },
                }}
              >
                <TableCell
                  align="right"
                  style={{
                    backgroundColor: "#9E9E9E",
                    fontWeight: "700",
                  }}
                >
                  Period :
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#9E9E9E",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell
                  align="right"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  Date :
                </TableCell>
                {data.map((row, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    {row.DateString}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell
                  align="right"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  Prices :
                </TableCell>
                {/* {data.map((row) => (
                  <TableCell
                    align="center"
                    style={fontColor ? { color: "green" } : { color: "red" }}
                  >
                    {parseFloat(row.Price).toFixed(2)}
                  </TableCell>
                ))} */}
                <TableCell
                  align="center"
                  style={{
                    fontSize: "1rem",
                    color: font1 ? "green" : "red",
                  }}
                >
                  {onedayprediction}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontSize: "1rem",
                    color: font7 ? "green" : "red",
                  }}
                >
                  {sevendayprediction}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    fontSize: "1rem",
                    color: font30 ? "green" : "red",
                  }}
                >
                  {thirtydayprediction}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  align="right"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  Confidence % :
                </TableCell>
                {data.map((row, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    {parseFloat(row.Confidence).toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell
                  align="right"
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  Error % :
                </TableCell>
                {data.map((row, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    {parseFloat(row.Error).toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
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
  );
};
export default StickyHeadTable;
