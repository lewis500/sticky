import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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
			The price of a widget, {Katex('P')}, depends on how hard workers are working. If each worker is making more than one widget per second, {Katex('P')} goes up. If output is lower than that, {Katex('P')} falls. Thus, the economy's <em>capacity</em> is {Katex('1')} widget/worker/second, or {Katex('10')} widgets/second overall. So, in the long run, you can't control output unless you let {Katex('P')} rise higher and higher.
		</p>
	</div>
	),
	introduction = (
		<div className='ll-text' >
		<p id="note">
			Note: For brevity, this visualization uses fixed levels, but, today, rates-of-change are what matter. So swap 'inflation' for 'price,' 'money growth' for 'money,' etc.
		</p>
		<p>
			Recessions happen when individuals, governments and/or firms decide to spend money less quickly. With lower spending, the only way the same amount of stuff gets sold is if prices fall. But prices &mdash; especially wages &mdash; fall slowly. So unless someone makes new money, or something (e.g., a bubble or new technology) makes people spend again, recessions last a long time. The opposite &mdash; a boom with rising prices &mdash; can happen, too.
		</p>
		<p>
			To the right is an economy with ten workers who buy from each other. You can control the demand for money (the opposite of the willingness to spend) with the {Katex('\\beta')} slider, and the money supply with the {Katex('M')} slider. The Instruction tab has detail.
		</p>
	</div>
	),
	comment = (
		<div className='ll-text'>
			<p>
				A central bank can often print money to keep spending pretty stable, and governments can help by boosting benefits and letting prices and wages change. Most English-speaking and some Nordic countries have central banks, stable benefits and free markets. In the Euro-zone, countries don't control their money, benefits are being cut, and laws make prices inflexible. The latter have bad unemployment.
			</p>
		</div>
	);
let texts = { introduction, explanation };


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
