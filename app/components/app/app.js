import { connect } from 'react-redux';
import React from 'react';
import d3Timer from 'd3-timer';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ProductionPlot from '../plots/production';
import Market from '../market/market';
import Rcslider from 'rc-slider';
import 'rc-slider/assets';
import './style-app.scss';
import Text from './text';

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
				<div className='flex-container-row big-row'>
					<div style={{'flex-basis': '30%', 'marginRight': '30px'}}>
						<Text pausePlay={this.pausePlay} paused={this.paused} reset={this.props.reset}/>
						<Rcslider  className='my-slider' min={1} max={10} step={1} value={this.props.β} onChange={this.props.change_β}/>
					</div>
					<div className='plot-column' style={{'marginRight': '30px'}}>
						<ProductionPlot history={this.props.history_long} time={this.props.time} />
						<ProductionPlot history={this.props.history_long} time={this.props.time} />
						<ProductionPlot history={this.props.history_long} time={this.props.time} />
					</div>
					<div style={{'marginRight': '20px'}}>
						<Market agents={this.props.agents} trades={this.props.trades} />
					</div>
				</div>
			</div>
		);
	}
});




const mapStateToProps = state => (state);

const mapActionsToProps = dispatch => ({
	change_β(e) {
		dispatch({ type: 'CHANGE_β', β: e });
	},
	reset() {
		dispatch({ type: 'RESET' });
	},
	tick(dt) {
		dispatch({ type: 'TICK', dt });
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
