import { connect } from 'react-redux';
import React from 'react';
import './style-app.scss';
import d3Timer from 'd3-timer';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ProductionPlot from '../plots/production';
import Market from '../market/market';
const { circle } = React.DOM;

const AppComponent = React.createClass({
	paused: true,
	pausePlay() {
		if (!(this.paused = !this.paused)) {
			let last = 0,
				dt = 0,
				timer = d3Timer
				.timer(elapsed => {
					dt = elapsed - last;
					last = elapsed;
					if (this.paused) timer.stop();
					this.props.tick(dt);
				});
		}
	},
	render() {
		let trade_circle;
		return (
			<div className='flex-container-column main'>
				<button onClick={this.pausePlay}>Pause Play</button>
				<button onClick={this.props.reset}>Reset</button>
				<Market agents={this.props.agents} trades={this.props.trades} />
				<br/>
				<div>{this.props.β}</div>
				<div>{this.props.price_index}</div>
				<ProductionPlot history={this.props.history} />
				<input type='range' min={0} max={10} step={.5} value={this.props.β} onChange={this.props.change_β}/>
			</div>
		);
	}
});

const mapStateToProps = state => (state);

const mapActionsToProps = dispatch => ({
	change_β(e) {
		dispatch({ type: 'CHANGE_BETA', β: +e.target.value });
	},
	reset() {
		dispatch({ type: 'RESET' });
	},
	tick(dt) {
		dispatch({ type: 'TICK', dt });
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
