import {
  Button,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

// import { dao } from '@be/dao'
import { StudentUpdateRequestResponse } from '@be/dao/dao.did'
import { useCanister, useConnect } from '@connect2ic/react'
// import { Table } from '@fe/components'
import { useEffect, useState } from 'react'

export function Vote() {
  const { principal } = useConnect()

  const [dao, { loading, error }] = useCanister('dao')

  const [pendingList, setPendingList] = useState<
    StudentUpdateRequestResponse[]
  >([])

  const [canVote, setCanVote] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<StudentUpdateRequestResponse>()

  useEffect(() => {
    dao.getIncomingRequests().then((data) => {
      setPendingList(data as StudentUpdateRequestResponse[])
      console.log('pending list', data)
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Identity</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingList.length > 0 &&
              pendingList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id.toString()}</TableCell>
                  <TableCell>{item?.request.identity.toString()}</TableCell>
                  <TableCell>{item?.request.reason}</TableCell>
                  <TableCell>{item?.request.requester.toString()}</TableCell>
                  <TableCell>
                    <Stack>
                      <Button
                        onClick={() => {
                          setModalOpen(true)
                          setSelectedRow(item)
                        }}
                      >
                        Details
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth={'lg'}
      >
        <TableContainer>
          <Table>
            {/* {item.request.student.grades[0].subjects.map((subject) => {})} */}
            <TableHead>
              <TableRow>
                <TableCell>Môn học</TableCell>
                <TableCell>HKI</TableCell>
                <TableCell>HKII</TableCell>
                <TableCell>Cả năm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedRow?.request.student.grades[0].subjects.map(
                (subject) => (
                  <TableRow>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.firstHalfScore}</TableCell>
                    <TableCell>{subject.secondHalfScore}</TableCell>
                    <TableCell>{subject.finalScore}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={'row'}>
          <Button
            onClick={() => {
              dao
                .vote({
                  vote: false,
                  requestId: selectedRow.id
                })
                .then(console.log)
            }}
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              dao
                .vote({
                  vote: true,
                  requestId: selectedRow.id
                })
                .then(console.log)
            }}
          >
            Verify
          </Button>
          <Button
            onClick={() => {
              dao.canIVote().then(console.log)
            }}
          >
            CanIVote
          </Button>
        </Stack>
      </Dialog>
      {/* <Table
        columns={[
          { field: 'id', headerName: 'Id' },
          { field: 'identity', headerName: 'Identity' },
          { field: 'reason', headerName: 'Reason' },
          { field: 'requester', headerName: 'Requester' },
          { field: 'action', headerName: 'Action' }
        ]}
        rows={pendingList.map((item) => ({
          id: item.id,
          identity: item.request.identity.toString(),
          requester: item.request.requester.toString(),
          reason: item.request.reason,
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
      /> */}
      {/* </Box> */}
    </Stack>
  )
}
