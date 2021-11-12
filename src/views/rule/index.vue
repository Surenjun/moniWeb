<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.carCode" placeholder="车牌号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="editCar">
        {{ $t('table.edit') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="addCar">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteCar">
        {{ $t('table.delete') }}
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-checkbox @change="carSelected(scope.row)" v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" align="center">
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
          <span>{{ scope.row.carType == 1?"小车":"大车" }}</span>
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
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { getCarInfoList,deleteCarInfo } from '@/api/device'
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

    deleteCar() {
      var param = {};
      param.id = this.carInfo.id;
      deleteCarInfo(param).then(response => {
        this.getList();
      })
    },

    getList() {

      let param = {
        pageSize: this.listQuery.pageSize,
        pageNum: this.listQuery.pageNum,
        carCode: this.listQuery.carCode
      }

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
