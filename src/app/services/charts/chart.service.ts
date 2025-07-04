import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

import Histogram from 'highcharts/modules/histogram-bellcurve';
Histogram(Highcharts);

import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);
// import * as newdata from './data';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  options:any;
  constructor() { }


  createchart(charttype:any,threeD:any, title:any, subtitle:any, antype:any, data:any, elementid:any){
    this.options = {
      colors: ['#2D95EC','#F64D2A','#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
      '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
      chart: {
          type: charttype,
          options3d: {enabled: threeD,alpha: 45},
          events:{ },
          height:280
      },
      title: {text: title},
      subtitle: {text: subtitle },
      xAxis:{categories: data.map((x:any)=>x[0])},
      plotOptions: {
        pie: {
          innerSize: 150,
          depth: 45,
          allowPointSelect: true,
          cursor: 'pointer',
          states: {
            inactive: {opacity: 1},
          },
          showInLegend: true,
          legend: {
            enabled: true,
        
          },
          point:{
            events:{
              // mouseOver: (obj:any) => {
              //   obj.target.graphic.attr({
              //       'stroke-width': 1.2,
              //       stroke: obj.target.color,
              //       zIndex: 3,
              //       margin : 10,
              //       opacity: 1
              //       // filter: 'drop-shadow(0 0 10px black)'
              //     }).css({borderRadius: 20}).add();
              // },
              // mouseOut: (obj:any) => {
              //   obj.target.graphic.attr({
              //       'stroke-width': 1,
              //       stroke: obj.target.color,
              //       margin: 0,
              //       filter: 'transparent',
              //   }).css({borderRadius: 0}).add();
              // },
            }
          }
        }
      },
      series: [{
          name: antype,
          data: data,
          state:{
            hover:{
              halo: null,
              brightness: 0,
            }
          },
          point:{events:{ }},
          color: {
            linearGradient: { x1: 1, x2: 1, y1: 1, y2: 0 },
            stops: [
                [0, '#D35138'], // start
                // [0.5, '#D35138'], // middle
                [1, '#175186'] // end
            ]
        }
      }]
    };
    return Highcharts.chart(elementid, this.options);
  }
}

 
/** use function to create chart with <div id="container"></div> 
  mychart(){
    var charttype = 'pie';
    var threeD = true;
    var title = 'Employee Efficiency - Bay 1';
    var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    var antype = 'Minutes';
    var elementid = 'container';
    var data =  [
      ['91 Minutes', 91],
      ['66 Minutes', 66]
    ];
    this.dataservice.createchart(charttype, threeD, title, subtitle, antype, data, elementid)
  }


  types: line, spline, area, boxplot, venn, vector, bubble, bullet, areaspline, column, bar, pie, scatter, gauge, arearange, areasplinerange and columnrange
 */