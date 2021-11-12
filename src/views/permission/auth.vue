<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddAuth(1)">
      {{ $t('permission.addMenu1') }}
    </el-button>

    <el-button type="primary" @click="handleAddAuth(2)">
      {{ $t('permission.addMenu2') }}
    </el-button>

    <el-button type="primary" @click="handleAddAuth(3)">
      {{ $t('permission.addButton') }}
    </el-button>

    <el-table
      row-key="menuId"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="authList" 
      style="width: 100%;margin-top:30px;" border>

      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="类型">
        <template slot-scope="scope">
          {{ calc(scope.row.type)  }}
        </template>
      </el-table-column>
     <!--  <el-table-column align="header-center" label="路径">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="重定向路径">
        <template slot-scope="scope">
          {{ scope.row.redirect }}
        </template>
      </el-table-column> -->
      <el-table-column align="header-center" label="权限">
        <template slot-scope="scope">
          {{ scope.row.permission }}
        </template>
      </el-table-column>
   <!--    <el-table-column align="header-center" label="组件">
        <template slot-scope="scope">
          {{ scope.row.component }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="Operations" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAuthList,deleteAuth } from '@/api/auth'
import EditBtn from '@/views/permission/components/EditBtn'
import EditMenu from '@/views/permission/components/EditMenu'
import Upgrade from '@/components/UploadVersion/Upgrade'

export default {
  data() {
    return {
        pointer: '',
        authList: []
    }
  },
  components:{
    EditBtn,
    EditMenu
  },
  computed: {
  },
  created() {
    this.getAuthList();
  },
  destory(){
    this.$EventBus.$off('MenuAdd');
    this.$EventBus.$off('MenuEdit');
  },
  methods: {
    calc: function(type){
      if(type == 0){
        return '菜单'
      }else if(type == 1){
        return '按钮'
      }else if(type == 2){
        return '接口'
      }
    },

    handleEdit: function(item){
      var title = '';
      var domStr = '';
      console.log(item);

      if(item.type == 0 && item.parentId == 0){
        title = '一级菜单编辑',
        domStr = 'edit-menu',
        this.pointer = {
          type: 1,
          item: item
        }
      }else if(item.type == 0 && item.parentId != 0){
        title = '二级菜单编辑',
        domStr = 'edit-menu',
        this.pointer = {
          type: 2,
          list: this.authList,
          item: item
        }
      }else if(item.type == 1){
        title = '按钮权限编辑',
        domStr = 'edit-btn'
        this.pointer = {
          type: 3,
          list: this.authList,
          item: item
        }
      }

      this.pointer.option = 'edit';
      const h = this.$createElement;
      this.$msgbox({
          title: title,
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h(domStr, {style: 'color: teal',props: {pointer:this.pointer},key: new Date().getTime()})
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

        this.$EventBus.$off('MenuEdit');
        this.$EventBus.$on('MenuEdit',()=>{
          this.getAuthList();
          this.$msgbox.close();
        })
    },

    handleAddAuth: function(type) {
      var title = '';
      var domStr = '';
      if(type == 1){
        title = '一级菜单新增',
        domStr = 'edit-menu',
        this.pointer = {
          type: 1
        }
      }else if(type == 2){
        title = '二级菜单新增',
        domStr = 'edit-menu',
        this.pointer = {
          type: 2,
          list: this.authList
        }
      }else if(type == 3){
        title = '按钮权限新增',
        domStr = 'edit-btn'
        this.pointer = {
          type: 3,
          list: this.authList
        }
      }

      this.pointer.option = 'add';

      const h = this.$createElement;
      this.$msgbox({
          title: title,
          showConfirmButton: false,
          customClass: 'handleVersionClass',
          message: h('p', null, [
            h(domStr, {style: 'color: teal',props: {pointer:this.pointer},key: new Date().getTime()})
          ]),
          beforeClose: (action, instance, done) => {
            done();
          }
        });

        this.$EventBus.$off('MenuAdd');
        this.$EventBus.$on('MenuAdd',()=>{
          this.getAuthList();
          this.$msgbox.close();
        })
    },
    getAuthList: function(){
        getAuthList({}).then((resp) => {
            this.authList = [];

            //列表三层接口， 1级菜单，2二级菜单，3按钮
            //先将按钮并入二级菜单，再将二级菜单并入一级菜单
            //二级菜单的parentId 不为0 且type为1

            //抽取二级菜单
            var tmpList = [];
            for(var i=0; resp.data && i<resp.data.length;i++){
              if(resp.data[i].parentId != 0 && resp.data[i].type == 0){
                resp.data[i].children = [];
                tmpList.push(resp.data[i]);
              }
            }

            //按钮并入二级菜单
            for(var m=0; m<tmpList.length; m++){
              for(var n=0;resp.data && n<resp.data.length;n++){
                if(resp.data[n].parentId == tmpList[m].menuId){
                  tmpList[m].children.push(resp.data[n]);
                }
              }
            }

            //抽取一级菜单
            for(var j=0; resp.data && j<resp.data.length;j++){
              if(resp.data[j].parentId == 0 && resp.data[j].type == 0){
                resp.data[j].children = [];
                this.authList.push(resp.data[j]);
              }
            }

            //按钮并入二级菜单
            for(var k=0; k<this.authList.length; k++){
              for(var l=0;resp.data && l<resp.data.length;l++){
                if(resp.data[l].parentId == this.authList[k].menuId){
                  this.authList[k].children.push(resp.data[l]);
                }
              }
            }

        })
    },
    handleDelete: function(item){

      var id = '' + item.menuId;
      console.log('id == ',id);
      if(item.children && item.children.length > 0){
        var tmpList = item.children;
        for(var i=0;i<tmpList.length;i++){
          id = id + ',' + tmpList[i].menuId;

          if(tmpList[i].children && tmpList[i].children.length > 0){
            var tmpList2 = tmpList[i].children;
            for(var j=0;j<tmpList2.length;j++){
              id = id + ',' + tmpList2[j].menuId;
            }
          }
        }
      }
      this.$confirm('此操作将永久删除该节点及其子节点, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        id = id.split(',');
        console.log(id);
        deleteAuth({ ids: id }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getAuthList();
        }).catch((e) => {
          console.log(e);
          this.$message({
            type: 'success',
            message: '操作失败!'
          });
        })
        
      }).catch(() => {
      });
      
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
