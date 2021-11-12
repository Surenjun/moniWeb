<template>
  <div>
    <div id="chart" :class="className" :style="{height:height,width:width}" />
    <div class="pieCenter">{{chartData.totalCheatNumber}} </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

const animationDuration = 2000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      let list = JSON.parse(JSON.stringify(this.chartData.list));

      let dataList = ['product'];
      let cheatZeroList = ['主动协助'];
      let cheatOneList = ['语音'];
      let cheatTwoList = ['手势'];
      let cheatThreeList = ['异常音'];

      let pieList = this.chartData.pieDataList;

      for (let i = list.length - 1; i >= 0; i--) {
        dataList.push(list[i].recordDate);
        cheatZeroList.push(list[i].cheatZeroNumber);
        cheatOneList.push(list[i].cheatOneNumber);
        cheatTwoList.push(list[i].cheatTwoNumber);
        cheatThreeList.push(list[i].cheatThreeNumber);
      }

      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.setOption({
        title: {
          text: ['{a|异常次数}', '{b|(单位：次)}'].join('  '),
          textStyle: {
            rich: {
              a: {
                color: 'black',
                fontSize: 20
              },
              b: {
                color: 'grey'
              }
            }
          }
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            // ['product', '2012', '2013', '2014', '2015'],
            // ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
            // ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
            // ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4],
            // ['Cheese Cocoa1', 24.1, 67.2, 79.5, 86.4]
            dataList, cheatZeroList, cheatOneList, cheatTwoList, cheatThreeList
          ]
        },
        // xAxis: [{
        //   type: 'category',
        //   axisTick: {
        //     show: false
        //   },
        //   axisLine: {
        //     symbolOffset: 0,
        //     lineStyle: {
        //       color: '#e6e6e6',
        //     }
        //   },
        //   axisLabel: {
        //     show: true,
        //     textStyle: {
        //       color: "black"
        //     }
        //   }
        // }],
        // yAxis: [{
        //   type: 'value',
        //   axisLine: {
        //     show: false
        //   },
        //   axisTick: {
        //     show: false
        //   }
        // }],
        grid: [
          { bottom: 40, right: '50%', left: 50 }
        ],
        // graphic: {
        //   type: "text",
        //   left: "75%",
        //   top: "49%",
        //   style: {
        //     // text:pieList[0].value + pieList[1].value + pieList[2].value + pieList[3].value,
        //     text: 12345678,
        //     textAlign: "left",
        //     fill: "#333",
        //     fontSize: 20
        //   }
        // },
        series: [
          // These series are in the first grid.
          // {
          //   type: 'bar',
          //   seriesLayoutBy: 'row',
          //   itemStyle: {
          //     color: '#79a4e0',
          //     barBorderRadius: [5, 5, 0, 0]
          //   },
          //   barWidth: 10
          // },
          // {
          //   type: 'bar',
          //   seriesLayoutBy: 'row',
          //   itemStyle: {
          //     color: '#69d1ba',
          //     barBorderRadius: [5, 5, 0, 0]
          //   },
          //   barWidth: 10
          // },
          // {
          //   type: 'bar',
          //   seriesLayoutBy: 'row',
          //   itemStyle: {
          //     color: '#f9c670',
          //     barBorderRadius: [5, 5, 0, 0]
          //   },
          //   barWidth: 10
          // },
          // {
          //   type: 'bar',
          //   seriesLayoutBy: 'row',
          //   itemStyle: {
          //     color: '#a89de0',
          //     barBorderRadius: [5, 5, 0, 0]
          //   },
          //   barWidth: 10
          // },
          // These series are in the second grid.
          {
            type: 'pie',
            // radius: 60,
            center: ['50%', '50%'],
            radius: ['30%', '60%'],
            color: ['#79a4e0', '#69d1ba', '#f9c670', '#a89de0'],
            data: pieList,
            label: {
              normal: {
                show: true,
                formatter: function(param) {
                  return pieList[param.dataIndex].value;
                },
                textStyle: {
                  fontSize: 18,
                  color: '#000'
                }
              }
            }
          }
        ]
      })
    }
  }
}

</script>
<style scoped>
  .pieCenter{
    position: absolute;
    width: 9%;
    right: 45%;
    top: 49%;
    font-size: 21px;
    text-align: center;
  }
</style>
