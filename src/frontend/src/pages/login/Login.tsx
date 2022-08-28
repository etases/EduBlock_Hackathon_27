import { useConnect, useProviders } from '@connect2ic/react'
import { Img } from '@fe/components'
import {
  useAdminLogin,
  useStudentLogin,
  useTeacherLogin
} from '@fe/hooks/use-query'
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
// @ts-ignore
import laptopPng from './assets/png/laptop.png'
// @ts-ignore
import { ReactComponent as PlugSvg } from './assets/svg/plug.svg'

const TEXT = {
  LOGIN: 'Login',
  WELCOME_BACK: 'Welcome Back',
  CONNECT_TO_PLUG: 'Connect to Plug'
}

const ROLE = {
  1: 'admin',
  2: 'verifier',
  3: 'student'
}

export function Login() {
  const providers = useProviders()

  const [notificationOpen, setNotificationOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(Object.keys(ROLE).at(-1))

  const {
    login: loginAsAdmin,
    state: {
      role: { setRole: updateAdminRole }
    }
  } = useAdminLogin()
  const {
    login: loginAsTeacher,
    state: {
      role: { setRole: updateTeacherRole }
    }
  } = useTeacherLogin()
  const {
    login: loginAsStudent,
    state: {
      role: { setRole: updateStudentRole }
    }
  } = useStudentLogin()

  const { connect: connectToIC, principal, status } = useConnect()

  const login = {
    1: loginAsAdmin,
    2: loginAsTeacher,
    3: loginAsStudent
  }

  const loginRoleSetter = {
    1: updateAdminRole,
    2: updateTeacherRole,
    3: updateStudentRole
  }

  useEffect(() => {
    Object.values(loginRoleSetter).forEach((setter) => {
      setter(Number(selectedRole))
    })
  }, [selectedRole])

  return (
    <Box
      display={'grid'}
      gridTemplateAreas={`"login decoration decorBackground"`}
      gridTemplateColumns={'40% 20% 40%'}
      width={'100%'}
      height={'100%'}
      bgcolor={'#EBEFFF'}
    >
      <Box gridArea={'login'}>
        <Stack
          width={'100%'}
          height={'100%'}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={3}
        >
          <Typography>{TEXT.WELCOME_BACK}</Typography>
          <PlugSvg />
          <Button
            sx={{
              background:
                'linear-gradient(94.95deg, #FFE701 -1.41%, #FA51D3 34.12%, #10D9ED 70.19%, #52FF53 101.95%)',
              color: 'white',
              textTransform: 'initial'
            }}
            onClick={() => {
              setNotificationOpen(true)
              if (status !== 'connected')
                connectToIC((providers[0] as any).meta.id)
              login[selectedRole]()
            }}
          >
            <Typography variant={'subtitle2'}>
              {TEXT.CONNECT_TO_PLUG}
            </Typography>
          </Button>
          <ToggleButtonGroup
            value={selectedRole}
            onChange={(_, value) => {
              setSelectedRole(value)
            }}
            exclusive={true}
          >
            {Object.keys(ROLE).map((roleId) => (
              <ToggleButton
                value={roleId}
                key={`${ROLE[roleId]}__${roleId}`}
              >
                <Typography textTransform={'capitalize'}>
                  {ROLE[roleId]}
                </Typography>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Snackbar
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            open={notificationOpen}
            onClose={() => setNotificationOpen(false)}
            autoHideDuration={5000}
          >
            <Alert
              onClose={() => setNotificationOpen(false)}
              sx={{
                width: '100%'
              }}
            >
              <Typography>{status}</Typography>
            </Alert>
          </Snackbar>
        </Stack>
      </Box>
      <Box
        gridArea={'decoration'}
        zIndex={0}
      >
        <Box
          component={Img}
          src={laptopPng}
        />
      </Box>
      <Box gridArea={'decorBackground'}>
        <Box
          bgcolor={'#AFB3FF'}
          width={'100%'}
          height={'100%'}
        />
      </Box>
    </Box>
  )
}
