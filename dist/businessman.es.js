var callbacks = {};

var observable = {
	register: function (name) {
		callbacks[name] = {};
	},
	on: function (name, type, cb) {
		var list = callbacks[name];
		if (type in list) {
			list[type].push(cb);
		} else {
			list[type] = [cb];
		}
	},
	off: function (name, type, cb) {
		var list = callbacks[name];
		if (cb) {
			var i = list[type].indexOf(cb);
			if (i) {
				list[type].splice(i, 1);
			}
		} else {
			list[type] = [];
		}
	},
	trigger: function (name, type) {
		var args = [], len = arguments.length - 2;
		while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];

		var list = callbacks[name];
		var cbs = list[type];
		if (cbs) {
			for (var i = 0; i < cbs.length; i++) {
				cbs[i].apply(cbs, args);
			}
		}
	}
};

var GETTER = 'GETTER';
var CLIENT = 'CLIENT';
var ALLSTATE = 'ALLSTATE';

observable.register(GETTER);
observable.register(CLIENT);
observable.register(ALLSTATE);

var trigger = function (data, obs) {
	if ( obs === void 0 ) obs = CLIENT;

	observable.trigger(obs, data.type, data.payload, data.mutation, data.getter);
};

var on = function (type, cb, obs) {
	if ( obs === void 0 ) obs = CLIENT;

	observable.on(obs, type, cb);
};

var off = function (type, cb, obs) {
	if ( obs === void 0 ) obs = CLIENT;

	if (cb) {
		observable.off(obs, type, cb);
	} else {
		observable.off(obs, type);
	}
};

