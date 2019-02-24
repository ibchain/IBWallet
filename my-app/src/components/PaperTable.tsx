import * as React from "react";
import { Table, TableBody, TableRow, TableCell } from "@material-ui/core";

export const PaperTable: React.FC<{ address: string, qty: number }> = (props) => {
  const { address, qty } = props
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell component='th' scope="row">Address</TableCell >
          <TableCell align='right'>{address}</TableCell >
        </TableRow>
        <TableRow>
          <TableCell component='th' scope="row">Asset</TableCell >
          <TableCell align='right'><div style={{ display: 'inline' }}>{0 + qty}</div></TableCell >
        </TableRow>
      </TableBody>
    </Table>
  )
}
