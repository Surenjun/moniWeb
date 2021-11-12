<template>
  <div class="pop">
    <div class="elInputContainer">
      <div class="info">
        名称：
      </div>
      <el-input class="elInput" placeholder="请输行为规范名称" prefix-icon="el-icon-search" v-model="obdName">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        英文名称：
      </div>
      <el-input class="elInput" placeholder="请输行为规范名称" prefix-icon="el-icon-search" v-model="obdEnName">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        编码：
      </div>
      <el-input class="elInput" placeholder="请输入行为规范编码" prefix-icon="el-icon-search" v-model="obdCode">
      </el-input>
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
import { addObd, updateObd } from '@/api/rule'
export default {
  data() {
    return {
      obdName: '',
      obdEnName: '',
      obdCode: '',
      remark:''
    };
  },
  props: ['obdInfo'],
  mounted: function(argument) {
    if(this.obdInfo){
      this.obdName = this.obdInfo.obdName;
      this.obdEnName = this.obdInfo.obdEnName;
      this.obdCode = this.obdInfo.obdCode;
      this.remark = this.obdInfo.remark;
    }

    console.log(this.obdInfo);
  },
  methods: {
    handleCar() {

      var FN = addObd;
      var param = {
        obdName: this.obdName,
        obdEnName: this.obdEnName,
        obdCode: this.obdCode,
        remark: this.remark
      };

      var message = 'addObd';
      if(this.obdInfo){
        FN = updateObd;
        param.id = this.obdInfo.id;
        message = 'updateObd';
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
