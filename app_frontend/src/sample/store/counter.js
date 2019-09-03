import { createStore } from 'redux'
import counter from '../reducers/counter.js'

const store = createStore(counter);

export default store;
