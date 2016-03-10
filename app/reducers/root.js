import d3 from 'd3';
import _ from 'lodash';

const traders = _.map(_.range(5), i => {
	return {
		id: i,
		balance: 4
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
	let seller = _.sample(sellers),
		trade = { buyer_id, seller_id: seller.id };
	traders[trade.seller_id] = {
		...seller,
		balance: seller.balance + 1
	};
	return {
		...state,
		trade,
		traders
	};
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'BUY':
			return reduceBuy(state, action);
		default:
			return state;
	}
};

export default rootReduce;
