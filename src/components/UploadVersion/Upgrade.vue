<template>
  <div class="upgrade">
    <el-radio-group v-model="radio">
      <el-radio :label="1">测试车</el-radio>
      <el-radio :label="2">正式车</el-radio>
      <el-radio :label="3">全部启用</el-radio>
    </el-radio-group>

    <el-switch class="swichClass"
      v-model="valueSwitch"
      active-text="启用"
      inactive-text="停用">
    </el-switch>
    <el-select v-model="valueApk" class="selectBox" clearable placeholder="请选择安卓包">
      <el-option v-for="item in optionsAPK" :key="item.id" :label="item.packageName" :value="item.packageName">
        <span style="float: left">{{ item && item.packageName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item && item.miniVersionNumber }}</span>
      </el-option>
    </el-select>
    <el-select v-model="valueTx2" class="selectBox" v-show="valueApk" clearable placeholder="请选择Tx2版本">
      <el-option v-for="item in optionsTx2" :key="item.id" :label="item.packageName" :value="item.packageName">
        <span style="float: left">{{ item && item.packageName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item && item.miniVersionNumber }}</span>
      </el-option>
    </el-select>
    <el-select v-model="valueTomDog" class="selectBox" v-show="valueTx2 && valueApk" clearable placeholder="请选择TomDog版本">
      <el-option v-for="item in optionsTomDog" :key="item.id" :label="item.packageName" :value="item.packageName">
        <span style="float: left">{{ item && item.packageName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item && item.miniVersionNumber }}</span>
      </el-option>
    </el-select>
    <el-input class="remark" type="textarea" :rows="2" placeholder="说明" v-model="textarea">
    </el-input>
    <div class="messageBoxButton">
      <el-button v-waves class="filter-item" type="primary" @click="handleUpgrade">
        {{!valueSwitch ? '停用':'启用'}}
      </el-button>
    </div>


    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      append-to-body
      width="30%">
      <span>继续操作？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { configVersion } from '@/api/version'

export default {
  data() {
    return {
      radio: -1,
      valueSwitch: false,
      textarea: '',
      valueApk: '',
      valueTx2: '',
      valueTomDog: '',
      optionsAPK: [],
      optionsTx2: [],
      optionsTomDog: [],
      currentApk: null,
      currentTx2: null,
      currentTomDog: null,
      dialogVisible: false
    };
  },

  props: ['list'],

  watch: {
    valueApk(newValue, oldValue) {
      this.valueTx2 = '';
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].packageName == newValue) {
          this.currentApk = this.list[i];
          break;
        }
      }
      if (this.currentApk) {
        let versionAPK = this.currentApk.versionNumber;
        let versionTx2 = this.currentApk.miniVersionNumber.split('@')[1];
        this.optionsTx2 = this.list.filter((item) => {
          let versionAPKForTx2 = item.miniVersionNumber.split('@')[0];

          // tx2 和 APP的版本号 互相约束
          return item.projectApkType == 1 &&
            versionAPK >= versionAPKForTx2 &&
            item.versionNumber >= versionTx2 &&
            (this.valueSwitch ? (item.status != this.radio) : (item.status == this.radio || item.status == 3));
        })
      }
    },

    valueTx2(newValue, oldValue) {
      this.valueTomDog = '';
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].packageName == newValue) {
          this.currentTx2 = this.list[i];
          break;
        }
      }

      if (this.currentTx2) {
        let versionAPK = this.currentApk.versionNumber;
        let versionTx2 = this.currentTx2.versionNumber;
        let versionTomDog = Math.max(this.currentTx2.miniVersionNumber.split('@')[2],this.currentApk.miniVersionNumber.split('@')[2]);

        this.optionsTomDog = this.list.filter((item) => {
          let versionAPKForTomDog = item.miniVersionNumber.split('@')[0];
          let versionTx2ForTomDog = item.miniVersionNumber.split('@')[1];

          // tx2 ,APP 和TomDog的版本号 互相约束
          return item.projectApkType == 2 &&
            versionAPK >= versionAPKForTomDog &&
            versionTx2 >= versionTx2ForTomDog &&
            item.versionNumber >= versionTomDog &&
            (this.valueSwitch ? (item.status != this.radio) : (item.status == this.radio || item.status == 3));
        })
      }
    },

    valueTomDog(newValue, oldValue){
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].packageName == newValue) {
          this.currentTomDog = this.list[i];
          break;
        }
      }
    },
    radio(newValue, oldValue) {
      this.valueApk = '';
      this.optionsAPK = this.list.filter((item) => {
        if(this.valueSwitch){
            return item.projectApkType == 0 &&
              item.status != this.radio;
        }else {
            return item.projectApkType == 0 &&
              item.status == this.radio || item.status == 3;
        }
      })
    },
    valueSwitch(newValue, oldValue){
      this.valueApk = '';
      this.optionsAPK = this.list.filter((item) => {
        if(this.valueSwitch){
            return item.projectApkType == 0 &&
              item.status != this.radio;
        }else {
            return item.projectApkType == 0 &&
              item.status == this.radio || item.status == 3;
        }
      })
    }
  },

  mounted() {
    console.log('this.optionsAPK == ', this.optionsAPK);
  },
  methods: {

    handleUpgrade() {
      if (!(this.valueApk && this.valueTx2 && this.valueTomDog)) {
        this.$message.success('有包没有选择哦~');
        return;
      }

      this.dialogVisible = true;
    },
    handleClose(){
      this.dialogVisible = false;
      let param = {
        ids: [this.currentApk.id,this.currentTx2.id,this.currentTomDog.id],
        status: this.valueSwitch ? this.radio : 0,
        uploadInstructions: this.textarea
      }

      configVersion(param).then((resp) => {
        this.$message.success(resp.message);
        this.$EventBus.$emit('upgradeSuccess');
      })
    }
  }
};

</script>
<style scoped>
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
