import * as React from 'react'
import { useEffect, Fragment } from 'react'
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  Card,
  CardMedia,
  styled,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  Grid,
  Menu,
  List,
  MenuItem,
  ListItemText,
  ListItem
} from '@mui/material'
import { Img, Table } from '@fe/components'
// @ts-ignore
import back from './images/Back.png'
// @ts-ignore
import edit from './images/Edit.png'
// @ts-ignore
import avt from './images/AVT.png'
// import { useMediaQuery } from "react-responsive";
import { GridColDef, GridRowsProp, DataGrid } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { useStudentQuery } from '@fe/hooks/use-query'
import { usePersistentState } from '@fe/hooks'
import { useCanister, useConnect } from '@connect2ic/react'
// import { backend } from '@be/backend'
import {
  StudentSubject,
  StudentGrade,
  Student,
  StudentLog
} from '@be/backend/backend.did'
import { Principal } from '@dfinity/principal'
import { useState } from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import { dao } from '@be/dao'
import { backend } from '@be/backend'

const options = ['Chọn lớp học', '10', '11', '12']

const colDialog: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Mon hoc'
  },
  {
    field: 'firstHalfScore',
    headerName: 'HKI',
    editable: true
  },
  {
    field: 'secondHalfScore',
    headerName: 'HKII',
    editable: true
  }
]

