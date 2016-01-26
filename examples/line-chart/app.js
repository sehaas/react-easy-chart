import React from 'react';
import ReactDom from 'react-dom';
// import {escapeHTML} from '../util';
// import ToolTip from '../ToolTip';
import {LineChart} from 'react-easy-chart';
import moment from 'moment';
import {format} from 'd3-time-format';
// import Scrollspy from 'react-scrollspy';

class LineChartContainer extends React.Component {
    constructor(props) {
      super(props);
      // Generate multiple lines of data
      this.data = [this.generateData(), this.generateData(), this.generateData(), this.generateData()];
      const initialWidth = window.innerWidth > 0 ? window.innerWidth : 500;
      this.state = {
        showToolTip: false,
        windowWidth: initialWidth - 100,
        componentWidth: 300
      };
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    mouseOverHandler(d, e) {
      this.setState({
        showToolTip: true,
        top: `${e.screenY - 10}px`,
        left: `${e.screenX + 10}px`,
        y: d.y,
        x: d.x});
    }

    mouseMoveHandler(e) {
      if (this.state.showToolTip) {
        this.setState({top: `${e.y - 10}px`, left: `${e.x + 10}px`});
      }
    }

    mouseOutHandler() {
      this.setState({showToolTip: false});
    }

    clickHandler(d) {
      this.setState({dataDisplay: `The amount selected is ${d.y}`});
    }

    generateData() {
      const data = [];
      const xs = [];

      let date = moment('2015-1-1 00:00', 'YYYY-MM-DD HH:mm');
      for (let i = 1; i <= 12; i++) {
        xs.push(date.format('D-MMM-YY HH:mm'));
        date = date.add(1, 'hour');
      }
      xs.map((x) => {
        data.push({x: x, y: this.getRandomArbitrary(0, 100)});
      });
      return data;
    }

    turnOnRandomData() {
      this.setState({randomDataIntervalId: setInterval(this.updateData.bind(this), 2000)});
    }

    turnOffRandomData() {
      clearInterval(this.state.randomDataIntervalId);
      this.setState({randomDataIntervalId: null});
    }

    updateData() {
      const parseDate = format('%d-%b-%y %H:%M').parse;
      this.data.map((data) => {
        data.shift();
        let y = this.getRandomArbitrary(
          data[data.length - 1].y - 20,
           data[data.length - 1].y + 20);
        if (y < 0 || y > 100) y = data[data.length - 1].y;
        const date = moment(parseDate(data[data.length - 1].x));
        date.add(1, 'hour');
        data.push({x: date.format('D-MMM-YY HH:mm'), y: y});
      });

      this.forceUpdate();
    }

    toggleState() {
      this.setState({
        active: !this.state.active
      });
    }

    render() {
      return (<div>
        {
          this.state.randomDataIntervalId ? <input type="button" value="Stop random data" onClick={this.turnOffRandomData.bind(this)}></input>
          :
          <input type="button" value="Start random data" onClick={this.turnOnRandomData.bind(this)}></input>
        }
        <LineChart
          data={this.data}
          datePattern={'%d-%b-%y %H:%M'}
          xType={'time'}
          width={800}
          height={500}
          interpolate={'cardinal'}
          yDomainRange={[0, 100]}
          axisLabels={{x: 'Hour', y: 'Percentage'}}
          axes
          grid
          style={{'.line0':
          {
            stroke: 'green'
          }}}
        />
      </div>
      );
    }
}


ReactDom.render(<LineChartContainer/>, document.getElementById('root'));
