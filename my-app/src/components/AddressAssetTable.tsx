import * as React from 'react'
import { Table, TableBody, TableRow, TableCell } from "@material-ui/core";

import { RdxMyAsset as MyAsset } from "./MyAsset";

export const MyAccount: React.FC<{ address: string }> = (props) => {
  const { address } = props
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell component='th' scope="row">Address</TableCell >
          <TableCell align='right'>{address}</TableCell >
        </TableRow>
        <TableRow>
          <TableCell component='th' scope="row">Asset</TableCell >
          <TableCell align='right'><MyAsset /></TableCell >
        </TableRow>
      </TableBody>
    </Table>
  )
}
