<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="项目分类" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.projectName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扣分分值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.markstandard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.markshow }}</span>
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
import {getRuleList} from "@/api/evaluate"
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
      }

      getRuleList(param).then(response => {
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
