<template>
    <div class="app-container">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
          prop="url"
          label="URL"
          :rules="[
      { required: true, message: '请输入URL地址', trigger: 'blur' },
      { type: 'url', message: '请输入正确的URL地址', trigger: ['blur', 'change'] }
    ]"
        >
          <el-input v-model="dynamicValidateForm.url"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :label="'配置' + index"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="{
      required: true, message: '配置不能为空', trigger: 'blur'
    }"
        >
          <el-input v-model="domain.value"></el-input><el-button class="del-btn" @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
          <el-button @click="addDomain">新增配置</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
    export default {
      name: "testUrl",
      data() {
        return {
          dynamicValidateForm: {
            domains: [{
              value: ''
            }],
            url: ''
          }
        };
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        removeDomain(item) {
          var index = this.dynamicValidateForm.domains.indexOf(item)
          if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1)
          }
        },
        addDomain() {
          this.dynamicValidateForm.domains.push({
            value: '',
            key: Date.now()
          });
        }
      }
    }
</script>

<style scoped lang="scss">
  .demo-dynamic{
    width: 600px;
    >>>.el-input{
      width: 300px;
    }
    .del-btn{
      margin-left: 30px;
    }
  }
</style>
