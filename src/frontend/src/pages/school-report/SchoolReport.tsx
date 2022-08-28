import { Img } from '@fe/components'
import {
  Box,
  Button,
  Card,
  Dialog,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Fragment, useEffect } from 'react'
// @ts-ignore
import back from './images/Back.png'
// @ts-ignore
import edit from './images/Edit.png'
// @ts-ignore
import avt from './images/AVT.png'
// import { useMediaQuery } from "react-responsive";
// import { backend } from '@be/backend'
import {
  StudentGrade,
  StudentLog,
  StudentSubject
} from '@be/backend/backend.did'
// import { dao } from '@be/dao'
import { useCanister, useConnect } from '@connect2ic/react'
import { Principal } from '@dfinity/principal'
import { usePersistentState } from '@fe/hooks'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const rowDataTemp = [
  { name: 'Toán' },
  { name: 'Vật Lí' },
  { name: 'Sinh học' },
  { name: 'Tin học' },
  { name: 'Ngữ Văn' },
  { name: 'Lịch sử' },
  { name: 'Địa lí' },
  { name: 'Ngoại ngữ' },
  { name: 'Giáo dục công dân' },
  { name: 'Công nghệ' }
  // { name: 'Thể dục' },
  // { name: 'Giáo dục Quốc phòng - An ninh' },
  // { name: 'Tự chọn (...)' },
  // { name: 'DTB các môn' }
]

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Index' },
  { field: 'name', headerName: 'Môn học' },
  {
    field: 'firstHalfScore',
    headerName: 'Học kỳ 1',
    type: 'number'
  },
  {
    field: 'secondHalfScore',
    headerName: 'Học kỳ 2',
    type: 'number'
  },
  {
    field: 'finalScore',
    headerName: 'Cả năm',
    type: 'number'
  }
]

const subject = (id): StudentSubject => {
  return {
    finalScore: 0,
    firstHalfScore: 0,
    name: rowDataTemp[id].name,
    secondHalfScore: 0
  }
}

const grade: StudentGrade = {
  name: new Date().getFullYear().toString(),
  subjects: Array.from(Array(rowDataTemp.length)).map((sub, id) => subject(id))
}

export function SchoolReport() {
  const [modalOpen, setModalOpen] = useState(false)

  const { state: account, setState: setAccount } = usePersistentState({
    store: 'account'
  })

  const { principal } = useConnect()

  const [backend] = useCanister('backend')
  const [dao] = useCanister('dao')

  const handleSubmit = () => {}

  const [selectedStudentLogId, setSelectedStudentLogId] = useState<number>(-1)

  const [selectedGradeId, setSelectedGradeId] = useState(-1)

  const [selectedStudentGrades, setSelectedStudentGrades] = useState<
    StudentGrade[]
  >([grade])

  const [focus, setFocus] = useState(0)

  const [studentLogs, setStudentLogs] = useState<StudentLog[]>(
    [] as StudentLog[]
  )

  console.log('sample slog')

  // backend.getStudentLog(Principal.fromText(account.principalId)).then(console.log)
  // backend
  //   .getStudentLog(Principal.fromText(account.principalId))
  //   .then(console.log)
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

  useEffect(() => {
    backend
      .getStudentLog(Principal.fromText(account.principalId))
      .then((response: any) => {
        const tmp: StudentLog[] = response.data[0]
        console.log(tmp)
        setStudentLogs(tmp)
      })
  }, [])

  useEffect(() => {
    if (studentLogs.length > 0)
      setSelectedStudentGrades(
        studentLogs.at(selectedStudentLogId)?.newStudent?.grades
      )
  }, [selectedStudentLogId])

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
                      {studentLogs.length > 0 &&
                        studentLogs.map((log, index) => (
                          <MenuItem value={index}>
                            {log.timestamp.toString()}
                            {/* {format(Number(log.timestamp), 'PPPP')} */}
                          </MenuItem>
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
                    disabled={true}
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
                      {studentLogs.length > 0 &&
                        studentLogs
                          .at(selectedStudentLogId)
                          ?.newStudent?.grades.map((log, index) => (
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
                  rows={
                    studentLogs
                      .at(selectedStudentLogId)
                      ?.newStudent?.grades.at(0)
                      .subjects.map((gr, index) => ({
                        id: index + 1,
                        ...gr
                      })) || []
                  }
                  columns={columns}
                  // pageSize={11}
                  // rowsPerPageOptions={[11]}
                  // checkboxSelection
                  disableSelectionOnClick
                  hideFooter
                  autoHeight
                />
              </div>
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
            {selectedStudentGrades
              .at(selectedGradeId)
              .subjects.map((s, index) => (
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
                          tmp[0].subjects[focus].firstHalfScore = Number(value)
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
                          tmp[0].subjects[focus].secondHalfScore = Number(value)
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
                          tmp[0].subjects[focus].finalScore = Number(value)
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
              dao
                .createRequest({
                  reason: 'create',
                  identity: Principal.fromText(account.principalId),
                  student: {
                    grades: [grade]
                  }
                })
                .then((response) => {
                  console.log(response)
                  return response
                })
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
