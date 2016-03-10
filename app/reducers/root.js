import d3 from 'd3';
import _ from 'lodash';

const traders = _.map(_.range(5), i => {
	return {
		id: i,
	};
});

const initialState = {
	traders,
	trade: null
};

const reduceBuy = (state, action) => {
	let traders = state.traders.slice(), 
	{ buyer_id } = action;
	let sellers = _.filter(traders, (d, i) => d.id != buyer_id);
	let seller_id = _.sample(sellers).id,
		trade = { buyer_id, seller_id };
	return {...state, trade };
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'KILL_TRADE':
			console.log('hello');
			return state;
		case 'BUY':
			return reduceBuy(state, action);
		default:
			return state;
	}
};

export default rootReduce;
