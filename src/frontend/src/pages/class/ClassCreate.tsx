import { Table } from '@fe/components'
import { useDebounce } from '@fe/hooks'
import { useStudentQuery, useTeacherQuery } from '@fe/hooks/use-query'
import {
  Badge,
  Class,
  FactCheck,
  NavigateBefore,
  NavigateNext,
  PersonAdd,
  Send
} from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Stack,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { GridColDef } from '@mui/x-data-grid'
import { DatePicker } from '@mui/x-date-pickers'
import { ReactNode, useEffect, useState } from 'react'

const TEXT = {
  CLASS_CREATE: 'Class Create',
  FILL_CLASS_INFO: 'Fill Class information',
  FILL_TEACHER_INFO: 'Fill teacher information',
  FILL_STUDENT_INFO: 'Fill students information',
  FORM_1: 'Form 1',
  FORM_2: 'Form 2',
  FORM_3: 'Form 3'
}

const steps = {
  0: {
    label: TEXT.FORM_1,
    stepIcon: <Class />,
    description: TEXT.FILL_CLASS_INFO
  },
  1: {
    label: TEXT.FORM_2,
    stepIcon: <Badge />,
    description: TEXT.FILL_TEACHER_INFO
  },
  2: {
    label: TEXT.FORM_3,
    stepIcon: <PersonAdd />,
    description: TEXT.FILL_STUDENT_INFO
  }
}

const TOTAL_STEP = Object.keys(steps).length
const LAST_STEP = TOTAL_STEP - 1
const FIRST_STEP = 0

function increase(number: number) {
  return number + 1
}

function decrease(number: number) {
  return number - 1
}

function ClassDetailsForm(props) {
  const {} = props
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  return (
    <Box
      height={'100%'}
      display={'grid'}
      gridTemplateAreas={`"class grade"
                          "start end"`}
      gridTemplateColumns={'50%'}
      gridTemplateRows={'50%'}
      gap={1}
    >
      <Stack gridArea={'class'}>
        <TextField label={'Class'} />
      </Stack>
      <Stack gridArea={'grade'}>
        <TextField label={'Grade'} />
      </Stack>
      <Stack gridArea={'start'}>
        <DatePicker
          label={'Start'}
          value={start}
          onChange={setStart}
          inputFormat={'PPPP'}
          renderInput={(inputProps) => <TextField {...inputProps} />}
          disablePast={true}
        />
      </Stack>
      <Stack gridArea={'end'}>
        <DatePicker
          label={'End'}
          value={end}
          onChange={setEnd}
          inputFormat={'PPPP'}
          renderInput={(inputProps) => <TextField {...inputProps} />}
          disablePast={true}
        />
      </Stack>
    </Box>
  )
}

const teacherColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Row Id'
  },
  {
    field: 'accountId',
    headerName: 'Account Id'
  },
  {
    field: 'principalId',
    headerName: 'Principal Id'
  },
  {
    field: 'firstName',
    headerName: 'First Name'
  },
  {
    field: 'lastName',
    headerName: 'Last Name'
  },
  {
    field: 'address',
    headerName: 'Address'
  },
  {
    field: 'dob',
    headerName: 'Date of Birth'
  },
  {
    field: 'phone',
    headerName: 'Phone'
  },
  {
    field: 'email',
    headerName: 'Email'
  }
]

