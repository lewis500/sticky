import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ProductionPlot from '../plots/production';

const styles = {
	headline: {
		fontSize: 24,
		paddingTop: 16,
		marginBottom: 12,
		fontWeight: 400,
	},
};

const Katex = (data) => {
	let math = katex.renderToString(data);
	return <span dangerouslySetInnerHTML={ {__html: math} }/>
};

const explanation = (
		<div className='ll-text' >
		<p>
			"Workers" buy "widgets" from each other for {Katex('P')} dollars each. There are {Katex('M')} dollars in total. For safety, each worker wants to hold {Katex('\\beta')} dollars in the bank for each dollar he/she spends. So, in all, workers spend about {Katex('M/\\beta')} dollars/second. Since one dollar buys {Katex('1/P')} widgets, "output" per second is about {Katex('\\frac{M/\\beta}{P}')}. </p>
		<p>
			Change {Katex('\\beta')} and {Katex('M')} with the sliders. If you raise {Katex('\\beta')}, people want to hold more money, and spending falls. If you raise M, dollars "split" into new dollars, and spending rises.
		</p>
		<p>
			The price of a widget, {Katex('P')}, changes depending on how hard workers are working. Workers would really like to make exactly one widget/sec. If they're making more than that, {Katex('P')} goes up. If they're working less, {Katex('P')} falls. So, in the long run, output goes to {Katex('10')} widgets/sec (the number of workers) unless you keep {Katex('P')} rising or falling. That's the economies' capacity.
		</p>
	</div>
	),
	introduction = (
		<div className='ll-text' >
		<p id="note">
			Note: For brevity, we talk about fixed levels, but, today, rates-of-change are what matter. So swap 'inflation' for 'price,' 'money growth' for 'money,' etc.
		</p>
		<p>
			Recessions happen when individuals, governments and/or firms decide to spend money less quickly. With lower spending, the only way the same amount of stuff gets sold is if prices fall. But prices &mdash; especially wages &mdash; fall slowly. So unless someone makes new money, or something (e.g., a bubble or new technology) makes people spend again, recessions last a long time. The opposite &mdash; a boom with rising prices &mdash; can happen, too.
		</p>
		<p>
			To the right is an economy with ten workers who buy from each other. You can control the demand for money (the opposite of the willingness to spend) with the {Katex('\\beta')} slider, and the money supply with the {Katex('M')} slider. The Instruction tab has detail.
		</p>
	</div>
	);


const Tab = ({ active_tab, name, on_change }) => {
	return (
		<div 
				onClick={()=> on_change(name)}
				className={'ll-tab ' + (active_tab ==name ? 'active': 'inactive')}>
				{name}
			</div>
	);
};


const Text = React.createClass({
	mixins: [PureRenderMixin],
	getInitialState() {
		return {
			tab: 'introduction'
		};
	},

	onChange(value) {
		this.setState({
			tab: value,
		});
	},

	render() {
		const plots = (
			<div className='ll-text'>

					<div style={{height: '120px'}}>
						<ProductionPlot history={this.props.history_long} time={this.props.time} />
					</div>
				</div>
		);
		let texts = { introduction, explanation, plots };

		let asdf = _.keys(texts).map(d => {
			return <Tab on_change={this.onChange} key={d} name={d} active_tab={this.state.tab}/>
		});

		return (
			<div className='ll-column-one'>
				<div className='ll-tabs'>
					{
						asdf
					}
				</div>
				<div className='holder'>
					{texts[this.state.tab]}
				</div>
				<div className='buttons flex-container-row'>
					<button className="btn" onClick={this.props.pausePlay}>{this.props.paused ? 'PLAY' : 'PAUSE'}</button>
					<button className="btn" onClick={this.props.reset}>RESET</button>
				</div>
			</div>
		);

	}
});

export default Text;

// <p>
// 	A central bank can often print money to keep spending pretty stable, and governments can help by boosting benefits and letting prices and wages change. Most English-speaking and some Nordic countries have central banks, stable benefits and free markets. In the Euro-zone, countries don't control their money, benefits are being cut, and laws make prices inflexible. The latter have bad unemployment.
// </p>
