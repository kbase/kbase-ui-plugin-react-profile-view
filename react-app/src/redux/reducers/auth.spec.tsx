import reducer from './auth';
interface State {
    state: {
        token: string;
        loggedInUser: string;
        hostName: string;
        
    }
}


describe('Auth Reducer', () => {
    test('returns right stuff', () => {
        const initState = {
            token: '',
            loggedInUser: '',
            hostName: ''
        }

        const state = {
            token: '3SLUNTKN5UABYMKHIB5QINDHTSQP442M',
            loggedInUser: 'my user id',
            hostName: 'https://narrative.kbase.us'
        }
        const payload = {
            token: '3SLUNTKN5UABYMKHIB5QINDHTSQP442M',
            loggedInUser: 'my user id',
            hostName: 'https://narrative.kbase.us'
        }

        const action = { type: 'LOGGEDIN_USER', payload: payload};
        const result = reducer(payload, action)
        console.log(result, result.state)
        expect(result.state.loggedInUser).toEqual(state.loggedInUser)
    })
})