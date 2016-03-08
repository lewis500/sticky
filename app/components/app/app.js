import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import d3 from 'd3';
import './style-app.scss';

const AppComponent = React.createClass({
	render() {
		return (
			<div className='flex-container-row main'>
				<button className='button' onClick={this.props.trade}>Trade</button>
				<svg width='500' height='500'>
					<g transform='translate(250,250)'>
						{_.map(this.props.traders, (d,i,k)=>{
							return (
								<circle 
									key={d.id}
									r='10'
									className='trader'
									onClick={this.props.trade}
									transform={`rotate(${i*360/k.length}) translate(${-200},0)`}/>
								);
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
	trade() {
		let delay = - Math.log(Math.random()) / λ;
		d3.timer(() => {
			dispatch({ type: 'TRADE' });
			return true;
		}, delay * 1000);
	}
});

export default connect(mapStateToProps, mapActionsToProps)(AppComponent);
