<template>
  <div class="pop">
    <div class="elInputContainer">
      <div class="info">
        名称：
      </div>
      <el-input class="elInput" placeholder="请输行为规范名称" prefix-icon="el-icon-search" v-model="behaviourName">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        英文名称：
      </div>
      <el-input class="elInput" placeholder="请输行为规范名称" prefix-icon="el-icon-search" v-model="behaviourEnName">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        编码：
      </div>
      <el-input class="elInput" placeholder="请输入行为规范编码" prefix-icon="el-icon-search" v-model="behaviourCode">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        是否判断OBD信号：
      </div>
      <el-switch
        v-model="obdFlag"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </div>
    <div class="elInputContainer">
      <div class="info">
        备注:
      </div>
      <el-input class="elInput"
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="remark">
      </el-input>
    </div>
    <div class="buttonContainer">
      <el-button class="filter-item" type="primary" @click="handleCar">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
import { updateBehaviour,addBehaviour } from '@/api/rule'
export default {
  data() {
    return {
      behaviourName: '',
      behaviourEnName: '',
      behaviourCode: '',
      remark:'',
      obdFlag: false
    };
  },
  props: ['behaviourInfo'],
  mounted: function(argument) {
    if(this.behaviourInfo){
      this.behaviourName = this.behaviourInfo.behaviourName;
      this.behaviourEnName = this.behaviourInfo.behaviourEnName;
      this.behaviourCode = this.behaviourInfo.behaviourCode;
      this.remark = this.behaviourInfo.remark;
      this.obdFlag = this.behaviourInfo.obdFlag=='1'?false:true;
    }

    console.log(this.behaviourInfo);
  },
  methods: {
    handleCar() {

      var FN = addBehaviour;
      var param = {
        behaviourName: this.behaviourName,
        behaviourEnName: this.behaviourEnName,
        behaviourCode: this.behaviourCode,
        remark: this.remark,
        obdFlag: this.obdFlag?'0':'1',
      };

      var message = 'addBehaviourSuccess';
      if(this.behaviourInfo){
        FN = updateBehaviour;
        param.id = this.behaviourInfo.id;
        message = 'updateBehaviourSuccess';
      }else{
        param.ObdFlag = 0;
      }

      FN(param).then(response => {
        this.$EventBus.$emit(message);
      })
    }
  }
}

</script>
<style>
.elInputContainer {
  margin-bottom: 10px;
}

.info {
  display: inline-block;
  width: 15%;
}

.elInput,
.elSelect {
  width: 80%;
}

.buttonContainer {
  width: 100%;
  text-align: center;
  margin-top: 15px;
}

.popBtn {
  margin: auto;
}

.filter-container .filter-item {
  display: block;
  margin-right: 10px;
}

</style>
