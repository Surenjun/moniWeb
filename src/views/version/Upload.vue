<template>
  <div class="upload">
    <el-upload
      class="upload"
      ref="upload"
      action=""
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>
  </div>
</template>
<script>
  import { uploadFile } from '@/api/version'
  <script>
  export default {
    data() {
      return {
        fileList: []
      };
    },
    methods: {
      submitUpload(file) {
        // this.$refs.upload.submit();
        console.log("file",file);
        uploadFile().then(response => {
          console.log(response);
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      }
    }
  }
</script>
<style>
  .filter-container{
    display:flex;
  }
  .filter-container .filter-item{
    display: block;
    margin-right: 10px;
  }
</style>
