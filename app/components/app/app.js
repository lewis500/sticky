import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import d3Ease from 'd3-ease';
import d3Timer from 'd3-timer';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const { circle } = React.DOM;

const Wealth = React.createClass({
	mixins: [PureRenderMixin],
	selection: null,
	update(money) {
		let circles = this.selection
			.selectAll('circle.money')
			.data(_.range(money));

		circles //NEW MONEY
			.enter()
			.append('circle')
			.attr({
				r: 0,
				class: 'money',
				cy: 25,
			})
			.transition('u')
			.delay(800)
			.ease('bounce-in')
			.duration(300)
			.attr({
				r: 4,
				// cy: 25
			});

		circles //ROTATE OLD CIRCLES
			.transition('p')
			.delay(() => money > this.props.money ? 725 : 0)
			.ease('elastic')
			.duration(600)
			.attr('transform', (d, i, k) => {
				let z = i * 360 / money;
				return `rotate(${z})`
			});

		circles
			.exit()
			.transition()
			.duration(200)
			.ease('cubic-out')
			.attr('cy', 0)
			.remove();
	},
	componentWillReceiveProps(nextProps) {
		if (this.refs.gWealth) this.update(nextProps.money);
	},
	componentDidMount() {
		this.selection = d3.select(this.refs.gWealth);
		this.update(this.props.money);
	},
	render() {
		return <g ref='gWealth'></g>
	}
});

const TradeCircle = React.createClass({
	selection: null,
	mixins: [PureRenderMixin],
	componentDidUpdate() {
		if (!this.props.trade) return;
		let buyer = d3.select(`g.id-${this.props.trade.buyer_id}`),
			seller = d3.select(`g.id-${this.props.trade.seller_id}`);
		//make the 
		buyer.select('circle.trader')
			.transition('asdf')
			.ease('cubic')
			.attr('transform', 'scale(1.25)')
			.transition()
			.ease('bounce')
			.duration(800)
			.attr('transform', 'scale(1)');

		seller.select('circle.trader')
			.transition('asdf')
			.ease('cubic')
			.attr('transform', 'scale(1.25)')
			.transition()
			.ease('bounce')
			.duration(800)
			.attr('transform', 'scale(1)');

		buyer.selectAll('circle.money')
			.transition('b')
			.delay(50)
			.ease('cubic-in')
			.duration((d, i) => Math.random() * 30 + 400)
			.attr('cy', 28)
			.transition('c')
			.ease('bounce')
			.duration((d, i) => 620 + Math.random() * 35)
			.attr('cy', 25);

		seller.selectAll('circle.money')
			.transition('b')
			.delay(50)
			.ease('cubic-in')
			.duration((d, i) => Math.random() * 30 + 400)
			.attr('cy', 28)
			.transition('c')
			.ease('bounce')
			.duration((d, i) => 620 + Math.random() * 35)
			.attr('cy', 25);

		let money = this.selection
			.append('circle')
			.attr({
				transform: buyer.attr('transform'),
				r: 0,
				class: 'money trade'
			})
			.transition('grow')
			.delay(125)
			.duration(125)
			.attr('r', 6)
			.transition('z')
			.ease('back')
			.duration(600)
			.attr({
				transform: seller.attr('transform')
			})
			.each('end', () => {
				money.transition('q2')
					.duration(120)
					.ease('cubic')
					.attr('r', 0)
					.remove();
			});

		let good = this.selection
			.append('circle')
			.attr({
				transform: seller.attr('transform'),
				r: 0,
				class: 'good trade'
			})
			.transition('grow')
			.delay(125)
			.duration(125)
			.attr('r', 6)
			.transition('z')
			.ease('back')
			.duration(600)
			.attr({
				transform: buyer.attr('transform')
			})
			.each('end', () => {
				good.transition('q3')
					.duration(160)
					.ease('cubic')
					.attr('r', 0)
					.remove();
			});
	},
	componentDidMount() {
		this.selection = d3.select(this.refs.gTrade);
	},
	render() {
		return <g ref='gTrade'></g>
	}
});

const AppComponent = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			paused: true
		};
	},
	pausePlay() {
		let paused;
		if (!(paused = !this.state.paused)) {
			let t = d3Timer
				.interval(elapsed => {
					this.props.make_trade();
					if (this.state.paused) t.stop();
				}, 600);
		}
		this.setState({ paused: paused })
	},
	render() {
		let trade_circle;
		return (
			<div className='flex-container-row main'>
				<button onClick={this.pausePlay}>Pause Play</button>
				<button onClick={this.props.reset}>Reset</button>
				<svg width='500' height='500'>
					<rect width='500' height='500' className='bg'/>
					<g transform='translate(250,250)'>
						{_.map(this.props.traders, (d,i,k)=>{
									let R = 100;
									return (
										<g 
											className={`id-${d.id}`}
											transform= {`translate(${R*Math.cos(i/k.length*Math.PI*2)}, ${R*Math.sin(i/k.length*Math.PI*2)})`}
											key={d.id}>
											<Wealth money={d.money }/>
											{circle({
												className: `trader`,
												r: 15,
												key: d.id,
												ref: d.id,
												onClick: ()=> this.props.buy(d.id)
											})}
									</g>
									);
						})}
						<TradeCircle trade={this.props.trade} />
					</g>
				</svg>
			</div>
		);
	}
});

const mapStateToProps = state => (state);

const mapActionsToProps = dispatch => ({
	reset() {
		dispatch({ type: 'RESET' });
	},
	make_trade() {
		dispatch({ type: 'TRADE' });
	},
	buy(buyer_id) {
		dispatch({ type: 'BUY', buyer_id });
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
