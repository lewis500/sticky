import d3 from 'd3';
import _ from 'lodash';

const traders = _.map(_.range(10), i => {
	return {
		id: i,
		money: 4,
		β: 2
	};
});

const initialState = {
	traders,
	trade: null
};

const reduceTick = (state, action) => {
	let traders = state.traders.slice();
	let trade = false,
		seller, draw;
	_.shuffle(traders)
		.filter(d => d.money > 0)
		.forEach(buyer => {
			let draw = (action.dt / buyer.β / 1000);
			if (Math.random() < draw) {
				seller = _.sample(_.without(traders, buyer));
				traders[seller.id] = {...seller, money: seller.money + 1 };
				traders[buyer.id] = {...buyer, money: buyer.money - 1 };
				trade = { seller_id: seller.id, buyer_id: buyer.id };
				return false;
			}
		});
	return {...state, trade, traders };
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'RESET':
			return initialState;
		case 'TICK':
			return reduceTick(state, action);
		default:
			return state;
	}
};

export default rootReduce;
