<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.carCode" placeholder="车牌号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-input v-model="listQuery.carNo" placeholder="考车编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-select v-model="listQuery.qualityStatus" placeholder="选择车辆状态">
        <el-option
          v-for="item in qualityStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item blue_bg" type="primary" icon="el-icon-edit" @click="editCar">
        {{ $t('table.edit') }}
      </el-button>
      <el-button v-waves class="filter-item grey_bg" type="primary" icon="el-icon-plus" @click="addCar">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item red_bg" type="primary" icon="el-icon-delete" @click="deleteCar">
        {{ $t('table.delete') }}
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-checkbox @change="carSelected(scope.row)" v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.carCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考车编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carTypeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆归属" align="center">
        <template slot-scope="scope">
          {{ scope.row.testType == 1?"测试车":"正式车" }}
        </template>
      </el-table-column>
      <el-table-column label="车辆状态" align="center">
        <template slot-scope="scope">
          <span>{{ qualityStatusCalc(scope.row.qualityStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态(安卓/Tx2)" align="center" width="400px">
        <template slot-scope="scope">
          <span v-html="getDeviceStatus(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="异常状态" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.exceptionStatusChn" placement="top-start">
              <span>{{ scope.row.exceptionStatusChn }}</span>
           </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="启停" align="center">
        <template slot-scope="scope">
          <el-button size="mini" v-if="scope.row.startFlag == 0" @click="changeStatus(scope.row)">
            停用
          </el-button>
          <el-button size="mini" v-if="scope.row.startFlag == 1" @click="changeStatus(scope.row)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { getCarInfoList,deleteCarInfo,updateCarStatus } from '@/api/device'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Pop from '@/components/Device/Pop' // Secondary package based on el-pagination

export default {
  name: 'device',
  // props:['idcard'],
  components: { Pagination,Pop },
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
        carCode: '',
        carNo: '',
        qualityStatus: '',
      },
      qualityStatusOptions: [
        {value: '1', label: '正常'},
        {value: '2', label: '停用'},
        {value: '3', label: '异常'},
        {value: '4', label: '报废'},
      ]
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

    getDeviceStatus(item){
      var str = '';
      if(item.androidInfo){
        str = '黑盒子(' + (item.androidInfo.useStatus == 0?'启用':'<span style="color: red">停用</span>') + ')';
      }

      if(item.tx2Info){
        if(str == ''){
          str = 'Tx2(' + (item.tx2Info.useStatus == 0?'启用':'<span style="color: red">停用</span>') + ')';
        }else {
          str = str + ' / Tx2(' + (item.tx2Info.useStatus == 0?'启用':'<span style="color: red">停用</span>') + ')';
        }
      }
      return str;
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

    editCar() {
      if(!this.carInfo){
        this.$message('请选择一辆车');
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
          title: '修改车辆',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('pop', {style: 'color: teal',props: {carInfo: this.carInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('updateCarSuccess',()=>{
          this.carInfo = null;
          this.$msgbox.close();
          this.getList();
        })
    },

    addCar() {
      this.carInfo = null;
      const h = this.$createElement;
      this.$msgbox({
          title: '添加车辆',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('pop', {style: 'color: teal',props: {carInfo: this.carInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('addCarSuccess',()=>{
          this.$msgbox.close();
          this.getList();
        })
    },

    changeStatus(item) {
      console.log(item)
      var param = {
        bindStatus: item.startFlag == 1? 0:1,
        carIds: [item.carId]
      };

      updateCarStatus(param).then(response => {
        this.getList();
        if (response.code !== 0) {
          return this.$message(response.msg||response.message);
        }
        this.$message({
          type: 'success',
          message: '更新设备信息成功'
        });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '操作失败'
        });
      })
    },

    deleteCar() {
      if(!this.carInfo){
        this.$message('请选择一辆车');
        return;
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {};
        param.id = this.carInfo.carId;
        deleteCarInfo(param).then(response => {
          if(response.code != 0){
            this.$message(response.message);
            return;
          }

          this.getList();
        })
      }).catch(() => {

      });
    },

    getList() {
      let param = {...this.listQuery};

      getCarInfoList(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },

    handleFilter() {
      this.getList();
    },

    destory() {
      this.$EventBus.$off('updateCarSuccess');
      this.$EventBus.$off('addCarSuccess');
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
