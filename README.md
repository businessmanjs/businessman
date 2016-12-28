Multi-thread State Management by the Worker API.

# API

## Create Store

Outline

```
import businessman from 'businessman'

const worker = businessman.worker

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( store, num ) => {
            store.state += num
        }
    },
    actions: {
        increment: ( store, num = 1 ) => {
            store.commit( 'increment', num )
        }
    }
} )
```

### Type

Type is a string that is the identity of the store. This needs to be unique.

```
type: 'counter'
```

### State

Save the state of the store. Any type can be used for the state.

```
state: 0
```

### Mutations

Change the state. After that, the new state is automatically notified to the main thread.

The first argument of the mutation is the store instance.

For example, to update the state by changing the `store.state`.

```
increment: ( store, num ) => {
    store.state += num
}
```

ATTENTION
- Do not place asynchronous processing on mutations.

### Actions

Execute the mutation. Asynchronous processing can be placed on the action.

The first argument of the action is the store instance.

For example, call `store.commit()` to execute the mutation.

```
increment: ( store, num = 1 ) => {
    store.commit( 'increment', num )
}
```

## Start worker

Call `businessman.worker.start()` to start a worker.

```
businessman.worker.start()
```

When added to the source of the Create Store as shown earlier, it becomes as follows.

```
import businessman from 'businessman'

const worker = businessman.worker

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( store, num ) => {
            store.state += num
        }
    },
    actions: {
        increment: ( store, num = 1 ) => {
            store.commit( 'increment', num )
        }
    }
} )

worker.start()
```

## Install worker

Install workers and start state management.

```
businessman.install( '/path/to/worker.js' )
```

ATTENTION
- Workers need to be converted for browsers with arbitrary compiler.

## Dispatch and Subscribe

```
businessman.dispatch( 'counter', 'increment', 1 )

businessman.subscribe( 'counter', ( state ) => {
    console.log( state ) // 1
} )
```

Dispatch / Subscribe is also available in Store style.

```
counter.dispatch( 'increment', 1 )

counter.subscribe( ( state ) => {
    console.log( state )
} )
```

The store style is available after the store in the worker has been created for the client. It can be obtained by subscribing `CREATE_CLIENT_STORE`.

```
let counter

businessman.subscribe( 'CREATE_CLIENT_STORE', ( stores ) => {
    console.log( stores ) // { counter: { dispatch: function () {...}, subscribe: function () {...} } }
    counter = stores.counter
} )
```

# Feel free to join

[GitLab Project](https://gitlab.com/aggre/businessman/boards)
