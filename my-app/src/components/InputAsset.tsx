import * as React from 'react'
import { ChangeEventHandler } from "react";
import { TextField, withStyles, Grid, Button, Paper, WithStyles } from "@material-ui/core";

let debug = require('debug')
let log = debug('InputAsset');
log.log = console.log.bind(console);

const styles: any = (theme: any) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
  addButton: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
})

export interface SendAsset {
  address: string
  qty: number
}

interface MyProps {
  address?: string
  assetName: string
  destinationAddress?: string
  qty?: number
  onClick?: (value: SendAsset) => void
  onChange?: () => void
  classes: any
  disabledButton: boolean
}

interface MyState {
  check: boolean
  to: string
  qty: number
}

class Component extends React.Component<MyProps, MyState> {

  constructor(props: MyProps) {
    super(props)
    this.state = {
      check: false,
      to: props.address ? props.address : '',
      qty: Math.max(0, props.qty !== undefined ? props.qty : 0)
    }
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    this.render = this.render.bind(this)
  }

  componentWillReceiveProps(props: Readonly<MyProps>) {
    log('componentWillReceiveProps', props)
    const { address, qty } = props
    if ((address !== undefined && qty !== undefined) && (this.state.to !== address || this.state.qty !== qty)) {
      this.setState({
        to: address ? address : '',
        qty: qty !== undefined ? qty : 0
      })
    } else {
      log('componentWillReceiveProps 変更なし')
    }
  }

  render() {
    const { classes } = this.props
    return (
      <Grid item xs={12}>
        <Grid item xs={12}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              required
              id="outlined-required"
              label="宛先アドレス"
              // defaultValue=""
              className={classes.textField}
              margin="normal"
              variant="outlined"
              fullWidth
              value={this.state.to}
              onChange={this.handleChangeAddress}
            />
            <TextField
              id="outlined-number"
              label={this.props.assetName}
              value={this.state.qty}
              onChange={this.handleChangeQty}
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
              variant="outlined"
              fullWidth
            />
          </form>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ textAlign: 'center', padding: '8px' }}>
            <AddButtons values={[1000, 100, 10, 1]} className={classes.addButton} prefix={''} clickHandler={this.handleClickSet} />
          </Paper>
          <Paper style={{ textAlign: 'center', padding: '8px' }}>
            <AddButtons values={[1000, 100, 10, 1]} className={classes.addButton} prefix={'+'} clickHandler={this.handleClickAdd} />
          </Paper>
          <Paper style={{ textAlign: 'center', padding: '8px' }}>
            <AddButtons values={[-1000, -100, -10, -1]} className={classes.addButton} prefix={''} clickHandler={this.handleClickAdd} />
          </Paper>
          <Paper style={{ textAlign: 'center', padding: '8px' }}>
            <Button
              onClick={this.handleClick}
              disabled={!this.state.check || this.props.disabledButton}
              variant="contained" color="secondary"
            >
              コイン送信（確認ダイアログ表示）
            </Button>
          </Paper>
        </Grid>
      </Grid >
    )
  }

  // ------------------------
  // handlers
  // ------------------------
  private handleClickAdd = (value: number) => {
    log('handleClickAdd', value)
    this.setQty(this.state.qty + value)
  }

  private handleClickSet = (value: number) => {
    log('handleClickSet', value)
    this.setQty(value)
  }

  private setQty = (qty: number): void => {
    this.setState({
      check: (0 < this.state.to.length) && (0 < qty),
      qty: Math.max(0, qty)
    })
  }

  private handleClick = () => {
    log('on click send button')
    if (this.props.onClick) {
      const { to, qty } = this.state
      if (!to || to.length === 0 || !qty || qty <= 0) return
      this.props.onClick({ address: to, qty: qty })
    }
  }

  private handleChangeAddress: ChangeEventHandler = (event: { target: any }): void => {
    let { value } = event.target
    this.setState({
      check: (value && 0 < value.length) && (0 < this.state.qty),
      to: value
    })
    this.onChangeEvent()
  }

  private handleChangeQty: ChangeEventHandler = (event: { target: any }): void => {
    let { value } = event.target
    let qty = 1 * value
    if (isNaN(qty)) {
      qty = 1 * this.state.qty
    }
    this.setState({
      check: (!!this.state.to && 0 < this.state.to.length) && (0 < qty),
      qty: qty
    })
    this.onChangeEvent()
  }

  private onChangeEvent = () => {
    if (this.props.onChange) {
      this.props.onChange()
    }
  }
}

interface AddButtonsProps {
  values: Array<number>
  className: string
  prefix: string
  clickHandler: (value: number) => void
}

const AddButtons: React.FC<AddButtonsProps> = (props) => {
  const { values, className, prefix, clickHandler } = props
  const items = values.map((value, index) => {
    return <AddButton value={value} text={`${prefix}${value}`} onClick={() => clickHandler(value)} className={className} key={`add-${index}-${value}`}/>
  })
  return (
    <React.Fragment>
      {items}
    </React.Fragment>
  )
}

interface AddBUttonProps {
  value: number
  text: string
  onClick: (value: number) => void
  className: string
}

const AddButton: React.FC<AddBUttonProps> = (props) => {
  const { className, text, onClick, value } = props
  return (
    <Button
      onClick={() => onClick(value)}
      variant="contained" color="primary"
      className={className}
    >
      {text}
    </Button>
  )
}

export const InputAsset = withStyles(styles)(Component)
