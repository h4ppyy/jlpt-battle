import { createStore } from 'redux'
import LoginReduce from '../reduxReduce/LoginReduce.js'

const LoginStore = createStore(LoginReduce);

export default LoginStore;
