export default ( action, payload, worker ) => {
    try {
        worker.postMessage( [ action, payload ] )
    } catch ( e ) {
        console.error( e )
    }
}
