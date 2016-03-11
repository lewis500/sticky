import _ from 'lodash';

const initialTraders = _(10).range().map(d => {
	return {
		id: d,
		money: 5,
		price: 1,
		β: 5, //fraction of spending in reserve
		sales: [],
		/*
			sale = {time,real_price}
		*/
		y: 1
	};
}).value();

const initialState = {
	traders: initialTraders,
	trades: [],
	elapsed: 0,
	history: [],
	gdp: 0,
	time: 0,
	β: 5,
	z: 0,
	mu: 10
};



const TF = {
	buy(buyer, traders, price_index, dt) { //returns a trade
		const { money, y, β, id } = buyer;
		const real_balance = money / price_index;

		//DOES DEMAND FOR BALANCES DEPEND ON INCOME OR ONLY CONSUMPTION?
		// if (_.lt(real_balance, β * y)) return null_trade;

		if (_.gte(real_balance / β * dt, Math.random())) {
			const seller = _.sample(_.without(traders, buyer));
			return {
				buyer_id: id,
				seller_id: seller.id,
				price: seller.price
			};
		} else {
			return {
				buyer_id: id,
				seller_id: -1,
				price: -1
			};
		}

	}, //end buy
	calc_y(trader, time, dt) { //returns a trade
		//count over two seconds
		const HORIZON = 2;
		const sales = _.filter(trader.sales, sale => _.gte(sale.time, time - HORIZON)),
			y = d3.sum(sales, sale => sale.real_price) / HORIZON;
		let price = trader.price,
			employment = sales.length / HORIZON; //COULD ALSO USE REAL INCOME?
		if (employment < .6) price = price * Math.exp(-dt * .02);
		if (employment > 1.2) price = price * Math.exp(dt * .03);
		return {
			...trader,
			sales,
			y,
			price
		};
	}, //end calc_y,
	calc_denominator(traders, mu) {
		return d3.sum(traders, d => Math.exp(-d.price * mu));
	}
};


const reduceTick = (state, action) => {
	const dt = action.dt / 1000,
		time = state.time + dt,
		mu = state.mu;

	let traders = _.map(state.traders, trader => TF.calc_y(trader, time, dt));
	const denom = TF.calc_denominator(traders, mu),
		price_index = d3.mean(traders, trader => trader.price);
		
	let intervals = _.map(traders, trader => Math.exp(-trader.price * mu));

	intervals = _.reduce(intervals, (l, num) => {
		l.push(
			l[l.length - 1] + num / denom
		);
		return l;
	}, [0]);

	const trades = _(traders)
		.map(buyer => TF.buy(buyer, traders, price_index, dt))
		.filter(trade => trade.price != -1)
		.value();

	_.forEach(trades, trade => {
		let { buyer_id, seller_id, price } = trade;
		let buyer = traders[buyer_id],
			seller = traders[seller_id];

		traders[buyer_id] = {
			...buyer,
			money: buyer.money - price
		};

		traders[seller_id] = {
			...seller,
			sales: [...seller.sales, { time, real_price: price / price_index }],
			money: seller.money + price
		};

	});

	const history = _(state.history)
		.filter(d => (d.time > (time - 10)))
		.push({ time, spending: d3.sum(trades, d => d.price) })
		.value();


	if (state.z % 50 == 0) {
		const gdp = d3.sum(history, d => d.spending / price_index) / 10;
		console.log(gdp);
		console.log(intervals);
	}

	return {...state, trades, traders, time, history, z: state.z + 1 };
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'CHANGE_BETA':
			return {
				...state,
				β: action.β,
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
