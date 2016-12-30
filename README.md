Multi-thread State Management by the Worker API.

<img src="https://aggre.gitlab.io/businessman/assets/businessman.png" alt="Businessman" width="750">

# API

## Create Store

Overview

```
import { worker } from 'businessman'

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( set, state, num ) => {
            set( state += num )
        }
    },
    actions: {
        increment: ( commit, num = 1 ) => {
            commit( 'increment', num )
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

Pass the new value to the function of the first argument of the mutation. The current state and payload are provided from other arguments.

```
increment: ( set, state, num ) => {
    set( state += num )
}
```

ATTENTION
- Do not place asynchronous processing on mutations.

### Actions

Execute the mutation. Asynchronous processing can be placed on the action.

Pass the mutation name to the function of the first argument of the action. The payload is provided from the second argument.

```
increment: ( commit, num = 1 ) => {
    commit( 'increment', num )
}
```

## Create Manager

Mutation and action belong to one store.

If you want to dispatch to multiple stores at the same time, you can use the manager.

The manager has registered it using `worker.registerManager()`.

```
import { worker } from 'businessman'

worker.registerManager( {
    type: 'countUpMessage',
    handler: ( stores, num = 1 ) => {
        stores.counter.dispatch( 'increment', num )
        stores.message.dispatch( 'update', `${num} has been added to the counter` )
    }
} )
```

Call `operate()` with manager type and payload specified.

```
import { operate } from 'businessman'

operate( 'countUpMessage', 1 )
```

## Start worker

Call `worker.start()` to start a worker.

```
worker.start()
```

When added to the source of the Create Store as shown earlier, it becomes as follows.

```
import { worker } from 'businessman'

worker.registerStore( {
    type: 'counter',
    state: 0,
    mutations: {
        increment: ( set, state, num ) => {
            set( state += num )
        }
    },
    actions: {
        increment: ( commit, num = 1 ) => {
            commit( 'increment', num )
        }
    }
} )

worker.start()
```

## Install worker

Install workers and start state management.

```
import { install } from 'businessman'

install( '/path/to/worker.js' )
```

ATTENTION
- Workers need to be converted for browsers with arbitrary compiler.

## Dispatch and Subscribe

```
import { dispatch, subscribe } from 'businessman'

dispatch( 'counter', 'increment', 1 )

subscribe( 'counter', ( state ) => {
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

subscribe( 'CREATE_CLIENT_STORE', ( stores ) => {
    console.log( stores ) // { counter: { dispatch: function () {...}, subscribe: function () {...}, unsubscribe: function () {...}, getState: function () {...} } }
    counter = stores.counter
} )
```

## Unsubscribe

You can stop / delete subscribe.

```
import { unsubscribe } from 'businessman'

unsubscribe( 'counter' ) // Delete all listeners subscribing to the store
unsubscribe( 'counter', listener ) // Delete one listener
```

For store style ...

```
counter.unsubscribe()
counter.unsubscribe( listener )
```

## getState

In Businessman `getState()` is also executed asynchronously.

```
counter.getState()
.then( ( state ) => {
    console.log( state )
} )
```

# How to contribute

See Board on GitLab.

You can feel free to join anytime!

[GitLab Project](https://gitlab.com/aggre/businessman/boards)
