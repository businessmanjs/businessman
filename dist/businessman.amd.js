define(function () { 'use strict';

var Store = function Store ( opt ) {
    opt = Object.assign( {
        type: '',
        state: null,
        mutations: {},
        actions: {}
    }, opt );

    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;

    Object.defineProperties( this, {
        type: {
            value: opt.type,
            enumerable: false,
            writable: false,
            configurable: false
        },
        state: {
            get: function () { return opt.state; },
            set: function (state) {
                opt.state = state;
                postMessage( { type: opt.type, payload: opt.state } );
            }
        },
        mutations: {
            value: opt.mutations,
            configurable: false,
            writable: false
        },
        actions: {
            value: opt.actions,
            configurable: false,
            writable: false
        },
        dispatch: {
            value: function ( type, payload ) { return dispatch.call( store, type, payload ); },
            configurable: false,
            writable: false
        },
        commit: {
            value: function ( type, payload ) { return commit.call( store, type, payload ); },
            configurable: false,
            writable: false
        }
    } );
};

Store.prototype.commit = function commit ( type, payload ) {
    this.mutations[ type ]( this, payload );
};

Store.prototype.dispatch = function dispatch ( type, payload ) {
    this.actions[ type ]( this, payload );
};

var observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

var o = new function () {
    observable( this );
};

var trigger = function ( data ) {
    try {
        o.trigger( data.type, data.payload );
    } catch ( e ) {
        console.error( e );
    }
};

var on = function ( type, cb ) {
    try {
        o.on( type, cb );
    } catch ( e ) {
        console.error( e );
    }
};

var defineFreezeProperties = function ( target, name, value ) {
    return Object.defineProperties( target, ( obj = {}, obj[ name ] = {
            value: value,
            enumerable: false,
            writable: false,
            configurable: false
        }, obj ) )
    var obj;
};

var INIT = 'init';

var worker = {};
var stores$1 = {};
var forFront = [];

var api$1 = {
    start: function () {
        onmessage = function (e) {
            var storeType = e[ 0 ],
                actionType = e[ 1 ],
                payload = e[ 2 ];
            stores$1[ storeType ].dispatch( actionType, payload );
        };
        postMessage( { type: INIT, payload: { stores: forFront } } );
    },
    registerStore: function (config) {
        var store = new Store( config ),
            type = store.type;
        if ( ! ( type in stores$1 ) ) {
            stores$1[ type ] = store;
            forFront.push( {
                type: type,
                actions: Object.assign( {}, store.actions )
            } );
        }
    }
};

for ( var prop$1 in api$1 ) {
    defineFreezeProperties( worker, prop$1, api$1[ prop$1 ] );
}

var install = function ( path, worker ) {
    try {
        worker = new Worker( path );
        worker.postMessage( 'start' );
        worker.onmessage = function ( data ) { return trigger( data ); };
        return worker
    } catch ( e ) {
        console.error( e );
    }
};

var dispatch$1 = function ( storeType, actionType, payload, worker ) {
    try {
        worker.postMessage( [ storeType, actionType, payload ] );
    } catch ( e ) {
        console.error( e );
    }
};

var subscribe = function ( type, cb ) {
    try {
        on( type, cb );
    } catch ( e ) {
        console.error( e );
    }
};

var businessman = {};
var businessmanWoker = null;
var stores = {};

var api = {
    install: function ( path ) {
        businessmanWoker = install( path, businessmanWoker );
    },
    dispatch: function ( storeType, actionType, payload ) { return dispatch$1( storeType, actionType, payload, businessmanWoker ); },
    subscribe: function ( type, cb ) { return subscribe( type, cb ); },
    worker: worker,
    stores: stores
};

for ( var prop in api ) {
    defineFreezeProperties( businessman, prop, api[ prop ] );
}

subscribe( INIT, function ( data ) {
    data.stores.map( function ( store ) {
        stores[ store.type ] = {
            dispatch: function ( actionType, payload ) {
                dispatch$1( store.type, actionType, payload, businessmanWoker );
            },
            subscribe: function ( type, cb ) {
                subscribe( type, cb );
            }
        };
    } );
    businessman.stores = stores;
} );

return businessman;

});
