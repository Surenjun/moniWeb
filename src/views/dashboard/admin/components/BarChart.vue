<template>
  <div :class="className" :style="{height:height,width:width}" />
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

      let dataList = [];
      let cheatList = [];
      let nomalList = [];

      for(let i=list.length - 1;i >= 0;i--){
        dataList.push(list[i].recordDate);
        cheatList.push(list[i].cheatExamNumber);
        nomalList.push(list[i].examNumber - list[i].cheatExamNumber);
      }
      this.chart = echarts.init(this.$el)
      this.chart.setOption({
        title: {
            text: ['{a|异常行为}','{b|(单位：次)}'].join('  '),
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
        legend: {
            show: true,
            data: ['正常', '疑似']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 60,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: dataList,
          axisTick: {
            show: false
          },
          axisLine: {
              symbolOffset: 0,
              lineStyle: {
                  color: '#e6e6e6',
              }
          },
          axisLabel: {
              show: true,
              textStyle: {
                  color: "black"
              }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false  
          }
        }],
        series: [{
          name: '正常',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          // data: [79, 52, 200, 334, 390, 330, 220],
          data: nomalList,
          itemStyle: {
            color: '#69d1ba'
          },
          barWidth: 30,
          animationDuration
        }, {
          name: '疑似',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          // data: [80, 52, 200, 334, 390, 330, 220],
          data: cheatList,
          itemStyle: {
              color: '#f9c670'
          },
          barWidth: 30,
          animationDuration
        }]
      })
    }
  }
}
</script>
