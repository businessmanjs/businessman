import { GET_STATE } from '../behaviorTypes'

const mutations = {
    [ GET_STATE ]: ( store ) => store.state = store.state
}

export default mutations
