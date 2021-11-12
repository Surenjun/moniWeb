<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索 -->
      <!-- <el-input v-model="listQuery.fileName" placeholder="文件名" style="width: 200px;margin-right: 10px;"
           class="filter-item" @keyup.enter.native="handleFilter" clearable />


      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button> -->

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="序号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

        <el-table-column label="用户名称" prop="username" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

       <el-table-column label="请求路径" prop="username" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
        <el-table-column label="会话ID" prop="sessionId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sessionId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="账号" prop="account" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column label="IP地址" prop="ip" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

         <el-table-column label="操作类型" prop="ip" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operationType }}</span>
        </template>
      </el-table-column>

        <el-table-column label="操作时间" prop="ip" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime }}</span>
        </template>
      </el-table-column>

       <el-table-column label="MAC地址" prop="macAddress" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.macAddress }}</span>
        </template>
      </el-table-column>


        <el-table-column label="成功标志" prop="successFlag" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.successFlag }}</span>
        </template>
      </el-table-column>

      
      <el-table-column label="操作描述" prop="reason" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.describe }}</span>
        </template>
      </el-table-column>

      
    
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>
<script>
import { getLogList } from '@/api/log'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import PopTx  from '@/components/Device/PopTx2' // Secondary package based on el-pagination

export default {

  name: 'pageLog',

    components: {Pagination},
    directives: {waves},
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
       
      },

    
    }
    
  },
  created() {
    this.getList()
  },
  methods: {

    // 分页查询列表
    getList() {
      let param = {
        // ...this.listQuery
      };

      getLogList(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })


    },


   



//  搜索按钮
    handleFilter() {
      this.getList();
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
