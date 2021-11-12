<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('permission.addUser') }}
    </el-button>

    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
     
      <el-table-column align="center" label="用户名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          {{ calcRoles(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-if="scope.row.username != 'admin'">
            {{ $t('permission.editPermission') }}
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)" v-if="scope.row.username != 'admin'">
            {{ $t('permission.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model="user.username" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="user.pwd" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleSelected" multiple placeholder="请选择角色">
            <el-option
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
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
import { deepClone } from '@/utils'
import { getUser,getRoles,deleteUser, addUser, editUser } from '@/api/auth'


export default {
  data() {
    return {
      user: {
        username: '',
        pwd: '',
        roleList: '',
        userId: ''
      },
      roleSelected: [],
      userList: [],
      roleList: [],      
      dialogType: '',
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getUser();
    this.getRoleList();
  },
  methods: {
    async getRoleList(){
      const res = await getRoles({})
      this.roleList = res.data
    },
    async getUser() {
      const res = await getUser({})
      this.userList = res.data;
    },

    calcRoles(item){
      if(item && item.roles && item.roles.length > 0){
        var roleStr = item.roles[0].roleName;
        for(var i=1; i<item.roles.length;i++){
            roleStr = roleStr + ',' + item.roles[i].roleName;
        }
      }

      return roleStr;
    },

    confirmRole(){
      console.log('roleSelected == ', this.roleSelected);

      var param = {
        username: this.user.username,
        password: this.user.pwd,
        roleIds: this.roleSelected,
        type: 1
      }

      var fn = addUser;
      if(this.dialogType == 'edit'){
        param.userId = this.user.userId
        fn = editUser;
      }

      fn(param).then(() => {
        this.getUser();
        this.$message({
          type: 'warning',
          message: '操作成功'
        })
        this.dialogVisible = false;
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '操作失败'
        })
      })
    },

    handleAddRole() {
      this.dialogType = 'new';
      this.dialogVisible = true;
      this.user = {
        username: '',
        pwd: '',
        roleList: '',
        userId: ''
      };
    },

    handleEdit(item) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user.username = item.username;
      this.user.pwd = item.password;
      this.user.userId = item.userId;
      this.roleSelected = [];
      if(item && item.roles && item.roles.length > 0){
        for(var i=0;i<item.roles.length;i++){
          this.roleSelected.push(item.roles[i].roleId)
        }
      }
    },

    handleDelete(item) {
      this.$confirm('确定删除用户么，该操作不可恢复', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser({
            ids:[item.userId]
          })
          this.getUser();
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
.el-select{
  width: 100%;
}
</style>
