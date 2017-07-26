import worker from './worker'
import _install from './install'
import _dispatch from './dispatch'
import _operate from './operate'
import _subscribe from './subscribe'
import _unsubscribe from './unsubscribe'
import _getState from './get-state'
import _getAllState from './get-all-state'

let businessmanWoker = null

const install = path => {
	businessmanWoker = _install(path, businessmanWoker)
}
const dispatch = (storeType, actionType, payload) => _dispatch(storeType, actionType, payload, businessmanWoker)
const operate = (managerType, payload) => _operate(managerType, payload, businessmanWoker)
const subscribe = (type, cb) => _subscribe(type, cb)
const unsubscribe = (type, cb) => _unsubscribe(type, cb)
const getState = (storeType, getter, options) => _getState(storeType, getter, options, businessmanWoker)
const getAllState = () => _getAllState(businessmanWoker)

export {
    install,
    dispatch,
    operate,
    subscribe,
    unsubscribe,
    getState,
	getAllState,
    worker
}
