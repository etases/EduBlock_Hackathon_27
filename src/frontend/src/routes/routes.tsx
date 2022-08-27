import { NormalLayout } from '@fe/components'
import {
  App,
  // Class,
  // ClassCreate,
  // ClassUpdate,
  Home,
  Marketplace,
  Profile
} from '@fe/pages'
import { Navigate, RouteObject } from 'react-router-dom'

const ROLE = {
  ADMIN: 1,
  TEACHER: 2,
  STUDENT: 3,
  GUEST: 'guest',
  ANY: 'any'
} as const

type RoleKeys = keyof typeof ROLE

type RoleValues = typeof ROLE[RoleKeys]

type Role = RoleValues

interface NavigationObject extends RouteObject {
  role?: Role[]
  children?: NavigationObject[]
}

const Anyone: Role[] = Object.values(ROLE)
const Anonymous: Role[] = [ROLE.GUEST]
const Authenticated: Role[] = [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT]

const ROUTES: NavigationObject[] = [
  {
    path: '/',
    element: <App />,
    role: Anyone,
    children: [
      {
        index: true,
        element: <Home />,
        role: Anonymous
      },
      // {
      //   path: 'login',
      //   element: <Login />,
      //   role: Anonymous
      // },
      // {
      //   path: 'school-report',
      //   element: <SchoolReport />,
      //   role: Authenticated
      // },
      {
        path: 'app',
        element: <NormalLayout />,
        role: Authenticated,
        children: [
          {
            index: true,
            element: <Marketplace />,
            role: Anonymous
          },
          {
            path: 'profile',
            element: <Profile />,
            role: Anonymous
          }
          // {
          //   path: 'teacher',
          //   element: <Teacher />,
          //   role: [ROLE.ADMIN]
          // },
          // {
          //   path: 'teacher-pending',
          //   element: <TeacherPending />,
          //   role: [ROLE.ADMIN]
          // },
          // {
          //   path: 'class',
          //   element: <Class />,
          //   role: [ROLE.ADMIN, ROLE.TEACHER]
          // },
          // {
          //   path: 'class-create',
          //   element: <ClassCreate />,
          //   role: [ROLE.ADMIN]
          // },
          // {
          //   path: 'class-update',
          //   element: <ClassUpdate />,
          //   role: [ROLE.ADMIN]
          // },
          // {
          //   path: 'student',
          //   element: <Student />,
          //   role: Authenticated
          // }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" />,
    role: Anyone
  }
]

interface GetRoutesProps {
  role: Role
  routes?: NavigationObject[]
}

const getRoutesDefaultProps: GetRoutesProps = {
  role: 'guest',
  routes: ROUTES
}

export function getRoutes(
  props: GetRoutesProps = getRoutesDefaultProps
): RouteObject[] {
  const { role, routes }: GetRoutesProps = {
    ...props,
    routes: Array.isArray(props.routes) ? props.routes : ROUTES
  }

  const result: RouteObject[] = []

  routes.forEach((r) => {
    try {
      const tmpRoute = r

      if (r.children && r.children.length > 0)
        tmpRoute.children = getRoutes({ role, routes: r.children })

      // if (tmpRoute.role.some((cr) => cr === role || cr === ROLE.ANY))
      result.push(tmpRoute)
    } catch (e) {
      console.debug(e.message)
    }
  })

  return result
}
