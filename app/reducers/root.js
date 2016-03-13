import _ from 'lodash';

const initialagents = _(10).range().map(d => {
	return {
		id: d,
		money: 5,
		price: 1,
		history: [],
		real_balance: 5,
		y: 1,
		next_buy: Math.random() * 2
	};
}).value();

const initialState = {
	agents: initialagents,
	trades: [],
	elapsed: 0,
	history: [],
	gdp: 0,
	time: 0,
	β: 5,
	price_index: 1,
	ϕ: .03,
	z: 0,
};

const TF = {
	choose_seller(buyer, agents) {
		const seller = _.sample(_.without(agents, buyer));
		return seller;
	},
	buy(buyer, agents) { //returns a trade
		const seller = this.choose_seller(buyer, agents);
		return {
			buyer_id: buyer.id,
			seller_id: seller.id,
		};

	}, //end buy
};

const reduceTick = (state, action) => {
	const dt = action.dt / 1000,
		time = state.time + dt,
		ϕ = state.ϕ,
		β = state.β;

	let spending = 0;
	let agents = state.agents.slice();

	const price_index = d3.mean(agents, agent => agent.price);
	// const price_index = 1;

	let trades = [];
	_.forEach(agents, agent => {
		if (_.lte(agent.next_buy, time)) {
			let trade = TF.buy(agent, agents);
			trades.push(trade);

		}
	});

	_.forEach(trades, trade => {
		const { buyer_id, seller_id } = trade;

		const buyer = agents[buyer_id],
			seller = agents[seller_id],
			price = seller.price;

		agents[seller_id] = {
			...seller,
			money: seller.money + price
		};

		let money = buyer.money - price,
			next_buy = time + β * price_index / buyer.money;
		agents[buyer.id] = {
			...buyer,
			next_buy,
			money
		};

		spending += price;

	});

	const HORIZON_LONG = 5,
		production = trades.length,
		history = _(state.history)
		.filter(d => _.gte(d.time, time - HORIZON_LONG))
		.push({
			time,
			production,
			spending,
			price_index
		})
		.value();

	const HORIZON_SHORT = 2, //used to calculate moving average
		history_short = history.filter(d => _.gte(d.time, time - HORIZON_SHORT)),
		Y = d3.sum(history_short, d => d.production) / HORIZON_SHORT,
		Ȳ = agents.length,
		output_gap = Math.log(Y / Ȳ),
		price_cofactor = Math.exp(ϕ * output_gap * dt);

	_.last(history).Y = Y;

	if (time > HORIZON_SHORT) {
		agents = _.map(agents, agent => {
			return {
				...agent,
				price: agent.price * price_cofactor
			};
		});
	}

	// if (state.z % 100 == 0) {
	// 	console.log(Y, price_index);
	// }

	return {...state, trades, agents, time, price_index, history, z: state.z + 1 };
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'CHANGE_β':
			return {
				...state,
				β: action.β
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
