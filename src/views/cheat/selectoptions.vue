<template>
  <div class="app-container">
    <el-row type="flex" justify="center" class="filter-container" style="margin-top: 1em;" >
      <el-select class="filter-item" style="margin-right: 2em;" v-model="value" placeholder="请选择作弊类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="danger" @click="recordVideo" :loading="loading">
        确认视频
      </el-button>
    </el-row>
  </div>
</template>

<script>
  import { startRecordVideo } from '@/api/cheat'

  export default {
    name: "start",
    data(){
      return {
        loading:false,
        value: '',
        options: [{
          value: '0',
          label: '刹车'
        }, {
          value: '1',
          label: '声音'
        }, {
          value: '2',
          label: '视频'
        }]
      }
    },
    methods:
      {
        recordVideo()
        {
          if(this.value === ''){
            this.$message({
              message: '请选择作弊类型',
              type: 'error'
            })
            return
          }
          this.loading = true
          startRecordVideo({cheatType:this.value}).then(response => {
            this.loading = false
          })
        }
      }
  }
</script>

<style scoped>

</style>
