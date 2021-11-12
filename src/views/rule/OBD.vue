<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryObdName" placeholder="OBD信号名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-input v-model="listQuery.obdCode" placeholder="OBD信号编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item blue_bg" type="primary" icon="el-icon-edit" @click="editObd">
        {{ $t('table.edit') }}
      </el-button>
      <el-button v-waves class="filter-item grey_bg" type="primary" icon="el-icon-plus" @click="addObd">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item red_bg" type="primary" icon="el-icon-delete" @click="deleteObd">
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
      <el-table-column label="obd信号名称" align="center" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.obdName + '(' + scope.row.obdEnName + ')' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="obd信号编码" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.obdCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" min-width="150">
        <template slot-scope="scope">
           <el-switch class="swichClass"
            @change="changeStatus(scope.row,'status')"
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="停用">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否有值" align="center" min-width="150">
        <template slot-scope="scope">
          <el-switch class="swichClass"
                     @change="changeStatus(scope.row,'valueFlag')"
                     v-model="scope.row.valueFlag"
                     active-text="启用"
                     inactive-text="停用">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { getOBDList, deleteObd,updateObd } from '@/api/rule'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ObdRule from '@/components/Behaviour/ObdRule'
export default {
  name: 'device',
  // props:['idcard'],
  components: { Pagination,ObdRule },
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
      obdInfo: null,
      showPop: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        queryObdName: '',
        obdCode: '',
      }
    }
  },

  created() {
    this.getList()
  },

  methods: {
    carSelected(item) {
      if (item.checked) {
        if (!this.obdInfo) {
          this.obdInfo = item;
        } else if (item != this.obdInfo) {
          this.obdInfo.checked = false;
          this.obdInfo = item;
        }
      } else if (item == this.obdInfo) {
        this.obdInfo = null;
      }
    },

    editObd() {

      if(!this.obdInfo){
        this.$message('请选择一个OBD信号');
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
          title: '修改车辆',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('obd-rule', {style: 'color: teal',props: {obdInfo: this.obdInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('updateObd',()=>{
          this.obdInfo = null;
          this.$msgbox.close();
          this.getList();
        })
    },

    addObd() {
      this.obdInfo = null;
      const h = this.$createElement;
      this.$msgbox({
          title: '添加车辆',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('obd-rule', {style: 'color: teal',props: {obdInfo: this.obdInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('addObd',()=>{
          this.$msgbox.close();
          this.getList();
        })
    },

    deleteObd() {
      if(!this.obdInfo){
        this.$message('请选择一个OBD信号');
        return;
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {};
        param.id = this.obdInfo.id;
        deleteObd(param).then(response => {
          if (response.code != 0) {
            this.$message(response.message);
            return;
          }
          this.getList();
        })
      }).catch(() => {

      });
    },

    changeStatus(item,property) {
      console.log(item);
      var param = {
        [property]: item[property]? '0':'1',
        id: item.id
      };

      updateObd(param).then(response => {
        this.getList();
        if (response.code !== 0) {
          return this.$message(response.msg||response.message);
        }
        this.$message({
          type: 'success',
          message: '更新成功'
        });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '操作失败'
        });
      })
    },

    getList() {
      let param = {
        ...this.listQuery
      };

      getOBDList(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data.list;
        for(let i=0;i<this.list.length;i++){
          this.list[i].status = this.list[i].status === '1' ? false: true;
          this.list[i].valueFlag = this.list[i].valueFlag === '1' ? false: true;
        }
        this.total = response.data.total;
        this.listLoading = false;
      })
    },

    handleFilter() {
      this.getList();
    },

    destory() {
      this.$EventBus.$off('updateObd');
      this.$EventBus.$off('addObd');
    },
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
