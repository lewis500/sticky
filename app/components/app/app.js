import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import d3Ease from 'd3-ease';
import d3Timer from 'd3-timer';
const { circle } = React.DOM;

// x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
// 	y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top

const TradeCircle = React.createClass({
	componentWillReceiveProps(nextProps) {
		let a = d3.select(`circle.id-${nextProps.trade.buyer_id}`),
			b = d3.select(`circle.id-${nextProps.trade.seller_id}`);
		a.transition()
			.ease('back')
			.attr('transform', a.attr('transform') + ' scale(1.25)')
			.transition()
			.ease('bounce')
			.duration(800)
			.attr('transform', `translate(${d3.transform(a.attr('transform')).translate})`);
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
					.duration(200)
					.attr('r',0)
					// .transition()
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
									return circle({
										className: `trader id-${d.id}`,
										r: 15,
										key: d.id,
										ref: d.id,
										transform: `translate(${R*Math.cos(i/k.length*Math.PI*2)}, ${R*Math.sin(i/k.length*Math.PI*2)})`,
										onClick: ()=> this.props.buy(d.id)
									});
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
