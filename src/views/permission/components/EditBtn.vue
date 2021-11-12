<template>
  <div class="editBtn">
    <div class="container" v-if="option == 'add'">
      <div class="left">一级菜单</div>
      <el-select v-model="menu1" class="selectBox inputR" clearable placeholder="请选择一级菜单">
        <el-option v-for="(item,index) in menu1List" :key="item.id" :label="item.name" :value="item.menuId">
          {{ item && item.name }}
        </el-option>
      </el-select>
    </div>
    <div class="container">
      <div class="left">二级菜单</div>
      <el-select v-model="menu2" class="selectBox inputR" clearable placeholder="请选择二级菜单">
        <el-option v-for="(item,index) in menu2List" :key="item.id" :label="item.name" :value="item.menuId">
          {{ item && item.name }}
        </el-option>
      </el-select>
    </div>
    
    <div class="container"><div class="left">名称</div><el-input v-model="input1" class="inputR" placeholder="请输入内容"></el-input></div>
    <div class="container"><div class="left">权限编码</div>
      <el-select v-model="permission" class="inputR" placeholder="请选择角色">
        <el-option
          v-for="(item,index) in permissionList"
          :key="index"
          :label="item.permission"
          :value="item.permission">
        </el-option>
      </el-select>
    </div>
    <div class="messageBoxButton">
      <el-button class="filter-item" type="primary" @click="handleEdit">
        确认
      </el-button>
    </div>
  </div>
</template>
<script>
import { configVersion } from '@/api/version'
import { addMenu,editMenu,getPermissions } from '@/api/auth'

export default {
  data() {
    return {
      menu1List:[],
      menu2List:[],
      menu1:'',
      menu2:'',
      input1: '',
      permission: '',
      option:'add',
      permissionList:[]
    };
  },

  props: ['pointer'],

  watch: {
    menu1(newValue, oldValue) {
      this.menu2 = '';
      this.menu2List = this.menu1List[newValue].children;
    }
  },

  mounted() {
    this.menu1List = this.pointer.list;
    this.option = this.pointer.option;
    if(this.pointer.item){
      this.input1 = item.name;
      this.permission = item.permission;
      this.menu2 = item.parentId;
    }


    //初始化赋值不需要监听menu，用户手动变更的时候才开始监听
    this.$watch('menu1', function(newValue, oldValue){
      this.menu2 = '';
      this.getPermissions(newValue);
      this.permission = '';
    })

    this.$watch('menu2', function(newValue, oldValue){
      if(newValue == ''){
        return;
      }
      this.getPermissions(newValue);
      this.permission = '';
    })

  },
  methods: {
    handleEdit(){
      console.log('this.menu1',this.menu1)
      console.log('this.menu2',this.menu2)

      var param = {
          name: this.input1,
          type: 1,
          permission: this.permission
        }

        //一级菜单
        if(typeof this.menu2 == 'number'){
          param.parentId = this.menu2;
        }else if(typeof this.menu1 == 'number'){
          param.parentId = this.menu1;
        }

        var fn = addMenu;
        var message = 'MenuAdd';
        var messagePop = '新增按钮成功';
        if(this.option == 'edit'){
          fn = editMenu
          message = 'MenuEdit';
          messagePop ="编辑按钮成功";
        }
        fn(param).then((resp)=>{
            this.$EventBus.$emit(message);
            if(resp.code == 0){
              this.$message({
                type: 'success',
                message: messagePop
              });
            }else {
              this.$message({
                type: 'success',
                message: resp.message
              });
            }
        }).catch(()=>{
          this.$message({
            type: 'success',
            message: '操作失败！'
          });
        })
    },

    getPermissions(parentId){
      getPermissions({parentId: parentId}).then((resp) => {
          this.permissionList = resp.data;
      })
    }
  }
};

</script>
<style scoped>

.container{
  display: flex;
  margin-top: 10px;
}

.container .left{
  width: 20%;
  margin-top: 5px;
}

.container .inputR{
  width: 80%;
  margin-top: 0;
}

.messageBoxButton {
  text-align: center;
  margin-top: 15px;
}

.remark {
  margin-top: 15px;
}

.selectBox {
  margin-top: 15px;
  width: 100%;
}

.swichClass{
  float: right;
}

</style>
