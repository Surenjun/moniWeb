<template>
  <div class="pop">
    <div class="elInputContainer">
      <div class="info">
        名称：
      </div>
      <el-input class="elInput" placeholder="请输项目名称" prefix-icon="el-icon-search" v-model="projectName">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        编码：
      </div>
      <el-input class="elInput" placeholder="请输入项目编码" prefix-icon="el-icon-search" v-model="projectCode">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        完整编码：
      </div>
      <el-input class="elInput" placeholder="请输入项目完整编码" prefix-icon="el-icon-search" v-model="sourceCode">
      </el-input>
    </div>
    <div class="elInputContainer">
      <div class="info">
        车辆类型：
      </div>
      <el-select class="elSelect" v-model="type" placeholder="请选择">
        <el-option v-for="item in options0" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="elInputContainer">
      <div class="info">
        考试科目：
      </div>
      <el-select class="elSelect" v-model="subject" placeholder="请选择">
        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="elInputContainer">
      <div class="info">
        备注:
      </div>
      <el-input
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
import { examProjectAdd, examProjectUpdate } from '@/api/rule'
export default {
  data() {
    return {
      projectName: '',
      projectCode: '',
      sourceCode: '',
      type: '',
      subject: '',
      remark: '',
      options0: [{
        value: '1',
        label: '小车'
      }, {
        value: '2',
        label: '大车'
      }],
      options1: [{
        value: '2',
        label: '科目二'
      }, {
        value: '3',
        label: '科目三'
      }]
    };
  },
  props: ['examRuleInfo'],
  mounted: function(argument) {
    if(this.examRuleInfo){
      this.projectName = this.examRuleInfo.projectName,
      this.projectCode = this.examRuleInfo.projectCode,
      this.sourceCode = this.examRuleInfo.sourceCode,
      this.type = this.examRuleInfo.type,
      this.subject = this.examRuleInfo.subject,
      this.remark = this.examRuleInfo.remark
    }
  },
  methods: {
    handleCar() {

      var FN = examProjectAdd;
      var param = {
        projectName:this.projectName,
        projectCode:this.projectCode,
        sourceCode:this.sourceCode,
        type:this.type,
        subject:this.subject,
        remark:this.remark
      };

      var message = 'addCarSuccess';
      if(this.examRuleInfo){
        FN = examProjectUpdate;
        param.id = this.examRuleInfo.id;
        message = 'updateCarSuccess';
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