var pack = function (options) {
	var type = options.type; if ( type === void 0 ) type = null;
	var payload = options.payload; if ( payload === void 0 ) payload = null;
	var mutation = options.mutation; if ( mutation === void 0 ) mutation = null;
	var getter = options.getter; if ( getter === void 0 ) getter = null;
	var allState = options.allState; if ( allState === void 0 ) allState = null;
	return {type: type, payload: payload, mutation: mutation, getter: getter, allState: allState}
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

var getters = {
	default: function (state) { return state; }
};

var mutations = {};

var actions = {};

var Store = function Store(opt) {
	var state = opt.state;
	var mutations$$1 = opt.mutations; if ( mutations$$1 === void 0 ) mutations$$1 = {};
	var actions$$1 = opt.actions; if ( actions$$1 === void 0 ) actions$$1 = {};
	var getters$$1 = opt.getters; if ( getters$$1 === void 0 ) getters$$1 = {};
	var type = opt.type;
	var store = this;
	var ref = this;
	var dispatch = ref.dispatch;
	var commit = ref.commit;
	var getState = ref.getState;

	var _state = {
		get: function () { return state; },
		set: function (newState, mutationType, provide) {
			state = newState;
			postMessage((provide ? pack({type: type, payload: state, mutation: mutationType}) : pack({type: type, mutation: mutationType})));
		}
	};
	getters$$1 = assign(getters$$1, getters);
	mutations$$1 = assign(mutations$$1, mutations);
	actions$$1 = assign(actions$$1, actions);

	Object.defineProperties(this, {
		type: {
			value: type,
			enumerable: false,
			writable: false,
			configurable: false
		},
		getters: {
			value: getters$$1,
			configurable: false,
			writable: false
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
			value: function (type, payload, provide) {
				if ( provide === void 0 ) provide = true;

				return commit.call(store, _state, type, payload, provide);
	},
			configurable: false,
			writable: false
		},
		getState: {
			value: function (type, payload) { return getState.call(store, _state, type, payload); },
			configurable: false,
			writable: false
		}
	});
};

Store.prototype.getState = function getState (state, type, payload) {
		if ( type === void 0 ) type = 'default';

	var get = this.getters[type](state.get(), payload, this.getters);
	return get
};

Store.prototype.commit = function commit (state, type, payload, provide) {
	state.set(this.mutations[type](state.get(), payload), type, provide);
};

Store.prototype.dispatch = function dispatch (type, payload) {
	this.actions[type](this.commit, payload);
};

var getState$2 = function (stores, data) {
	var store = data[0];
	var type = data[1];
	var payload = data[2];
	var get = stores[store].getState(type, payload);
	postMessage(pack({type: store, payload: get, getter: type}));
};

var DISPATCH = 'dispatch';
var OPERATE = 'operate';
var GET_STATE = 'getState';
var GET_ALL_STATE = 'getAllState';

var getAllState$1 = function (stores) {
	var state = {};
	var key = Object.keys(stores);
	for (var i = 0; i < key.length; i++) {
		state[key[i]] = stores[key[i]].getState();
	}
	postMessage(pack({type: GET_ALL_STATE, payload: state, allState: true}));
	return state
};

var INIT = 'INIT';

var stores = {};
var managers = {};

var worker = {
	start: function () {
		onmessage = function (e) {
			var data = e.data;
			var c = data[0];
			data.shift();
			switch (c) {
				case DISPATCH:
					stores[data[0]].dispatch(data[1], data[2]);
					break
				case OPERATE:
					managers[data[0]](stores, data[1]);
					break
				case GET_STATE:
					getState$2(stores, data);
					break
				case GET_ALL_STATE:
					getAllState$1(stores);
					break
				default:
					break
			}
		};
		postMessage(pack({type: INIT, payload: {stores: Object.keys(stores), managers: Object.keys(managers)}}));
	},
	registerStore: function (config) {
		var store = new Store(config);
		var type = store.type;
		if (!(type in stores)) {
			stores[type] = store;
		}
	},
	registerManager: function (config) {
		var type = config.type;
		var handler = config.handler;
		if (!(type in managers)) {
			managers[type] = handler;
		}
	}
};

var worker$1 = Object.freeze(worker);

var _install = function (path, worker) {
	try {
		worker = new Worker(path);
		worker.onmessage = function (m) { return trigger(m.data, (m.data.allState ? ALLSTATE : m.data.getter ? GETTER : CLIENT)); };
		return worker
	} catch (err) {
		console.error('Error in install', err);
	}
};

var _dispatch = function (storeType, actionType, payload, worker) {
	worker.postMessage([DISPATCH, storeType, actionType, payload]);
};

var _operate = function (managerType, payload, worker) {
	worker.postMessage([OPERATE, managerType, payload]);
};

var _subscribe = function (type, cb) {
	on(type, cb);
};

var _unsubscribe = function (type, cb) {
	off(type, cb);
};

var _getState = function (storeType, getter, options, worker) {
	if ( getter === void 0 ) getter = 'default';

	return new Promise(function (resolve, reject) {
		var subscriber = function (state, m, got) {
			if (got !== getter) {
				return
			}
			off(storeType, subscriber, GETTER);
			resolve(state);
		};

		on(storeType, subscriber, GETTER);

		try {
			worker.postMessage([GET_STATE, storeType, getter, options]);
		} catch (err) {
			off(storeType, subscriber, GETTER);
			reject(err);
		}
	})
};

var _getAllState = function (worker) {
	return new Promise(function (resolve, reject) {
		var subscriber = function (state) {
			off(GET_ALL_STATE, subscriber, ALLSTATE);
			resolve(state);
		};

		on(GET_ALL_STATE, subscriber, ALLSTATE);

		try {
			worker.postMessage([GET_ALL_STATE]);
		} catch (err) {
			off(GET_ALL_STATE, subscriber, ALLSTATE);
			reject(err);
		}
	})
};

var businessmanWoker = null;

var install = function (path) {
	businessmanWoker = _install(path, businessmanWoker);
};
var dispatch$1 = function (storeType, actionType, payload) { return _dispatch(storeType, actionType, payload, businessmanWoker); };
var operate = function (managerType, payload) { return _operate(managerType, payload, businessmanWoker); };
var subscribe = function (type, cb) { return _subscribe(type, cb); };
var unsubscribe = function (type, cb) { return _unsubscribe(type, cb); };
var getState$1 = function (storeType, getter, options) { return _getState(storeType, getter, options, businessmanWoker); };
var getAllState = function () { return _getAllState(businessmanWoker); };

export { install, dispatch$1 as dispatch, operate, subscribe, unsubscribe, getState$1 as getState, getAllState, worker$1 as worker };