function ClassTeacherForm(props) {
  const {} = props

  const {
    queryResult,
    state: {
      apiData: {
        teachers: { teachers },
        pagination: { pagination }
      },
      queryOptions: {
        search: { search, setSearch },
        page: { page, setPage },
        pageSize: { pageSize, setPageSize }
      }
    }
  } = useTeacherQuery({
    initialProps: {
      page: 0,
      pageSize: 5,
      search: ''
    }
    // autoFetch: true
  })

  const { debouncedValue: searchDebounced } = useDebounce({
    value: search,
    delay: 1000
  })

  const [selectedTeacher, setSelectedTeacher] = useState<any>({
    id: 0,
    firstName: '',
    lastName: ''
  })

  useEffect(() => {
    queryResult.refetch()
  }, [])

  useEffect(() => {
    queryResult.refetch()
  }, [searchDebounced, page, pageSize])

  useEffect(() => {
    // console.log({ teachers })
  }, [teachers])

  useEffect(() => {
    // console.log({ selectedTeacher })
  }, [selectedTeacher])

  return (
    <Stack
      height={'100%'}
      spacing={1}
    >
      <Stack
        direction={'row'}
        spacing={1}
      >
        <Autocomplete
          fullWidth={true}
          loading={queryResult.isFetching}
          filterOptions={(o) => o}
          value={
            selectedTeacher || {
              id: 0,
              firstName: '',
              lastName: ''
            }
          }
          onChange={(_, value) => {
            setSelectedTeacher(
              value || {
                id: 0,
                firstName: '',
                lastName: ''
              }
            )
          }}
          inputValue={search || ''}
          onInputChange={(_, value) => {
            // if (value !== 'undefined undefined' || value !== undefined)
            setSearch(value)
            // else setSearch('')
          }}
          options={teachers || []}
          getOptionLabel={(option: any) =>
            option.firstName === '' || option.lastName === ''
              ? ''
              : `${option.firstName} ${option.lastName}`
          }
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
      <Box flexGrow={1}>
        <Table
          columns={teacherColumns}
          rows={
            Object.keys(selectedTeacher || {}).length > 0
              ? [selectedTeacher]
                  .filter(
                    (teacher) =>
                      teacher.firstName !== '' && teacher.lastName !== ''
                  )
                  .map((teacher, rowIndex) => ({
                    id: rowIndex,
                    ...teacherColumns.reduce(
                      (prev, curr) => ({
                        ...prev,
                        [curr.field]: teacher[curr.field]
                      }),
                      {}
                    )
                  }))
              : []
          }
          loading={queryResult.isFetching}
          sort={{ onSortModelChange(gridSortModel) {} }}
          filter={{ onFilterModelChange(gridFilterModel) {} }}
          page={{
            page,
            setPage
          }}
          pageSize={{
            pageSize,
            setPageSize
          }}
          rowCount={(pagination as any).count || 0}
        />
      </Box>
    </Stack>
  )
}

const studentColumns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Row Id'
  },
  {
    field: 'accountId',
    headerName: 'Account Id'
  },
  {
    field: 'principalId',
    headerName: 'Principal Id'
  },
  {
    field: 'firstName',
    headerName: 'First Name'
  },
  {
    field: 'address',
    headerName: 'Address'
  },
  {
    field: 'dob',
    headerName: 'Date of Birth'
  },
  {
    field: 'phone',
    headerName: 'Phone'
  },
  {
    field: 'email',
    headerName: 'Email'
  }
]

function ClassStudentsForm(props) {
  const {} = props

  const {
    queryResult,
    state: {
      apiData: {
        students: { students },
        pagination: { pagination }
      },
      queryOptions: {
        search: { search, setSearch },
        page: { page, setPage },
        pageSize: { pageSize, setPageSize }
      }
    }
  } = useStudentQuery({
    initialProps: {
      page: 0,
      pageSize: 1,
      search: ''
    }
    // autoFetch: true
  })

  const { debouncedValue: searchDebounced } = useDebounce({
    value: search,
    delay: 1000
  })

  const [selectedStudent, setSelectedStudent] = useState<any>({})
  const [selectedStudentList, setSelectedStudentList] = useState<any[]>([])

  useEffect(() => {
    queryResult.refetch()
  }, [])

  useEffect(() => {
    queryResult.refetch()
  }, [searchDebounced, page, pageSize])

  useEffect(() => {
    // console.log({ students })
  }, [students])

  useEffect(() => {
    // console.log({ selectedStudentList })
  }, [selectedStudentList])

  return (
    <Stack
      height={'100%'}
      spacing={1}
    >
      <Stack
        direction={'row'}
        spacing={1}
      >
        <Autocomplete
          fullWidth={true}
          loading={queryResult.isFetching}
          filterOptions={(o) => o}
          value={selectedStudent || ''}
          onChange={(_, value) => {
            setSelectedStudent(value || '')
            setSelectedStudentList((currentValue) => [...currentValue, value])
          }}
          inputValue={search}
          onInputChange={(_, value) => {
            setSearch(value)
          }}
          options={students}
          getOptionLabel={(option: any) =>
            `${option.firstName} ${option.lastName}`
          }
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
      <Box flexGrow={1}>
        <Table
          columns={studentColumns}
          rows={
            selectedStudentList.map((student, rowIndex) => ({
              id: rowIndex,
              ...studentColumns.reduce(
                (prev, curr) => ({
                  ...prev,
                  [curr.field]: student[curr.field]
                }),
                {}
              )
            })) || []
          }
          loading={queryResult.isFetching}
          sort={{ onSortModelChange(gridSortModel) {} }}
          filter={{ onFilterModelChange(gridFilterModel) {} }}
          page={{
            page,
            setPage
          }}
          pageSize={{
            pageSize,
            setPageSize
          }}
          rowCount={(pagination as any).count || 0}
        />
      </Box>
    </Stack>
  )
}

