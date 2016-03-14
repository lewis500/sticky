import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import '../../style/style-charts.scss';
import Axis from '../axis/axis';
import col from '../../style/colors';

const m = {
	top: 10,
	left: 25,
	bottom: 5,
	right: 10
};

const ProductionPlot = React.createClass({
	mixins: [PureRenderMixin],
	componentDidMount() {
		let domNode = findDOMNode(this);
		this.parent = domNode.parentElement;
		this.resize();
		this.listener = window.addEventListener('resize', this.resize);
	},
	resize() {
		this.setState({ width: this.parent.clientWidth * .9 });
	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize)
	},
	getInitialState() {
		return {
			xDomain: [0, 10],
			yDomain: [0, 15],
			width: 160,
			height: 80
		};
	},
	xScale(v) {
		let { xDomain, width } = this.state;
		return (v - xDomain[0]) / (xDomain[1] - xDomain[0]) * width;
	},
	yScale(v) {
		let { yDomain, height } = this.state;
		return height * (yDomain[1] - v) / (yDomain[1] - yDomain[0]);
	},
	pathMaker(data, xVar, yVar) {
		var i = data.length,
			points = new Array(i);
		while (i--) {
			points[i] = [
				this.xScale(data[i][xVar]),
				this.yScale(data[i][yVar])
			];
		}
		return "M" + points.join("L");
	},
	componentWillReceiveProps(nextProps) {
		let { history } = nextProps;
		if (nextProps.time > 7.5) {
			let xDomain = [history[0].time, history[history.length - 1].time + 2.5];
			this.setState({ xDomain })
		}
	},
	render() {
		let { width, height, yDomain, xDomain } = this.state;
		let { yScale, xScale } = this;
		let paths;
		if (this.props.history.length > 0) {
			paths = (
				<g 
					transform={`translate(${m.left},${m.top})`} 
					clipPath="url(#myClip)">
					<path 
						className='path'	
						d={this.pathMaker(this.props.history,'time','Y')} 
						/>
				</g>
			);
		}
		return (
			<div style={{...this.props.style, position: 'absolute'}}>
				<svg 
					className='chart' 
					width={width+m.left+m.right}
					height={height+m.top+m.bottom}
					>
					<clipPath id="myClip" >
						<rect 
							y={-5}
							width={width} 
							height={height +5} />
					</clipPath>
					<g transform={`translate(${m.left},${m.top})`}>
						<Axis 
							classname='axis'
							domain={yDomain}
							range={[height,0]}
							height={height}
							tickArguments={[5]}
							innerTickSize={this.state.width}
							orientation='left'
							tickFormat={d3.format("d")}
							innerTickSize={-width}
						/>


						<g 
							className='legend' 
							transform={`translate(${width - 50},15)`}>
						</g>
					</g>
					{paths}
				</svg>
			</div>
		);
	}
});
/*
	<Axis 
		className='axis'
		domain={xDomain}
		range={[0,width]}
		width={width}
		height={height}
		orientation='bottom'
		label='time'
	/>
	*/

export default ProductionPlot;
