import { Login } from '../reduxAction/Login.js'
import { Logout } from '../reduxAction/Logout.js'

if (localStorage.getItem("jwt") === null) {
    var initialState = {
      loginStatus: 0
    };
} else {
    var initialState = {
      loginStatus: 1
    };
}


function LoginReduce(state = initialState, action) {
    switch (action.type) {
        case 'LOGIN':
            return Login(state);
        case 'LOGOUT':
            return Logout(state);
        default:
            return state;
    }
}

export default LoginReduce;
