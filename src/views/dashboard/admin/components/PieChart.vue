<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

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
      default: '400px'
    },
    chartData:{
      type: Object,
      required: true
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    console.log('渲染pie')

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
      // console.log(this.chartData)
      this.chart = echarts.init(this.$el, 'macarons')
      let chartdata = [];
      if(this.chartData.cheatZeroNumber) chartdata.push({ value: this.chartData.cheatZeroNumber, name: '主动协助' });
      if(this.chartData.cheatOneNumber) chartdata.push({ value: this.chartData.cheatOneNumber, name: '讲话' });
      if(this.chartData.cheatTwoNumber) chartdata.push({ value: this.chartData.cheatTwoNumber, name: '手势' });
      if(this.chartData.cheatThreeNumber) chartdata.push({ value: this.chartData.cheatThreeNumber, name: '异常音' });

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold']
        },
        calculable: true,
        series: [
          {
            name: '作弊类型',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: chartdata,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
