import _ from 'lodash';

const initialTraders = _(10).range().map(d => {
	return {
		id: d,
		money: 5,
		price: 1,
		β: 5, //fraction of spending in reserve
		sales: _.range(2).map(() => {
			return { time: 0, real_price: 1 }
		}),
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
	mu: 20
};

const TF = {
	choose_seller(buyer_id, intervals) {
		let draw = Math.random(),
			seller_id = _.findLastIndex(intervals, d => d < draw);
		if (buyer_id == seller_id) return this.choose_seller(buyer_id, intervals);
		else return seller_id;
	},
	buy(buyer, intervals, traders, price_index, dt) { //returns a trade
		const { money, y, β, id } = buyer;
		const real_balance = money / price_index;

		if (_.lt(real_balance / β * dt, Math.random())) {
			return {
				buyer_id: id,
				seller_id: -1,
			};
		}
		// return
		// let seller_id = _.sample(_.without(traders,buyer)).id;
			let seller_id = this.choose_seller(id, intervals);
		return {
			buyer_id: id,
			seller_id
		};
	}, //end buy
	calc_y(trader, time, dt) { //returns a trade
		//count over two seconds
		const HORIZON = 2;
		const sales = _.filter(trader.sales, sale => _.gte(sale.time, time - HORIZON)),
			y = d3.sum(sales, sale => sale.real_price) / HORIZON;
		let price = trader.price;
		let employment = sales.length / HORIZON; //COULD ALSO USE REAL INCOME?
		if (employment < .7) price = price * Math.exp(-dt * .02);
		if (employment > 1.3) price = price * Math.exp(dt * .03);
		return {
			...trader,
			sales,
			y,
			price
		};
	}, //end calc_y,
};

const reduceTick = (state, action) => {
	const dt = action.dt / 1000,
		time = state.time + dt,
		mu = state.mu;

	let traders = _.map(state.traders, trader => TF.calc_y(trader, time, dt));
	const numerators = _.map(traders, trader => Math.exp(-trader.price * mu)),
		denominator = _.sum(numerators),
		intervals = _.reduce(numerators, (l, num) => {
			return [...l, l[l.length - 1] + num / denominator];
		}, [0]),
		price_index = d3.mean(traders, trader => trader.price);

	const trades = _(traders)
		.map(buyer => TF.buy(buyer, intervals, traders, price_index, dt))
		.filter(trade => trade.seller_id !== -1)
		.value();

	let spending = 0;

	_.forEach(trades, trade => {
		const { buyer_id, seller_id } = trade;
		const buyer = traders[buyer_id],
			seller = traders[seller_id],
			price = seller.price;

		traders[buyer_id] = {
			...buyer,
			money: buyer.money - price
		};

		traders[seller_id] = {
			...seller,
			sales: [...seller.sales, { time, real_price: price / price_index }],
			money: seller.money + price
		};

		spending += price;

	});

	const history = _(state.history)
		.filter(d => (d.time > (time - 10)))
		.push({ time, spending })
		.value();


	if (state.z % 50 == 0) {
		const gdp = d3.sum(history, d => d.spending / price_index) / 10;
		console.log(gdp);
		// console.log(price_index, Math.log(denominator));
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
