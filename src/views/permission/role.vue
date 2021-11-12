<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('permission.addRole') }}
    </el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleCode }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" @click="handleEdit(scope)" v-if="scope.row.roleCode != 'supper'">
            {{ $t('permission.editPermission') }}
          </el-button> -->
          <el-button type="primary" size="small" @click="handleEdit(scope.row)"  v-if="scope.row.roleCode != 'supper'"> 

            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)"  v-if="scope.row.roleCode != 'supper'">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Code">
          <el-input v-model="role.code" placeholder="Role Code" />
        </el-form-item>
       <!--  <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item> -->
        <el-form-item label="Menus">
          <el-tree ref="tree" 
            :data="routes" 
            :props="props"
            :default-expanded-keys="default_expanded_keys"
            :default-checked-keys="default_checked_keys" 
            show-checkbox 
            node-key="permission" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getAuthList, getRoles, addRole,editRole,deleteRole } from '@/api/auth'
import { deepClone,uniqueArr } from '@/utils'

export default {
  data() {
    return {
      props: {
          label: 'name'
      },
      default_expanded_keys: [],
      default_checked_keys: [],
      role: {
        name:'',
        code:'',
        description:'',
        roleId: ''
      },
      permissionList: [],
      disabledPermission: [],
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },

  created() {
    // Mock: get all routes and roles list from server
    this.getAuthList()
    this.getRoles()
  },

  methods: {
    getAuthList: function(argument) {
      getAuthList({}).then((resp) => {
            this.routes = [];
            this.permissionList = resp.data;
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
                this.routes.push(resp.data[j]);
              }

              if(resp.data[j].name == '系统概览'){
                resp.data[j].disabled = true;
                this.disabledPermission.push(resp.data[j].permission);
              }
            }

            //按钮并入二级菜单
            for(var k=0; k<this.routes.length; k++){
              for(var l=0;resp.data && l<resp.data.length;l++){
                if(resp.data[l].parentId == this.routes[k].menuId){
                  this.routes[k].children.push(resp.data[l]);
                }
              }
            }

        })
    },


    async getRoles() {
      const res = await getRoles({})
      this.rolesList = res.data
    },

    handleAddRole(){
      var tmpList = deepClone(this.routes);
      this.routes = [];
      this.routes = tmpList; //触发树的刷新， 单纯更新 default_expanded_keys或者default_checked_keys 无法生效

      this.default_expanded_keys = this.disabledPermission;
      this.default_checked_keys = this.disabledPermission;

      this.dialogType = 'add'
      this.dialogVisible = true;
      this.role = {
        name:'',
        code:'',
        description:'',
        roleId: ''
      }
    },
    confirmRole(){
      var permissions = this.$refs.tree.getCheckedKeys();
      var permissionList = [];

      for (var i = permissions.length - 1; i >= 0; i--) {
        for (var j = this.permissionList.length - 1; j >= 0; j--) {
          if(this.permissionList[j].permission == permissions[i]){
            permissionList.push(this.permissionList[j].menuId);
            break;
          }
        }
      }

      console.log('permissionList == ',permissionList);
      var param = {
        roleCode: this.role.code,
        roleName: this.role.name,
        permissions: permissionList
      }
      var message = '';
      var fn = addRole;
      if(this.dialogType == 'add'){
        message = '添加角色成功';
      }else {
        message = '修改角色成功';
        fn = editRole;
        param.roleId = this.role.roleId;
      }
      fn(param).then(() => {
        this.dialogVisible = false;
        this.default_expanded_keys = [];
        this.default_checked_keys = [];

        this.getRoles();
        

        this.$message({
          type: 'success',
          message: message
        });
      })
    },
    handleEdit(item) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      var permissions = [];

      if(item.permissions && item.permissions.length > 0){
        for(var i=0;i<item.permissions.length;i++){
          permissions.push(item.permissions[i].permission);
        }
      }

      var tmpList = deepClone(this.routes);
      this.routes = [];
      this.routes = tmpList; //触发树的刷新， 单纯更新 default_expanded_keys或者default_checked_keys 无法生效

      this.default_expanded_keys = uniqueArr(permissions.concat(this.disabledPermission));
      this.default_checked_keys = uniqueArr(permissions.concat(this.disabledPermission));

      this.role.name = item.roleName;
      this.role.code = item.roleCode;
      this.role.roleId = item.roleId;
    },

    handleDelete(item) {
      this.$confirm('确定删除角色么，该操作不可恢复', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole({
            ids:[item.roleId]
          })
          this.getRoles();
          this.$message({
            type: 'success',
            message: '删除用户成功!'
          })
        })
        .catch(err => { console.error(err) })
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

.el-dialog__body .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #adb6c3 !important;
  border-color: #adb6c3 !important;
}

.el-dialog__body .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
  border-color: white !important; 
}
</style>
