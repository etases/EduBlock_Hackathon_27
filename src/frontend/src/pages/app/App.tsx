import { usePersistentState } from '@fe/hooks'
import { Outlet, useNavigate } from 'react-router-dom'

export function App() {
  const navigate = useNavigate()
  const { state: account, setState: setAccount } = usePersistentState({
    store: 'account'
  })

  // useEffect(() => {
  //   setAccount(defaultAccountValue)
  // }, [])

  // useEffect(() => {
  //   if (account.accountId.length === 0) navigate('/login')
  // }, [account])

  return <Outlet />
}
