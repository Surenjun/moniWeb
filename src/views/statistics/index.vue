<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;">
      <el-date-picker
        v-model="timeBetween"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      @sort-change="reSortList"
      style="width: 100%;"
    >
      <el-table-column label="日期" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.recordDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试人数" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPeopleNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试次数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常次数" sortable="custom" align="center" min-width="100" prop="totalCheatNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCheatNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常比列" sortable="custom" align="center" min-width="100" prop="cheatRate">
        <template slot-scope="scope">
          <span>{{ scope.row.cheatRate == '0' ? scope.row.cheatRate: scope.row.cheatRate + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="主动协助" sortable="custom" align="center" min-width="100" prop="cheatZeroNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.cheatZeroNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语音提示" sortable="custom" align="center" min-width="100" prop="cheatOneNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.cheatOneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手势提示" sortable="custom" align="center" min-width="100" prop="cheatTwoNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.cheatTwoNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常音" sortable="custom" align="center" min-width="100" prop="cheatThreeNumber">
        <template slot-scope="scope">
          <span>{{ scope.row.cheatThreeNumber }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
  import { getStatisticsPage } from '@/api/statistics'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime,calcTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'statistics',
    components: { Pagination },
    directives: { waves },
    filters: {
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        timeBetween:null,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          queryStartTime: null,
          queryEndTime:null,
        },

        dialogFormVisible: false,
        dialogStatus: '',

        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false
      }
    },
    created() {
      console.log('statistics page created')
      this.getList()
    },
    destroyed(){
      console.log('销毁页面')
    },
    methods: {
      calcTimeM(s){
        return calcTime(s);
      },
      reSortList(param){
        console.log(param);
        this.listQuery.orderBy = param.prop;
        this.listQuery.orderType = param.order == "ascending" ? "ASC" : "DESC";

        getStatisticsPage(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      getList() {
        this.listLoading = true
        getStatisticsPage(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        console.log(this.timeBetween)
        if(this.timeBetween){
          this.listQuery.queryStartTime =  this.timeBetween[0] + ' 00:00:00'
          this.listQuery.queryEndTime =  this.timeBetween[1] + ' 00:00:00'
        }else{
          this.listQuery.queryStartTime = null
          this.listQuery.queryEndTime = null
        }
        this.listQuery.pageNum = 1
        this.getList()
      },

      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
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
      }
    }
  }
</script>
