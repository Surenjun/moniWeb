<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="versionValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        style="margin-right: 10px;"
        v-model="timeBetween"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-button v-waves class="filter-item" icon="el-icon-search" type="primary" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>

      <el-button v-waves class="filter-item floatRight" type="primary" @click="uploadVersion">
        版本上传
      </el-button>

      <el-button v-waves class="filter-item floatRight" type="primary" @click="handleVersion">
        版本启用/停用
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.packageName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.versionNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="MD5" prop="id" align="center" width="200px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.md5" placement="top-start">
              <span>{{ scope.row.md5 }}</span>
           </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="上传日期" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.projectApkType == 0 ? "安卓包":(scope.row.projectApkType == 1 ? "TX2":"Tomdog") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本兼容" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.miniVersionNumber" placement="top-start">
              <span>{{ scope.row.miniVersionNumber }}</span>
           </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="升级配置说明" align="center" width="200px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.description" placement="top-start">
            <span>{{ scope.row.description }}</span>
           </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作说明" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.uploadInstructions }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100px">
        <template slot-scope="scope">
          <span :class="[scope.row.status == 0 ? '' : 'bgColor']">{{calcStatus(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本删除" align="center" width="100px">
        <template slot-scope="{row}">
          <el-button size="mini" @click="deleteVersion(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <upload-version></upload-version> -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
  import { getPageVersion,deleteVersion } from '@/api/version'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import UploadVersion from '@/components/UploadVersion'
  import Upgrade from '@/components/UploadVersion/Upgrade'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'cheat',
    // props:['idcard'],
    components: { Pagination, UploadVersion, Upgrade },
    directives: { waves },
    filters: {
    },
    data() {
      return {
        options: [{
          value: '',
          label: '全部',
        },{
          value: '0',
          label: 'TomDog',
        }, {
          value: '1',
          label: 'TX2'
        }, {
          value: '2',
          label: '安卓APK'
        }],
        versionValue: '',
        tableKey: new Date().getTime(),
        list: null,
        total: 0,
        listLoading: true,
        timeBetween:null,
        listQuery: {
          pageNum: 1,
          pageSize: 10
        }
      }
    },

    created() {
      console.log('创建页面')
      this.getList()
    },
    methods: {
      calcStatus: function(status) {
        if(status == 0){
          return "停用";
        }else if(status == 1){
          return "测试车";
        }else if(status == 2){
          return "正式车";
        }else if(status == 3){
          return "全部启用";
        }

        return "";
      },
      getList() {
        let param = {
          pageSize: 10,
          pageNum: 0,
          projectApkType: this.versionValue
        }

        if(this.timeBetween && this.timeBetween[0]){
          param.queryStartTime = this.timeBetween[0] + ' 00:00:00';
        }

        if(this.timeBetween && this.timeBetween[1]){
          param.queryEndTime = this.timeBetween[1] + ' 00:00:00';
        }

        getPageVersion(param).then(response => {
          this.tableKey = new Date().getTime();

          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        })
      },

      uploadVersion(){
        const h = this.$createElement;
        this.$msgbox({
          title: '文件上传',
          message: h('p', null, [
            h('upload-version', { style: 'color: teal', key: new Date().getTime() })
          ]),
          showConfirmButton: false,
          beforeClose: (action, instance, done) => {
              done();
          }
        })
        this.$EventBus.$on('uploadSucess',()=>{
          this.$msgbox.close();
          this.getList();
        })
      },
      deleteVersion(row){
          if(row.status != 0){
            this.$message.success('启用中的版本不可以删除');
            return;
          }

           this.$confirm('删除后文件将不可恢复，是否继续？', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
               deleteVersion({id: row.id}).then((resp) => {
                  this.$message.success(resp.message);
                  this.getList();
                })
            });
      },
      handleVersion(row){
        const h = this.$createElement;
        this.$msgbox({
          title: '停用/启用',
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h('upgrade', {style: 'color: teal',props: {list:this.list},key: new Date().getTime() })
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

        this.$EventBus.$on('upgradeSuccess',()=>{
          this.$msgbox.close();
          this.getList();
        })
      },

      handleFilter(){
        this.getList();
      },

      destory(){
        this.$EventBus.$off('upgradeSuccess');
        this.$EventBus.$off('uploadSucess');
      }
    }
  }
</script>
<style scoped>
  .filter-container{
    display:flex;
  }
  .filter-container .filter-item{
    display: block;
    margin-right: 10px;
  }
  .el-select{
    display: block;
    margin-right: 10px;
  }
  .bgColor{
    background: #1890ff;
    padding: 5px;
    color: white;
  }
</style>
<style>
    .handleVersionClass{
      width: 520px;
    }
</style>