const forms = {
  0: ClassDetailsForm,
  1: ClassTeacherForm,
  2: ClassStudentsForm
}

function getForm(step, props) {
  if (typeof forms[step] === 'undefined') return null
  const FormComponent = forms[step]
  return <FormComponent {...props} />
}

function stepIconComponent(props: StepIconProps, icon: ReactNode) {
  const { active, completed, className } = props
  return (
    <Box
      className={className}
      color={active || completed ? '#6B6AB7' : grey[400]}
      sx={{
        opacity: completed ? 0.8 : 1
      }}
    >
      {completed ? <FactCheck /> : icon}
    </Box>
  )
}

export function ClassCreate() {
  const [activeStep, setActiveStep] = useState(0)
  const [classDetails, setClassDetails] = useState({
    class: '',
    grade: '',
    start: '',
    end: ''
  })
  const [teacher, setTeacher] = useState<any>({})
  const [students, setStudent] = useState<any[]>([])

  return (
    <Stack
      width={'100%'}
      height={'100%'}
      divider={<Divider />}
    >
      <Stack
        width={'100%'}
        height={'30%'}
        alignItems={'center'}
      >
        {/* <Typography variant={'h5'}>{TEXT.CLASS_CREATE}</Typography> */}
        <Typography variant={'h5'}>{steps[activeStep].description}</Typography>
        <Stepper
          sx={{
            width: '50%'
          }}
          alternativeLabel={true}
          activeStep={activeStep}
          // connector={<></>}
        >
          {Object.entries(steps).map(
            ([currentStep, { label, stepIcon }], index) => {
              return (
                <Step
                  key={`${label
                    .split(' ')
                    .join('_')}__${currentStep}__${index}`}
                  completed={activeStep > parseInt(currentStep)}
                >
                  <StepLabel
                    StepIconComponent={(props: StepIconProps) =>
                      stepIconComponent(props, stepIcon)
                    }
                  >
                    <Typography>{label}</Typography>
                  </StepLabel>
                </Step>
              )
            }
          )}
        </Stepper>
      </Stack>
      <Stack
        height={'70%'}
        justifyContent={'space-between'}
      >
        <Box
          flexGrow={1}
          paddingY={1}
        >
          {getForm(activeStep, {})}
        </Box>
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
        >
          <Button
            onClick={() => {
              setActiveStep((current) =>
                current > FIRST_STEP ? decrease(current) : current
              )
              // queryResult.refetch()
            }}
            disabled={activeStep === FIRST_STEP}
            startIcon={<NavigateBefore />}
            variant={'outlined'}
          >
            <Typography>Prev</Typography>
          </Button>
          <Button
            sx={{
              background: '#6B6AB7',
              color: 'white',
              ':hover': {
                background: '#6B6AB7'
              }
            }}
            onClick={() => {
              setActiveStep((current) =>
                current < LAST_STEP ? increase(current) : current
              )
              // queryResult.refetch()
            }}
            endIcon={activeStep === LAST_STEP ? <Send /> : <NavigateNext />}
            // variant={'contained'}
          >
            <Typography>
              {activeStep === LAST_STEP ? 'Send' : 'Next'}
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
