import { TextField, Button, Typography, Stack } from "@mui/material";

export function TransferToken() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      paddingTop={"2vh"}
    >
      <Typography fontSize={"5vh"}>Transfer Tokens</Typography>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        paddingTop={"2vh"}
      >
        <TextField
          //error
          id="outlined-error-helper-text"
          label="Principle ID"
          defaultValue=""
        />
        <TextField
          //error
          id="outlined-error-helper-text"
          label="Token"
          defaultValue=""
        />
      </Stack>
      <Button>
        <Typography>Submit</Typography>
      </Button>
    </Stack>
  )
}
