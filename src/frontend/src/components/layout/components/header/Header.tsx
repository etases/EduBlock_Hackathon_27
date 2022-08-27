import { Button, Link, Stack } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export function Header() {
  return (
    <Stack
      width={'100%'}
      height={'100%'}
      alignItems={'center'}
      justifyContent={'space-between'}
      direction={'row'}
      // padding={1}
    >
      {/* <Stack
        direction={'row'}
        justifyContent={'space-between'}
        // alignSelf={'start'}
      > */}
      {/* logo */}
      <Button size={'small'}>Logo</Button>
      <Stack
        direction={'row'}
        spacing={1}
        marginRight={1}
      >
        <Link
          component={RouterLink}
          to={'/home'}
        >
          Home
        </Link>
        <Link
          component={RouterLink}
          to={'/app'}
        >
          Market
        </Link>
        <Link
          component={RouterLink}
          to={'/app/profile'}
        >
          Profile
        </Link>
      </Stack>
      {/* <Typography
          fontSize={64}
          color={'white'}
          fontWeight={600}
        >
          {TEXT.EDU}
        </Typography>
        <Typography
          fontSize={64}
          color={'#6B6AB7'}
          fontWeight={600}
        >
          {TEXT.BLOCK}
        </Typography> */}
      {/* </Stack> */}
      {/* <Typography
        // alignSelf={'end'}
        // marginRight={1}
        fontWeight={600}
        color={'white'}
      >
        Blockchain-based School Report
      </Typography> */}
    </Stack>
  )
}
