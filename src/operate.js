export default ( managerType, payload, worker ) => {
	worker.postMessage( [ 'operate', managerType, payload ] )
}
