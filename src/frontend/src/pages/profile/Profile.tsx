import { PlusOne } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { grey } from '@mui/material/colors'

export function Profile() {
  return (
    <Stack height={'100%'}>
      {/* <Typography>Profile</Typography> */}
      <Stack direction={'row'}>
        <Avatar>
          <Typography>A</Typography>
        </Avatar>
        <Stack>
          <Typography>PrincipalId: xxx</Typography>
          <Typography>Wallet: 100</Typography>
        </Stack>
      </Stack>
      <Typography>My NFT Storage</Typography>
      <Grid
        container={true}
        spacing={1}
      >
        <Grid
          item={true}
          md={3}
          // component={Button}
          // variant={'outlined'}
          padding={0}
          // justifyContent={'center'}
          // alignItems={'center'}
        >
          <Box
            width={'100%'}
            height={'100%'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <IconButton size={'large'}>
              <PlusOne />
            </IconButton>
          </Box>
        </Grid>
        {Array.from(Array(100)).map((_, index) => (
          <Grid
            item={true}
            md={3}
          >
            <Stack
              height={350}
              bgcolor={grey[200]}
            >
              <Typography flexGrow={1}>{index}</Typography>
              <Typography bgcolor={grey[300]}>PrincipalId: {index}</Typography>
              <Stack
                direction={'row'}
                justifyContent={'space-evenly'}
              >
                <Button>{index % 2 === 0 ? 'Auction' : 'Auctioning'}</Button>
                {/* <Button>Detail</Button> */}
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
