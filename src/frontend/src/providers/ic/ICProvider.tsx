import * as backend from '@be/backend'
import * as dao from '@be/dao'
import * as token from '@be/token'
import { createClient } from '@connect2ic/core'
import { PlugWallet } from '@connect2ic/core/providers'
import { Connect2ICProvider as Provider } from '@connect2ic/react'
import { ReactNode } from 'react'

import { BaseInterface } from '@fe/constants'

const client = createClient({
  providers: [new PlugWallet()],
  canisters: { backend, dao, token }
})

interface ICProviderProps extends BaseInterface {
  children: ReactNode
}

export function ICProvider(props: ICProviderProps) {
  const { children } = props
  return <Provider client={client}>{children}</Provider>
}
