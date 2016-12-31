import { worker } from '../src/businessman'

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( state, num ) => {
            return state += num
        },
        set: ( state, num ) => {
            return num
        }
    },
    actions: {
        increment: ( commit, num = 1 ) => {
            commit( 'increment', num )
        },
        set: ( commit, num = 0 ) => {
            commit( 'set', num )
        }
    }
} )

worker.registerStore( {
    type: 'message',
    state: '',
    mutations: {
        update: ( state, mes ) => {
            return mes
        }
    },
    actions: {
        update: ( commit, mes = '' ) => {
            commit( 'update', mes )
        }
    }
} )

worker.registerManager( {
    type: 'countUpMessage',
    handler: ( stores, num = 1 ) => {
        stores.counter.dispatch( 'increment', num )
        stores.message.dispatch( 'update', `${num} has been added to the counter` )
    }
} )

worker.start()
