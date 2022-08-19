import React, { useEffect, useState } from 'react'
import './SortedChart.css'
import * as Chart from 'chart.js';
import PubSub from 'pubsub-js'
import axios from 'axios'
// import { max } from 'd3';
// import { toBePartiallyChecked } from '@testing-library/jest-dom/dist/matchers';

var labelsDATA = []
var datasetsDATA = []

export default function SortedChart() {

  const [riverData, setriverData] = useState([])
  const [timeData, settimeData] = useState('')
  const [initSort, setinitSort] = useState(true)

  useEffect(() => {
    console.log('         SortedChart111111111');
    PubSub.subscribe('socialHac', (msg, data) => {
      setriverData(riverData => data)
    })
    PubSub.subscribe('timeData', (msg, data) => {
      settimeData(timeData => data)
    })

    // axios.get("http://localhost:3000/api/Sorted").then(res=>{
    //   console.log(res.data);
    // })

    if (timeData) {
      // console.log(initSort);
      if (initSort) {
        funcDataSets()
        setinitSort(initSort => false)
      } else {
        funcDataSets2()
      }

      drawSorted()
    }
  }, [riverData])

  function funcDataSets() {
    // console.log(datasetsDATA);
    labelsDATA.push(timeData)

    riverData.map((d) => {

      // console.log(d);
      let labelNow = String(d.index)
      let fillNow = false

      let dyTemp = 0
      d.List.map((dy) => {
        dyTemp = dyTemp + dy.y
      })
      let dataNow = dyTemp / d.List.length

      let max = 0
      let min = 9999
      for (let i = 0; i < d.List.length; i++) {
        if (d.List[i].y > max) {
          max = d.List[i].y
        }
        if (d.List[i].y < min) {
          min = d.List[i].y
        }
      }
      let widthNow = max - min

      let r = Math.round(Math.random()*255);
      let g = Math.round(Math.random()*255);
      let b = Math.round(Math.random()*255);
      

      let value = {
        label: labelNow,
        fill: fillNow,
        data: [dataNow],
        width: [widthNow],
        backgroundColor: "rgba("+r+","+g+","+b+",0.4)"
      }
      datasetsDATA.push(value)
    })
    // console.log(datasetsDATA);

  }

  function funcDataSets2() {
    // console.log(datasetsDATA);
    labelsDATA.push(timeData)
    let hashDataSets = new HashTable()
    datasetsDATA.map(d => {
      hashDataSets.add(d.label, d)
    })
    // console.log(hashDataSets);
    // console.log(hashDataSets.getValues());

    riverData.map((d) => {
      if (hashDataSets.containsKey(d.index)) {
        let labelNow = String(d.index)
        let fillNow = false
        let dyTemp = 0
        d.List.map((dy) => {
          dyTemp = dyTemp + dy.y
        })
        let dataNow = dyTemp / d.List.length

        let max = 0
        let min = 9999
        for (let i = 0; i < d.List.length; i++) {
          if (d.List[i].y > max) {
            max = d.List[i].y
          }
          if (d.List[i].y < min) {
            min = d.List[i].y
          }
        }
        let widthNow = max - min

        let value = {
          label: labelNow,
          fill: fillNow,
          data: [...hashDataSets.getValue(d.index).data, dataNow],
          width: [...hashDataSets.getValue(d.index).width, widthNow],
          backgroundColor: hashDataSets.getValue(d.index).backgroundColor
        }
        // console.log(value);
        hashDataSets.remove(d.index)
        hashDataSets.add(d.index, value)
        datasetsDATA = hashDataSets.getValues()
        
        // datasetsDATA = hashDataSets.getValues
        // console.log(datasetsDATA);
      } else {
        let labelNow = String(d.index)
        let fillNow = false

        let dyTemp = 0
        d.List.map((dy) => {
          dyTemp = dyTemp + dy.y
        })
        let dataNow = dyTemp / d.List.length

        let max = 0
        let min = 9999
        for (let i = 0; i < d.List.length; i++) {
          if (d.List[i].y > max) {
            max = d.List[i].y
          }
          if (d.List[i].y < min) {
            min = d.List[i].y
          }
        }
        let widthNow = max - min
        let r = Math.round(Math.random()*255);
        let g = Math.round(Math.random()*255);
        let b = Math.round(Math.random()*255);
        let value = {
          label: labelNow,
          fill: fillNow,
          data: [dataNow],
          width: [widthNow],
          backgroundColor: "rgba("+r+","+g+","+b+",0.4)",
        }
        datasetsDATA.push(value)
      }
      // hashDataSets.getValue()
    })
  }

  function drawSorted() {
    Chart.defaults.stripe = Chart.helpers.clone(Chart.defaults.line);
    Chart.controllers.stripe = Chart.controllers.line.extend({
      draw: function (ease) {
        var result = Chart.controllers.line.prototype.draw.apply(this, arguments);
        // don't render the stripes till we've finished animating
        /* if (!this.rendered && ease !== 1)
          return; */
        this.rendered = true;
        var helpers = Chart.helpers;
        var meta = this.getMeta();
        var yScale = this.getScaleForId(meta.yAxisID);
        var yScaleZeroPixel = yScale.getPixelForValue(0);
        var widths = this.getDataset().width;
        var ctx = this.chart.chart.ctx;
        ctx.save();
        ctx.fillStyle = this.getDataset().backgroundColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        // initialize the data and bezier control points for the top of the stripe
        helpers.each(meta.data, function (point, index) {
          point._view.y += (yScale.getPixelForValue(widths[index]) - yScaleZeroPixel);
        });
        Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);
        // draw the top of the stripe
        helpers.each(meta.data, function (point, index) {
          if (index === 0)
            ctx.moveTo(point._view.x, point._view.y);
          else {
            var previous = helpers.previousItem(meta.data, index);
            var next = helpers.nextItem(meta.data, index);

            Chart.elements.Line.prototype.lineToNextPoint.apply({
              _chart: {
                ctx: ctx
              }
            }, [previous, point, next, null, null])
          }
        });
        // revert the data for the top of the stripe
        // initialize the data and bezier control points for the bottom of the stripe
        helpers.each(meta.data, function (point, index) {
          point._view.y -= 2 * (yScale.getPixelForValue(widths[index]) - yScaleZeroPixel);
        });
        // we are drawing the points in the reverse direction
        meta.data.reverse();
        Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);
        // draw the bottom of the stripe
        helpers.each(meta.data, function (point, index) {
          if (index === 0)
            ctx.lineTo(point._view.x, point._view.y);
          else {
            var previous = helpers.previousItem(meta.data, index);
            var next = helpers.nextItem(meta.data, index);
            Chart.elements.Line.prototype.lineToNextPoint.apply({
              _chart: {
                ctx: ctx
              }
            }, [previous, point, next, null, null])
          }
        });
        // revert the data for the bottom of the stripe
        meta.data.reverse();
        helpers.each(meta.data, function (point, index) {
          point._view.y += (yScale.getPixelForValue(widths[index]) - yScaleZeroPixel);
        });
        Chart.controllers.line.prototype.updateBezierControlPoints.apply(this);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        return result;
      }
    });
    var ctx = document.getElementById("sorted");
    let aaa = new Chart(ctx, {
      type: 'stripe',
      data: {
        labels: labelsDATA,
        datasets: datasetsDATA
      },
      options: {
        // legend: {
        //   display: false,
        // },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: "black",
              fontSize: 20,
            }
          }],

          

          yAxes: [{
            ticks: {
              fontColor: "black",
              fontSize: 20,
              min: 200,
              max: 800
            }
          }]
        }
      }
    });

  }

  function HashTable() {
    var size = 0;
    var entry = new Object();
    this.add = function (key, value) {
      if (!this.containsKey(key)) {
        size++;
      }
      entry[key] = value;
    }
    this.getValue = function (key) {
      return this.containsKey(key) ? entry[key] : null;
    }
    this.remove = function (key) {
      if (this.containsKey(key) && (delete entry[key])) {
        size--;
      }
    }
    this.containsKey = function (key) {
      return (key in entry);
    }
    this.containsValue = function (value) {
      for (var prop in entry) {
        if (entry[prop] == value) {
          return true;
        }
      }
      return false;
    }
    this.getValues = function () {
      var values = new Array();
      for (var prop in entry) {
        values.push(entry[prop]);
      }
      return values;
    }
    this.getKeys = function () {
      var keys = new Array();
      for (var prop in entry) {
        keys.push(prop);
      }
      return keys;
    }
    this.getSize = function () {
      return size;
    }
    this.clear = function () {
      size = 0;
      entry = new Object();
    }
  }

  return (
    <canvas id='sorted'>
      {/* <canvas id='sortedChart'>

    </canvas> */}
    </canvas>
  )
}
