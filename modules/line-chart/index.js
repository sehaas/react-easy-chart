import React from 'react';
import {createElement} from 'react-faux-dom';
import {reduce, calcMargin, getValueFunction, getRandomId, setLineDomainAndRange} from '../shared';
import {select, svg} from 'd3';
import {Style} from 'radium';
import merge from 'lodash.merge';
import {format} from 'd3-time-format';

const defaultStyle = {
  '.line': {
    fill: 'none',
    strokeWidth: 1.5
  },
  '.dot': {
    fill: '',
    strokeWidth: 0
  },
  'circle': {
    'r': 4
  },
  'circle:hover': {
    'r': 8,
    'opacity': 0.6
  },
  '.dot0': {
    fill: 'steelblue'
  },
  '.line0': {
    stroke: 'steelblue'
  },
  '.dot1': {
    fill: 'orange'
  },
  '.line1': {
    stroke: 'orange'
  },
  '.dot2': {
    fill: 'red'
  },
  '.line2': {
    stroke: 'red'
  },
  '.dot3': {
    fill: 'darkblue'
  },
  '.line3': {
    stroke: 'darkblue'
  },
  '.axis': {
    font: '10px arial'
  },
  '.axis .label': {
    font: '14px arial'
  },
  '.axis path,.axis line': {
    fill: 'none',
    stroke: '#000',
    'shape-rendering': 'crispEdges'
  },
  'x.axis path': {
    display: 'none'
  },
  '.tick line': {
    stroke: 'lightgrey',
    opacity: '0.7'
  }
};


export default class LineChart extends React.Component {
  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired,
      width: React.PropTypes.number,
      height: React.PropTypes.number,
      xType: React.PropTypes.string,
      yType: React.PropTypes.string,
      datePattern: React.PropTypes.string,
      interpolate: React.PropTypes.string,
      style: React.PropTypes.object,
      margin: React.PropTypes.object,
      axes: React.PropTypes.bool,
      grid: React.PropTypes.bool,
      xDomainRange: React.PropTypes.array,
      yDomainRange: React.PropTypes.array,
      axisLabels: React.PropTypes.object,
      tickTimeDisplayFormat: React.PropTypes.string,
      yTicks: React.PropTypes.number,
      xTicks: React.PropTypes.number,
      dataPoints: React.PropTypes.bool,
      mouseOverHandler: React.PropTypes.func,
      mouseOutHandler: React.PropTypes.func,
      mouseMoveHandler: React.PropTypes.func,
      clickHandler: React.PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      width: 200,
      height: 150,
      datePattern: '%d-%b-%y',
      interpolate: 'linear',
      axes: false,
      xType: 'linear',
      yType: 'linear',
      axisLabels: {x: '', y: ''},
      mouseOverHandler: () => {},
      mouseOutHandler: () => {},
      mouseMoveHandler: () => {},
      clickHandler: () => {}
    };
  }

  constructor(props) {
    super(props);
    this.parseDate = format(props.datePattern).parse;
    this.uid = getRandomId();
  }

  componentDidMount() {
    this.myPath = select('svg')
    .append('g')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', `line line0`)
    .datum(this.props.data[0])
    .attr('d', this.linePath);
    // this.paths[0].datum(this.props.data[0]);
    // this.props.data.map((dataElelment, i) => {
    //   this.pathGroups[i].append('path');
    // });
    // .datum(dataElelment)
    // .attr('class', `line line${i}`)
    // .attr('d', this.linePath)
    // this.drawPaths(this.props.data);
  }

  componentDidUpdate() {
    // challenge is to add to the data element before this data is sent in
    // this.props.data[0].pop(this.props.data[3]);
    this.myPath
    .attr('d', this.linePath)
    .attr('transform', null)
    .transition()
      .duration(1000)
      .ease('linear')
      .attr('transform', 'translate(-140, 0)');

    // this.myPath.attr('transform', 'translate(-70, 0)');

    // this.props.data.shift();
    // this.props.data.shift();
    // const tempData = prevProps.data.slice();
    // tempData.map((dataElement) => {
    //   // dataElement.push(this.props.data[i][this.props.data[i].length - 1]);
    //   dataElement.shift();
    // });
    // this.updatePaths(this.props.data);
  }

  updatePaths() {
    console.log(this.paths);
  //   selectAll('.line')
  //   // .attr('d', this.linePath)
  //   .attr('transform', null)
  // .transition()
  //   .duration(100)
  //   .ease('linear')
  //   .attr('transform', 'translate(-70, 0)');
  }

  // drawPaths(data) {
  //   selectAll('.line')
  //   .datum(data)
  //   .attr('d', (d, i) => {
  //     return this.linePath(d[i]);
  //   });
  //   // selectAll('.line')
  //   // .transition()
  //   // .duration(400)
  //   // .ease('linear')
  //   // .attr('transform', `translate(-70 ,0)`);
  // }


  render() {
    const {data,
      xType,
      yType,
      style,
      axes,
      xDomainRange,
      yDomainRange,
      interpolate
    } = this.props;
    const margin = calcMargin(axes, this.props.margin);
    const width = reduce(this.props.width, margin.left, margin.right);
    const height = reduce(this.props.height, margin.top, margin.bottom);

    this.x = setLineDomainAndRange('x', xDomainRange, data, xType, width, this.parseDate);
    const y = setLineDomainAndRange('y', yDomainRange, data, yType, height, this.parseDate);

    const yValue = getValueFunction('y', yType, this.parseDate);
    const xValue = getValueFunction('x', xType, this.parseDate);
    this.linePath = svg.line().interpolate(interpolate).x((d) => this.x(xValue(d))).y((d) => y(yValue(d)));

    const svgNode = createElement('svg');
    select(svgNode)
    .append('defs').append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height);
    select(svgNode).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    // this.pathGroups = [];
    // data.map(() => {
    //   var group = select(svgNode).append('g')
    //   .attr('clip-path', 'url(#clip)')
    //   .attr('transform', `translate(${margin.left},${margin.top})`);
    //   // var newPath = group.append('path')
    //   //   .datum(dataElelment)
    //   //   .attr('class', `line line${i}`)
    //   //   .attr('d', this.linePath)
    //   //   ;
    //   this.pathGroups.push(group);
    // });

    return (
      <div className={`line-chart${this.uid}`}>
        <Style scopeSelector={`.line-chart${this.uid}`} rules={merge({}, defaultStyle, style)}/>
        {svgNode.toReact()}
      </div>
    );
  }
}
