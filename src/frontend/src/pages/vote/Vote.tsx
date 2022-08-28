import { Button, Stack } from '@mui/material'

// import { dao } from '@be/dao'
import { StudentUpdateRequestResponse } from '@be/dao/dao.did'
import { useCanister, useConnect } from '@connect2ic/react'
import { Table } from '@fe/components'
import { useEffect, useState } from 'react'

export function Vote() {
  const { principal } = useConnect()

  const [dao, { loading, error }] = useCanister('dao')

  const [pendingList, setPendingList] = useState<
    StudentUpdateRequestResponse[]
  >([])
  const [canVote, setCanVote] = useState(false)

  useEffect(() => {
    dao.getIncomingRequests().then((data) => {
      setPendingList(data as StudentUpdateRequestResponse[])
      // console.log('pending list', data)
      return data
    })
    dao.canIVote().then((data) => {
      setCanVote(data as boolean)
      // console.log('can vote', data)
      return data
    })
  }, [])

  return (
    <Stack
      width={'100%'}
      height={'100%'}
    >
      {/* <Box flexGrow={1}> */}
      <Table
        columns={[
          { field: 'id', headerName: 'Id' },
          { field: 'action', headerName: 'Action' }
        ]}
        rows={pendingList.map((item) => ({
          id: item.id,
          action: (
            <Stack>
              <Button>Action</Button>
            </Stack>
          )
        }))}
        filter={{
          onFilterModelChange(gridFilterModel) {}
        }}
        loading={false}
        page={{
          page: 0,
          setPage(page) {}
        }}
        pageSize={{
          pageSize: 20,
          setPageSize(size) {}
        }}
        rowCount={pendingList.length}
        sort={{
          onSortModelChange(gridSortModel) {}
        }}
      />
      {/* </Box> */}
    </Stack>
  )
}
