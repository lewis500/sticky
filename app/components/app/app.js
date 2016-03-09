import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';
import d3Ease from 'd3-ease';
import d3Timer from 'd3-timer';
const { circle } = React.DOM;

const D3Circle = React.createClass({
	getInitialState: function() {
		return {
			rotate: this.props.rotate, //the initial rotation
		};
	},
	duration: 200,
	_timer: null,
	componentWillUnmount() {
		this._timer.stop();
	},
	componentWillReceiveProps(nextProps) {
		if (this._timer) this._timer.stop();
		let a = this.state.rotate,
			b = nextProps.rotate,
			θ = 0;
		this._timer = d3Timer.timer(elapsed => {
			θ = d3Ease.easeLinear(elapsed / this.duration);
			this.setState({
				rotate: a * (1 - θ) + θ * b
			});
			if (elapsed > this.duration) this._timer.stop();
		});
	},
	render() {
		return circle({
			className: 'trader',
			r: 10,
			cx: -50,
			transform: `rotate(${this.state.rotate})`
		});
	}
});

const AppComponent = React.createClass({
	render() {
		return (
			<div className='flex-container-row main'>
				<button className='button' onClick={this.props.trade}>Trade</button>
				<button className='button' onClick={this.props.deleteOne}>Delete</button>
				<svg width='500' height='500'>
					<g transform='translate(250,250)'>
						{_.map(this.props.traders, (d,i,k)=>{
							return (<D3Circle rotate={i*360/k.length + this.props.numTrades*20} key={i}/>);
						})}
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
	deleteOne() {
		dispatch({ type: 'DELETE' });
	},
	trade() {
		// let delay = -Math.log(Math.random()) / λ;
		// d3.timer(() => {
		dispatch({ type: 'TRADE' });
		// 	return true;
		// }, delay * 1000);
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
