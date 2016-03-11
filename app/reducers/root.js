import d3 from 'd3';
import _ from 'lodash';

const initialState = {
	traders: initialTraders,
	trades: [],
	elapsed: 0,
	history: [],
	gdp: 0,
	time: 0,
	z: 0
};

const Trader = {
	constructor(id) {
		_.assign(this, {
			id: id,
			money: 4,
			y: 1,
			price: 1,
			γ: 1 //fraction of income needed in reserve
		});
	},
	purchase(dt, traders, price_index) {
		let real_balance = this.money / price_index;
		if (real_balance < this.γ * this.income) return null;
		let planned_spending = real_balance / this.γ;
		if (Math.random() > (dt * this.planned_spending)) return null;
		let seller = _.sample(_.without(traders, this));
		seller.sell(price_index);
		this.money = this.money - seller.price;
		let trade = { seller_id: seller.id, buyer_id: this.id };
		return trade;
	},
	sell(dt){

	},
	calc_index(price_index){

	}
};

const mu = 18;
const cutoff0 = .8;
const cutoff1 = 1.5;

const reduceTick = (state, action) => {
	let trades = [],
		dt = action.dt / 1000,
		time = state.time + dt,
		traders = state.traders,
		deflator = d3.sum(traders, d => Math.exp(-d.price * mu)),
		z = 0,
		intervals = _.map(traders, d => {
			return z = z + Math.exp(-d.price * mu) / deflator;
		});

	traders = _.map(traders, trader => {
		let gap = time - trader.last_sale;
		if (gap < cutoff0) {
			return {...trader, price: trader.last_price * Math.exp(.013 * (cutoff0 - gap)) };
		} else if (gap > cutoff1) {
			return {...trader, price: trader.last_price * Math.exp(-.012 * (gap - cutoff1)) };
		} else return trader;
	});
	intervals.unshift(0);
	_.forEach(traders, buyer => {
		if (Math.random() > (dt / buyer.β)) return;
		let draw = Math.random(),
			seller = traders[
				_.findLastIndex(intervals, d => d < draw)
			],
			price = seller.price;
		if (seller === buyer) return;
		traders[buyer.id] = {
			...buyer,
			money: buyer.money - price
		};
		traders[seller.id] = {
			...seller,
			money: seller.money + price,
			last_sale: time,
			last_price: price,
		};
		trades.push({ seller_id: seller.id, buyer_id: buyer.id, price });
	});
	let index = d3.mean(traders, d => d.price);
	let history = _(state.history)
		.filter(d => (d.time > (time - 8)))
		.push({ time, spending: d3.sum(trades, d => d.price) }).value()
	let gdp = d3.sum(history, d => d.spending / index) / 8;
	if ((state.z % 40) == 0) {
		console.log(gdp);
	}
	return {...state, trades, traders, time, history, gdp, z: state.z + 1 };
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'CHANGE_BETA':
			console.log('asdf');
			return {
				...state,
				traders: _.map(state.traders, trader => ({...trader, β: action.β })),
				trades: []
			};
		case 'RESET':
			return initialState;
		case 'TICK':
			return reduceTick(state, action);
		default:
			return state;
	}
};

export default rootReduce;
