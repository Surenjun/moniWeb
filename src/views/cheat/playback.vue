<template>
  <div class="app-container" :style="'background:repeat '+ditu+';background-size:cover'">
    <div style="margin-bottom: 1em; display: flex;justify-content: center;align-items: center">
      <!--<input type="button" value="选取视频" onclick="javascript:$('input[name=\'fileVideo\']').click();" />-->
      <!--<input name="fileNameVideo" readonly />-->
      <!--<input type="file" ref="uploadVideo" name="fileVideo" style="display: none;" onchange="javascript:$('input[name=\'fileNameVideo\']').val(this.files[0].name);" />-->

      <!--<input type="button" value="选取文件" onclick="javascript:$('input[name=\'fileText\']').click();" />-->
      <!--<input name="fileNameText" readonly />-->
      <!--<input type="file" ref="uploadText" name="fileText" style="display: none;" onchange="javascript:$('input[name=\'fileNameText\']').val(this.files[0].name);" />-->
      <!--<label class="color1">选取声音录像 </label><input class="color1" type="file" ref="uploadVideo_o"/>-->
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
      <!--<el-upload-->
        <!--ref="uploadVideo"-->
        <!--class="upload-demo color1"-->
        <!--:show-file-list="false"-->
        <!--:multiple="false"-->
        <!--:auto-upload="false"-->
        <!--action="">-->
        <!--<el-button slot="trigger" size="small" type="primary">选取录像</el-button>-->
      <!--</el-upload>-->
      <!--<el-upload-->
        <!--ref="uploadText"-->
        <!--class="upload-demo"-->
        <!--:auto-upload="false"-->
        <!--action="">-->
        <!--<el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
      <!--</el-upload>-->
      <el-button style="margin-left: 10px;" size="small" type="success" @click="initFile">开始播放</el-button>
    </div>

    <div id="main">
      <div class="stage border">
        <video id='video' ref='video' class="video" width="640px" height="960px" style="position: absolute;" preload = "auto" controls="controls" >
          您的浏览器不支持 HTML5 video 标签。
        </video>
        <canvas id="canvasLine" width="640" height="800">您的浏览器不支持画布。</canvas>
      </div>

      <div class="info font1">
        <div class="border" style="padding: 1em;">
          <div class="row" style="margin-top: 0">
            <!--<span style="text-align: justify;text-align-last: justify;" class="color3">身份证号：</span><span class="color1">340222199305110015</span>-->
            <span style="text-align: justify;text-align-last: justify;" class="color3">身份证号：</span><span class="color1">{{studentID}}</span>
          </div>
          <div class="row">
            <!--<span class="color3">考生姓名：</span><span style="width:180px;" class="color1">周胜</span>-->
            <span class="color3">考生姓名：</span><span style="width:180px;" class="color1">{{studentName}}</span>
            <span class="color3">考试员号：</span><span class="color1">{{examnierId}}</span>
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
        <div style="display: flex;justify-content:space-between;">
          <div style="display: flex;flex-flow: column;flex-basis:400px;">
            <div class="back " style="">
              <div class="row">
                <span class="color3">车&nbsp速：</span><span style="width:100px;" class="color1 font2">{{animatedSpeed}}</span>
                <span class="color3">档&nbsp位：</span><span class="color1 font2">{{gear}}</span>
              </div>
              <div class="row" style="margin-bottom: 0">
                <span class="color3">发动机转速：</span><span class="color1 font2">{{animatedRp}}</span>
              </div>
            </div>
            <div class="back">
              <p class="font1 color3" style="text-align: center;">驾驶室异常情况</p>
              <div class="behavior">
                <div class="border behavior4 item color3"><span>主动协助</span></div>
                <div class="border behavior1 item color3"><span>手势</span></div>
                <div class="border behavior3 item color3"><span>讲话</span></div>
                <div class="border behavior2 item color3"><span>异常音</span></div>
              </div>
              <!--<div class="row">-->
              <!--<p class="color3">【手势】</p>-->
              <!--<div class="behavior">-->
              <!--<img :src="require('../../assets/image/optionIcon/FL.png')" style="top:0;left: 0;" v-show="!FL">-->
              <!--<img :src="require('../../assets/image/optionIcon/FL_L.png')" style="top:0;left: 0;" v-show="FL">-->
              <!--<img :src="require('../../assets/image/optionIcon/FR.png')" style="top:0;left: 80px;" v-show="!FR">-->
              <!--<img :src="require('../../assets/image/optionIcon/FR_L.png')" style="top:0;left: 80px;" v-show="FR">-->
              <!--<img :src="require('../../assets/image/optionIcon/G.png')" style="top:0;left: 160px;" v-show="!G">-->
              <!--<img :src="require('../../assets/image/optionIcon/G_L.png')" style="top:0;left: 160px;" v-show="G">-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="row">-->
              <!--<p class="color3">【声音】</p>-->
              <!--<div class="behavior" style="margin-left: 10px;">-->
              <!--<img :src="require('../../assets/image/optionIcon/Vo.png')" style="top:0;left: 0;" v-show="!Vo">-->
              <!--<img :src="require('../../assets/image/optionIcon/Vo_L.png')" style="top:0;left: 0;" v-show="Vo">-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="row color3">-->
              <!--<p class="color3">【刹车】</p>-->
              <!--<div class="behavior" style="margin-left: 10px;">-->
              <!--<img :src="require('../../assets/image/optionIcon/SC.png')" style="top:0;left: 0;" v-show="!SC">-->
              <!--<img :src="require('../../assets/image/optionIcon/SC_L.png')" style="top:0;left: 0;" v-show="SC">-->
              <!--</div>-->
              <!--</div>-->
            </div>
          </div>
          <div class="sign">
            <img class="s1" :src="require('../../assets/image/optionIcon/lihe.png')" v-show="!lihe">
            <img class="s2" :src="require('../../assets/image/optionIcon/jiaosha.png')" v-show="!jiaosha">
            <img class="s3" :src="require('../../assets/image/optionIcon/fusha.png')" v-show="!fusha">
            <img class="s4" :src="require('../../assets/image/optionIcon/zuozhuan.png')" v-show="!zuozhuan">
            <img class="s5" :src="require('../../assets/image/optionIcon/youzhuan.png')" v-show="!youzhuan">
            <img class="s6" :src="require('../../assets/image/optionIcon/shuangshan.png')" v-show="!shuangshan">
            <img class="s7" :src="require('../../assets/image/optionIcon/jinguangdeng.png')" v-show="!jinguangdeng">
            <img class="s8" :src="require('../../assets/image/optionIcon/yuanguangdeng.png')" v-show="!yuanguangdeng">
            <img class="s9" :src="require('../../assets/image/optionIcon/shikuandeng.png')" v-show="!shikuandeng">
            <img class="s10" :src="require('../../assets/image/optionIcon/anquandai.png')" v-show="anquandai">
            <img class="s11" :src="require('../../assets/image/optionIcon/chemen.png')" v-show="!chemen">
            <img class="s12" :src="require('../../assets/image/optionIcon/shousha.png')" v-show="!shousha">

            <img class="s1" :src="require('../../assets/image/optionIcon/lihe_gl.png')" v-show="lihe">
            <img class="s2" :src="require('../../assets/image/optionIcon/jiaosha_gl.png')" v-show="jiaosha">
            <img class="s3" :src="require('../../assets/image/optionIcon/fusha_gl.png')" v-show="fusha">
            <img class="s4" :src="require('../../assets/image/optionIcon/zuozhuan_gl.png')" v-show="zuozhuan">
            <img class="s5" :src="require('../../assets/image/optionIcon/youzhuan_gl.png')" v-show="youzhuan">
            <img class="s6" :src="require('../../assets/image/optionIcon/shuangshan_gl.png')" v-show="shuangshan">
            <img class="s7" :src="require('../../assets/image/optionIcon/jinguangdeng_gl.png')" v-show="jinguangdeng">
            <img class="s8" :src="require('../../assets/image/optionIcon/yuanguangdeng_gl.png')" v-show="yuanguangdeng">
            <img class="s9" :src="require('../../assets/image/optionIcon/shikuandeng_gl.png')" v-show="shikuandeng">
            <img class="s10" :src="require('../../assets/image/optionIcon/anquandai_gl.png')" v-show="!anquandai">
            <img class="s11" :src="require('../../assets/image/optionIcon/chemen_gl.png')" v-show="chemen">
            <img class="s12" :src="require('../../assets/image/optionIcon/shousha_gl.png')" v-show="shousha">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {startRecordVideo, getProjectAndMarkRule} from '@/api/cheat'

  export default {
    name: "start",
    data() {
      return {
        examDesc:{},
        cheatDesc:{},
        ditu: 'url(' + require("../../assets/image/ditu.png") + ')',
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
        carType: '',
        carNumber: '',
        startTime: '',
        examName: '',
        score:'',
        deduct: '',
        examnierId:'',

        speed: 0,    //速度
        tweenedSpeed: 0,
        rp: 0,   //转速
        tweenedRp: 0,
        gear: 0, //档位

        wsip: 'ws://192.168.51.10:9088',
        rtsp: 'rtsp://192.168.51.10:8554/exammonitor2',

        //对象
        video:{},
        video_o:{},
        playTimer: '', //播放的定时器
        openLine:true,

        timestamp:-1,
        guestureMap:{},
        obdMap:{},
        cheatMap:{},
        // wsdata:{},
        url:'',
        // url_o:'',

        loading:false
      }
    },
    computed: {
      animatedSpeed: function () {
        return this.tweenedSpeed.toFixed(0);
      },
      animatedRp: function () {
        return this.tweenedRp.toFixed(0);
      }
    },
    watch: {
      speed: function (newValue) {
        TweenLite.to(this.$data, 0.5, {tweenedSpeed: newValue});
      },
      rp: function (newValue) {
        TweenLite.to(this.$data, 1, {tweenedRp: newValue});
      }
    },
    created() {
      this.onKeyEvent()
      // this.initFile()
    },
    beforeDestroy(){
      console.log('预备销毁页面')
      this.destroyKeyEvent()
    },
    destroyed() {

    },
    mounted: function () {

      this.getDesc();
      this.initDraw()
    },
    methods: {
        getDesc() {
            getProjectAndMarkRule().then(response =>{
                if(response.data.data.examProjects.length > 0){
                    var examPro = response.data.data.examProjects;
                    for(var i =0; i < examPro.length;i++){
                        this.examDesc[examPro[i].djgProjectCode] = examPro[i].projectName;
                    }
                }

                if(response.data.data.markRules.length > 0){
                    var markRules = response.data.data.markRules;
                    for(var i =0; i < markRules.length;i++){
                        this.cheatDesc[markRules[i].itemno + '.' + markRules[i].markserial] = markRules[i].markdepend;
                    }
                }
            })
        },
        initDraw() { // 初始化画布
          let canvasLine = document.getElementById('canvasLine')
          this.ctLine = canvasLine.getContext('2d')
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
          this.initVideo()
        },
        //监听键盘事件
        onKeyEvent(){
          var _this = this;
          document.onkeydown = function(e) {
            let key = window.event.keyCode;
            if(e.keyCode == 65){
              console.log('你按下了A')
              _this.animateCSS('.behavior4','flash')
            }
            if(e.keyCode == 83){
              console.log('你按下了S')
              _this.animateCSS('.behavior1','flash')
            }
            if(e.keyCode == 68){
              console.log('你按下了D')
              _this.animateCSS('.behavior3','flash')
            }
            if(e.keyCode == 70){
              console.log('你按下了F')
              _this.animateCSS('.behavior2','flash')
            }
          };
        },
        destroyKeyEvent(){
          document.onkeydown = undefined
        },
        initVideo(){
          this.video = document.getElementById('video');
          this.video.onplay = this.startPlay
          this.video.onpause = this.endPlay
          this.video.onprogress = function (ev) {
            // console.log(ev);
          }
          this.video.src = this.url


          // this.video_o = document.getElementById('video_o');
          // this.video_o.src = this.url_o

        },
        startPlay(){
          this.playTimer = setInterval(this.refreshData,100)
          // this.video_o.play()
        },
        endPlay(){
          clearInterval(this.playTimer)
          // this.video_o.pause()
        },
        drawLine(p) {
          let ct = this.ctLine
          ct.clearRect(0, 0, 640, 800)


            console.log('drawLine in');
          //先整理数据 将p中的点坐标都取整
          if(!p || p == null || p.length == 0) return
          for (let i = 0; i < p.length; i++) {
            p[i].x = Math.floor(p[i].x)
            if(!p[i].yAdd){
              p[i].y = Math.floor(p[i].y) + 240;
              p[i].yAdd = true;
            }
            p[i].score = Math.floor(p[i].score)
          }
          ct.lineWidth = 6 //线条的宽度

          //draw the man
          if (p[0].x && p[0].y && p[1].x && p[1].y) {
            ct.beginPath()
            ct.strokeStyle = "#bb6564"
            ct.moveTo(p[0].x, p[0].y)
            ct.lineTo(p[1].x, p[1].y)
            ct.stroke()
          }
          if (p[1].x && p[1].y && p[8].x && p[8].y) {
            ct.beginPath()
            ct.strokeStyle = "#bb6564"
            ct.moveTo(p[1].x, p[1].y)
            ct.lineTo(p[8].x, p[8].y)
            ct.stroke()
          }
          // if (p[0].x && p[0].y && p[15].x && p[15].y) {
          //   ct.beginPath()
          //   ct.strokeStyle = "#00ffff";
          //   ct.moveTo(p[0].x, p[0].y)
          //   ct.lineTo(p[15].x, p[15].y)
          //   ct.stroke()
          // }
          // if (p[15].x && p[15].y && p[17].x && p[17].y) {
          //   ct.beginPath()
          //   ct.strokeStyle = "#00ffff";
          //   ct.moveTo(p[15].x, p[15].y)
          //   ct.lineTo(p[17].x, p[17].y)
          //   ct.stroke()
          // }
          // if (p[0].x && p[0].y && p[16].x && p[16].y) {
          //   ct.beginPath()
          //   ct.strokeStyle = "#b8f1cc";
          //   ct.moveTo(p[0].x, p[0].y)
          //   ct.lineTo(p[16].x, p[16].y)
          //   ct.stroke()
          // }
          // if (p[16].x && p[16].y && p[18].x && p[18].y) {
          //   ct.beginPath()
          //   ct.strokeStyle = "#b8f1cc";
          //   ct.moveTo(p[16].x, p[16].y)
          //   ct.lineTo(p[18].x, p[18].y)
          //   ct.stroke()
          // }
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

          if (p[8].x && p[8].y && p[9].x && p[9].y) {
            ct.beginPath()
            ct.strokeStyle = "#00ff00";
            ct.moveTo(p[8].x, p[8].y)
            ct.lineTo(p[9].x, p[9].y)
            ct.stroke()
          }
          // if (p[9].x && p[9].y && p[10].x && p[10].y) {
          //   ct.beginPath()
          //   ct.strokeStyle = "#f55066";
          //   ct.moveTo(p[9].x, p[9].y)
          //   ct.lineTo(p[10].x, p[10].y)
          //   ct.stroke()
          // }
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
          // if (p[12].x && p[12].y && p[13].x && p[13].y) {
          //   ct.beginPath()
          //   ct.strokeStyle = "#0000ff";
          //   ct.moveTo(p[12].x, p[12].y)
          //   ct.lineTo(p[13].x, p[13].y)
          //   ct.stroke()
          // }
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
        refreshData() {  //刷新数据
          let currentTime = video.currentTime

          let guestureMap = this.guestureMap[Number(this.timestamp) + currentTime.toFixed(1)*10]
          let obdMap = this.obdMap[Number(this.timestamp) + currentTime.toFixed(1)*10]
          let cheatMap = this.cheatMap[Number(this.timestamp) + currentTime.toFixed(1)*10]
          // console.log(cheatMap)
          //开启骨骼
          if(this.openLine && guestureMap) {
            this.drawLine(guestureMap.points)
          }else{
            this.ctLine.clearRect(0, 0, 640, 800)
          }


          if(obdMap)
          {
            console.log('刷新数据')
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
              if (this.gear !== Number(sign.substr(15, 1))) this.gear = parseInt(sign.substr(15, 3), 2)
            }

            this.examnierId = obdMap.examnierId
            this.carType = obdMap.examCarType
            this.carNumber = obdMap.carNumber
            this.studentName = obdMap.studentId
            this.studentID = obdMap.studentExamInfo.idCard
            this.startTime = obdMap.studentExamInfo.startTime

            let last = obdMap.deductionIDs.split(';').filter(item => item).pop()
            this.examName = this.examDesc[obdMap.projectId]?this.examDesc[obdMap.projectId]:''
            this.deduct = this.cheatDesc[last]?this.cheatDesc[last]:''

            this.speed = obdMap.carSpeed ? obdMap.carSpeed : 0
            this.rp = obdMap.engineSpeed ? obdMap.engineSpeed : 0

            this.score = obdMap.deductionValue
          }

          if(cheatMap){
            console.log('刷新作弊')
            if(cheatMap.cheatType === '2') this.animateCSS('.behavior1','flash')
            if(cheatMap.cheatType === '1') this.animateCSS('.behavior2','flash')
            if(cheatMap.cheatType === '1') this.animateCSS('.behavior3','flash')
            if(cheatMap.cheatType === '0') this.animateCSS('.behavior4','flash')
          }
        },
        clearData(){
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
          // console.log('add')
          function handleAnimationEnd() {
            // console.log('remove')
            node.classList.remove('animated')
            node.classList.remove(animationName)
            node.removeEventListener('animationend', handleAnimationEnd)
            if (typeof callback === 'function') callback()
          }
          node.addEventListener('animationend', handleAnimationEnd)
        },
      }
  }
