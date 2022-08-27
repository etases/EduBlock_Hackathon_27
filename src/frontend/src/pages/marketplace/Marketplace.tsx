import { AccessTime } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { useState } from 'react'

export function Marketplace() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <Stack height={'100%'}>
      <Stack>
        <Typography>NFT Marketplace</Typography>
        <Typography>EduBlock</Typography>
        <Button>Create</Button>
      </Stack>
      {/* <Box
        flexGrow={1}
        overflow={'scroll'}
      > */}
      <Grid
        container={true}
        spacing={1}
        // overflow={'scroll'}
      >
        {Array.from(Array(100)).map((_, index) => (
          // <ImageListItem key={`sr__${index}`}>
          <Grid
            item={true}
            md={3}
            sx={{
              ':hover': {
                filter: 'brightness(0.8)'
              }
            }}
          >
            <Stack
              height={350}
              bgcolor={grey[200]}
              onClick={() => setModalOpen(true)}
            >
              <Typography flexGrow={1}>{index}</Typography>
              <Typography bgcolor={grey[300]}>PrincipalId: {index}</Typography>
            </Stack>
          </Grid>
          // </ImageListItem>
        ))}
      </Grid>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth={'md'}
      >
        <Stack spacing={1}>
          <Stack
            direction={'row'}
            // width={'100%'}
            // height={'100%'}
            spacing={1}
          >
            <Stack>
              <Typography>Current price</Typography>
              <Stack spacing={1}>
                <Typography>100 ETAX</Typography>
                <Typography>(100$)</Typography>
                <Divider />
                <TextField />
                <Button>Make offer</Button>
              </Stack>
            </Stack>
            <Divider
              orientation={'vertical'}
              flexItem={true}
            />
            <Stack spacing={1}>
              <Stack>
                <Typography>Owned by: xxx</Typography>
                <Typography>Mike - FSchool CanTho GPA 9.0 (2022)</Typography>
                <Typography>
                  <AccessTime /> Sale ends September 25, 2022 at 6:11am GMT+7
                </Typography>
              </Stack>
              <Divider />
              <Box>
                {/* School report image */}
                School report image
              </Box>
            </Stack>
          </Stack>
          <Divider />
          <Box>
            {/* School report table */}
            School report table
          </Box>
        </Stack>
      </Dialog>
      {/* </Box> */}
    </Stack>
  )
}
