(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.businessman = global.businessman || {})));
}(this, (function (exports) { 'use strict';

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
	observable(this);
}();

var trigger = function (data) {
	o.trigger(data.type, data.payload, data.applied);
};

var on = function (type, cb) {
	o.on(type, cb);
};

var off = function (type, cb) {
	if (cb) {
		o.off(type, cb);
	}	else {
		o.off(type);
	}
};

var pack = function (type, payload, applied) {
	if ( type === void 0 ) type = '';
	if ( payload === void 0 ) payload = {};

	if (applied) {
		return {type: type, payload: payload, applied: applied}
	}
	return {type: type, payload: payload}
};

var assign = function (target, sources) {
	try {
		return Object.assign(target, sources)
	} catch (err) {
		var keys = Object.keys(sources);
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (!(key in target)) {
				target[key] = sources[key];
			}
		}
		return target
	}
};

var INIT = 'INIT';
var CREATE_CLIENT_STORE = 'CREATE_CLIENT_STORE';
var CREATE_CLIENT_MANAGER = 'CREATE_CLIENT_MANAGER';
var GET_STATE = 'GET_STATE';

var mutations = {};
mutations[GET_STATE] = function (state) { return state; };

var actions = {};
actions[GET_STATE] = function (commit) { return commit(GET_STATE); };

var Store = function Store(opt) {
	var state = opt.state;
	var mutations$$1 = opt.mutations; if ( mutations$$1 === void 0 ) mutations$$1 = {};
	var actions$$1 = opt.actions; if ( actions$$1 === void 0 ) actions$$1 = {};
	var type = opt.type;
	var store = this;
	var ref = this;
	var dispatch = ref.dispatch;
	var commit = ref.commit;

	var _state = {
		get: function () { return state; },
		set: function (newState) {
			state = newState;
			postMessage(pack(type, state, store.appliedMutation));
		}
	};
	mutations$$1 = assign(mutations$$1, mutations);
	actions$$1 = assign(actions$$1, actions);

	Object.defineProperties(this, {
		type: {
			value: type,
			enumerable: false,
			writable: false,
			configurable: false
		},
		mutations: {
			value: mutations$$1,
			configurable: false,
			writable: false
		},
		actions: {
			value: actions$$1,
			configurable: false,
			writable: false
		},
		dispatch: {
			value: function (type, payload) { return dispatch.call(store, type, payload); },
			configurable: false,
			writable: false
		},
		commit: {
			value: function (type, payload) { return commit.call(store, _state, type, payload); },
			configurable: false,
			writable: false
		},
		appliedMutation: {
			value: '',
			writable: true
		}
	});
};

Store.prototype.commit = function commit (state, type, payload) {
	this.appliedMutation = type;
	state.set(this.mutations[type](state.get(), payload));
};

Store.prototype.dispatch = function dispatch (type, payload) {
	this.actions[type](this.commit, payload);
};

var stores = {};
var managers = {};
var forClient = {
	stores: [],
	managers: []
};

var worker = {
	start: function () {
		onmessage = function (e) {
			var data = e.data;
			if (data.length > 2) {
				stores[data[0]].dispatch(data[1], data[2]);
			}			else if (data.length > 1) {
				managers[data[0]](stores, data[1]);
			}
		};
		postMessage(pack(INIT, {stores: forClient.stores, managers: forClient.managers}));
	},
	registerStore: function (config) {
		var store = new Store(config);
		var type = store.type;
		var actions = store.actions;
		if (!(type in stores)) {
			stores[type] = store;
			forClient.stores.push({
				type: type,
				actions: Object.keys(actions)
			});
		}
	},
	registerManager: function (config) {
		var type = config.type;
		var handler = config.handler;
		if (!(type in managers)) {
			managers[type] = handler;
			forClient.managers.push({
				type: type
			});
		}
	}
};

var worker$1 = Object.freeze(worker);

var _install = function (path, worker) {
	try {
		worker = new Worker(path);
		worker.onmessage = function (message) { return trigger(message.data); };
		return worker
	} catch (err) {
		console.error('Error in install', err);
	}
};

var dispatch$2 = function (storeType, actionType, payload, worker) {
	worker.postMessage([storeType, actionType, payload]);
};

var _operate = function (managerType, payload, worker) {
	worker.postMessage([managerType, payload]);
};

var subscribe$1 = function (type, cb) {
	on(type, cb);
};

var unsubscribe$1 = function (type, cb) {
	off(type, cb);
};

var _getState = function (storeType, worker) {
	return new Promise(function (resolve, reject) {
		var subscriber = function (state, applied) {
			if (applied !== GET_STATE) {
				return
			}
			unsubscribe$1(storeType, subscriber);
			resolve(state);
		};

		subscribe$1(storeType, subscriber);

		try {
			dispatch$2(storeType, GET_STATE, '', worker);
		} catch (err) {
			reject(err);
			unsubscribe$1(storeType, subscriber);
		}
	})
};

var businessmanWoker = null;

var install = function (path) {
	businessmanWoker = _install(path, businessmanWoker);
};
var dispatch$1 = function (storeType, actionType, payload) { return dispatch$2(storeType, actionType, payload, businessmanWoker); };
var operate = function (managerType, payload) { return _operate(managerType, payload, businessmanWoker); };
var subscribe = function (type, cb) { return subscribe$1(type, cb); };
var unsubscribe = function (type, cb) { return unsubscribe$1(type, cb); };
var getState = function (storeType) { return _getState(storeType, businessmanWoker); };

subscribe(INIT, function (data) {
	var stores = {};
	var managers = {};
	try {
		data.stores.map(function (store) {
			stores[store.type] = {
				dispatch: function (actionType, payload) { return dispatch$1(store.type, actionType, payload); },
				subscribe: function (cb) { return subscribe(store.type, cb); },
				unsubscribe: function (cb) { return unsubscribe(store.type, cb); },
				getState: function () { return getState(store.type); }
			};
			return store
		});
		trigger(pack(CREATE_CLIENT_STORE, stores));
		managers = data.managers;
		trigger(pack(CREATE_CLIENT_MANAGER, managers));
	} catch (err) {
		console.error('Error in creating client store or client manager', err);
	}
});

exports.install = install;
exports.dispatch = dispatch$1;
exports.operate = operate;
exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.getState = getState;
exports.worker = worker$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
