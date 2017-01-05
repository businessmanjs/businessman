export default ( storeType, actionType, payload, worker ) => {
	worker.postMessage( [ storeType, actionType, payload ] )
}
