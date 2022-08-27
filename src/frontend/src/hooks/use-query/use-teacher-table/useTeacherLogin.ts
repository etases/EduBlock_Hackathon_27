import { useConnect } from '@connect2ic/react'
import { BaseInterface } from '@fe/constants'
import { usePersistentState } from '@fe/hooks'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTeacherQuery } from './useTeacherQuery'

interface UseTeacherLoginProps extends BaseInterface {
  // role: number
}

export function useTeacherLogin(props?: UseTeacherLoginProps) {
  // const { role } = props

  const [role, setRole] = useState(3)

  const { isConnected, principal } = useConnect()

  const navigate = useNavigate()

  const { state: account, setState: setAccount } = usePersistentState({
    store: 'account'
  })

  const {
    queryResult,
    state: {
      queryOptions: {
        search: { search, setSearch }
      }
    }
  } = useTeacherQuery({
    initialProps: {
      page: 0,
      pageSize: 1
    },
    sideEffectFunctions: {
      onSuccess(data) {
        if (typeof data[0] === 'object') {
          const account = data[0]
          setAccount((prev) => ({
            ...prev,
            id: account.id,
            order: account.order,
            accountId: account.accountId,
            address: account.address,
            dateOfBirth: account.dob,
            email: account.email,
            firstName: account.firstName,
            gender: account.gender.value,
            lastName: account.lastName,
            phone: account.phone,
            principalId: account.principalId || principal,
            role: {
              id: account.role.id,
              value: account.role.value
            },
            token: {
              id: account.token.id,
              value: account.token.value
            }
          }))
        }
      }
    }
  })

  useEffect(() => {
    // console.log('teacherLoginRole', role)
    if (role !== 2) setSearch('')
  }, [role])

  useEffect(() => {}, [search])
  // console.log('teacher search', search)

  useEffect(() => {
    if (
      role === 2 &&
      typeof principal === 'string' &&
      principal.length > 0 &&
      isConnected
    )
      setSearch(principal)
  }, [principal, role])

  useEffect(() => {
    setSearch('')
    if (account.accountId.length > 0 && isConnected && account.role.id === 2)
      navigate('/vote')
  }, [account])

  function login() {
    queryResult.refetch()
  }

  return { queryResult, login, state: { role: { role, setRole } } }
}
