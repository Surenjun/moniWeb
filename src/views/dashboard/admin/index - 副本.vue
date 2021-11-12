<template>
  <div class="dashboard-editor-container"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <!--<github-corner class="github-corner" />-->

    <panel-group
      v-if="nova"
      v-bind:num1=totalPeopleNumber
       v-bind:num2=examNumber
       v-bind:num3=totalCheatNumber
       v-bind:num4=examTotalTime />

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--<el-col :xs="24" :sm="24" :lg="24">-->
        <!--<div class="chart-wrapper">-->
          <!--<pie-chart />-->
        <!--</div>-->
      <!--</el-col>-->
      <!--&lt;!&ndash;<line-chart :chart-data="lineChartData" />&ndash;&gt;-->
    <!--</el-row>-->

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <pie-chart v-if="nova" v-bind:chartData={cheatZeroNumber,cheatOneNumber,cheatTwoNumber,cheatThreeNumber} />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getStatistics } from '@/api/statistics'
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    // LineChart,
    // RaddarChart,
    PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis
      loading: false,
      nova: false,
      listQuery: {
        queryStartTime: null,
        queryEndTime:null,
      },
      examNumber:0,
      examTotalTime:0,
      totalCheatTime:0,
      totalCheatNumber:0,

      cheatZeroNumber:0,  //主动协助
      cheatOneNumber:0,   //讲话
      cheatTwoNumber:0,   //手势
      cheatThreeNumber:0, //异常音
    }
  },
  created() {
    console.log('创建页面')
    this.loading = true

    getStatistics(this.listQuery).then(response => {
      console.log(response)
      this.examNumber = response.data.examNumber
      this.examTotalTime = Math.round(response.data.examTotalTime / 60)
      this.totalCheatTime = response.data.totalCheatTime
      this.totalCheatNumber = Math.floor(response.data.totalCheatTime / 12) //response.data.totalCheatNumber
      this.totalPeopleNumber = response.data.totalPeopleNumber
      this.cheatZeroNumber = response.data.cheatZeroNumber
      this.cheatOneNumber = response.data.cheatOneNumber
      this.cheatTwoNumber = response.data.cheatTwoNumber
      this.cheatThreeNumber = response.data.cheatThreeNumber
      this.nova = true
      this.loading = false
    })
  },
  destroyed(){
    console.log('销毁页面')//
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  min-height: 100vh;
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
