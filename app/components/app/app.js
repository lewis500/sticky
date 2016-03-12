import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
// import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import d3Ease from 'd3-ease';
import d3Timer from 'd3-timer';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ProductionPlot from '../plots/production';
const { circle } = React.DOM;

const arc = d3.svg.arc()
	.innerRadius(18)
	.outerRadius(22)
	.startAngle(0)
	.endAngle(d => d / 20 * Math.PI * 2);

const Wealth = React.createClass({
	mixins: [PureRenderMixin],
	selection: null,
	update(oldMoney, newMoney) {
		this.selection.attr('d', arc(newMoney));
	},
	componentDidMount() {
		this.selection = d3.select(this.refs.path);
		this.selection.attr('d', arc(this.props.money));
	},
	componentWillReceiveProps(nextProps) {
		if (this.selection) this.update(this.props.money, nextProps.money)
	},
	render() {
		return <path ref='path' className='money arc'/>
	}
});

const Trades = React.createClass({
	mixins: [PureRenderMixin],
	selection: null,
	xScale(val){
		let {domain,range} = this.props;
		return range[0] + (range[1] - range[0])*(val-domain[0])/(domain[1]-domain[0]);
	},
	update(trades) {
		_.forEach(trades, trade => {
			let buyer = d3.select(`g.id-${trade.buyer_id}`),
				seller = d3.select(`g.id-${trade.seller_id}`);

			buyer.select('circle.agent')
				.transition('asdf')
				.ease('cubic')
				.attr('transform', 'scale(1.25)')
				.transition()
				.ease('bounce')
				.duration(800)
				.attr('transform', 'scale(1)');

			seller.select('circle.agent')
				.transition('asdf')
				.ease('cubic')
				.attr('transform', 'scale(1.25)')
				.transition()
				.ease('bounce')
				.duration(800)
				.attr('transform', 'scale(1)');

			let money = this.selection
				.append('circle')
				.attr({
					transform: buyer.attr('transform'),
					r: 0,
					class: 'money trade'
				})
				.transition('grow')
				.duration(100)
				.attr('r', 6)
				.transition('z')
				.ease('cubic')
				.duration(400)
				.attr({
					transform: seller.attr('transform')
				})
				.each('end', () => {
					money.transition('q2')
						.duration(50)
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
				.duration(100)
				.attr('r', 6)
				.transition('z')
				.ease('cubic')
				.duration(400)
				.attr({
					transform: buyer.attr('transform')
				})
				.each('end', () => {
					good.transition('q3')
						.duration(130)
						.ease('cubic')
						.attr('r', 0)
						.remove();
				});
		});

	},
	componentDidMount() {
		this.selection = d3.select(this.refs.gTrades);
	},
	componentWillReceiveProps(nextProps) {
		if (this.selection) this.update(nextProps.trades);
	},
	render() {
		return <g ref='gTrades'></g>
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
			let last = 0,
				dt = 0;
			let t = d3Timer
				.timer(elapsed => {
					dt = elapsed - last;
					last = elapsed;
					if (this.state.paused) t.stop();
					this.props.tick(dt);
				});
		}
		this.setState({ paused: paused })
	},
	render() {
		let trade_circle;
		return (
			<div className='flex-container-column main'>
				<button onClick={this.pausePlay}>Pause Play</button>
				<button onClick={this.props.reset}>Reset</button>
				<svg width='500' height='500'>
					<rect width='500' height='500' className='bg'/>
					<g transform='translate(250,250)'>
						{_.map(this.props.agents, (d,i,k)=>{
									let R = 180;
									return (
										<g 
											className={`id-${d.id}`}
											transform= {`translate(${R*Math.cos(d.id/k.length*Math.PI*2)}, ${R*Math.sin(d.id/k.length*Math.PI*2)})`}
											key={d.id}>
											{
												//<Wealth money={d.money }/>
											}
											{circle({
												className: `agent`,
												r: 10,
												key: d.id,
												ref: d.id,
											})}

									</g>
									);
						})}
						<ProductionPlot history={this.props.history} />
						<Trades trades={this.props.trades} />
					</g>
				</svg>
				<br/>
				<div>{this.props.β}</div>
				<div>{this.props.price_index}</div>
				<input type='range' min={0} max={10} step={.5} value={this.props.β} onChange={this.props.change_β}/>
			</div>
		);
	}
});

const mapStateToProps = state => (state);

const mapActionsToProps = dispatch => ({
	change_β(e) {
		dispatch({ type: 'CHANGE_BETA' , β: +e.target.value});
	},
	reset() {
		dispatch({ type: 'RESET' });
	},
	tick(dt) {
		dispatch({ type: 'TICK', dt });
	},
	buy(buyer_id) {
		dispatch({ type: 'BUY', buyer_id });
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
