import React from 'react';
const styles = {
	headline: {
		fontSize: 24,
		paddingTop: 16,
		marginBottom: 12,
		fontWeight: 400,
	},
};


const Text = React.createClass({

	getInitialState() {
		return {
			tab: 'a'
		};
	},

	onChange(value) {
		this.setState({
			tab: value,
		});
	},

	render() {
		let aContent = (
			<div className='ll-text' >
				<p>
					To the right, "workers" buy "widgets" from each other for  P dollars each. There are M dollars altogether. For safety, each worker wants to hold $β for each one he/she spends. So, spending per second is about M/β, and "output" (widgets sold) per second is (M/β)/P.</p>
				<p>
					Change β and M with the sliders. If you raise β, people want to hold more money, and spending falls. If you raise M, dollars "split" into new dollars, and spending rises.
				</p>
				<p>
					The price level, P, depends on how hard workers are working. If workers make more than one widget per second, the economy is over capacity, and P rises; if they make less, P falls. Because prices adjust, in the long run you can't control output unless you keep P rising.
				</p>
			</div>
		);
		let bContent = (
			<div className='ll-text' >
				<p id="note">
					Note: For brevity, this is explained with fixed quantities. It's really rates-of-change that matter. So swap 'inflation' for 'price,' 'money growth' for 'money,' etc.
				</p>
				<p>Recessions happen when people decide to spend money less quickly. With less spending, the only way the same amount of stuff can get sold is if prices fall. But prices &mdash; especially wages &mdash; fall slowly. So unless someone makes new money or something makes people spend more, recessions last a long time.</p>
			</div>
		);
		return (
			<div className='ll-column-one'>
				<div className='ll-tabs'>
					<div 
						onClick={()=>this.onChange('a')}
						className={'ll-tab ' + (this.state.tab=='a' ? 'active': 'inactive')}>Instructions</div>
					<div 
						onClick={()=>this.onChange('b')}
						className={'ll-tab ' + (this.state.tab=='b' ? 'active': 'inactive')}>Explanation</div>
				</div>
				<div className='holder'>
					{(this.state.tab == 'a' ? aContent : bContent)}
				</div>
				<div className='buttons flex-container-row'>
					<button className="btn" onClick={this.props.pausePlay}>{this.props.paused ? 'PLAY' : 'PAUSE'}</button>
					<button className="btn" onClick={this.props.reset}>RESET</button>
				</div>
			</div>
		);

	}
});

// return (
// 	<Tab label="INSTRUCTIONS" value="a" onClick={()=> this.onChange('a')} >

// 		</Tab>
// 		<Tab label="EXPLANATION" value="b" onClick={()=> this.onChange('b')} >

// 		</Tab>
// );
// class Text extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       slideIndex: 0,
//     };
//   }

//   handleChange = (value) => {
//     this.setState({
//       slideIndex: value,
//     });
//   };

//   render() {
//     return (
//       <div>
//         <Tabs
//           onChange={this.handleChange}
//           value={this.state.slideIndex}
//         >
//           <Tab label="Tab One" value={0} />
//           <Tab label="Tab Two" value={1} />
//           <Tab label="Tab Three" value={2} />
//         </Tabs>
//         <SwipeableViews
//           index={this.state.slideIndex}
//           onChangeIndex={this.handleChange}
//         >
//           <div id='text'>
//           <h5>Why do recessions happen?</h5>
//           <p id="note"><em>Note: to be short, this is explained with fixed levels. It's really rates-of-change that matter, so  'price'=='inflation' and 'money'=='change in money' etc.</em></p>
//           <p>
//             Recessions happen when people decide to spend money less quickly. With less spending, the only way the same amount of stuff can get sold is if prices fall. But prices &mdash; especially wages &mdash; fall slowly. So unless someone makes new money or something makes people spend more, recessions last a long time.
//           </p>
//           <p>
//             To the right, "workers" buy "widgets" from each other for  P dollars each. There are M dollars altogether. For safety, each worker wants to hold $β for each one he/she spends. So, spending per second is about M/β, and "output" (widgets sold) per second is (M/β)/P (try the math).</p>
//           <p>
//             Change β and M with the sliders. If you raise β, people want to hold more money, and spending falls. If you raise M, dollars "split" into new dollars, and spending rises.
//           </p>
//           <p>
//             You can't control the price P. It changes based on how hard workers are working. If workers make more than one widget per second, P rises; if they make less, P falls. Because prices adjust, in the long run you can't control output unless you keep P rising.
//           </p>
//           </div>
//         </SwipeableViews>
//       </div>
//     );
//   }
// }

export default Text;
