<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="searchConditions">

        <el-input v-model="listQuery.idCard" placeholder="接收人" style="width: 300px;" class="filter-item"
                  @keyup.enter.native="handleFilter" clearable />
        <el-input v-model="listQuery.name" placeholder="车牌号" style="width: 300px;" class="filter-item"
                  @keyup.enter.native="handleFilter" clearable />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
      </div>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="序号" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>


      <el-table-column label="车牌号" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.carInfo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carTypeChn }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接收人" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消息时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否已读" align="center">
        <template slot-scope="scope">
          <span
            :class="{'grey': scope.row.examFlag == 2,'black': scope.row.examFlag == 0,'orange': scope.row.examFlag == 1}">{{ getExamZh(scope.row.examFlag) }}</span>
        </template>
      </el-table-column>


    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="getList" />
  </div>
</template>

<script>
import {
  getExamInfo,
  createExamInfo,
  updateExamInfo,
  delExamInfo
} from '@/api/student'
import waves from '@/directive/waves' // Waves directive
import {
  parseTime
} from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import {
  getNoPageList as getCarTypeList
} from '@/api/device'
export default {
  name: 'student',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      timeBetween: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        carNo: '',
        name: null,
        idCard: null,
        queryStartTime: null,
        queryEndTime: null,
        carType: ''
      },
      carTypes: [],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{
          required: true,
          message: 'type is required',
          trigger: 'change'
        }],
        timestamp: [{
          type: 'date',
          required: true,
          message: 'timestamp is required',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: 'title is required',
          trigger: 'blur'
        }]
      },
      downloadLoading: false,

    }
  },
  created() {
    console.log('创建页面')
    this.getList();
    this.getCarType();
  },
  methods: {
    getExamZh(flag) {
      switch (flag) {
        case "0":
          return '否';
        case "1":
          return '是';

      }
    },

    getList() {
      this.listLoading = true
      getExamInfo(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].examFlag === '0') this.list[i].btnstyle = 'success'
          if (this.list[i].examFlag === '1') this.list[i].btnstyle = 'warning'
          if (this.list[i].examFlag === '2') this.list[i].btnstyle = 'danger'
        }
        // console.log(this.list)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      if (this.timeBetween) {
        this.listQuery.queryStartTime = this.timeBetween[0] + ' 00:00:00'
        this.listQuery.queryEndTime = this.timeBetween[1] + ' 00:00:00'
      } else {
        this.listQuery.queryStartTime = null
        this.listQuery.queryEndTime = null
      }
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData
            .timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleCheat(row) {
      console.log(row)
      //跳转
      this.$router.push({
        name: 'cheat',
        query: {
          examInfoId: row.id,
          idcard: row.idCard
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },

    getCarType() {
      getCarTypeList().then(res => {
        console.log(res);
        this.carTypes = res.data;
      }).catch(res => {

      })

    }

  }
}

</script>
<style>
.filter-container {
  display: flex;
  align-items: end;
}

.filter-container .filter-item {
  /*display: block;*/
  margin-right: 10px;
  /*margin-bottom: 0;*/
}

</style>
