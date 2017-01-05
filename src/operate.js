export default ( managerType, payload, worker ) => {
	worker.postMessage( [ managerType, payload ] )
}
