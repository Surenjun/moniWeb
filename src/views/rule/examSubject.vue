<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.projectName" placeholder="考试项目名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable />
      <el-button v-waves class="filter-item" icon="el-icon-search" type="primary" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button v-waves class="filter-item blue_bg" icon="el-icon-edit" type="primary" @click="editExam">
        {{ $t('table.edit') }}
      </el-button>
      <el-button v-waves class="filter-item grey_bg" icon="el-icon-plus" type="primary" @click="addExam">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves class="filter-item red_bg" icon="el-icon-delete" type="primary" @click="deleteExam">
        {{ $t('table.delete') }}
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
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
      <el-table-column label="考试项目名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试项目编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试项目完整编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sourceCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试科目" align="center">
        <template slot-scope="scope">
          <span>{{ calc(scope.row.subject)}}</span>
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
      list: null,
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
      let param = {
        pageSize: this.listQuery.pageSize,
        pageNum: this.listQuery.pageNum,
        projectName: this.listQuery.projectName,
      }

      getExamProject(param).then(response => {
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
