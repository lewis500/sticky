import d3 from 'd3';
import _ from 'lodash';

const traders = _.map(_.range(5), i => {
	return {
		id: i,
		money: 4
	};
});

const initialState = {
	traders,
	trade: null
};

const reduceBuy = (state, action) => {
	let traders = state.traders.slice(),
		{ buyer_id } = action;
	let buyer = traders[buyer_id];
	if (buyer.money <= 0) return state;
	let sellers = _.filter(traders, (d, i) => d.id != buyer_id);
	let seller = _.sample(sellers),
	// let seller = traders[3],
		trade = { buyer_id, seller_id: seller.id };
	traders[trade.seller_id] = {
		...seller,
		money: seller.money + 1
	};
	traders[buyer_id] = {
		...buyer,
		money: buyer.money - 1
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
		case 'RESET':
			return initialState;
		case 'TRADE':
			let buyer = _.sample(state.traders);
			return reduceBuy(state, { buyer_id: buyer.id });
		default:
			return state;
	}
};

export default rootReduce;
