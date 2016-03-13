import React from 'react';
import { findDOMNode } from 'react-dom';
import d3 from 'd3';
import './style-market.scss';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const { circle } = React.DOM;

const arc = d3.svg.arc()
	.innerRadius(18).outerRadius(22)
	.startAngle(0).endAngle(d => d / 20 * Math.PI * 2);

const Wealth = React.createClass({
	arc,
	mixins: [PureRenderMixin],
	selection: null,
	update(oldMoney, newMoney) {
		this.selection.attr('d', this.arc(newMoney));
	},
	componentDidMount() {
		this.selection = d3.select(findDOMNode(this));
		this.selection.attr('d', this.arc(this.props.money));
	},
	componentWillReceiveProps(nextProps) {
		if (this.selection) this.update(this.props.money, nextProps.money)
	},
	render() {
		return <path className='money arc'/>
	}
});

const Trades = React.createClass({
	mixins: [PureRenderMixin],
	selection: null,
	xScale(val) {
		let { domain, range } = this.props;
		return range[0] + (range[1] - range[0]) * (val - domain[0]) / (domain[1] - domain[0]);
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
		this.selection = d3.select(findDOMNode(this));
	},
	componentWillReceiveProps(nextProps) {
		if (this.selection) this.update(nextProps.trades);
	},
	render() {
		return <g></g>
	}
});

const Market = ({ agents, trades }) => {
	return (
		<svg width='500' height='500'>
				<rect width='500' height='500' className='bg'/>
				<g transform='translate(250,250)'>
					{_.map(agents, (d,i,k)=>{
								let R = 180;
								return (
									<g 
										className={`id-${d.id}`}
										transform= {`translate(${R*Math.cos(d.id/k.length*Math.PI*2)}, ${R*Math.sin(d.id/k.length*Math.PI*2)})`}
										key={d.id}>
										{
											<Wealth money={d.money }/>
										}
										{circle({
											className: `agent`,
											r: 10,
											key: d.id,
										})}

								</g>
								);
					})}
					<Trades trades={trades} />
				</g>
		</svg>
	);
};

export default Market;
