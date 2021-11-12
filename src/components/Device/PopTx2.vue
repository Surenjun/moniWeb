<template>
  <div class="pop">
    <div class="elInputContainer">
      <div class="info">
        绑定车牌号：
      </div>
      <el-input class="elInput" placeholder="请输入车牌号" prefix-icon="el-icon-search" v-model="carCode">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        设备名称：
      </div>
      <el-input class="elInput" placeholder="请输入设备名称" prefix-icon="el-icon-search" v-model="deviceName">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        设备状态：
      </div>
      <el-switch class="swichClass"
      v-model="valueSwitch"
      active-text="启用"
      inactive-text="停用">
    </el-switch>
    </div>
    <div class="buttonContainer">
      <el-button class="filter-item" type="primary" @click="handleCar">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
import { updateTx2 } from '@/api/device'
export default {
  data() {
    return {
      carCode: '',
      deviceName: '',
      valueSwitch: ''
    };
  },
  props: ['terminalInfo'],
  mounted: function(argument) {
    if(this.terminalInfo){
      this.carCode = this.terminalInfo.carCode;
      this.deviceName = this.terminalInfo.deviceName;
      this.valueSwitch = this.terminalInfo.useStatus == 0 ? true:false
    }
  },
  methods: {
    handleCar() {

       var param = {
        carCode: this.carCode,
        deviceName: this.deviceName,
        id: this.terminalInfo.id,
        carId: this.terminalInfo.carId,
        useStatus: this.valueSwitch ? 0 : 1
      };

      if(this.carCode == ''){
        param.bindStatus = 0;
      }

      updateTx2(param).then(response => {
        this.$EventBus.$emit('updateTx2Success');
        this.$message({
          type: 'success',
          message: '更新设备信息成功'
        });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '操作失败'
        });
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
  width: 20%;
}

.elInput,
.elSelect {
  width: 75%;
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
