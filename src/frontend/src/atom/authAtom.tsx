import { atomWithStorage } from 'jotai/utils'

const loggedInIdentity = atomWithStorage('identity', false)
