import { BaseInterface } from '@fe/constants'
import { useDebounce, usePersistentState } from '@fe/hooks'
import { useQuery } from '@fe/hooks/use-query/core'
import { useEffect, useState } from 'react'

interface UseAdminQueryProps extends BaseInterface {
  initialProps: {
    page: number
    pageSize: number
    search?: string
  }
  autoFetch?: true | false
  sideEffectFunctions?: {
    onError?: (error) => void
    onSuccess?: (data) => void
    onSettled?: (data, error) => void
  }
}

const apiFields = [
  {
    localPropName: 'id',
    remotePropName: 'id'
  },
  {
    localPropName: 'order',
    remotePropName: 'order'
  },
  {
    localPropName: 'accountId',
    remotePropName: 'AccountId'
  },
  {
    localPropName: 'firstName',
    remotePropName: 'FirstName'
  },
  {
    localPropName: 'lastName',
    remotePropName: 'LastName'
  },
  {
    localPropName: 'dob',
    remotePropName: 'DateOfBirth'
  },
  {
    localPropName: 'address',
    remotePropName: 'Address'
  },
  {
    localPropName: 'principalId',
    remotePropName: 'PrincipalId'
  },
  {
    localPropName: 'role',
    remotePropName: '_Role'
  },
  {
    localPropName: 'token',
    remotePropName: '_Token'
  },
  {
    localPropName: 'phone',
    remotePropName: 'Phone'
  },
  {
    localPropName: 'email',
    remotePropName: 'Email'
  },
  {
    localPropName: 'gender',
    remotePropName: 'Gender'
  }
]

const specialProps = ['role', 'token']

const ENDPOINT = 'rows/table/91168/'

export function useAdminQuery(props: UseAdminQueryProps) {
  const {
    state: {
      token: { value: token }
    }
  } = usePersistentState({
    store: 'account'
  })
  const {
    initialProps,
    autoFetch,
    sideEffectFunctions: {
      onError: onErrorCallback,
      onSuccess: onSuccessCallback,
      onSettled: onSettledCallback
    }
  }: UseAdminQueryProps = {
    ...props,
    autoFetch: typeof props.autoFetch === 'undefined' ? false : props.autoFetch,
    sideEffectFunctions: {
      ...(typeof props.sideEffectFunctions === 'undefined'
        ? {
            onError(error) {},
            onSuccess(data) {},
            onSettled(data, error) {}
          }
        : props.sideEffectFunctions)
    }
  }

  const [admins, setAdmins] = useState<any[]>([])
  const [pagination, setPagination] = useState({})

  const [page, setPage] = useState(initialProps.page)
  const [pageSize, setPageSize] = useState(initialProps.pageSize)
  const [search, setSearch] = useState(initialProps.search)

  const { debouncedValue: searchDebounced } = useDebounce({
    value: search,
    delay: 500
  })

  useEffect(() => {
    // console.log('updateSearch')
    setSearch(initialProps.search)
  }, [])

  const queryResult = useQuery({
    options: {
      enabled: autoFetch,
      queryKey: [
        {
          endpoint: ENDPOINT,
          page,
          pageSize,
          search
        }
      ],
      onSettled(data, error) {
        if (typeof onSettledCallback === 'function')
          onSettledCallback(data, error)
      },
      onError(error) {
        if (typeof onErrorCallback === 'function') onErrorCallback(error)
      },
      onSuccess(data: any) {
        const {
          data: { count, next, previous, results }
        } = data
        setAdmins((_) => {
          // format data and return formatted data
          const formattedResult = Array.isArray(results)
            ? results.map((admin) =>
                apiFields.reduce((prev, { localPropName, remotePropName }) => {
                  const isSpecialProps = specialProps.some(
                    (prop) => prop === localPropName
                  )
                  return {
                    ...prev,
                    [localPropName]: isSpecialProps
                      ? admin[remotePropName][0]
                      : admin[remotePropName]
                  }
                }, {})
              )
            : []

          if (typeof onSuccessCallback === 'function')
            onSuccessCallback(formattedResult)
          // console.log(formattedResult)
          return formattedResult
        }),
          setPagination((_) => {
            // format data and return formatted data
            return { count, next, previous }
          })
      }
    },
    requestOptions: {
      endpoint: ENDPOINT,
      method: 'GET',
      token: token.length > 0 ? token : 'lktZDvGtDxFzOVJJ0DcsX6123vpKYhyn',
      query: {
        user_field_names: true,
        page: page + 1,
        size: pageSize,
        ...(typeof search === 'string' && search.length > 0 ? { search } : {})
      }
    }
  })

  return {
    queryResult,
    state: {
      apiData: {
        admins: {
          admins
          // setAdmins
        },
        pagination: {
          pagination
          // setPagination
        }
      },
      queryOptions: {
        page: { page, setPage },
        pageSize: { pageSize, setPageSize },
        search: { search, setSearch }
      }
    }
  }
}
