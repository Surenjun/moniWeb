<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.projectName" placeholder="ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" icon="el-icon-search" type="primary" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="false" :data="list" style="width: 100%;">
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-checkbox @change="carSelected(scope.row)" v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评测对象" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row['评测对象'] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row['日期'] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="场景" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row['场景'] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row['状态']}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <a style="color: cornflowerblue">下载</a>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>
<script>
import { getExamProject, examProjectDelete } from '@/api/rule'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ExamRule from '@/components/Behaviour/ExamRule' // Secondary package based on el-pagination

export default {
  name: 'device',
  // props:['idcard'],
  components: { Pagination,ExamRule },
  directives: { waves },
  filters: {},
  data() {
    return {
      versionValue: '',
      tableKey: new Date().getTime(),
      list: [
        {
          id:'1',
          "评测对象":"素质评测",
          "日期":"2021-10-23",
          "场景":"外场",
          "状态":"进行中",
        },
        {
          id:'2',
          "评测对象":"品德评测",
          "日期":"2021-10-22",
          "场景":"内场",
          "状态":"开始",
        },
        {
          id:'3',
          "评测对象":"素质评测",
          "日期":"2021-10-21",
          "场景":"外场",
          "状态":"结束",
        },
        {
          id:'4',
          "评测对象":"品德评测",
          "日期":"2021-10-22",
          "场景":"内场",
          "状态":"开始",
        }
      ],
      total: 0,
      listLoading: true,
      timeBetween: null,
      examRuleInfo: null,
      showPop: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        projectName: ''
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    calc: function(number){
      if(number == 1){
        return '科目一'
      }else if(number == 2){
        return '科目二'
      }else if(number == 3){
        return '科目三'
      }
    },

    carSelected(item) {
      if (item.checked) {
        if (!this.examRuleInfo) {
          this.examRuleInfo = item;
        } else if (item != this.examRuleInfo) {
          this.examRuleInfo.checked = false;
          this.examRuleInfo = item;
        }
      } else if (item == this.examRuleInfo) {
        this.examRuleInfo = null;
      }
    },

    editExam() {
      if(!this.examRuleInfo){
        this.$message('请选择一个考试项目');
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: '修改考试项目',
        showConfirmButton: false,
        customClass: 'handleVersionClass',
        message: h('p', null, [
          h('exam-rule', {style: 'color: teal',props: {examRuleInfo: this.examRuleInfo},key: new Date().getTime() })
        ]),
        beforeClose: (action, instance, done) => {
          done();
        }
      });

      this.$EventBus.$on('updateCarSuccess',()=>{
        this.examRuleInfo = null;
        this.$msgbox.close();
        this.getList();
      })
    },

    addExam() {
      this.examRuleInfo = null;
      const h = this.$createElement;
      this.$msgbox({
        title: '添加考试项目',
        showConfirmButton: false,
        customClass: 'handleVersionClass',
        message: h('p', null, [
          h('exam-rule', {style: 'color: teal',props: {examRuleInfo: this.examRuleInfo},key: new Date().getTime() })
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

    deleteExam() {
      if(!this.examRuleInfo){
        this.$message({
          message:'请选择一个考试项目'
        });
        return;
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {};
        param.id = this.examRuleInfo.id;
        examProjectDelete(param).then(response => {
          if (response.code != 0) {
            this.$message(response.message);
            return;
          }
          this.getList();
        })
      }).catch(() => {

      });
    },

    getList() {
      // let param = {
      //   pageSize: this.listQuery.pageSize,
      //   pageNum: this.listQuery.pageNum,
      //   projectName: this.listQuery.projectName,
      // }
      //
      // getExamProject(param).then(response => {
      //   this.tableKey = new Date().getTime();
      //   this.list = response.data.list
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },

    handleFilter() {
      this.getList();
    },

    destory() {
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
