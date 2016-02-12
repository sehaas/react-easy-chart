import React from 'react';
import ReactDOM from 'react-dom';
import {housePriceData} from './data';
import {ScatterplotChart} from 'react-easy-chart';
import {Legend} from 'react-easy-chart';

export default class HousePrices extends React.Component {
  constructor(props) {
    super(props);
    this.data = [];
    this.change = [];
    this.qOneChange = [];
    this.state = {
      componentWidth: 1000
    };
  }

  /*
  convert
  {
    'Quarter': 'Q4 1952',
    'Index': 100,
    'Price': '1,891',
    'Annual Change': 0
  }
  to
  {
    'type': 'Q4', //Quarter
    'x': 100, // index
    'y': 5 // change
  }
  */
  // create data
  componentWillMount() {
    housePriceData.map(
      (item) => {
        // const t = item.Quarter.slice(0, 2);
        const t = item.Quarter.slice(0, 2);
        const price = Number(item.Price.replace(',', ''));
        const year = Number(item.Quarter.slice(-4));
        // const z = item['Annual Change'];
        this.data.push({
          type: t,
          x: year,
          y: price
        });

        this.change.push({
          type: t,
          x: year,
          y: item['Annual Change']
        });

        if (t === 'Q1' || t === 'Q4') {
          this.qOneChange.push({
            type: t,
            x: year,
            y: item['Annual Change']
          });
        }
      }
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({
      componentWidth: this.refs.component.offsetWidth
    });
  }

  render() {
    return (
      <div className="container" ref="component">
        <h1>UK House prices</h1>
        <p>A collection of scatterplot charts displaying <a href="http://www.nationwide.co.uk/about/house-price-index/download-data">Nationwide data</a> of average UK house prices since 1953</p>
        <h3>Average house price since 1953</h3>
        <p>The following chart plots the average house price with quarterly variation</p>
        <ScatterplotChart
          axes
          grid
          data={this.data}
          width={this.state.componentWidth}
          height={this.state.componentWidth / 2}
        />
      <Legend data={this.data} dataId={'type'} horizontal />
      <h3>Quaterly change since 1953</h3>
      <p>The chart below describes the annual percentage price change as reported for each quarter.</p>
        <ScatterplotChart
          axes
          grid
          verticalGrid
          data={this.change}
          width={this.state.componentWidth}
          height={this.state.componentWidth / 2}
        />
      <Legend data={this.change} dataId={'type'} horizontal />
      <h3>Q1 vs Q4 change since 1953</h3>
      <p>A variation of the previous chart showing the variation between Q1 and Q4</p>
        <ScatterplotChart
          axes
          grid
          verticalGrid
          data={this.qOneChange}
          width={this.state.componentWidth}
          height={this.state.componentWidth / 2}
        />
      <Legend data={this.qOneChange} dataId={'type'} horizontal />
      </div>
    );
  }
}

ReactDOM.render(<HousePrices/>, document.getElementById('root'));
