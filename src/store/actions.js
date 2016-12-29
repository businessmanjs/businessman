import { GET_STATE } from '../behaviorTypes'

const actions = {
    [ GET_STATE ]: ( store ) => store.commit( GET_STATE )
}

export default actions
