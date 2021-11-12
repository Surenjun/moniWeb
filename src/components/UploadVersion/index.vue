<template>
  <div class="upload">
    <el-upload
      class="upload"
      ref="upload"
      action=""
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-radio-group v-model="radio">
        <el-radio :label="3">安卓APK</el-radio>
        <el-radio :label="6">TX2</el-radio>
        <el-radio :label="9">TomDog</el-radio>
      </el-radio-group>
    </el-upload>

    <el-input class="remark"
      type="textarea"
      :rows="2"
      placeholder="说明"
      v-model="textarea">
    </el-input>

    <div class="uploadButton">
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    </div>
  </div>
</template>
<script>
  import { uploadFile } from '@/api/version'
  export default {
    data() {
      return {
        fileList: [],
        radio: 0,
        file: null,
        textarea: ''
      };
    },
    methods: {
      submitUpload() {
        if(!this.file){
          this.$message.warning(`请选择文件先`);
        }

        if(!this.radio === 0){
          this.$message.warning(`请选择文件类型`);
        }

        this.$refs.upload.submit();
      },

      handleRemove(file, fileList) {
        console.log(file, fileList);
      },

      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件`);
      },

      beforeUpload(file){
        this.file = file;
        this.fileList.push
          var fileName=file.name.substring(file.name.lastIndexOf('.')+1);
          if(fileName!='zip'){
              this.uploadTemplateDialog=false;
              this.$message({
                  type:'error',
                  showClose:true,
                  duration:3000,
                  message:'文件类型不是zip文件!'
              });
              return false;
          }

          //读取文件大小
          var fileSize=file.size;
          console.log(fileSize);
          if(fileSize>1048576 * 100 * 5){
              this.uploadTemplateDialog=false;
              this.$message({
                  type:'error',
                  showClose:true,
                  duration:3000,
                  message:'文件大于500M!'
              });
              return false;
          }

          this.downloadLoading=this.$loading({
              lock:true,
              text:'数据导入中...',
              spinner:'el-icon-loading',
              background:'rgba(0,0,0,0.7)'
          });

          let fd=new FormData();
          fd.append('file',file);
          fd.append('projectApkType', this.radio/3 - 1);
          fd.append('remark', this.textarea)
          uploadFile(fd).then(resp => {
              this.$message.success(resp.message);
              if(this.downloadLoading) this.downloadLoading.close();
              this.$EventBus.$emit('uploadSucess');

          }).catch(error=> {
              this.$message({
                  type:'error',
                  showClose:true,
                  duration:60000,
                  message:'请求失败! error:'+error.message
              });

              if(this.downloadLoading) this.downloadLoading.close()
          })
          return false;
      }
    }
  }
</script>
<style scoped>
  .uploadButton{
    text-align: center;
    margin-top: 40px;
  }
  .remark{
    margin-top: 15px;
  }
</style>
