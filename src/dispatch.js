export default ( storeType, actionType, payload, worker ) => {
	worker.postMessage( [ 'dispatch', storeType, actionType, payload ] )
}
