import { Box } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Outlet } from 'react-router-dom'
import { Header } from './components'

export function NormalLayout() {
  return (
    <Box
      width={'100%'}
      height={'100%'}
      display={'grid'}
      gridTemplateAreas={`"header"
                          "main"`}
      gridTemplateRows={'50px auto'}
      gridTemplateColumns={'auto'}
      gap={1}
      // bgcolor={grey[400]}
    >
      {/* header (horizontal nav) */}
      <Box
        gridArea={'header'}
        // height={'100%'}
        bgcolor={grey[100]}
        // overflow={'hidden'}
      >
        <Header />
      </Box>
      {/* aside (vertical nav) */}
      {/* <Box
        gridArea={'aside'}
        bgcolor={grey[100]}
      >
        <VerticalNav />
      </Box> */}
      {/* main view */}
      <Box
        gridArea={'main'}
        bgcolor={grey[100]}
        padding={1}
        overflow={'auto'}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
