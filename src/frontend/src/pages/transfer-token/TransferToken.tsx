import { useCanister } from '@connect2ic/react'
import { Box, Typography } from '@mui/material'

export function TransferToken() {
  const [token, { error, loading }] = useCanister('token')
  return (
    <Box>
      <Typography>Transfer token</Typography>
    </Box>
  )
}