</script>

<style lang="scss" scoped>
  /*设置字体*/
  p, span {
    font-size: 24px;
    font-family: "PingFang SC", "微软雅黑", Arial, sans-serif;
    letter-spacing: 5px;
    /*line-height: 36px;*/
  }

  .font1 {
    font-size: 24px;
  }
  .font2 {
    font-size: 32px;
  }
  .color1 {
    color: #fff;
  }

  .color2 {
    color: rgb(243, 152, 0);
  }

  .color3 {
    color: rgb(147, 164, 194);
  }

  .app-container {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
  }

  .border {
    border: 2px solid rgb(76, 103, 145);
    border-radius: 5px;
  }

  .border-red{
    border: 2px solid red;
    border-radius: 5px;
  }

  .back {
    background-color: #233962;
    padding: .5em;
  }

  .row {
    display: flex;
    width: 100%;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  #main {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: nowrap;
  }

  .stage {
    width: 640px;
    height: 960px;
    position: relative;
    flex-shrink: 0;
  }

  canvas {
    position: absolute;
  }

  #canvasLine {
    z-index: 2
  }

  .video{
    z-index: 1
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-basis: 900px;
    flex-shrink: 0;
    margin-left: 2em;
  }

  //九宫格
  $sw:140px;
  $sh:120px;
  .sign {
    position: relative;
    flex-shrink: 0;
    width:$sw*3;
    height:$sh*4;
  }
  .sign img {
    width: $sw;
    height: $sh;
    position: absolute;
  }
  .s1 {
    top: 0;
    left: 0;
  }
  .s2 {
    top: 0;
    left: $sw*1;
  }
  .s3 {
    top: 0;
    left: $sw*2 ;
  }
  .s4 {
    top: $sh ;
    left: 0;
  }
  .s5 {
    top: $sh ;
    left: $sw*1 ;
  }
  .s6 {
    top: $sh ;
    left: $sw*2 ;
  }
  .s7 {
    top: $sh*2 ;
    left: 0;
  }
  .s8 {
    top: $sh*2 ;
    left: $sw*1 ;
  }
  .s9 {
    top: $sh*2 ;
    left: $sw*2 ;
  }
  .s10 {
    top: $sh*3 ;
    left: 0;
  }
  .s11 {
    top: $sh*3 ;
    left: $sw*1 ;
  }
  .s12 {
    top: $sh*3 ;
    left: $sw*2 ;
  }

  .behavior {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .behavior .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width:140px;
    height:80px;
    margin: 20px;
  }

  .flash{
    background-color: #70b32d;
    border: 2px solid #70b32d;
    border-radius: 5px;
    color:#fff;

    animation-duration: 2s;
    animation-iteration-count: 2;
  }
</style>
