import d3 from 'd3';
import _ from 'lodash';

const traders = _.map(_.range(5), i=>{
	return {
		id: i,
	};
});

const initialState = {
	numTrades: 0,
	traders
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'TRADE':
			console.log(state.numTrades);
			return {
				...state,
				numTrades: state.numTrades + 1
			};
		default:
			return state;
	}
};

export default rootReduce;
