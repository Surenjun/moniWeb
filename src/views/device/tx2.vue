<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.carCode" placeholder="车牌号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-input v-model="listQuery.carNo" placeholder="考车号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item blue_bg" type="primary" icon="el-icon-edit" @click="editCar">
        {{ $t('table.edit') }}
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
      <el-table-column label="ID" prop="id" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编码" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定车辆" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.carCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考车号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNo }}</span>
        </template>
      </el-table-column>
       <el-table-column label="使用状态" align="center" min-width="150">
        <template slot-scope="scope">
          <el-switch class="swichClass"
            @change="changeStatus(scope.row)"
            v-model="scope.row.useStatus"
            active-text="启用"
            inactive-text="停用"
            active-value="0"
            inactive-value="1">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.version }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="总运行内存" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memoryTotal }}</span>
        </template>
      </el-table-column>
       <el-table-column label="运行内存使用量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memoryAvail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内置内存总量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.interDiskTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内置内存使用量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.interDiskAvail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外置内存总量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.outerDiskTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外置内存使用量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.outerDiskAvail }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="最后一次在线时间" align="center" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.lastOnTime }}
        </template>
      </el-table-column>
      <el-table-column label="最后一次离线时间" align="center" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.lastOffTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { getTx2List,deleteTx2,updateTx2 } from '@/api/device'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PopTx  from '@/components/Device/PopTx2' // Secondary package based on el-pagination

export default {
  name: 'device',
  // props:['idcard'],
  components: { Pagination,PopTx },
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
      terminalInfo: null,
      showPop: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        carCode: '',
        carNo: ''
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {

    editCar() {
       if(!this.terminalInfo){
        this.$message('请选择一台识别终端');
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
          title: '修改设备',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('pop-tx', {style: 'color: teal',props: {terminalInfo: this.terminalInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('updateTx2Success',()=>{
          this.terminalInfo = null;
          this.$msgbox.close();
          this.getList();
        })
    },

    carSelected(item) {
      if (item.checked) {
        if (!this.terminalInfo) {
          this.terminalInfo = item;
        } else if (item != this.terminalInfo) {
          this.terminalInfo.checked = false;
          this.terminalInfo = item;
        }
      } else if (item == this.terminalInfo) {
        this.terminalInfo = null;
      }
    },

    deleteCar() {
      if(!this.terminalInfo){
        this.$message('请选择一台识别终端');
        return;
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {};
        param.id = this.terminalInfo.id;
        deleteTx2(param).then(response => {
          if(response.code != 0){
            this.$message(response.message);
            return;
          }

          this.getList();
        })
      }).catch(() => {

      });
    },
    changeStatus(item) {
      var param = {
        carCode: item.carCode,
        deviceName: item.deviceName,
        id: item.id,
        carId: item.carId,
        useStatus: item.useStatus
      };

      if(this.carCode == ''){
        param.bindStatus = 0;
      }

      updateTx2(param).then(response => {
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
          message: res.message
        });
      })
    },
    getList() {
      let param = {
        ...this.listQuery
      };

      getTx2List(param).then(response => {
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
      this.$EventBus.$off('updateTx2Success');
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
