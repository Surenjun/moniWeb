<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="searchConditions">
        <el-input v-model="listQuery.idCard" placeholder="身份证号码" style="width: 300px;" class="filter-item"
          @keyup.enter.native="handleFilter" clearable />
        <el-input v-model="listQuery.name" placeholder="姓名" style="width: 300px;" class="filter-item"
          @keyup.enter.native="handleFilter" clearable />
        <el-input v-model="listQuery.carInfo" placeholder="考车信息" style="width: 300px;" class="filter-item"
          @keyup.enter.native="handleFilter" clearable />
        <el-input v-model="listQuery.carNo" placeholder="考车号" style="width: 300px;" class="filter-item"
          @keyup.enter.native="handleFilter" clearable />

        <el-select v-model="listQuery.carType" placeholder="请选择车型" style="width: 300px;margin-right: 10px;"
          @change='getCarType'>
          <el-option value="">--请选择--</el-option>
          <el-option v-for="item in carTypes" :key="item.id" :label="item.code" :value="item.code">
          </el-option>
        </el-select>

        <el-select style="width:300px; margin-right: 10px;" v-model="listQuery.typeChn" multiple placeholder="请选择作弊类型">
          <el-option v-for="item in cheatOptions" :key="item.id" :label="item.value" :value="item.id">
          </el-option>
        </el-select>

        <el-date-picker style="margin-right: 10px; width: 300px;" v-model="timeBetween" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>

        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
      </div>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作弊类型" prop="id" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.typeChn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发生时间" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考车号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.carNo }}</span>
        </template>
      </el-table-column>

      <el-select v-model="listQuery.carType" placeholder="请选择" style="width: 300px;" @change='getCarType'>
        <el-option value="">--请选择--</el-option>
        <el-option v-for="item in carTypes" :key="item.id" :label="item.code" :value="item.code">
        </el-option>
      </el-select>

      <el-table-column label="文件名称" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.fileName" placement="top-start">
            <span>{{ scope.row.fileName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="记录状态" align="center" width="100px">
        <template slot-scope="scope">
          <span
            :class="{'grey': scope.row.messageFlag == 1,'black': scope.row.messageFlag == 0}">{{ scope.row.messageFlagChn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" width="100px">
        <template slot-scope="scope">
          <span
            :class="{'red': scope.row.handleFlag == 1,'orange': scope.row.handleFlag == 0,'black': scope.row.handleFlag == 2}">{{ scope.row.handleFlagChn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查看" align="center" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button size="mini" class='blue' @click="handleDetail(row)">
            详情
          </el-button>
          <el-button size="mini" class='blue' @click="handleVideo(row)">
            录像
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  import {
    getExamInfoDetail,
    updateExamInfoDetail
  } from '@/api/cheat'
  import waves from '@/directive/waves' // Waves directive
  import {
    parseTime
  } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {
    getNoPageList as getCarTypeList
  } from '@/api/device'
  export default {
    name: 'cheat',
    // props:['idcard'],
    components: {
      Pagination
    },
    directives: {
      waves
    },
    filters: {},
    data() {
      return {
        cheatOptions: [{
            id: 0,
            value: '主动协助'
          },
          {
            id: 1,
            value: '讲话'
          },
          {
            id: 2,
            value: '手势'
          },
          {
            id: 3,
            value: '异常音'
          }
        ],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        timeBetween: null,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          idCard: null,
          name: null,
          carInfo: '',
          carNo: '',
          typeChn: [],
          examInfoId: null,
          queryStartTime: null,
          queryEndTime: null,
          orderBy: null,
          orderType: null,
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
        downloadLoading: false
      }
    },
    created() {
      console.log('创建页面')
      // console.log(this.$store.state.tagsView.cachedViews)
      if (this.$route.query.idcard) {
        this.listQuery.idCard = this.$route.query.idcard
      }
      if (this.$route.query.examInfoId) {
        this.listQuery.examInfoId = this.$route.query.examInfoId
      }
      this.getList();

      this.$EventBus.$on("changeSuccess", (msg) => {
        console.log('EventBus changeSuccess', 1234);
        this.getList();
      });
      this.getCarType();
    },
    destroyed() {
      console.log('销毁页面 $off("changeSuccess")');
      this.$EventBus.$off("changeSuccess");
    },
    methods: {
      getList() {
        this.listLoading = true;
        let query = JSON.parse(JSON.stringify(this.listQuery));
        query.type = query.typeChn.join(',')
        getExamInfoDetail(query).then(response => {
          this.list = response.data.list
          this.total = response.data.total
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

      sortChange(data) {
        const {
          prop,
          order
        } = data
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
        updateExamInfoDetail({
          id: row.id,
          messageFlag: 1
        }).then(response => {
          row.messageFlagChn = '已读'
        })
        //跳转
        // this.$router.push({path:'/cheat/playback',query:{ id:row.id }})
        this.$router.push({
          path: '/cheat/video',
          query: {
            id: row.id
          }
        })
        // this.$router.push('/cheat/video/'+row.id)
      },
      handleDetail(row) {
        //跳转
        this.$router.push({
          path: '/cheat/detail',
          query: {
            id: row.id
          }
        })
        // this.$router.push('/cheat/detail/'+row.id)
      },
      //
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
