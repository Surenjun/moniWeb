<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.queryBehaviourName" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-input v-model="listQuery.behaviourCode" placeholder="编码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" icon="el-icon-search" type="primary" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item blue_bg" icon="el-icon-edit" type="primary" @click="editBehaviour">
        {{ $t('table.edit') }}
      </el-button>
      <el-button v-waves class="filter-item grey_bg" icon="el-icon-plus" type="primary" @click="addBehaviour">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item red_bg" icon="el-icon-delete" type="primary" @click="deleteBehaviour">
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
      <el-table-column label="行为规范名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.behaviourName + '(' + scope.row.behaviourEnName + ')' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="行为规范编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.behaviourCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center">
        <template slot-scope="scope">
          <el-switch class="swichClass"
            @change="changeStatus(scope.row)"
            v-model="scope.row.status"
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
import { getBehaviourList,changeBehaviourStatus,deleteBehaviour } from '@/api/rule'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import BehaviourRule from '@/components/Behaviour/BehaviourRule' // Secondary package based on el-pagination

export default {
  name: 'device',
  // props:['idcard'],
  components: { Pagination,BehaviourRule },
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
      behaviourInfo: null,
      showPop: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        queryBehaviourName: '',
        behaviourCode: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    carSelected(item) {
      if (item.checked) {
        if (!this.behaviourInfo) {
          this.behaviourInfo = item;
        } else if (item != this.behaviourInfo) {
          this.behaviourInfo.checked = false;
          this.behaviourInfo = item;
        }
      } else if (item == this.behaviourInfo) {
        this.behaviourInfo = null;
      }
    },

    editBehaviour() {
      if(!this.behaviourInfo){
        this.$message('请选择一个行为规范');
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
          title: '修改行为规范',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('behaviour-rule', {style: 'color: teal',props: {behaviourInfo: this.behaviourInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('updateBehaviourSuccess',()=>{
          this.behaviourInfo = null;
          this.$msgbox.close();
          this.getList();
        })
    },

    addBehaviour() {
      this.behaviourInfo = null;
      const h = this.$createElement;
      this.$msgbox({
          title: '添加行为规范',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('behaviour-rule', {style: 'color: teal',props: {behaviourInfo: this.behaviourInfo},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

      this.$EventBus.$on('addBehaviourSuccess',()=>{
          this.$msgbox.close();
          this.getList();
        })
    },

    deleteBehaviour() {
      if(!this.behaviourInfo){
        this.$message('请选择一个行为规范');
        return;
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {};
        param.id = this.behaviourInfo.id;
        deleteBehaviour(param).then(response => {
          if (response.code != 0) {
            this.$message(response.message);
            return;
          }
          this.getList();
        })
      }).catch(() => {

      });
    },

    changeStatus(item) {
      changeBehaviourStatus({
        id: item.id,
        status: item.status ? 1: 0
      }).then(response => {
        this.getList();
        if (response.code !== 0) {
          return this.$message(response.msg||response.message);
        }
        this.$message({
          type: 'success',
          message: '更新设备信息成功'
        });
      }).catch(res => {
        this.$message({
          type: 'success',
          message: '操作失败'
        });
      });
    },

    getList(listQuery) {

      let param = {
        pageSize: 10,
        pageNum: 0
      }

      if(this.listQuery){
        param = this.listQuery;
      }
      getBehaviourList(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data.list;
        for(let i=0;i<this.list.length;i++){
          this.list[i].status = this.list[i].status == 1 ? true: false;
        }

        console.log(this.list);
        this.total = response.data.total
        this.listLoading = false
      })
    },

    handleFilter() {
      this.getList(this.listQuery);
    },

    destory() {
      this.$EventBus.$off('addBehaviourSuccess');
      this.$EventBus.$off('updateBehaviourSuccess');
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
