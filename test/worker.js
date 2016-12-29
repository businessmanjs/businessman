import { worker } from '../src/businessman'

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( store, num ) => {
            store.state += num
        },
        set: ( store, num ) => {
            store.state = num
        }
    },
    actions: {
        increment: ( store, num = 1 ) => {
            store.commit( 'increment', num )
        },
        set: ( store, num = 0 ) => {
            store.commit( 'set', num )
        }
    }
} )

worker.registerStore( {
    type: 'message',
    state: '',
    mutations: {
        update: ( store, mes ) => {
            store.state = mes
        }
    },
    actions: {
        update: ( store, mes = '' ) => {
            store.commit( 'update', mes )
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
