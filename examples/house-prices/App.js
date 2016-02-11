import React from 'react';
import ReactDOM from 'react-dom';
import {housePriceData} from './data';
import {ScatterplotChart} from 'react-easy-chart';
import {Legend} from 'react-easy-chart';

export default class HousePrices extends React.Component {
  constructor(props) {
    super(props);
    this.data = [];
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
      }
    );
  }

  render() {
    return (
      <div className="container">
        <h1>House prices</h1>
        <ScatterplotChart
          axes
          data={this.data}
          width={this.state.componentWidth}
          height={this.state.componentWidth / 2}
        />
        <Legend data={this.data} dataId={'type'} />
      </div>
    );
  }
}

ReactDOM.render(<HousePrices/>, document.getElementById('root'));
