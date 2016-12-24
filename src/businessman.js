import worker from './worker'
import install from './install'
import dispatch from './dispatch'
import subscribe from './subscribe'

let businessman = {},
    businessmanWoker = null

const api = {
    install: function ( path ) {
        install( path, businessmanWoker )
    },
    dispatch: function ( action, payload ) {
        dispatch( action, payload, businessmanWoker )
    },
    subscribe: function ( store, cb ) {
        subscribe( store, cb )
    }
}

for ( let prop in api ) {
    Object.defineProperties( businessman, {
        [ prop ]: {
            value: api[ prop ],
            enumerable: false,
            writable: false,
            configurable: false
        }
    } )
}

export let worker = worker

export default businessman
