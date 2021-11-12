<template>
  <div class="app-container">
    <div style="margin-bottom: 1em; display: flex;justify-content: center;align-items: center">
      <el-switch
        v-model="openLine"
        style="margin-right: 50px;"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="绘制骨骼"
        inactive-text="关闭骨骼">
      </el-switch>
      <label class="color1">选取录像 </label><input class="color1" type="file" ref="uploadVideo"/>
      <label class="color1">选取文件 </label><input class="color1" type="file" ref="uploadText"/>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="initFile">开始播放</el-button>
    </div>
    <!--    <div class="title">苏ET457-41042519730728101X-20200515111409124.mp4</div>-->
<!--    <div class="title">{{fileName}}</div>-->
    <div id="main">
      <div class="stage" id='videoContainer' :style="{height: videoHeight}">
        <!--style="flex-shrink: 0;position: relative;width:640px;height:960px;"-->
        <video id="video" ref='video' class="video" preload="auto" controls="controls">
          您的浏览器不支持 HTML5 video 标签。
        </video>
        <canvas id="canvasLine" @click="videoPlay()" :style="{left: canvasLeft,width: VideoWidth/2 + 'px'}">您的浏览器不支持画布。</canvas>
      </div>
      <div class="middle">
        <div class="back">
          <div class="color3">车&nbsp速：</div>
          <div style="min-width:50px;" class="color1 font2">{{animatedSpeed}}</div>
          <div class="color3">档&nbsp位：</div>
          <div style="min-width:50px;" class="color1 font2">{{gear}}</div>
          <div class="color3" style="min-width:100px;">发动机转速：</div>
          <div style="min-width:50px;" class="color1 font2">{{rp}}</div>
        </div>
        <div class="back">
          <p class="font4 color3" style="width:160px;">驾驶室异常情况</p>
          <div class="behavior" style="min-width:525px;">
            <div class="behavior4 item color3 font3"><span>主动协助</span></div>
            <div class="behavior1 item color3 font3"><span>手势</span></div>
            <div class="behavior3 item color3 font3"><span>讲话</span></div>
            <div class="behavior2 item color3 font3"><span>异常音</span></div>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="stuInfo">
          <div class="row" style="margin-top: 0">
            <!--<span style="text-align: justify;text-align-last: justify;" class="color3">身份证号：</span><span class= "color1">340222199305110015</span>-->
            <span style="text-align: justify;text-align-last: justify;" class="color3">身份证号：</span><span class="color1">{{studentID}}</span>
          </div>
          <div class="row">
            <!--<span class="color3">考试姓名：</span><span style="width:180px;" class="color1">周胜</span>-->
            <span class="color3">考生姓名：</span><span style="width:180px;" class="color1">{{studentName}}</span>
            <span class="color3">考试员号：</span><span class="color1">{{exammonitorName}}</span>
          </div>
          <div class="row">
            <span class="color3">车&nbsp牌&nbsp号<span style="margin-left: 5px;">：</span></span><span style="width:180px;" class="color1">{{carNumber}}</span>
            <span class="color3">考试车型：</span><span class="color1">{{carType}}</span>
            <!--<span class="color3">考试车型：</span><span class="color1">C2</span>-->
          </div>
          <div class="row">
            <span class="color3">开始时间：</span><span class="color1">{{startTime}}</span>
          </div>
          <div class="row">
            <span class="color1">考试项目：{{examName}}</span>
          </div>
          <div class="row">
            <span class="color1">考试得分：{{score}}</span>
          </div>
          <div class="row" style="margin-bottom: 0">
            <span class="color2">扣分原因：</span><span class="color1">{{deduct}}</span>
          </div>
        </div>
        <div class="optionInfo">
          <img class="s2" :src="require('../../assets/image/optionIcon/lihe.png')" v-show="!lihe">
          <img class="s1" :src="require('../../assets/image/optionIcon/lihe_gl.png')" v-show="lihe">
          <img class="s2" :src="require('../../assets/image/optionIcon/jiaosha.png')" v-show="!jiaosha">
          <img class="s2" :src="require('../../assets/image/optionIcon/jiaosha_gl.png')" v-show="jiaosha">
          <img class="s3" :src="require('../../assets/image/optionIcon/fusha.png')" v-show="!fusha">
          <img class="s3" :src="require('../../assets/image/optionIcon/fusha_gl.png')" v-show="fusha">
          <img class="s4" :src="require('../../assets/image/optionIcon/zuozhuan.png')" v-show="!zuozhuan">
          <img class="s4" :src="require('../../assets/image/optionIcon/zuozhuan_gl.png')" v-show="zuozhuan">
          <img class="s5" :src="require('../../assets/image/optionIcon/youzhuan.png')" v-show="!youzhuan">
          <img class="s5" :src="require('../../assets/image/optionIcon/youzhuan_gl.png')" v-show="youzhuan">
          <img class="s6" :src="require('../../assets/image/optionIcon/shuangshan.png')" v-show="!shuangshan">
          <img class="s6" :src="require('../../assets/image/optionIcon/shuangshan_gl.png')" v-show="shuangshan">
          <img class="s7" :src="require('../../assets/image/optionIcon/jinguangdeng.png')" v-show="!jinguangdeng">
          <img class="s7" :src="require('../../assets/image/optionIcon/jinguangdeng_gl.png')" v-show="jinguangdeng">
          <img class="s8" :src="require('../../assets/image/optionIcon/yuanguangdeng.png')" v-show="!yuanguangdeng">
          <img class="s8" :src="require('../../assets/image/optionIcon/yuanguangdeng_gl.png')" v-show="yuanguangdeng">
          <img class="s9" :src="require('../../assets/image/optionIcon/shikuandeng.png')" v-show="!shikuandeng">
          <img class="s9" :src="require('../../assets/image/optionIcon/shikuandeng_gl.png')" v-show="shikuandeng">
          <img class="s10" :src="require('../../assets/image/optionIcon/anquandai.png')" v-show="anquandai">
          <img class="s10" :src="require('../../assets/image/optionIcon/anquandai_gl.png')" v-show="!anquandai">
          <img class="s11" :src="require('../../assets/image/optionIcon/chemen.png')" v-show="!chemen">
          <img class="s11" :src="require('../../assets/image/optionIcon/chemen_gl.png')" v-show="chemen">
          <img class="s12" :src="require('../../assets/image/optionIcon/shousha.png')" v-show="!shousha">
          <img class="s12" :src="require('../../assets/image/optionIcon/shousha_gl.png')" v-show="shousha">
        </div>
        <div class="changeStatus">
          <el-checkbox-group v-model="checkList">
            <el-checkbox class="color1" label="0">主动协助</el-checkbox>
            <el-checkbox class="color1" label="1">讲话</el-checkbox>
            <el-checkbox class="color1" label="2">手势</el-checkbox>
            <el-checkbox class="color1" label="3">异常音</el-checkbox>
          </el-checkbox-group>
          <el-button class="filter-item" type="danger" @click="cheat" :loading="cheatLoading">
            疑似作弊
          </el-button>
          <el-button class="filter-item" type="success" @click="normal" :loading="normalLoading">
            正常
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getSignalInfo, getExamInfoDetail, updateExamInfoDetail, getProjectAndMarkRule } from '@/api/cheat'
  export default {
    name: "videoTest",
    data() {
      return {
        examDesc: {},
        cheatDesc: {},

        lihe: 0,
        jiaosha: 0,
        fusha: 0,
        zuozhuan: 0,
        youzhuan: 0,
        shuangshan: 0,
        jinguangdeng: 0,
        yuanguangdeng: 0,
        shikuandeng: 0,
        anquandai: 0,
        chemen: 0,
        shousha: 0,

        //info
        studentID: '',
        studentName: '',
        exammonitorName: '',
        carType: '',
        carNumber: '',
        startTime: '',
        examName: '',
        score: '',
        deduct: '',
        fileName: '',

        speed: 0, //速度
        tweenedSpeed: 0,
        rp: 0, //转速
        tweenedRp: 0,
        gear: 0, //档位

        //对象
        video: {}, //video
        ctLine: {}, //canvas
        playTimer: '', //播放的定时器
        ajaxTimer: '', //轮询定时器

        timestamp: -1,
        openLine: true,

        guestureMap: {},
        obdMap: {},
        cheatMap: {},

        url: '',

        checkList: [],
        loading: 1,
        cheatLoading: false,
        normalLoading: false,
        canvasLeft: '',
        videoHeight: '0'
      }
    },
    computed: {
      animatedSpeed: function() {
        return this.tweenedSpeed.toFixed(0);
      },
      // animatedRp: function () {
      //   return this.tweenedRp.toFixed(0);
      // }

      VideoWidth() {
        return this.videoHeight?parseFloat(this.videoHeight)*(960/360):0;
      },

      sidebarOpened () {
        return this.$store.state.app.sidebar.opened;　　//需要监听的数据
      }
    },
    watch: {
      speed: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedSpeed: newValue });
      },
      // rp: function (newValue) {
      //   TweenLite.to(this.$data, 1, {tweenedRp: newValue});
      // }
      sidebarOpened: function (nv) {
        //侧边栏展开
        if (nv) {
          let VideoDivwidth = document.getElementById('videoContainer').offsetWidth - 156;
          this.canvasLeft = VideoDivwidth/2 - this.VideoWidth/2 + 'px'
        } else {
          let VideoDivwidth = document.getElementById('videoContainer').offsetWidth + 156;
          this.canvasLeft = VideoDivwidth/2 - this.VideoWidth/2 + 'px'
        }
      }
    },
    created() {
      console.log('创建页面')
      // this.onKeyEvent()
      // this.initFile()
    },
    beforeDestroy() {
      console.log('预备销毁页面')
      // this.destroyKeyEvent()
      // clearInterval(this.ajaxTimer)
      // this.endPlay()
    },
    destroyed() {
      clearInterval(this.ajaxTimer);
      this.endPlay()
    },
    mounted: function() {
      // var width = document.getElementById('videoContainer').offsetWidth;
      // var height = 360 / 960 * width;
      // document.getElementById('videoContainer').style.height = height + 'px';

      // console.log(height);


      this.loading = 1
      // this.ajaxTimer = setInterval(this.request, 1000)
      this.getDesc();
      this.$nextTick(() => {
        this.initVideoLayout()
      })
    },
    methods: {
      //初始化视频和画布布局
      initVideoLayout() {
        let wH = document.body.offsetHeight;
        let vH = wH - 50 -34 - 18 - 50 - document.getElementsByClassName('optionInfo')[0].offsetHeight - 40;
        if (vH>0) {
          this.videoHeight = vH + 'px'
        } else {
          this.videoHeight = '0'
        }
        let VideoDivwidth = document.getElementById('videoContainer').offsetWidth;
        this.canvasLeft = VideoDivwidth/2 - this.VideoWidth/2 + 'px'
      },

      getDesc() {
        getProjectAndMarkRule().then(response => {
          if (response.data.data.examProjects.length > 0) {
            var examPro = response.data.data.examProjects;
            for (var i = 0; i < examPro.length; i++) {
              this.examDesc[examPro[i].djgProjectCode] = examPro[i].projectName;
            }
          }

          if (response.data.data.markRules.length > 0) {
            var markRules = response.data.data.markRules;
            for (var i = 0; i < markRules.length; i++) {
              this.cheatDesc[markRules[i].itemno + '.' + markRules[i].markserial] = markRules[i].markdepend;
            }
          }
        })
      },
      //加载视频和文件数据
      initFile(){
        // console.log(this.$refs.uploadVideo.files)
        // console.log(this.$refs.uploadText.files)
// return;
        if(this.$refs.uploadVideo.files.length === 0) {
          alert('请添加视频')
          return
        }
        if(this.$refs.uploadText.files.length === 0) {
          alert('请添加文件')
          return
        }
        let fileVideo = this.$refs.uploadVideo.files[0];
        this.url = URL.createObjectURL(fileVideo);

        // let fileVoice = this.$refs.uploadVideo_o.files[0];
        // this.url_o = URL.createObjectURL(fileVoice);

        let reader = new FileReader();//新建一个FileReader
        reader.readAsText(this.$refs.uploadText.files[0], "UTF-8");//读取文件
        reader.onload = this.readeronload
      },
      readeronload(evt){
        let re = JSON.parse(evt.target.result)
        console.log(re)
        this.timestamp = Math.floor(re.startTime/100)

        let guestureMap = re.guestureMap
        let obdMap = re.obdMap
        let cheatMap = re.cheatMap

        if(guestureMap)
        {
          //处理姿态数据
          let keyarr1 = Object.keys(guestureMap)
          let l1 = keyarr1.length
          for(let i=0;i<l1;i++)
          {
            this.guestureMap[Math.floor(keyarr1[i]/100)] = guestureMap[keyarr1[i]]
          }
        }

        if(obdMap)
        {
          //处理obd数据
          let keyarr2 = Object.keys(obdMap)
          let l2 = keyarr2.length
          for(let i=0;i<l2;i++)
          {
            this.obdMap[Math.floor(keyarr2[i]/100)] = obdMap[keyarr2[i]]
          }
        }

        if(cheatMap)
        {
          //处理作弊数据
          let keyarr3 = Object.keys(cheatMap)
          let l3 = keyarr3.length
          for(let i=0;i<l3;i++)
          {
            this.cheatMap[Math.floor(keyarr3[i]/100)] = cheatMap[keyarr3[i]]
          }
          // console.log(this.cheatMap)
        }

        //开始初始化视频
        this.initDraw();
        this.initVideo()
      },

      initVideo() {
        this.video = document.getElementById('video');
        this.video.onplay = this.startPlay
        this.video.onpause = this.endPlay
        this.video.onprogress = function(ev) {
          // console.log(ev);
        }
        this.video.src = this.url
        // console.log(video)
        // this.video.src = "http://47.106.75.159:8080/html/tls.mp4"
      },
      // 初始化绘制信息
      initDraw() { // 初始化画布
        let canvasLine = document.getElementById('canvasLine');
        //  计算画布的宽度
        let width = canvasLine.offsetWidth;
        //  计算画布的高度
        let height = canvasLine.offsetHeight;
        this.ctLine = canvasLine.getContext('2d');
        //  设置宽高
        canvasLine.width = width;
        canvasLine.height = height;
      },
      startPlay() {
        this.playTimer = setInterval(this.refreshData, 100)
      },
      endPlay() {
        console.log('this.playTimer end playTimer== ', this.playTimer);
        clearInterval(this.playTimer)
      },
      videoPlay (){
        if(this.video.paused){
          this.video.play();
        }else {
          this.video.pause()
        }
      },
      drawLine(p) {
        let ct = this.ctLine

        //先整理数据 将p中的点坐标都取整
        if (!p || p == null || p.length == 0) return;

        //计算缩放比例
        let proportion = this.VideoWidth/2/480;

        for (let i = 0; i < p.length; i++) {

          //坐标值是按照 640 * 480 计算， 页面按照480 * 360 计算， 需要等比换算坐标
          // p[i].x = Math.floor(p[i].x * 0.75);
          // p[i].y = Math.floor(p[i].y * 0.75);
          //jun 修改位置
          // p[i].x = Math.floor(p[i].x * 0.5)/proportion;
          p[i].x = Math.floor(p[i].x * 0.75)*proportion*.95;
          p[i].y = Math.floor(p[i].y * 0.75)*proportion;
          p[i].score = Math.floor(p[i].score)
        }
        let canvasLine = document.getElementById('canvasLine');
        //  计算画布的宽度
        let width = canvasLine.offsetWidth;
        //  计算画布的高度
        let height = canvasLine.offsetHeight;
        canvasLine.width = width;
        canvasLine.height = height;//设置宽高会清空画布
        // ct.clearRect(0, 0, 640, 480)
        ct.lineWidth = 2.5 //线条的宽度

        //draw the man
        if (p[0].x && p[0].y && p[15].x && p[15].y) {
          ct.beginPath()
          ct.strokeStyle = "#bb6564"
          ct.moveTo(p[0].x, p[0].y)
          ct.lineTo(p[15].x, p[15].y)
          ct.stroke()
        }

        if (p[0].x && p[0].y && p[16].x && p[16].y) {
          ct.beginPath()
          ct.strokeStyle = "#bb6564"
          ct.moveTo(p[0].x, p[0].y)
          ct.lineTo(p[16].x, p[16].y)
          ct.stroke()
        }

        if (p[15].x && p[15].y && p[17].x && p[17].y) {
          ct.beginPath()
          ct.strokeStyle = "#bb6564"
          ct.moveTo(p[15].x, p[15].y)
          ct.lineTo(p[17].x, p[17].y)
          ct.stroke()
        }

        if (p[16].x && p[16].y && p[18].x && p[18].y) {
          ct.beginPath()
          ct.strokeStyle = "#bb6564"
          ct.moveTo(p[16].x, p[16].y)
          ct.lineTo(p[18].x, p[18].y)
          ct.stroke()
        }

        if (p[0].x && p[0].y && p[1].x && p[1].y) {
          ct.beginPath()
          ct.strokeStyle = "#bb6564"
          ct.moveTo(p[0].x, p[0].y)
          ct.lineTo(p[1].x, p[1].y)
          ct.stroke()
        }

        if (p[1].x && p[1].y && p[2].x && p[2].y) {
          ct.beginPath()
          ct.strokeStyle = "#f0b631";
          ct.moveTo(p[1].x, p[1].y)
          ct.lineTo(p[2].x, p[2].y)
          ct.stroke()
        }

        if (p[2].x && p[2].y && p[3].x && p[3].y) {
          ct.beginPath()
          ct.strokeStyle = "#f0b631";
          ct.moveTo(p[2].x, p[2].y)
          ct.lineTo(p[3].x, p[3].y)
          ct.stroke()
        }
        if (p[3].x && p[3].y && p[4].x && p[4].y) {
          ct.beginPath()
          ct.strokeStyle = "#f0b631";
          ct.moveTo(p[3].x, p[3].y)
          ct.lineTo(p[4].x, p[4].y)
          ct.stroke()
        }

        if (p[1].x && p[1].y && p[5].x && p[5].y) {
          ct.beginPath()
          ct.strokeStyle = "#e7dac9";
          ct.moveTo(p[1].x, p[1].y)
          ct.lineTo(p[5].x, p[5].y)
          ct.stroke()
        }
        if (p[5].x && p[5].y && p[6].x && p[6].y) {
          ct.beginPath()
          ct.strokeStyle = "#e7dac9";
          ct.moveTo(p[5].x, p[5].y)
          ct.lineTo(p[6].x, p[6].y)
          ct.stroke()
        }
        if (p[6].x && p[6].y && p[7].x && p[7].y) {
          ct.beginPath()
          ct.strokeStyle = "#e7dac9";
          ct.moveTo(p[6].x, p[6].y)
          ct.lineTo(p[7].x, p[7].y)
          ct.stroke()
        }

        if (p[1].x && p[1].y && p[8].x && p[8].y) {
          ct.beginPath()
          ct.strokeStyle = "#bb6564"
          ct.moveTo(p[1].x, p[1].y)
          ct.lineTo(p[8].x, p[8].y)
          ct.stroke()
        }

        if (p[8].x && p[8].y && p[9].x && p[9].y) {
          ct.beginPath()
          ct.strokeStyle = "#00ff00";
          ct.moveTo(p[8].x, p[8].y)
          ct.lineTo(p[9].x, p[9].y)
          ct.stroke()
        }
        if (p[9].x && p[9].y && p[10].x && p[10].y) {
          ct.beginPath()
          ct.strokeStyle = "#f55066";
          ct.moveTo(p[9].x, p[9].y)
          ct.lineTo(p[10].x, p[10].y)
          ct.stroke()
        }
        // if (p[10].x && p[10].y && p[11].x && p[11].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#f55066";
        //   ct.moveTo(p[10].x, p[10].y)
        //   ct.lineTo(p[11].x, p[11].y)
        //   ct.stroke()
        // }
        // if (p[11].x && p[11].y && p[24].x && p[24].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#f55066";
        //   ct.moveTo(p[11].x, p[11].y)
        //   ct.lineTo(p[24].x, p[24].y)
        //   ct.stroke()
        // }
        // if (p[11].x && p[11].y && p[22].x && p[22].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#f55066";
        //   ct.moveTo(p[11].x, p[11].y)
        //   ct.lineTo(p[22].x, p[22].y)
        //   ct.stroke()
        // }
        // if (p[22].x && p[22].y && p[23].x && p[23].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#f55066";
        //   ct.moveTo(p[22].x, p[22].y)
        //   ct.lineTo(p[23].x, p[23].y)
        //   ct.stroke()
        // }

        if (p[8].x && p[8].y && p[12].x && p[12].y) {
          ct.beginPath()
          ct.strokeStyle = "#0000ff";
          ct.moveTo(p[8].x, p[8].y)
          ct.lineTo(p[12].x, p[12].y)
          ct.stroke()
        }
        if (p[12].x && p[12].y && p[13].x && p[13].y) {
          ct.beginPath()
          ct.strokeStyle = "#0000ff";
          ct.moveTo(p[12].x, p[12].y)
          ct.lineTo(p[13].x, p[13].y)
          ct.stroke()
        }
        // if (p[13].x && p[13].y && p[14].x && p[14].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#0000ff";
        //   ct.moveTo(p[13].x, p[13].y)
        //   ct.lineTo(p[14].x, p[14].y)
        //   ct.stroke()
        // }
        // if (p[14].x && p[14].y && p[21].x && p[21].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#0000ff";
        //   ct.moveTo(p[14].x, p[14].y)
        //   ct.lineTo(p[21].x, p[21].y)
        //   ct.stroke()
        // }
        // if (p[14].x && p[14].y && p[19].x && p[19].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#0000ff";
        //   ct.moveTo(p[14].x, p[14].y)
        //   ct.lineTo(p[19].x, p[19].y)
        //   ct.stroke()
        // }
        // if (p[19].x && p[19].y && p[20].x && p[20].y) {
        //   ct.beginPath()
        //   ct.strokeStyle = "#0000ff";
        //   ct.moveTo(p[19].x, p[19].y)
        //   ct.lineTo(p[20].x, p[20].y)
        //   ct.stroke()
        // }
      },
      //监听键盘事件
      onKeyEvent() {
        var _this = this;
        // document.onkeydown = function(e) {
        //   let key = window.event.keyCode;
        //   if(e.keyCode == 65){
        //     console.log('你按下了A')
        //     _this.animateCSS('.behavior4','flash')
        //   }
        //   if(e.keyCode == 83){
        //     console.log('你按下了S')
        //     _this.animateCSS('.behavior1','flash')
        //   }
        //   if(e.keyCode == 68){
        //     console.log('你按下了D')
        //     _this.animateCSS('.behavior3','flash')
        //   }
        //   if(e.keyCode == 70){
        //     console.log('你按下了F')
        //     _this.animateCSS('.behavior2','flash')
        //   }
        //   if(e.keyCode == 71){
        //     console.log('你按下了G')
        //     // _this.animateCSS('.behavior4','flash')
        //     if(_this.fusha === 1) _this.fusha = 0
        //     else _this.fusha = 1
        //   }
        // };
      },
      destroyKeyEvent() {
        document.onkeydown = undefined
      },
      refreshData() { //刷新数据
        let currentTime = Number(this.timestamp) + video.currentTime.toFixed(1) * 10;

        let guestureMap = this.guestureMap[currentTime]
        let obdMap = this.obdMap[currentTime]
        let cheatMaps = [this.cheatMap[currentTime - 100], this.cheatMap[currentTime], this.cheatMap[currentTime + 100]];

        // console.log(Number(this.timestamp) , currentTime.toFixed(1) * 10);
        // console.log('guestureMap == ', guestureMap);
        // console.log('obdMap == ', obdMap);
        // console.log('obdMap == ', obdMap);
        //开启骨骼
        if (this.openLine) {
          // console.log('刷新骨骼')
          if (guestureMap) this.drawLine(JSON.parse(JSON.stringify(guestureMap.points)));
        } else {
          let canvasLine = document.getElementById('canvasLine');
          //  计算画布的宽度
          let width = canvasLine.offsetWidth;
          //  计算画布的高度
          let height = canvasLine.offsetHeight;
          canvasLine.width = width;
          canvasLine.height = height;//设置宽高会清空画布
          // this.ctLine.clearRect(0, 0, 640, 480)
        }

        if (obdMap) {
          // console.log('刷新数据')
          let sign = obdMap.devicesInfo
          if (sign) {
            if (this.zuozhuan !== Number(sign.substr(0, 1))) this.zuozhuan = Number(sign.substr(0, 1))
            if (this.youzhuan !== Number(sign.substr(1, 1))) this.youzhuan = Number(sign.substr(1, 1))
            if (this.shuangshan !== Number(sign.substr(2, 1))) this.shuangshan = Number(sign.substr(2, 1))
            if (this.yuanguangdeng !== Number(sign.substr(3, 1))) this.yuanguangdeng = Number(sign.substr(3, 1))
            if (this.jinguangdeng !== Number(sign.substr(4, 1))) this.jinguangdeng = Number(sign.substr(4, 1))
            if (this.shikuandeng !== Number(sign.substr(5, 1))) this.shikuandeng = Number(sign.substr(5, 1))
            if (this.lihe !== Number(sign.substr(8, 1))) this.lihe = Number(sign.substr(8, 1))
            if (this.jiaosha !== Number(sign.substr(9, 1))) this.jiaosha = Number(sign.substr(9, 1))
            if (this.shousha !== Number(sign.substr(10, 1))) this.shousha = Number(sign.substr(10, 1))
            if (this.fusha !== Number(sign.substr(11, 1))) this.fusha = Number(sign.substr(11, 1))
            if (this.chemen !== Number(sign.substr(13, 1))) this.chemen = Number(sign.substr(13, 1))
            if (this.anquandai !== Number(sign.substr(14, 1))) this.anquandai = Number(sign.substr(14, 1))
            // if (this.gear !== Number(sign.substr(15, 1))) this.gear = parseInt(sign.substr(15, 3), 2)
          }

          this.carType = obdMap.examCarType
          this.carNumber = obdMap.carNumber
          this.studentName = obdMap.studentId
          this.exammonitorName = obdMap.exammonitorName;
          this.studentID = obdMap.studentExamInfo.idCard
          this.startTime = obdMap.studentExamInfo.startTime

          let last = obdMap.deductionIDs.split(';').filter(item => item).pop()
          this.examName = this.examDesc[obdMap.projectId] ? this.examDesc[obdMap.projectId] : ''
          this.deduct = this.cheatDesc[last] ? this.cheatDesc[last] : ''

          this.speed = obdMap.carSpeed ? obdMap.carSpeed : 0
          this.rp = obdMap.engineSpeed ? obdMap.engineSpeed : 0
          this.gear = obdMap.devicesInfoBen.gear ? obdMap.devicesInfoBen.gear : 0

          this.score = obdMap.deductionValue
        }

        // console.log('cheatMap.cheatType == ', cheatMaps);
        for (var i = 0; i < cheatMaps.length; i++) {
          if (cheatMaps[i]) {
            if (cheatMaps[i].cheatType === '2') this.animateCSS('.behavior1', 'flash')
            if (cheatMaps[i].cheatType === '1') this.animateCSS('.behavior2', 'flash')
            if (cheatMaps[i].cheatType === '1') this.animateCSS('.behavior3', 'flash')
            if (cheatMaps[i].cheatType === '0') this.animateCSS('.behavior4', 'flash')
          }
        }
      },
      clearData() {
        this.zuozhuan = 0
        this.youzhuan = 0
        this.shuangshan = 0
        this.yuanguangdeng = 0
        this.jinguangdeng = 0
        this.shikuandeng = 0
        this.lihe = 0
        this.jiaosha = 0
        this.shousha = 0
        this.fusha = 0
        this.chemen = 0
        this.anquandai = 0
        this.gear = 0

        this.carType = ''
        this.carNumber = ''
        this.studentName = ''
        this.studentID = ''
        this.startTime = ''
        this.examName = ''
        this.deduct = ''

        this.speed = 0
        this.rp = 0
      },
      animateCSS(element, animationName, callback) {
        const node = document.querySelector(element)
        node.classList.add('animated')
        node.classList.add(animationName)

        function handleAnimationEnd() {
          node.classList.remove('animated')
          node.classList.remove(animationName)
          node.removeEventListener('animationend', handleAnimationEnd)
          if (typeof callback === 'function') callback()
        }
        node.addEventListener('animationend', handleAnimationEnd)
      },
      cheat() {
        this.cheatLoading = true
        updateExamInfoDetail({ id: this.$route.query.id, type: this.checkList.join(','), handleFlag: 1 }).then(response => {
          this.cheatLoading = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          console.log('$emit("changeSuccess")');
          this.$EventBus.$emit("changeSuccess");
        })
      },
      normal() {
        this.normalLoading = true
        updateExamInfoDetail({ id: this.$route.query.id, handleFlag: 2 }).then(response => {
          this.normalLoading = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          console.log('$emit("changeSuccess")');
          this.$EventBus.$emit("changeSuccess");
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .title {
    color: white;
  }

  /*设置字体*/
  p,
  span {
    font-family: "PingFang SC", "微软雅黑", Arial, sans-serif;
  }

  .font1 {
    font-size: 24px;
  }

  .font2 {
    font-size: 18px;
  }

  .font3 {
    font-size: 16px;
  }

  .font4 {
    font-size: 14px;
  }

  .color1 {
    color: #fff;
  }

  .color2 {
    color: rgb(243, 152, 0);
  }

  .color3 {
    color: #bdc6d2;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    min-height: calc(100vh - 50px - 34px);
    background: #1c2838;
  }

  .border {
    border: 2px solid rgb(76, 103, 145);
    border-radius: 5px;
  }

  .border-red {
    border: 2px solid red;
    border-radius: 5px;
  }

  .row {
    display: flex;
    width: 100%;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  #main {
    /*display: flex;*/
    /*justify-content: center;*/
    /*flex-wrap: nowrap;*/
    width: 100%;
  }

  .stage {
    width: 100%;
    position: relative;
    flex-shrink: 0;

    #video {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1
    }

    #canvasLine {
      width: 50%;
      height: 100%;
      z-index: 2;
      position: absolute;
    }
  }

  .middle {
    display: flex;
    justify-content: space-between;
    background: #0f161f;
    width: 100%;
    height: 50px;

    .back {
      padding: 0px 2%;
      display: flex;
      align-items: center;
    }

    .behavior .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 30px;
      margin: 15px;
      background: #334866;
      border-radius: 5px;
    }
  }

  .info {
    background: #141d29;
    display: flex;
    justify-content: space-between;
    flex-basis: 700px;
    flex-shrink: 0;
    padding: .75rem 0;
    width: 100%;
    .stuInfo {
      width: 50%;
      padding-left: 2%;
      padding-top: 1rem;
      font-size: 14px;
    }

    .optionInfo {
      width: 30%;
      display: flex;
      justify-content: space-between;
      background: #0f161f;
      flex-wrap: wrap;
      padding: 1%;

      img {
        width: 14%;
        margin: 4%;
      }
    }

    .changeStatus {
      width: 20%;
      padding: 1rem;
      text-align: center;
    }
  }



  .behavior {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }



  .flash {
    background-color: #f39800;
    border-radius: 5px;
    color: #fff;

    animation-duration: 2s;
    animation-iteration-count: 2;
  }

  .el-switch__label * {
    color: #fff;
  }

</style>
<style>
  .changeStatus .el-checkbox-group {
    text-align: left;
  }

  .changeStatus .el-checkbox {
    display: block;
    margin: 1.25rem;
  }

</style>
