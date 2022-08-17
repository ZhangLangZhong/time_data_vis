import React, { useEffect, useState } from 'react'
import './SortedChart.css'
import * as Chart from 'chart.js';
import PubSub from 'pubsub-js'
import axios from 'axios'
// import { max } from 'd3';
// import { toBePartiallyChecked } from '@testing-library/jest-dom/dist/matchers';

var labelsDATA = []

export default function SortedChart() {

  const [riverData,setriverData] = useState([])
  const [timeData,settimeData] = useState('')

  var datasetsDATA = []
  useEffect(() => {
    console.log('         SortedChart111111111');
    PubSub.subscribe('socialHac',(msg,data)=>{
      setriverData(riverData=>data)
    })
    PubSub.subscribe('timeData',(msg,data)=>{
      settimeData(timeData=>data)
    })

    // axios.get("http://localhost:3000/api/Sorted").then(res=>{
    //   console.log(res.data);
    // })

    if (timeData) {
      funcDataSets()
      drawSorted() 
    }
  }, [riverData])

  function funcDataSets(){
    labelsDATA.push(timeData)
    // console.log(labels);
    // console.log(riverData);
    riverData.map((d)=>{
      // console.log(d);
      let labelNow = String(d.index)
      // console.log(label);
      let fillNow = false

      let dyTemp = 0
      d.List.map((dy)=>{
        dyTemp = dyTemp + dy.y
      })
      let dataNow = dyTemp/d.List.length

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
      let widthNow= max - min

      let value = {
        label:labelNow,
        fill:fillNow,
        data:[dataNow],
        width:[widthNow],
        backgroundColor:"rgba(75,192,192,0.4)",
      }
      // console.log(value);
      datasetsDATA.push(value)
    })
    console.log(datasetsDATA);

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
        datasets:datasetsDATA
      },


      // type: 'stripe',
      // // data: {
      // //   labels: ['January', "February", "March", "April", "May", "June", "July"],
      // //   datasets: [{
      // //     label: "My First dataset",
      // //     fill: false,   
      // //     data: [65, 20, 80, 81, 56, 85, 40],
      // //     width: [12, 4, 5, 13, 12, 2, 19],
      // //     // borderColor: "rgba(75,192,192,1)",
      // //     backgroundColor: "rgba(75,192,192,0.4)",
      // //     // pointRadius: 0
      // //   }, {
      // //     label: "My Second dataset",
      // //     fill: false,   
      // //     data: [80, 81, 56, 85, 40, 65, 20],
      // //     width: [4, 5, 13, 12, 2, 19, 12],
      // //     // borderColor: "rgba(192,75,192,1)",
      // //     backgroundColor: "rgba(192,75,192,0.4)",
      // //     // pointRadius: 0
      // //   }, {
      // //     label: "My Third dataset",
      // //     fill: false,
      // //     data: [81, 56, 85, 40, 65, 20, 80],
      // //     width: [5, 13, 12, 2, 19, 12, 4],
      // //     // borderColor: "rgba(192,102,75,1)",
      // //     backgroundColor: "rgba(192,192,75,0.4)",
      // //     // pointRadius: 0
      // //   }]
      // // },
      



      // data:{
      //   labels:labelsDATA,
      //   datasets:[datasetsDATA]
      // },
      options: {
        legend: {
          display:false,
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor:"black",
              fontSize: 20,
            }
          }],
          yAxes: [{
            ticks: {
              fontColor:"black",
              fontSize: 20,
              min: 300,
              max: 600
            }
          }]



        }
      }
    });
    console.log(aaa);
  }

  return (
  <canvas id='sorted'>
    {/* <canvas id='sortedChart'>

    </canvas> */}
  </canvas>
  )
}
