import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import d3Ease from 'd3-ease';
import d3Timer from 'd3-timer';
const { circle } = React.DOM;

const Balances = React.createClass({
	selection: null,
	update(balance) {
		let circles = this.selection
			.selectAll('circle.balance')
			.data(_.range(balance));

		let newCircle = circles
			.enter()
			.append('circle')
			.attr({
				r: 0,
				class: 'balance',
				cy: 25,
			})
			.transition('u')
			.delay(200)
			.ease('bounce-in')
			.duration(500)
			.attr('r', 4);

		circles
			.transition('p')
			.ease('elastic')
			.duration(750)
			.attr('transform', (d, i, k) => {
				let z = i * 360 / balance;
				return `rotate(${z})`
			});
		newCircle.transiti
		circles.exit().remove();
	},
	componentDidMount() {
		this.selection = d3.select(this.refs.gBalances);
		this.update(this.props.balance);
	},
	render() {
		if (this.refs.gBalances) this.update(this.props.balance);
		return <g ref='gBalances'></g>
	}
});

const TradeCircle = React.createClass({
	selection: null,
	componentWillReceiveProps(nextProps) {
		let a = d3.select(`g.id-${nextProps.trade.buyer_id}`),
			b = d3.select(`g.id-${nextProps.trade.seller_id}`);
		a.select('circle')
			.transition('a')
			.ease('cubic')
			.attr('transform', 'scale(1.25)')
			.transition()
			.ease('bounce')
			.duration(800)
			.attr('transform', 'scale(1)');
		a.selectAll('circle.balance')
			.transition('b')
			.delay(50)
			.ease('cubic-in')
			// .delay((d,i)=> Math.random()*20)
			.duration((d, i) => Math.random() * 30 + 400)
			.attr('cy', 28)
			.transition('c')
			.ease('bounce')
			// .delay((d,i)=> Math.random()*20)
			.duration((d, i) => 620 + Math.random() * 35)
			.attr('cy', 25);
		let added = this.selection.append('circle')
			.attr({
				transform: a.attr('transform'),
				r: 5,
				class: 'trade-circle'
			})
			.transition()
			.ease('back-in')
			.duration(800)
			.attr({
				transform: b.attr('transform')
			})
			.each('end', () => {
				added.transition()
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
	render() {
		let trade_circle;
		return (
			<div className='flex-container-row main'>
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
											{circle({
												className: `trader`,
												r: 15,
												key: d.id,
												ref: d.id,
												onClick: ()=> this.props.buy(d.id)
											})}
											<Balances balance={d.balance }/>
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
// let i = 0;
let λ = 3; //3 per second
const mapActionsToProps = dispatch => ({
	buy(buyer_id) {
		dispatch({ type: 'BUY', buyer_id });
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
