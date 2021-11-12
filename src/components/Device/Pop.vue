<template>
  <div class="pop">
    <div class="elInputContainer">
      <div class="info">
        车牌号：
      </div>
      <el-input class="elInput" placeholder="请输入车牌号" prefix-icon="el-icon-search" v-model="carCode">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        考车编号：
      </div>
      <el-input class="elInput" placeholder="请输入考车编号" prefix-icon="el-icon-search" v-model="carNo">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        车辆类型：
      </div>
      <el-select class="elSelect" v-model="carType" placeholder="请选择">
        <el-option v-for="item in options1" :key="item.id" :label="item.code" :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="elInputContainer">
      <div class="info">
        车辆归属:
      </div>
      <el-select class="elSelect" v-model="testType" placeholder="请选择">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="elInputContainer">
      <div class="info">
        车辆状态：
      </div>
      <el-select class="elSelect" v-model="qualityStatus" placeholder="请选择">
        <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="buttonContainer">
      <el-button class="filter-item" type="primary" @click="handleCar">
        确定
      </el-button>
    </div>
  </div>
</template>
<script>
import { addCarInfo,updateCarInfo,getNoPageList } from '@/api/device'
export default {
  data() {
    return {
      carCode: '',
      carNo: '',
      options1: [/*{
        value: '1',
        label: '小车'
      }, {
        value: '2',
        label: '大车'
      }*/],
      options2: [{
        value: '1',
        label: '测试车'
      }, {
        value: '2',
        label: '正式车'
      }],
      options3: [{
        value: '1',
        label: '正常'
      }, {
        value: '2',
        label: '停用'
      }, {
        value: '3',
        label: '异常'
      }, {
        value: '4',
        label: '报废'
      }],
      carType: '',
      testType: '',
      qualityStatus: ''
    };
  },
  props: ['carInfo'],
  created() {
    this.getData()
  },
  mounted: function(argument) {
    if(this.carInfo){
      this.carCode = this.carInfo.carCode;
      this.carNo = this.carInfo.carNo;
      this.carType = this.carInfo.carType;
      this.testType = this.carInfo.testType;
      this.qualityStatus = this.carInfo.qualityStatus;
    }

    console.log(this.carInfo);
  },
  methods: {
    handleCar() {

      var FN = addCarInfo;
      var param = {
        carCode: this.carCode,
        carNo: this.carNo,
        carType: this.carType,
        testType: this.testType,
        qualityStatus: this.qualityStatus,
      };

      var message = 'addCarSuccess';
      var popMessage = '新增车辆成功';
      if(this.carInfo){
        FN = updateCarInfo;
        param.id = this.carInfo.carId;
        message = 'updateCarSuccess';
        popMessage = '修改车辆成功';
      }


      FN(param).then(response => {
        if (response.code !== 0) {
          return this.$message({
            type: 'error',
            message: response.msg||response.message
          });
        }
        this.$EventBus.$emit(message);

        this.$message({
          type: 'success',
          message: popMessage
        });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '操作失败'
        });
      })
    },

    getData() {
      getNoPageList().then(res => {
        console.log(res);
        this.options1 = res.data;
      }).catch(res => {

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
