<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索 -->
      <el-input v-model="listQuery.fileName" placeholder="文件名" style="width: 200px;margin-right: 10px;"
           class="filter-item" @keyup.enter.native="handleFilter" clearable />

     

      <el-input v-model="listQuery.remark" placeholder="备注" style="width: 200px;margin-right: 10px;"
      class="filter-item" @keyup.enter.native="handleFilter" clearable />


      <el-select style="width: 300px;" v-model="listQuery.type" placeholder="请选择文件类型">
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.value"
          :value="item.id">
        </el-option>
      </el-select>
      

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>

      <!-- <el-button v-waves class="filter-item blue_bg" type="primary" icon="el-icon-edit" >
        下载
      </el-button> -->

    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" style="width: 100%;">
      <el-table-column label="ID" prop="id" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="文件名称" align="center" min-width="180" :show-overflow-tooltip='true' enterable ='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.fileName + scope.row.suffix }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" align="center" min-width="100">
        <template slot-scope="scope">
          <span>{{ dealTypes(scope.row.type) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="远程url" align="center" min-width="150" :show-overflow-tooltip='true' enterable ='true' >
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" :show-overflow-tooltip='true' enterable ='true'>
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column> 

      <!-- <el-table-column label="md5" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.md5 }}</span>
        </template>
      </el-table-column> -->


      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button size="mini" class='blue' @click="download(row)">
            下载
          </el-button>  


        </template>
      </el-table-column>
    
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>
<script>
import {getCommonFilePageList ,downloadCommonFile } from '@/api/subjectThree'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import PopTx  from '@/components/Device/PopTx2' // Secondary package based on el-pagination

export default {

  name: 'commonFile',
    // props:['idcard'],
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
        type: '',
        fileName: '',
        remark:''
      },

      types:[
         {id:'',value:'请选择'},
         {id:1,value:'日志'},
         {id:2,value:'全程视频'},
         {id:3,value:'信息文件'},
         {id:4,value:'其他'}
      ]
    }
    
  },
  created() {
    this.getList()
  },
  methods: {

    // 分页查询列表
    getList() {
      let param = {
        ...this.listQuery
      };
      getCommonFilePageList(param).then(response => {
        this.tableKey = new Date().getTime();
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },

    dealTypes(data){
      if(data =='1'){
        return '日志'
      }else if(data=='2'){
        return '全程视频'
      }else if(data=='3'){
        return '信息文件'
      } else if(data=='4'){
        return '其他'
      }
    },

//  搜索按钮
    handleFilter() {
      this.getList();
    },
    
  download(row){
      // window.location.href =window.location.protocol+"//"+window.location.host+"/moni/api/common/download/netFile?fileUrl=" + encodeURI(row.url);  
      window.location.href ="http://127.0.0.1:9090/moni/api/common/download/netFile?fileUrl=" + encodeURI(row.url);  
     this.exportLoading = false;

    // window.location.href = "http://127.0.0.1:9090/moni/api/common/download?fileName=" + encodeURI(row.fileName) + "&delete=" + true;

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
