<template>
  <div class="app-container" style="display: flex;align-items: center;">
    <div id="message" style="margin-bottom: 1em;">
      <OBJECT id="activex" WIDTH="0" HEIGHT="0" CLASSID="clsid:f81c6df9-8b37-4550-a050-b2551fa531db">
        <span class="color1">您的浏览器不支持ActiveX控件，请使用IE11浏览器！</span>
      </OBJECT>
      <el-button @click="changeCar(7)" type="success">七号车播放</el-button>
      <el-button @click="changeCar(10)" type="success">十号车播放</el-button>
      <el-button @click="release" type="danger">结束</el-button>

      <!--<input v-model="rtsp" width="1000px" placeholder="请输入rtsp视频流地址" style="display: inline"></input>-->
      <!--<el-button @click="init" type="success">开始</el-button>-->
      <!--<el-button @click="release" type="danger">结束</el-button>-->
      <!--<span style="margin-left: 1em;" class="color1">播放器状态：{{message}}</span>-->
      <!--<span style="margin-left: 1em;" class="color1">视频流数据：{{activexMsg}}</span>-->
    </div>
    <div style="display: flex;justify-content: center;">
      <!--<el-row type="flex" justify="center" class="filter-container" style="margin-top: 1em;" >-->
      <!--<el-select class="filter-item" style="margin-right: 2em;" v-model="value" placeholder="请选择作弊类型">-->
      <!--<el-option-->
      <!--v-for="item in options"-->
      <!--:key="item.value"-->
      <!--:label="item.label"-->
      <!--:value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <div class="filter-container" style="display: flex;justify-content:center; flex-flow: column nowrap; margin-right: 20px;">
        <el-button class="filter-item" style="margin-left:10px;width:150px;" type="danger" @click="recordVideo(0)" :loading="loading[0]">
          主动协助
        </el-button>
        <el-button class="filter-item" style="width:150px;" type="danger" @click="recordVideo(2)" :loading="loading[2]">
          手势
        </el-button>
        <el-button class="filter-item" style="width:150px;" type="danger" @click="recordVideo(1)" :loading="loading[1]">
          讲话
        </el-button>
        <el-button class="filter-item" style="width:150px;" type="danger" @click="recordVideo(3)" :loading="loading[3]">
          异常音
        </el-button>
      </div>

      <!--</el-row>-->
      <div
        v-loading="atxloading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="stage border">
        <canvas id="canvasImg" width="640" height="960">您的浏览器不支持 画布。</canvas>
      </div>
    </div>


  </div>
</template>

<script>
  import { startRecordVideo } from '@/api/cheat'

  export default {
    name: "start",
    data(){
      return {
        rtsp:'rtsp://192.168.51.10:8554/exammonitor2',

        activex: {},
        axBuffer: {}, //视频缓存
        ctImg: {}, //canvas
        playTimer: '', //播放的定时器
        checkTimer: '',  //检测定时器

        image: new Image(),
        // frame: 100,  //画布的刷新间隔 帧率是 1000/frame
        // timestamp: -1,  //当前时间戳   该时间戳是 被刷新时间约分过的

        //消息
        activexMsg: '关闭',
        message: '请点击开始',

        atxloading:false,

        loading:{
          1 : false,
          2 : false,
          3 : false,
          4 : false
        },
      }
    },
    mounted() {
      this.initDraw()
      // this.drawLine(this.p)
    },
    methods:
      {
        init() { //开始
          if (this.status === 1) return
          this.status = 1

          this.atxloading = 1

          // this.message = '初始化视频流!'
          this.initActivex()
          this.ctImg.clearRect(0, 0, 640, 960)
          this.axBuffer = {}
          // this.timestamp = -1
          //开始播放
          this.playTimer = setInterval(this.play, this.frame)
        },
        release() { //结束
          if (this.status === 0) return
          this.status = 0

          this.atxloading = 0

          // this.message = '播放结束'

          this.activeClose()
          this.ctImg.clearRect(0, 0, 640, 960)
          this.axBuffer = {}
          // this.timestamp = -1
          clearInterval(this.playTimer)
        },
        changeCar(number){
          // console.log(number)
          if(number === 7){
            this.rtsp = 'rtsp://192.168.51.7:8554/exammonitor2'
            // this.release()
            this.init()
          }else if(number === 10){
            this.rtsp = 'rtsp://192.168.51.10:8554/exammonitor2'
            // this.release()
            this.init()
          }
        },
        initActivex() {  //初始化activex控件
          this.activex = document.getElementById('activex')
          this.activex.AttachEvent('ImgCallBack', this.AxImgCallBack) //注册activex事件
          this.activex.AttachEvent('UrlConState', this.AxUrlConState) //注册activex事件
          this.activeInit()
        },
        activeInit(){
          this.activex.on_Play_slot(this.rtsp)
        },
        activeClose() {
          // this.activexMsg = '关闭'
          this.activex.on_Close_slot()
        },
        AxImgCallBack(x, y, z, s) {
          // this.activexMsg = '接受数据长度：' + z
          // this.axBuffer[Math.floor((x * 1000 + y) / this.frame)] = s
          this.axBuffer = s
        },
        AxUrlConState(s) {
          if (s === 1) {
            // this.activexMsg = '连接成功'
            this.atxloading = 0
            this.$message({
              message: '视频流连接成功',
              type: 'success'
            });
          } else{
            if(this.status === 1)
            {
              //重新连接
              console.log('重新连接atx')
              this.atxloading = 1
              setTimeout(this.activeInit,1000)
            }
          }
        },

        play() { //开始播放
          //开始播放
          // if (this.timestamp === -1) return
          // this.message = '播放中'

          if (this.axBuffer) {
            this.drawImg()
          }
        },
        // 初始化绘制信息
        initDraw() { // 初始化画布
          let canvasImg = document.getElementById('canvasImg')
          this.ctImg = canvasImg.getContext('2d')
        },
        drawImg() { //画一张图片
          this.image.src = 'data:image/png;base64,' + this.axBuffer
          this.image.onload = () => { //加载完成，不然加载有间隔会频闪
            this.ctImg.clearRect(0, 0, 640, 960)
            this.ctImg.drawImage(this.image, 0, 0)
            // console.log('删除' + timestamp + '图片')
            this.axBuffer = null
          }
        },

        recordVideo(type)
        {
          this.loading[type] = true
          startRecordVideo({cheatType:type}).then(response => {
            this.loading[type] = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        }
      }
  }
</script>

<style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
  }
  .border {
    border: 2px solid rgb(76, 103, 145);
    border-radius: 5px;
  }
  .stage {
    width: 640px;
    height: 960px;
    position: relative;
    flex-shrink: 0;
  }
</style>
