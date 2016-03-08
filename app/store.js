import { createStore, applyMiddleware } from 'redux';
import rootReduce from './reducers/root.js';
import thunk from 'redux-thunk';
const store = createStore(
	rootReduce
	// applyMiddleware(thunk)
);

export default createStore(rootReduce);
