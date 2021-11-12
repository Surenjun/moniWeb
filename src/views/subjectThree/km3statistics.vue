<template>
  <div class="app-container">
    <div class="filter-container" style="display:flex;">
      <el-date-picker
        style="margin-right: 10px;"
        v-model="timeBetween"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd">
      </el-date-picker>

      <el-select v-model="listQuery.conditionType" placeholder="请选择" style="width: 200px;" @change='handleStatistics'>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 10px;">
        {{ $t('table.search') }}
      </el-button> -->
    


      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleStatistics" style="margin-left: 10px;">
        统计
      </el-button>

     <el-button v-waves class="filter-item" type="primary" icon="el-icon-upload2"  style="margin-left: 10px;" @click="handleExport" >
          导出
      </el-button>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-printer"  style="margin-left: 10px;" @click="temp">
         打印
    </el-button>

     

    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
     
      style="width: 100%;"
    >

      <el-table-column label="统计维度" prop="conditionType" align="center" min-width="80" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{listQuery.conditionType =='1'?'单次考试统计':scope.row.conditionType=='2'?'每日扣分项目统计':'扣分项目统计' }}</span> 
        </template>
      </el-table-column>

      <el-table-column label="日期" align="center" min-width="120" v-if="listQuery.conditionType == 2" >
        <template slot-scope="scope">
          <span>{{ scope.row.lxsj }}</span>
        </template>
      </el-table-column>

      <el-table-column label="考试地点" align="center" min-width="120" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.ksdd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流水号" align="center" min-width="120" v-if="listQuery.conditionType == 1"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.lsh }}</span>
        </template>
      </el-table-column>

      <el-table-column label="考试用时(秒)" align="center" min-width="120" v-if="listQuery.conditionType == 1"  :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.totalKssj }}</span>
        </template>
      </el-table-column> 

      <el-table-column label="扣分code" align="center" min-width="120" v-if="listQuery.conditionType != 1" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.kfxm }}</span>
        </template>
      </el-table-column>
      
          <el-table-column label="扣分内容" align="center" min-width="120" v-if="listQuery.conditionType != 1" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.ruleChn }}</span>
        </template>
      </el-table-column>
      
      

      <el-table-column label="评判总次数" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="自动评判正确" align="center" prop="correctCount">
        <template slot-scope="scope">
          <span>{{ scope.row.correctCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="自动评判错误" align="center" min-width="100" prop="errorCount">
        <template slot-scope="scope">
          <span>{{ scope.row.errorCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="未审核次" align="center" min-width="100" prop="noVerifyCount">
        <template slot-scope="scope">
          <span>{{ scope.row.noVerifyCount }}</span>
        </template>
      </el-table-column>  

      <el-table-column label="评判正确比例"  align="center" min-width="100" prop="rate">
        <template slot-scope="scope">
          <span>{{scope.row.rate }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
  </div>
</template>

<script>
  import { doStatisticsByConditon,exportReport } from '@/api/km3Statistics'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime,calcTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'km3statistics',
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
          queryEndTime: null,
          conditionType: '',
        },


        dialogFormVisible: false,
        dialogStatus: '',

        // 导出遮罩层
      exportLoading: false,
       downLoadFileName: '',

        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        options: [
        {
          value: '1',
          label: '单次考试统计'
        }, {
          value: '2',
          label: '每日扣分项目统计'
        }
        , {
          value: '3',
          label: '扣分项目统计'
        } 
      ],

        isStatistics: false

      }
    
    },
    created() {
      console.log('创建页面')
      // this.getList()
      // this.list = null

      this.init()
    },
    destroyed(){
      console.log('销毁页面')
    },
    methods: {
      calcTimeM(s){
        return calcTime(s);
      },

      init(){
        this.listLoading = false
        this.list = null;         
      },


      temp() {
        return this.$message("该功能公测中，暂未开放")
      },


      handleStatistics() {
        if(this.timeBetween){
          this.listQuery.queryStartTime =  this.timeBetween[0] + ' 00:00:00'
          this.listQuery.queryEndTime =  this.timeBetween[1] + ' 00:00:00'
        }else{
          this.listQuery.queryStartTime = null
          this.listQuery.queryEndTime = null
        }
        this.listQuery.pageNum = 1
        delete this.listQuery.orderBy
        delete this.listQuery.orderType
        this.listLoading = true

        doStatisticsByConditon(this.listQuery).then(response => {
          this.listLoading = false
          if (response.code !== 0) {
            return this.$message(response.message||response.msg)
          }
          this.list = response.data
          // this.total = response.data.total
          this.isStatistics = true
        })
      },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有参数数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          // this.exportLoading = true;
          // return exportConfig(queryParams);
          this.$message("正在生成报表，请等待...")

        return exportReport(this.listQuery).then(response => {
         console.log(response.data)
         this.downLoadFileName=response.data;
        }) 

        }).then(response => {
        //  window.location.href =window.location.protocol+"//"+window.location.host+"/moni/api/common/download?fileName=" + encodeURI(this.downLoadFileName) + "&delete=" + false;  
         window.location.href ="http://127.0.0.1:9090/moni/api/common/download?fileName=" + encodeURI(this.downLoadFileName) + "&delete=" + false;  
        // window.location.href ="http://127.0.0.1:9090/moni/api/common/down/netFile?fileUrl=" + encodeURI(this.downLoadFileName);  
          this.exportLoading = false;
        })
    },
   
    }
  }
</script>
