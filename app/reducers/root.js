import _ from 'lodash';

const initialagents = _(20).range().map(d => {
	return {
		id: d,
		money: 5,
		price: 1,
		β: 5, //fraction of spending in reserve
		sales: [],
		y: 1
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
	ϕ: .01,
	z: 0,
};

const TF = {
	choose_seller(buyer, agents) {
		const seller = _.sample(_.without(agents, buyer));
		return seller;
	},
	buy(buyer, agents, price_index, dt) { //returns a trade
		const { money, y, β, id } = buyer;
		const real_balance = money / price_index;

		if (_.gte(real_balance / β * dt, Math.random())) {
			const seller = this.choose_seller(buyer, agents);
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
	calc_y(agent, time, dt) { //returns a trade
		//count over two seconds
		const HORIZON = 2;
		if (time < HORIZON) return agent;
		const sales = _.filter(agent.sales, sale => _.gte(sale.time, time - HORIZON)),
			y = sales.length;
		// y = d3.sum(sales, sale => sale.real_price) / HORIZON;
		return {
			...agent,
			sales,
			y
		};
	}, //end calc_y,
};

const reduceTick = (state, action) => {
	const dt = action.dt / 1000,
		time = state.time + dt;

	let agents = _.map(state.agents, agent => TF.calc_y(agent, time, dt)),
		spending = 0;

	const price_index = d3.mean(agents, agent => agent.price),
		trades = _(agents)
		.map(buyer => TF.buy(buyer, agents, price_index, dt))
		.filter(trade => trade.seller_id !== -1)
		.value();

	_.forEach(trades, trade => {
		const { buyer_id, seller_id } = trade;

		const buyer = agents[buyer_id],
			seller = agents[seller_id],
			price = seller.price;

		agents[buyer_id] = {
			...buyer,
			money: buyer.money - price
		};

		agents[seller_id] = {
			...seller,
			sales: [...seller.sales, { time, real_price: price / price_index }],
			money: seller.money + price
		};

		spending += price;

	});

	const HORIZON = 3;

	const production = trades.length,
		history = _(state.history)
		.filter(d => (d.time > (time - HORIZON)))
		.push({
			time,
			production,
			spending,
			price_index
		})
		.value();

	const Y = d3.sum(history, d => d.production) / HORIZON,
		Ȳ = agents.length,
		output_gap = (Y - Ȳ),
		ϕ = state.ϕ,
		price_cofactor = Math.exp(ϕ * output_gap * dt);

	agents = _.map(agents, agent => {
		return {
			...agent,
			price: agent.price * price_cofactor
		};
	});


	if (state.z % 100 == 0) {
		// pi = d3.mean(history, d => d.price_index);
		console.log(Y);
	}

	return {...state, trades, agents, time, history, z: state.z + 1 };
};

const rootReduce = (state = initialState, action) => {
	switch (action.type) {
		case 'CHANGE_BETA':
			return {
				...state,
				β: action.β,
				agents: _.map(state.agents, agent => ({...agent, β: action.β })),
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
