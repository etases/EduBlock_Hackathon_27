// import { token } from '@be/token'
import { useCanister, useConnect } from '@connect2ic/react'
import { Principal } from '@dfinity/principal'
import { Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

export function TransferToken() {
  const [token, { error, loading }] = useCanister('token')
  const { principal } = useConnect()

  const [principalId, setPrincipalId] = useState('')
  const [noOfToken, setNoOfToken] = useState('')

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      paddingTop={'2vh'}
    >
      <Typography fontSize={'5vh'}>Transfer Tokens</Typography>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        paddingTop={'2vh'}
      >
        <TextField
          //error
          id="outlined-error-helper-text"
          label="Principle ID"
          // defaultValue=""
          value={principalId}
          onChange={({ target: { value } }) => {
            setPrincipalId(value)
          }}
        />
        <TextField
          //error
          id="outlined-error-helper-text"
          label="Token"
          // defaultValue=""
          value={noOfToken}
          onChange={({ target: { value } }) => {
            setNoOfToken(value)
          }}
        />
      </Stack>
      <Button
        onClick={() => {
          token
            .transfer(Principal.fromText(principalId), BigInt(noOfToken))
            .then(console.log)
        }}
      >
        <Typography>Submit</Typography>
      </Button>
      <Button
        onClick={() => {
          token.balanceOf(Principal.fromText(principalId)).then(console.log)
        }}
      >
        <Typography>balance</Typography>
      </Button>
    </Stack>
  )
}