export function SchoolReport() {
  const rowDataTemp = [
    { name: 'Toán' },
    { name: 'Vật Lí' },
    { name: 'Sinh học' },
    { name: 'Tin học' },
    { name: 'Ngữ Văn' },
    { name: 'Lịch sử' },
    { name: 'Địa lí' },
    { name: 'Ngoại ngữ (Tiếng Anh)' },
    { name: 'Giáo dục công dân' },
    { name: 'Công nghệ' },
    { name: 'Thể dục' },
    { name: 'Giáo dục Quốc phòng - An ninh' },
    { name: 'Tự chọn (...)' },
    { name: 'DTB các môn' }
  ]

  const [modalOpen, setModalOpen] = useState(false)

  const { state: account, setState: setAccount } = usePersistentState({
    store: 'account'
  })

  const handleSubmit = () => {}

  const [selectedStudentLogId, setSelectedStudentLogId] = useState<number>(-1)

  const [selectedGradeId, setSelectedGradeId] = useState(-1)

  const [selectedStudentGrades, setSelectedStudentGrades] = useState<
    StudentSubject[]
  >([])

  const [focus, setFocus] = useState(0)

  const [studentLogs, setStudentLogs] = useState<StudentLog[]>(
    Array.from(Array(10)).map((_, index) => {
      const subject = (id) => {
        return {
          finalScore: index,
          firstHalfScore: index,
          name: rowDataTemp[id].name,
          resitScore: index,
          secondHalfScore: index,
          teacherName: 'tea'
        } as StudentSubject
      }
      const grade: StudentGrade = {
        name: 'gr',
        subjects: Array.from(Array(rowDataTemp.length)).map((sub, id) =>
          subject(id)
        )
      }
      const sl: StudentLog = {
        newStudent: {
          grades: [grade, grade, grade]
        },
        oldStudent: {
          grades: [grade, grade, grade]
        },
        requester: Principal.fromText('aaaaa-aa'),
        timestamp: BigInt(index)
      }

      return sl
    })
  )

  console.log('sample slog')

  // backend.getStudentLog(Principal.fromText(account.principalId)).then(console.log)
  // backend
  //   .getStudentLog(Principal.fromText(account.principalId))
  //   .then(console.log)

  const { principal } = useConnect()

  // const [dao, { error, loading }] = useCanister('dao')

  useEffect(() => {
    // dao.createRequest({
    //   identity: principal,
    //   reason: 'new',
    //   student: {
    //     grades:
    //   }
    // })
    backend.getStudentLog(Principal.fromText(principal)).then((response) => {
      console.log('log', response)
      return response
    })
  }, [])

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/login')
  }

  //   finalScore: 0/
  // firstHalfScore: 0/
  // name: "na"/
  // resitScore: 0
  // secondHalfScore: 0/
  // teacherName: "tea"
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Index', hide: true },
    { field: 'name', headerName: 'Môn học', width: 400 },
    {
      field: 'firstHalfScore',
      headerName: 'Học kỳ 1',
      type: 'number',
      width: 150
    },
    {
      field: 'secondHalfScore',
      headerName: 'Học kỳ 2',
      type: 'number',
      width: 150
    },
    {
      field: 'finalScore',
      headerName: 'Cả năm',
      type: 'number',
      width: 150
    }
  ]

  const columnsTemp: GridColDef[] = [
    { field: 'id', headerName: 'Index', hideable: true },
    { field: 'name', headerName: 'Môn học' },
    {
      field: 'firstHalfScore',
      headerName: 'Học kỳ 1',
      type: 'number',
      editable: true
    },
    {
      field: 'secondHalfScore',
      headerName: 'Học kỳ 2',
      type: 'number',
      editable: true
    },
    {
      field: 'finalScore',
      headerName: 'Cả năm',
      type: 'number',
      editable: true
    }
  ]

  // replace Array.from(Array(10)) with data from API, use rowId from API instead of rowIndex
  const rows: GridRowsProp = Array.from(Array(10)).map((_, rowIndex) => ({
    id: rowIndex,
    ...columns.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.field]: `${curr.headerName}__${rowIndex}`
      }
    }, {})
  }))

  const rowData = [
    { name: 'Toán', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Vật Lí', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Sinh học', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Tin học', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Ngữ Văn', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Lịch sử', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Địa lí', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Ngoại ngữ (Tiếng Anh)', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Giáo dục công dân', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Công nghệ', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Thể dục', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Giáo dục Quốc phòng - An ninh', HK1: 0, HK2: 0, CN: 0 },
    { name: 'Tự chọn (...)', HK1: 0, HK2: 0, CN: 0 },
    { name: 'DTB các môn', HK1: 0, HK2: 0, CN: 0 }
  ]

  // const columns = [
  //   {
  //     field: 'name',
  //     headerName: 'Name',
  //     editable: true
  //   },
  //   {
  //     field: 'address',
  //     headerName: 'Address',
  //     editable: true
  //   }
  // ]

  //const [counter, { loading, error }] = useCanister("counter")

  useEffect(() => {
    setSelectedStudentGrades(
      studentLogs.at(selectedStudentLogId).newStudent.grades.at(selectedGradeId)
        .subjects
    )
  }, [selectedGradeId, selectedStudentLogId])

  useEffect(() => {
    console.log(selectedStudentGrades)
  }, [selectedStudentGrades])

  return (
    <Box
      className={'main'}
      display={'grid'}
      width={'100%'}
      height={'100vh'}
      bgcolor={'#a8a6fe'}
      color={'#fff'}
      gridTemplateAreas={`"Info Table"`}
      gridTemplateColumns={'50% 50%'}
      fontFamily={'Poppins'}
    >
      {/* INFO SIDE */}
      <Box
        gridArea={'Info'}
        bgcolor={'#fff'}
        paddingTop="5vh"
      >
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="stretch"
          spacing={0.5}
        >
          {/* 2 BUTTONS */}
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="baseline"
            spacing={2}
          >
            <Button
              onClick={handleClick}
              sx={{
                background: '#c0c4c4',
                color: 'white',
                textTransform: 'initial',
                width: '160px',
                borderRadius: '5'
              }}
            >
              <Typography
                fontSize="1rem"
                variant={'subtitle2'}
              >
                {'Trở lại'} &emsp;&emsp;
              </Typography>
              <Box
                component={Img}
                src={back}
                height={'25px'}
              ></Box>
            </Button>
            {/* <Button
              sx={{
                background: '#f89c14',
                color: 'white',
                textTransform: 'initial',
                width: '160px'
              }}
            >
              <Typography
                fontSize="1rem"
                variant={'subtitle2'}
              >
                {'Cập nhật'} &emsp;&emsp;&emsp;
              </Typography>
              <Box
                component={Img}
                src={edit}
                height={'25px'}
              ></Box>
            </Button> */}
          </Stack>

          {/* 1 AVATAR and 3 INPUTs */}
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="baseline"
            spacing={0.5}
            height={'350px'}
            width={'100%'}
            paddingTop={'20px'}
          >
            <Card
              sx={{ display: 'flex' }}
              style={{ border: 'none', boxShadow: 'none' }}
            >
              <Box
                component={Img}
                src={avt}
                height={'20%'}
                width={'45%'}
              ></Box>
              <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="stretch"
                spacing={2.5}
                width={'55%'}
                paddingTop={'10%'}
                paddingLeft={'10%'}
              >
                <TextField
                  //error
                  id="outlined-error-helper-text"
                  label="Họ"
                  value={account.firstName}
                />
                <TextField
                  //error
                  id="outlined-error-helper-text"
                  label="Tên"
                  value={account.lastName}
                />
                <FormControl>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={account.gender}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="F"
                      control={<Radio />}
                      label="Nữ"
                    />
                    <FormControlLabel
                      value="M"
                      control={<Radio />}
                      label="Nam"
                    />
                  </RadioGroup>
                </FormControl>
              </Stack>
            </Card>
          </Stack>

          {/* 4 INPUTS */}
          <Stack
            direction="column"
            justifyContent="space-evenly"
            alignItems="stretch"
            spacing={3.5}
            width={'100%'}
          >
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="baseline"
              spacing={3.5}
            >
              <TextField
                //error
                id="outlined-error-helper-text"
                label="Số điện thoại"
                value={account.phone}
              />
              <TextField
                //error
                id="outlined-error-helper-text"
                label="Ngày Sinh"
                value={account.dateOfBirth}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-evenly"
              alignItems="baseline"
              spacing={3.5}
            >
              <TextField
                //error
                id="outlined-error-helper-text"
                label="Chỗ ở hiện tại"
                value={account.address}
              />
              <TextField
                //error
                id="outlined-error-helper-text"
                label="Dân tộc"
                value={account.ethnic.value}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* TABLE SIDE */}
      <Box gridArea={'Table'}>
        <Stack
          direction="column"
          justifyContent="space-around"
          alignItems="stretch"
          spacing={0.5}
          //height={'100vh'}
        >
          {/* EDUBLOCK */}
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            minHeight={'20vh'}
          >
            <p>
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
                  {'Edu'}
                </Typography>
                <Typography
                  fontSize={'7rem'}
                  style={{ fontWeight: 'bold' }}
                  height={'10%'}
                  color={'#706cb4'}
                >
                  {'Block'}
                </Typography>
              </Stack>
            </p>
          </Stack>

          <Stack
            direction="column"
            justifyContent="space-evenly"
            alignItems="stretch"
            minHeight="5vh"
            spacing={0}
          >
            {/* 2 SELECTS && 1 BUTTON */}
            <Stack
              direction="column"
              justifyContent="space-around"
              alignItems="stretch"
              spacing={0.5}
              height={'8vh'}
              bgcolor="#fff"
            >
              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={2}
              >
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={2}
                >
                  {/* <Typography color={'#000'}>Lịch sử:</Typography>
                  <Select
                    value={selectedStudentLog}
                    onChange={({ target: { value } }) => {
                      setSelectedStudentLog(Number(value))
                    }}
                  >
                    {studentLogs.map((log, index) => (
                      <MenuItem value={index}>{index}</MenuItem>
                    ))}
                  </Select> */}
                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small">Lịch sử</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      label="Lịch sử"
                      value={selectedStudentLogId}
                      onChange={({ target: { value } }) => {
                        setSelectedStudentLogId(Number(value))
                      }}
                    >
                      {studentLogs.map((log, index) => (
                        <MenuItem value={index}>{index + 1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={2}
                >
                  {/*<Typography color={'#000'}>Khối:</Typography>
                   <Select
                    value={selectedGrade}
                    onChange={({ target: { value } }) => {
                      setSelectedStudentGrade(Number(value))
                    }}
                  >
                    {studentLogs
                      .at(selectedStudentLog)
                      .newStudent.grades.map((log, index) => (
                        <MenuItem value={index}>{index}</MenuItem>
                      ))}
                  </Select> */}
                  <FormControl
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                  >
                    <InputLabel id="demo-select-small">Khối</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      label="Khối"
                      value={selectedGradeId}
                      onChange={({ target: { value } }) => {
                        setSelectedGradeId(Number(value))
                      }}
                    >
                      {studentLogs
                        .at(selectedStudentLogId)
                        .newStudent.grades.map((log, index) => (
                          <MenuItem value={index}>{index + 10}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Button
                  sx={{
                    background: '#f89c14',
                    color: 'white',
                    textTransform: 'initial',
                    alignContent: 'flex-end'
                  }}
                  onClick={() => setModalOpen(true)}
                >
                  <Typography
                    fontSize="1rem"
                    variant={'subtitle2'}
                  >
                    {'Cập nhật bảng điểm'}
                  </Typography>
                </Button>
              </Stack>
            </Stack>

            {/* TABLE */}
            <Stack
              direction="column"
              justifyContent="space-around"
              alignItems="stretch"
              spacing={0.5}
              height={'90vh'}
              bgcolor="#fff"
              paddingBottom={'35px'}
            >
              {/* TEMP TABLE component={DataGrid}*/}
              <div style={{ height: '100%', width: '50vw' }}>
                <DataGrid
                  rows={studentLogs
                    .at(selectedStudentLogId)
                    .newStudent.grades.at(selectedGradeId)
                    .subjects.map((gr, index) => ({
                      id: index,
                      ...gr
                    }))}
                  columns={columns}
                  // pageSize={11}
                  // rowsPerPageOptions={[11]}
                  // checkboxSelection
                  disableSelectionOnClick
                  hideFooter
                  autoHeight
                />
              </div>
              {/* <Stack height={'100%'}>
                <Table
                  columns={columns}
                  rows={studentLogs
                    .at(selectedStudentLog)
                    .newStudent.grades.at(selectedGrade)
                    .subjects.map((gr, index) => ({
                      id: index,
                      ...gr
                    }))}
                  loading={false}
                  rowCount={rows.length}
                  hide={true}
                  hideFooter={true}
                  autoHeight={true}
                  page={{
                    page: 0,
                    setPage(page) {
                      // set page for query
                    }
                  }}
                  pageSize={{
                    pageSize: 15,
                    setPageSize(size) {
                      // set page size for query
                    }
                  }}
                  sort={{
                    onSortModelChange(gridSortModel) {
                      // set query here
                    }
                  }}
                  filter={{
                    onFilterModelChange(gridFilterModel) {
                      // set query here
                    }
                  }}
                />
              </Stack> */}
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Dialog
        maxWidth={'md'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Stack
          padding="40px 40px 40px 40px"
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          height={'100%'}
        >
          <Grid
            container={true}
            fontSize="2.5vh"
          >
            <Grid
              item={true}
              md={3}
              width={'50%'}
            >
              Môn học
            </Grid>
            <Grid
              item={true}
              md={3}
              width={'50%'}
            >
              Học kỳ 1
            </Grid>
            <Grid
              item={true}
              md={3}
              width={'50%'}
            >
              Học kỳ 2
            </Grid>
            <Grid
              item={true}
              md={3}
              width={'50%'}
            >
              Cả năm
            </Grid>
            {selectedStudentGrades.map((s, index) => (
              <Fragment key={`${s.name}__${index}`}>
                <Grid
                  item={true}
                  md={3}
                  width={'50%'}
                >
                  <Typography fontSize="2vh">{s.name}</Typography>
                </Grid>
                <Grid
                  item={true}
                  md={3}
                  width={'50%'}
                >
                  <TextField
                    onFocus={() => setFocus(index)}
                    value={s.firstHalfScore}
                    onChange={({ target: { value } }) => {
                      setSelectedStudentGrades((prev) => {
                        const tmp = [...prev]
                        tmp[focus].firstHalfScore = Number(value)
                        console.log(tmp[focus])
                        return tmp
                      })
                    }}
                    variant={'standard'}
                  />
                </Grid>
                <Grid
                  item={true}
                  md={3}
                  width={'50%'}
                >
                  <TextField
                    onFocus={() => setFocus(index)}
                    value={s.secondHalfScore}
                    onChange={({ target: { value } }) => {
                      setSelectedStudentGrades((prev) => {
                        const tmp = [...prev]
                        tmp[focus].secondHalfScore = Number(value)
                        return tmp
                      })
                    }}
                    variant={'standard'}
                  />
                </Grid>
                <Grid
                  item={true}
                  md={3}
                  width={'50%'}
                >
                  <TextField
                    onFocus={() => setFocus(index)}
                    value={s.finalScore}
                    onChange={({ target: { value } }) => {
                      setSelectedStudentGrades((prev) => {
                        const tmp = [...prev]
                        tmp[focus].finalScore = Number(value)
                        return tmp
                      })
                    }}
                    variant={'standard'}
                  />
                </Grid>
              </Fragment>
            ))}
          </Grid>

          {/* <div style={{ height: '80vh', width: '50vw' }}>
          <DataGrid
              rows={selectedStudentGrades.map((gr, index) => ({
                id: index,
                ...gr
              }))}
              columns={columnsTemp}
              // pageSize={11}
              // rowsPerPageOptions={[11]}
              // checkboxSelection
              onCellModesModelChange={(model, details) => {
                
              }}
              disableSelectionOnClick
              hideFooter
              autoHeight
            /> */}
          {/* <Table
            columns={colDialog}
            rows={selectedStudentGrades.map((row, index) => ({
              id: index,
              ...row
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
              pageSize: 14,
              setPageSize(size) {}
            }}
            rowCount={selectedStudentGrades.length}
            sort={{
              onSortModelChange(gridSortModel) {}
            }}
          /> */}
          {/* </div> */}

          {/* <Button onClick={handleSubmit}>Cập nhật</Button> */}
          <Button
            // onClick={handleSubmit}
            onClick={() => {
              console.log(selectedStudentGrades)
            }}
            sx={{
              background: '#f89c14',
              color: 'white',
              textTransform: 'initial',
              height: '5vh',
              width: '15vw'
            }}
          >
            <Typography
              fontSize="1rem"
              variant={'subtitle2'}
            >
              {'Cập nhật'} &emsp;&emsp;&emsp;
            </Typography>
            <Box
              component={Img}
              src={edit}
              height={'25px'}
            ></Box>
          </Button>
        </Stack>
      </Dialog>
    </Box>
  )
}
