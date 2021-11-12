<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.carCode" placeholder="车牌号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="车牌号" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.carCode }}({{scope.row.carNo}})</span>
        </template>
      </el-table-column>
      <el-table-column label="安卓设备" align="center">
        <el-table-column label="运行内存(已使用/总计)M" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ calcMemory(scope.row.androidInfo.memoryAvail) + "/" + calcMemory(scope.row.androidInfo.memoryTotal) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内置内存(已使用/总计)M" align="center" width="200">
          <template slot-scope="scope">
             <span>{{ calcMemory(scope.row.androidInfo.interDiskAvail) + "/" + calcMemory(scope.row.androidInfo.interDiskTotal) }}</span>
          </template>
        </el-table-column>
       <!--  <el-table-column label="外置内存(已使用/总计)M" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ calcMemory(scope.row.androidInfo.outerDiskAvail) + "/" + calcMemory(scope.row.androidInfo.outerDiskTotal) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="CPU温度" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.androidInfo.cupTemperature }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU使用率" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.androidInfo.cupUsage }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="识别终端" align="center">
        <el-table-column label="运行内存(已使用/总计)KB" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ calcMemoryToKB(scope.row.tx2Info.memoryAvail) + "/" + calcMemoryToKB(scope.row.tx2Info.memoryTotal) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="存储(已使用/总计)KB" align="center" min-width="180">
          <template slot-scope="scope">
             <span>{{ calcMemoryToKB(scope.row.tx2Info.diskAvail) + "/" + calcMemoryToKB(scope.row.tx2Info.diskTotal) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU温度" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tx2Info.cupTemperature }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CPU使用率" align="center" min-width="100">
          <template slot-scope="scope">
            <span>{{ ((+scope.row.tx2Info.cpuUsageCpu0 + +scope.row.tx2Info.cpuUsageCpu1 + +scope.row.tx2Info.cpuUsageCpu2 + +scope.row.tx2Info.cpuUsageCpu3 + +scope.row.tx2Info.cpuUsageCpu4 + +scope.row.tx2Info.cpuUsageCpu5)/6).toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { getAllDeviceList } from '@/api/device'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'device',
  // props:['idcard'],
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      versionValue: '',
      tableKey: new Date().getTime(),
      list: null,
      total: 0,
      listLoading: true,
      timeBetween: null,
      carInfo: null,
      showPop: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        carCode: ''
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    qualityStatusCalc: function(status) {
      if (status == 1) {
        return "正常";
      } else if (status == 2) {
        return "停用";
      } else if (status == 3) {
        return "异常";
      } else if (status == 4) {
        return "报废";
      }

      return "";
    },
    calcMemory (value){
      if(value){
        return Math.round(value / 1024 / 1024);
      }else {
        return 0;
      }
    },
    calcMemoryToKB (value){
      if(value){
        return Math.round(value / 1024);
      }else {
        return 0;
      }
    },
    carSelected(item) {
      if (item.checked) {
        if (!this.carInfo) {
          this.carInfo = item;
        } else if (item != this.carInfo) {
          this.carInfo.checked = false;
          this.carInfo = item;
        }
      } else if (item == this.carInfo) {
        this.carInfo = null;
      }
    },

    getList(param) {
      if(!param){
        param = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
        }
      }

      getAllDeviceList(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false;
        for(let i =0; i< this.list.length;i++){
          if(!this.list[i].androidInfo){
            this.list[i].androidInfo = {}
          }

          if(!this.list[i].tx2Info){
            this.list[i].tx2Info = {}
          }
        }
      })
    },

    handleFilter() {
      this.getList({
          carCode: this.listQuery.carCode
        });
    }
  }
}

</script>
<style scoped>
.filter-container {
  display: flex;
}

.filter-container .filter-item {
  display: block;
  margin-right: 10px;
}

.el-select {
  display: block;
  margin-right: 10px;
}

.bgColor {
  background: #1890ff;
  padding: 5px;
  color: white;
}

</style>
<style>
.handleVersionClass {
  width: 520px;
}

</style>
