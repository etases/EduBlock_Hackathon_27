//import { backend } from '@be/backend'
import * as React from 'react'
import { Box, Button, Typography, Stack } from '@mui/material'
import { Img } from '@fe/components'
// @ts-ignore
import img_block_small from './images/Block_01.png'
// @ts-ignore
import fpticon from './images/fpticon.png'
// @ts-ignore
import fues from './images/fues.png'
// @ts-ignore
import img_block_big from './images/BigBlock.png'
// @ts-ignore
import rec from './images/rectangle.png'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }
  return (
    <Box
      display={'grid'}
      width={'100%'}
      height={'100vh'}
      bgcolor={'#a8a6fe'}
      color={'#fff'}
      gridTemplateAreas={`"Logo dvtc home"`}
      gridTemplateColumns={'50% 40% 10%'}
    >
      <Box gridArea={'Logo'}>
        <Stack
          width={'100%'}
          height={'70%'}
          direction={'column'}
          alignItems="flex-start"
          justifyContent="space-evenly"
          spacing={2}
        >
          <Typography
            fontFamily={'Poppins'}
            fontSize="2rem"
            style={{ fontWeight: 'bold' }}
          >
            &nbsp;&nbsp;
            <Box
              component={Img}
              src={img_block_small}
              height={'30%'}
            ></Box>
            &nbsp;{' ESTATE'}
          </Typography>

          <Box
            bgcolor={'#a8a6fe'}
            width={'100%'}
            height={'10%'}
          />

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0}
          >
            <Typography
              fontSize={'7rem'}
              style={{ fontWeight: 'bold' }}
              height={'10%'}
            >
              &nbsp;{'EDU'}
            </Typography>
            <Typography
              fontSize={'7rem'}
              style={{ fontWeight: 'bold' }}
              height={'10%'}
              color={'#706cb4'}
            >
              {'BLOCK'}
            </Typography>
          </Stack>
          <Typography fontSize="1.5rem">
            &emsp;&emsp;Học bạ điện tử BlockChain
          </Typography>
          <Button
            onClick={handleClick}
            sx={{
              background: '#666efa',
              color: 'white',
              textTransform: 'initial',
              height: '50px',
              width: '180px',
              right: '-40px'
            }}
          >
            <Typography
              fontSize="1rem"
              variant={'subtitle2'}
            >
              {'Đăng nhập'} &emsp; {'>'}
            </Typography>
          </Button>
        </Stack>
      </Box>

      <Box gridArea={'dvtc'}>
        <Stack
          width={'100%'}
          height={'70%'}
          direction={'column'}
          alignItems="center"
          justifyContent="flex-start"
          spacing={3}
        >
          <Typography
            display={'flex'}
            justifyContent={'center'}
            fontFamily={'Poppins'}
            style={{ fontWeight: 'bold' }}
            fontSize="1.2rem"
          >
            Đơn vị tổ chức
          </Typography>
          <p>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={0.5}
              height={50}
            >
              <Box
                component={Img}
                src={fpticon}
                height={'100%'}
              ></Box>
              <Box
                component={Img}
                src={fues}
                height={'100%'}
              ></Box>
            </Stack>
          </p>

          <Box
            bgcolor={'#a8a6fe'}
            width={'100%'}
            height={'10%'}
            paddingTop={'10px'}
          />

          <Box
            component={Img}
            src={img_block_big}
            height={'900%'}
          ></Box>
        </Stack>
      </Box>

      <Box gridArea={'home'}>
        <Typography
          fontSize="1.5rem"
          fontFamily={'Poppins'}
          justifyContent={'center'}
        >
          Home
        </Typography>
        <Box
          borderRadius={3}
          component={Img}
          src={rec}
          height={'0.3%'}
        ></Box>
      </Box>
    </Box>
  )
}
