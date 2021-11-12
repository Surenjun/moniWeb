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
      
      <!-- <el-table-column width="55">
        <template slot-scope="scope">
          <el-checkbox @change="dataSelected(scope.row)" v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column> -->

      <el-table-column label="序号" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

        <el-table-column label="参数名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

       <el-table-column label="参数值" prop="value" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      
      
        <el-table-column label="描述" prop="decribe" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.decribe }}</span>
        </template>
      </el-table-column>

         <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
     <el-table-column align="left" label="操作" width="250px" fixed="right">
        <!-- <template slot-scope="{row}"> -->
            <template slot-scope="scope">
          <el-button  size="mini" @click="handleEdite(scope.row)" type="primary"
            >编辑</el-button
          >

          <el-button @click="handleDelete(scope.row)" size="mini" type="danger"
            >删除</el-button
          >

        </template>
      </el-table-column>
    </el-table>

<el-dialog :visible.sync="dialogVisible" :title="dialogType=='edit'?'编辑':'新增'">
      <el-form :model="buildingForm" label-width="80px" label-position="left">
        <el-form-item label="序号">
          <el-input v-model="buildingForm.id" placeholder="序号" />
        </el-form-item>


        <el-form-item label="参数名称">
          <el-input v-model="buildingForm.name" placeholder="参数名称" />
        </el-form-item>


       <el-form-item label="参数值">
          <el-input v-model="buildingForm.value" placeholder="参数值" />
        </el-form-item>

       
         <el-form-item label="描述">
          <el-input v-model="buildingForm.decribe" placeholder="描述" />
        </el-form-item>
           <el-form-item label="备注">
          <el-input v-model="buildingForm.remark" placeholder="备注" />
        </el-form-item>
        

      </el-form>

      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
import { getLogList,getSysParamConfig ,editSysParamConfig } from '@/api/log'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import PopTx  from '@/components/Device/PopTx2' // Secondary package based on el-pagination

export default {

  name: 'sysParamConfig',

    components: {Pagination},
    directives: {waves},
    filters: {},
  data() {
    return {
      versionValue: '',
      tableKey: new Date().getTime(),
      list: null,
      // total: 0,
      listLoading: true,
      timeBetween: null,
      terminalInfo: null,
      showPop: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
       
      },

      dialogType: '',
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },

       buildingForm: {
        // buildingId: "",
        id: '',
        name: '',
        value: '',
        decribe: '',
        remark: ''
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

      getSysParamConfig(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data
        // this.total = response.data.total
        this.listLoading = false
      })


    },



//  搜索按钮
    handleFilter() {
      this.getList();
    },

     // 删除
    handleDelete() {
    // return this.$message("该功能公测中，暂未开放")
      this.$confirm("确定删除么，该操作不可恢复", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (resp) => {

       return   this.$message.error('权限不够');
       
        })
        .catch((err) => {
          console.error(err);
        });
    },
       // 编辑按鈕
     // 编辑按鈕
    handleEdite(item) {
      // this.getCommunitys();
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.buildingForm.id = item.id
      this.buildingForm.value = item.value
      this.buildingForm.name = item.name
      this.buildingForm.decribe = item.decribe
      this.buildingForm.remark = item.remark
    },

    save() {
      var param = {
        name: this.buildingForm.name,
        value: this.buildingForm.value,
        decribe: this.buildingForm.decribe,
        remark: this.buildingForm.remark,
      }

      // var fn = add
      if (this.dialogType == 'edit') {
        param.id = this.buildingForm.id
        // fn = editSysParamConfig
      }
      console.log(param)
      editSysParamConfig(param)
        .then((resp) => {
          this.getList()
          this.$message.success(resp.message)
          // 关闭弹出框
          this.dialogVisible = false
        })
        .catch((resp) => {
          this.$message({ type: 'warning', message: resp.message })
        })
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
