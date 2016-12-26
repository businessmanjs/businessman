import businessman from '../src/businessman'

const worker = businessman.worker

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( store, num ) => {
            store.state = num
        }
    },
    actions: {
        increment: ( store, num = 1 ) => {
            store.commit( 'increment', num )
        }
    }
} )

worker.start()
