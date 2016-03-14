import _ from 'lodash';

const initialagents = _(10).range().map(d => {
	return {
		id: d,
		money: 5,
		price: 1,
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
	history_long: [],
	gdp: 0,
	Ȳ: initialagents.length,
	time: 0,
	β: 5,
	price_index: 1,
	last_push_to_history_long: 0,
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
		{ ϕ, β, Ȳ } = state;
	let { history_long, history, agents, last_push_to_history_long } = state;

	const price_index = d3.mean(agents, agent => agent.price);
	// const price_index = 1;

	let trades = [];
	_.forEach(agents, agent => {
		if (
			agent.next_buy < time
		) {
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

	});

	const FREQUENCY = .5,
		HORIZON_LONG = 3,
		HORIZON_SHORT = 2,
		production = trades.length;

	history = [
		...history, {
			time,
			production,
			price_index,
			dt
		}
	];
	const history_short = _.filter(history, d => d.time >= time - HORIZON_SHORT),
		Y = d3.sum(history_short, d => d.production) / HORIZON_SHORT,
		output_gap = Math.log(Y / Ȳ),
		price_cofactor = Math.exp(ϕ * output_gap * dt);

	if (
		last_push_to_history_long < (time - FREQUENCY)
	) {
		let Y_long = 0,
			price_index_long = 0;
		_.forEachRight(history, d => {
			if (
				d.time <= time-HORIZON_LONG
			) return false;
			Y_long += d.production;
			price_index_long += (d.price_index * d.dt);
		});
		Y_long = Y_long / HORIZON_LONG;
		price_index_long = price_index_long / HORIZON_LONG;

		history_long = _(history_long)
			.filter(d => d.time >= time-10)
			.push({
				time,
				Y: Y_long,
				price_index: price_index_long
			}).value();
		last_push_to_history_long = time;

	}

	if (time > HORIZON_SHORT) {
		agents = _.map(agents, agent => {
			return {
				...agent,
				price: agent.price * price_cofactor
			};
		});
	}

	return {...state, trades, agents, time, price_index, history, history_long, z: state.z + 1, last_push_to_history_long };
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
