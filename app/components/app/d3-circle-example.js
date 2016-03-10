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