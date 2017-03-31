Multi-thread State Management by Worker API.

<a href="https://travis-ci.org/businessmanjs/businessman">
<img src="https://api.travis-ci.org/businessmanjs/businessman.svg?branch=master" alt="build status">
</a>
<a href="https://www.npmjs.com/package/businessman">
<img src="https://img.shields.io/npm/v/businessman.svg" alt="npm version">
</a>
<a href="https://github.com/businessmanjs/businessman/blob/master/LICENSE.md">
<img src="https://img.shields.io/npm/l/businessman.svg" alt="license">
</a>

<img src="https://raw.githubusercontent.com/businessmanjs/businessman/master/public/assets/businessman.png" alt="Businessman" width="750">

# Motivation

If application state management is performed by an application thread, the responsiveness of the application may be impaired. There is also a risk that the application itself will manipulate the state.

The application keep responsiveness by delegating state management to the Worker. It also eliminates the risk of direct manipulation of the state.

# API

## Create Store

In Businessman, only the states manipulated by dispatching are sent to the main thread. Because the data size between threads affects performance.

In short, Businessman only has one small state in one store.

The store is defined as follows.

```js
import { worker } from 'businessman'

worker.registerStore( {
    type: 'counter',
    state: 0,
    actions: {
        increment: ( commit, num = 1 ) => {
            commit( 'increment', num )
        }
    },
    mutations: {
        increment: ( state, num ) => state += num
    },
    getters: {
        absolute: state => Math.abs( state )
    }
} )
```

### Type

Type is a string that is the identity of the store. This needs to be unique.

```js
type: 'counter'
```

### State

Save the state of the store. Any type can be used for the state.

```js
state: 0
```

### Actions

Execute the mutation. Asynchronous processing can be placed on the action.

Pass the mutation name to the function of the first argument of the action. The payload is provided from the second argument.

```js
increment: ( commit, num = 1 ) => {
    commit( 'increment', num )
}
```

If the third argument of commit is false, it does not provide state.

In this case, the state passed to the subscriber is `null`.

```js
increment: ( commit, num = 1 ) => {
    commit( 'increment', num, false )
}
```

### Mutations

Change the state. After that, the new state is automatically notified to the main thread.

It will receive the current state and payload and return the new value.

The state is changed and the main thread is notified.

```js
increment: ( state, num ) => state += num
```

ATTENTION
- Do not place asynchronous processing on mutations.

### Getters

Getters gets state by calculation.

```js
absolute: state => Math.abs( state )
```

An option is provided for the second argument, and another Getter is provided for the third argument.

```js
absolute: ( state, options, getters ) => {
    // state: Current state
    // options: Some option
    // getters: All Getters in this store
}
```

## Create Manager

Mutation and action belong to one store.

If you want to dispatch to multiple stores at the same time, you can use the manager.

It can be registered using `worker.registerManager()`.

```js
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

```js
import { operate } from 'businessman'

operate( 'countUpMessage', 1 )
```

## Start worker

Call `worker.start()` to start a worker.

```js
worker.start()
```

When added to the source of the Create Store as shown earlier, it becomes as follows.

```js
import { worker } from 'businessman'

worker.registerStore( {
    type: 'counter',
    state: 0,
    actions: {
        increment: ( commit, num = 1 ) => {
            commit( 'increment', num )
        }
    },
    mutations: {
        increment: ( state, num ) => state += num
    },
    getters: {
        absolute: state => Math.abs( state )
    }
} )

worker.start()
```

## Install worker

Install workers and start state management.

```js
import { install } from 'businessman'

install( '/path/to/worker.js' )
```

ATTENTION
- Workers need to be converted for browsers with arbitrary compiler.

## Dispatch and Subscribe

```js
import { dispatch, subscribe } from 'businessman'

dispatch( 'counter', 'increment', 1 )

subscribe( 'counter', state => {
    console.log( state ) // 1
} )
```

Dispatch / Subscribe is also available in Store style.

```js
counter.dispatch( 'increment', 1 )

counter.subscribe( state => {
    console.log( state )
} )
```

The store style is available after the store in the worker has been created for the client. It can be obtained by subscribing `CREATE_CLIENT_STORE`.

```js
let counter

subscribe( 'CREATE_CLIENT_STORE', stores => {
    console.log( stores ) // { counter: { dispatch: function () {...}, subscribe: function () {...}, unsubscribe: function () {...}, getState: function () {...} } }
    counter = stores.counter
} )
```

## Unsubscribe

You can stop / delete subscribe.

```js
import { unsubscribe } from 'businessman'

unsubscribe( 'counter' ) // Delete all listeners subscribing to the store
unsubscribe( 'counter', listener ) // Delete one listener
```

For store style ...

```js
counter.unsubscribe()
counter.unsubscribe( listener )
```

## getState

In Businessman `getState()` is also executed asynchronously.

```js
import { getState } from 'businessman'

getState( 'counter' )
.then( state => {
    console.log( state )
} )

// You can also specify Getter.
getState( 'counter', 'absolute' )
.then( state => {
    console.log( state )
} )
```

For store style ...

```js
counter.getState()
.then( state => {
    console.log( state )
} )

// You can also specify Getter.
counter.getState( 'absolute' )
.then( state => {
    console.log( state )
} )
```

## getAllState

`getState()` can only get the state of one store.

To get the state of all stores, use `getAllState()`.

```js
import { getAllState } from 'businessman'

getAllState()
.then( state => {
    console.log( state )
} )
```

# How to contribute

You can feel free to join anytime!

[GitHub Issues](https://github.com/businessmanjs/businessman/issues)

[GitHub Contributing Guide](https://github.com/businessmanjs/businessman/blob/master/.github/CONTRIBUTING.md)
