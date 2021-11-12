<template>
  <div class="dashboard-editor-container"
       v-loading="loading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <!--<github-corner class="github-corner" />-->

    <!-- <panel-group
      v-if="nova"
      v-bind:num1=totalPeopleNumber
       v-bind:num2=examNumber
       v-bind:num3=totalCheatNumber
       v-bind:num4=examTotalTime /> -->

    <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
      <!--<el-col :xs="24" :sm="24" :lg="24">-->
        <!--<div class="chart-wrapper">-->
          <!--<pie-chart />-->
        <!--</div>-->
      <!--</el-col>-->
      <!--&lt;!&ndash;<line-chart :chart-data="lineChartData" />&ndash;&gt;-->
    <!--</el-row>-->
    <el-row :gutter="32">
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="topContainer">
          <div class="chart-wrapper">
            <bar-chart v-if="nova" v-bind:chartData=statisticsObj />
            <div class="showMore" @click="gotoStatic">更多 ></div>
          </div>
          <!-- <div class="channelVideo"></div> -->
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="chart-wrapper2">
          <two-chart v-if="nova" v-bind:chartData=statisticsObj />
          <div class="showMore" @click="gotoStatic">更多 ></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
    
      <el-col :xs="12" :sm="12" :lg="12">
        <div class="chart-wrapper3">
          <BarChartCondition v-if="statisticsConditionCarShow" v-bind:chartData=statisticsConditionCar height="450px" ref="statisticsConditionCarRef"/>
          <div class="sort-div">
            <span @click="sortAscCar">↑</span>
            <span @click="sortDescCar">↓</span>
          </div>
          <div class="showMore" @click="gotoStaticCondition">更多 ></div>
        </div>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="12">
        <div class="chart-wrapper3">
          <BarChartCondition v-if="statisticsConditionPeopleShow" v-bind:chartData=statisticsConditionPeople height="450px" ref="statisticsConditionPeopleRef"/>
          <div class="sort-div">
            <span @click="sortAscPeople">↑</span>
            <span @click="sortDescPeople">↓</span>
          </div>
          <div class="showMore" @click="gotoStaticCondition">更多</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import { getStatistics, getStatisticsPage, statisticsConditionGetNoPageStatistics } from '@/api/statistics'
// import GithubCorner from '@/components/GithubCorner'
// import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TwoChart from './components/TwoChart'
import BarChartCondition from './components/BarChartCondition'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import Vue from 'vue'

import { parseTime } from '@/utils/index.js'


export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    // PanelGroup,
    // LineChart,
    // RaddarChart,
    // PieChart,
    BarChart,
    TwoChart,
    BarChartCondition,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis
      loading: false,
      nova: false,
      statisticsConditionCarShow: false,
      statisticsConditionPeopleShow: false,
      listQuery: {
        queryStartTime: parseTime(new Date(new Date().getFullYear() - 1,new Date().getMonth(),new Date().getDate()),'{y}-{m}-{d}') + ' 00:00:00',
        queryEndTime: parseTime(new Date(),'{y}-{m}-{d}') + ' 23:59:59',
        pageNum: 1,
        pageSize: 9
      },
      statisticsObj: null,
      statisticsConditionCar: null,
      statisticsConditionPeople: null,
    }
  },
  created() {
    console.log('创建页面')
    this.loading = true

    getStatisticsPage(this.listQuery).then(response => {
      let statisticsObj = response.data;

      getStatistics({}).then(response => {

        var pieDataList = [
          { value: response.data.cheatZeroNumber, name: '主动协助'},
          { value: response.data.cheatOneNumber, name: '语音'},
          { value: response.data.cheatTwoNumber, name: '手势'},
          { value: response.data.cheatThreeNumber, name: '异常音'}
        ];

        statisticsObj.pieDataList = pieDataList;
        statisticsObj.totalCheatNumber = response.data.totalCheatNumber;

        this.statisticsObj = statisticsObj;

        this.nova = true
        this.loading = false
      })
    })
    this.getStatisticsCar('DESC')
    this.getStatisticsPeople('DESC')

    // console.log('Vue.$router == ' + Vue.$router)
  },

  destroyed(){
    console.log('销毁页面')//
  },
  methods: {
    gotoStatic () {
        this.$router.push({path:'/statistics/index'})
    },

    gotoStaticCondition () {
        this.$router.push({path:'/statistics/condition'})
    },

    //升
    sortAscCar() {
      this.getStatisticsCar('ASC')
    },

    //降
    sortDescCar() {
      this.getStatisticsCar('DESC')
    },

    //升
    sortAscPeople() {
      this.getStatisticsPeople('ASC')
    },

    //降
    sortDescPeople() {
      this.getStatisticsPeople('DESC')
    },

    getStatisticsCar(sort) {
      statisticsConditionGetNoPageStatistics({
        queryStartTime: this.listQuery.queryStartTime,
        queryEndTime: this.listQuery.queryEndTime,
        orderType: sort,
        orderBy: 'totalCheatNumber',
        conditionType: '1'

      }).then(response => {
        this.statisticsConditionCar = response.data;
        if (this.statisticsConditionCarShow) {
          setTimeout(() => {
            this.$refs.statisticsConditionCarRef.initChart()
          },50)
        }
        this.statisticsConditionCarShow = true;
      })
    },

    getStatisticsPeople(sort) {
      statisticsConditionGetNoPageStatistics({
        queryStartTime: this.listQuery.queryStartTime,
        queryEndTime: this.listQuery.queryEndTime,
        orderType: sort,
        orderBy: 'totalCheatNumber',
        conditionType: '2'

      }).then(response => {
        this.statisticsConditionPeople = response.data
        if (this.statisticsConditionPeopleShow) {
          setTimeout(() => {
            this.$refs.statisticsConditionPeopleRef.initChart()
          },50)
        }
        this.statisticsConditionPeopleShow = true;
      })
    },
  }
}
</script>

<style lang="scss" scoped>

$bg:"../../../assets/image/channelVideo.jpg";

.dashboard-editor-container {
  min-height: 100vh;
  padding: 10px 0px 16px 16px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
  .topContainer {
    background: white;
    display: flex;
    align-items: center;
  }

  .chart-wrapper {
    padding: 16px 16px 0;
    margin-bottom: 10px;
    position: relative;
    width: 100%;
  }

  .chart-wrapper2{
    padding: 16px 16px 0;
    margin: 0px 0px 10px;
    position: relative;
    width: 100%;
    background: white;
  }
  .chart-wrapper3{
    padding: 16px 16px 0;
    margin: 10px 0px;
    position: relative;
    width: 100%;
    background: white;
  }
  .channelVideo{
    background: url($bg);
    width: 100px;
    height: 100px;
    width: 446px;
    height: 300px;
  }
  .showMore{
    position: absolute;
    right: 40px;
    top: 20px;
    color: #69d1ba;
    cursor: pointer;
  }

  .sort-div{
    position: absolute;
    right: 100px;
    top: 20px;
    color: #69d1ba;
  }

  .sort-div span{
    padding: 10px;
    cursor: pointer;
  }
}
</style>
