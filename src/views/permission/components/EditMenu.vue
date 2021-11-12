<template>
  <div class="editMenu">
    <div class="container" v-if="pointer.type == 2">
      <div class="left">一级菜单</div>
      <el-select v-model="menu" class="selectBox inputR" clearable placeholder="请选择">
        <el-option v-for="item in pointer.list" :key="item.id" :label="item.name" :value="item.menuId">
          {{ item && item.name }}
        </el-option>
      </el-select>
    </div>
    <div class="container"><div class="left">名称</div><el-input class="inputR" v-model="input1" placeholder="请输入内容"></el-input></div>
    <!-- <div class="container"><div class="left">图标</div><el-input class="inputR" v-model="input2" placeholder="请输入内容"></el-input></div> -->
    <!-- <div class="container"><div class="left">路径</div><el-input class="inputR" v-model="input3" placeholder="请输入内容"></el-input></div> -->
    <!-- <div class="container"><div class="left">组件</div><el-input class="inputR" v-model="input4" placeholder="请输入内容"></el-input></div> -->
    <!-- <div class="container"><div class="left">重定向</div><el-input class="inputR" v-model="input5" placeholder="请输入内容"></el-input></div> -->
    <div class="container"><div class="left">优先级</div><el-input class="inputR" v-model="input6" placeholder="请输入内容"></el-input></div>

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
import { addMenu,getPermissions,editMenu } from '@/api/auth'

export default {
  name: 'Menuabc',
  data() {
    return {
      menu:'',
      menu1List:[],
      input1: '',
      // input2: '',
      // input3: '',
      // input4: '',
      // input5: '',
      input6: '',
      permission: '',
      parentId: '',
      permissionList:[]
    };
  },

  props: ['pointer'],

  watch: {
   
  },

  mounted() {
    console.log('this.optionsAPK == ');
    this.parentId = 0;
    if(this.pointer.item){
      this.parentId = this.pointer.item.parentId;
    }

    this.getPermissions(this.parentId);
    if(this.pointer.item){
      var item = this.pointer.item;
      this.menu = item.parentId;
      this.input1 = item.name;
      // this.input2 = item.icon;
      // this.input3 = item.path;
      // this.input4 = item.component;
      // this.input5 = item.redirect;
      this.input6 = item.sort;
      this.permission = item.permission;
    }

    //初始化赋值不需要监听menu，用户手动变更的时候才开始监听
    this.$watch('menu', function(newValue, oldValue){
      this.getPermissions(newValue);
      this.permission = '';
    })
  },
  methods: {
    handleEdit(){
        var param = {
          name: this.input1,
          // icon: this.input2,
          // path: this.input3,
          // component: this.input4,
          // redirect: this.input5,
          sort: this.input6,
          type: 0,
          // permission: 'static:view'
          permission: this.permission
        }

        //一级菜单
        if(this.pointer.type == 1){
          param.parentId = 0;
        }else if(this.pointer.type == 2){
          param.parentId = this.menu;
        }
        var fn = addMenu;
        var message = 'MenuAdd';
        if(this.pointer.option == 'edit'){
          fn = editMenu;
          message = 'MenuEdit';
          param.menuId = this.pointer.item.menuId;
        }

        fn(param).then((resp)=>{
            this.$EventBus.$emit(message);
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
