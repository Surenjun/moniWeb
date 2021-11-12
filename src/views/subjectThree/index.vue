<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="searchConditions">   
        <el-input v-model="listQuery.carNo" placeholder="考车号" style="width: 300px;" class="filter-item"
                  @keyup.enter.native="handleFilter" clearable/>
        <el-input v-model="listQuery.lsh" placeholder="流水号" style="width: 300px;" class="filter-item"
                  @keyup.enter.native="handleFilter" clearable/>
        <el-select style="width: 300px;margin-right: 10px;"  v-model="listQuery.zdppjg" placeholder="请选择自动评判结果">
          <el-option
            v-for="item in cheatOptions"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>

         
        <el-select style="width: 300px;margin-right: 10px;" v-model="listQuery.verifyFlag" placeholder="评判审核结果">
          <el-option
            v-for="item in verifyFlags"
            :key="item.id"
            :label="item.value"
            :value="item.id">
          </el-option>
        </el-select>


        <el-date-picker
        style="width: 300px;margin-right: 10px;"
        v-model="timeBetween"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>

      <el-input v-model="listQuery.ksdd" placeholder="考点(未开启)" style="width: 300px;" class="filter-item"
      @keyup.enter.native="handleFilter" clearable/>  
      
      </div>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="身份证号码" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.sfzhm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="流水号" prop="lsh" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.lsh }}</span>
        </template>
      </el-table-column>

      <el-table-column label="考车号" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.carno }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="考试项目" prop="scope" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.ksxm }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="考试项目" prop="scope" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      

      <el-table-column label="扣分项目" prop="kfxm" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.kfxm }}</span>
        </template>
      </el-table-column>

      <el-table-column label="扣分内容" prop="ruleChn" align="center" width="100px" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
             <!-- <el-tooltip class="item" effect="dark" :content="scope.row.ruleChn" placement="top-start"> -->
               <span>{{ scope.row.ruleChn }}</span>
            <!-- </el-tooltip> -->
        </template>
      </el-table-column> 

      <!-- <el-table-column label="上传时间" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="录像时间" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.lxsj }}</span>
        </template>
      </el-table-column>

      <el-table-column label="人工审核结果" align="center" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.verifyFlag==1?'未处理':scope.row.verifyFlag==2?'审核一致':'自动评审错误' }}</span>
        </template>
      </el-table-column>

    
      <el-table-column label="自动评判结果" align="center" width="120px">
        <template slot-scope="scope">  
          <span>{{ scope.row.zdppjg==1?'车上已经评判':'车上未评判' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="录像时长" prop="lxsc" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.lxsc }}</span>
        </template>
      </el-table-column>

      
      <el-table-column label="考试信息文件URL" prop="ksxxUrl" align="center" width="500"  :show-overflow-tooltip='true' enterable ='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.videoUrl }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评判详情" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.verifyReason }}</span>
        </template>
      </el-table-column>



      
     
      <el-table-column label="查看" align="center" width="100px" fixed="right">
        <template slot-scope="{row}">
          <el-button size="mini" class='blue' @click="handleVideo(row)">
            录像
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import {getkm3FilePageList} from '@/api/subjectThree'
  import waves from '@/directive/waves' // Waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'subjectThree',
    // props:['idcard'],
    components: {Pagination},
    directives: {waves},
    filters: {},
    data() {
      return {
        cheatOptions: [
          {id: 0, value: '车上未评判'},
          {id: 1, value: '车上已评判'}
        ],
        verifyFlags: [
           {id: 1, value: '未处理'}
          ,{id: 2, value: '审核一致'}
          ,{id: 3, value: '自动评审错误'}

        ],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        timeBetween:null,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          sfzhm: null,
          name: null,
          carNo: '',
          lsh: '',
          zdppjg: '',
        },
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

        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        downloadLoading: false
      }
    },
    created() {
      console.log(this.$store.state.tagsView.cachedViews)
      console.log('subject three created')
      this.getList();
      this.$EventBus.$on("changeSuccessNew", (msg) => {
        console.log('EventBus changeSuccessNew',1234);
          this.getList();
      });
    },

    methods: {
      getList() {
        this.listLoading = true;
        if(this.timeBetween){
          this.listQuery.queryStartTime =  this.timeBetween[0] + ' 00:00:00'
          this.listQuery.queryEndTime =  this.timeBetween[1] + ' 23:59:59'
        }else{
          this.listQuery.queryStartTime = null
          this.listQuery.queryEndTime = null
        }
        let query = JSON.parse(JSON.stringify(this.listQuery));
        getkm3FilePageList(query).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },

      sortChange(data) {
        const {prop, order} = data
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
      handleVideo(row) {
        //发送修改已读
        // updateExamInfoDetail({id:row.id, messageFlag:1}).then(response => {
        //   row.messageFlagChn = '已读'
        // })
        //跳转
        // this.$router.push({path:'/cheat/playback',query:{ id:row.id }})
        window.sessionStorage.setItem('subject_three',JSON.stringify(row))
        this.$router.push({path: '/subject_three/video', query: {id: row.id}})
        // this.$router.push('/cheat/video/'+row.id)
      },
    }
  }
</script>
<style scoped lang="scss">
  .filter-container {
    display: flex;
    align-items: center;
  }

  .searchConditions {
    display: flex;
    flex-wrap: wrap;
  }

  .filter-container .filter-item {
    display: block;
    margin-right: 10px;
  }
</style>
<style>
  .el-table .cell{
    white-space: normal;
  }
</style>
