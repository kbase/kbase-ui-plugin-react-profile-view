const initState = {
    token: '3SLUNTKN5UABYMKHIB5QINDHTSQP442M',
    loggedInUser: 'my user id',
    hostName: 'https://narrative.kbase.us'
}
interface Action {
    type: string
}
function authState (state = initState, action: Action) {
    switch (action.type) { 
        case 'LOGGEDIN_USER':
            state = {
                token: state.token,
                loggedInUser: state.loggedInUser,
                hostName: state.hostName
            }
            return {state}

        default:
            return state;

    }
}

export default authState;