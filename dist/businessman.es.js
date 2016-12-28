/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
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
        console.error( 'Error in trigger', e );
    }
};

var on = function ( type, cb ) {
    try {
        o.on( type, cb );
    } catch ( e ) {
        console.error( 'Error in on', e );
    }
};

var off = function ( type, cb ) {
    try {
        if ( cb ) { o.off( type, cb ); }
        else { o.off( type ); }
    } catch ( e ) {
        console.error( 'Error in off', e );
    }
};

var pack = function ( type, payload ) {
    return { type: type, payload: payload }
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

var Store = function Store ( opt ) {
    opt = index( {
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
                postMessage( pack( opt.type, opt.state ) );
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

var INIT = 'INIT';
var CREATE_CLIENT_STORE = 'CREATE_CLIENT_STORE';

var worker = {};
var stores = {};
var forFront = [];

var api$1 = {
    start: function () {
        onmessage = function (e) {
            var storeType = e.data[ 0 ],
                actionType = e.data[ 1 ],
                payload = e.data[ 2 ];
            stores[ storeType ].dispatch( actionType, payload );
        };
        postMessage( pack( INIT, { stores: forFront } ) );
    },
    registerStore: function (config) {
        var store = new Store( config ),
            type = store.type;
        if ( ! ( type in stores ) ) {
            stores[ type ] = store;
            forFront.push( {
                type: type,
                actions: Object.keys( store.actions )
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
        worker.onmessage = function ( message ) { return trigger( message.data ); };
        return worker
    } catch ( e ) {
        console.error( 'Error in install', e );
    }
};

var dispatch$1 = function ( storeType, actionType, payload, worker ) {
    try {
        worker.postMessage( [ storeType, actionType, payload ] );
    } catch ( e ) {
        console.error( 'Error in dispatch', e );
    }
};

var subscribe = function ( type, cb ) {
    try {
        on( type, cb );
    } catch ( e ) {
        console.error( 'Error in subscribe', e );
    }
};

var unsubscribe = function ( type, cb ) {
    try {
        off( type, cb );
    } catch ( e ) {
        console.error( 'Error in unsubscribe', e );
    }
};

var businessman = {};
var businessmanWoker = null;

var api = {
    install: function ( path ) {
        businessmanWoker = install( path, businessmanWoker );
    },
    dispatch: function ( storeType, actionType, payload ) { return dispatch$1( storeType, actionType, payload, businessmanWoker ); },
    subscribe: function ( type, cb ) { return subscribe( type, cb ); },
    unsubscribe: function ( type, cb ) { return unsubscribe( type, cb ); },
    worker: worker
};

for ( var prop in api ) {
    defineFreezeProperties( businessman, prop, api[ prop ] );
}

subscribe( INIT, function ( data ) {
    var stores = {};
    try {
        data.stores.map( function ( store ) {
            stores[ store.type ] = {
                dispatch: function ( actionType, payload ) {
                    dispatch$1( store.type, actionType, payload, businessmanWoker );
                },
                subscribe: function ( cb ) {
                    subscribe( store.type, cb );
                },
                unsubscribe: function ( cb ) {
                    unsubscribe( store.type, cb );
                }
            };
        } );
        trigger( pack( CREATE_CLIENT_STORE, stores ) );
    } catch ( e ) {
        console.error( 'Error in creating client store', e );
    }
} );

export default businessman;
