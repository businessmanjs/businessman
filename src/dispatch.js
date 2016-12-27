export default ( storeType, actionType, payload, worker ) => {
    try {
        worker.postMessage( [ storeType, actionType, payload ] )
    } catch ( e ) {
        console.error( 'Error in dispatch', e )
    }
}
