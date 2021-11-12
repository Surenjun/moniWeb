<template>
  <div class="app-container">
    <div class="title">{{fileName}}</div>
    <div id="main">
      <div class="stage" id='videoContainer' v-loading="loading" element-loading-text="视频正在生成，预计15秒，请稍后..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :style="{height: videoHeight}">
        <!--style="flex-shrink: 0;position: relative;width:640px;height:960px;"-->
        <video id="video" ref='video' class="video" preload="auto" controls="controls">
          您的浏览器不支持 HTML5 video 标签。
        </video>
        <canvas id="canvasLine" @click="videoPlay()">您的浏览器不支持画布。</canvas>
      </div>
      <div class="info">
        <div class="stuInfo">
          <div class="row">
            <span class="color1">流水号：{{lsh}}</span>
          </div>
          <div class="row">
            <span class="color3">考车号：</span><span class="color1">{{carno}}</span>
          </div>
          <div class="row">
            <span class="color3">录像时间：</span><span class="color1">{{lxsj}}</span>
          </div>
          <div class="row">
            <span class="color1">考试id：{{ksid}}</span>
          </div>
          <div class="row" style="margin-bottom: 0">
            <span class="color2">考试项目：</span><span class="color1">{{projectName}}</span>
          </div>
          <div class="row" style="margin-bottom: 0">
            <span class="color2">扣分代码：</span><span class="color1">{{kfxm}}</span>
          </div>
          <div class="row" style="margin-bottom: 0">
            <span class="color2">扣分项目：</span><span class="color1">{{ruleChn}}</span>
          </div>
        </div>
        <div class="changeStatus">
          <div class="row" :rows="7">
            <span class="color2">自动评判： </span><span class="color1">{{ zdppjg ==1?'车上已经评判':'车上未评判' }}</span>
          </div>
          <div class="row" :rows="7">
            <span class="color2">人工审核结果： </span>
            <span class="color1">{{verifyFlag== '1'?'未处理':verifyFlag== '2' ?'审核一致':'自动评审错误' }}</span>
          </div>
          <div class="row" :rows="7">
            <el-input type="textarea" v-model="inputPs" placeholder="请输入评审内容" style="width:60%;margin-left:0px;"></el-input>
          </div>
          <div class="row">
            <el-button class="filter-item" type="danger" @click="psError" :loading="psErrorLoading">
              自动评审错误
            </el-button>
            <el-button class="filter-item" type="success" @click="psNormal" :loading="psNormalLoading">
              审核一致
            </el-button>
            <!-- <div style="margin-left: 15px;">
              <img class="s4" :src="require('../../assets/image/optionIcon/zuozhuan_gl.png')" @click="getNextData(1)">
              <img class="s5" :src="require('../../assets/image/optionIcon/youzhuan_gl.png')" @click="getNextData(3)">
            </div> -->
          </div>
          <div class="row">
            <img class="s4" :src="require('../../assets/image/optionIcon/zuozhuan_gl.png')" @click="getNextData(1)">
            <img class="s5" :src="require('../../assets/image/optionIcon/youzhuan_gl.png')" @click="getNextData(3)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { startRecordVideo, updateExamInfoDetail, doVerify, getProjectAndMarkRule, getNearData } from '@/api/subjectThree'
export default {
  name: "Video",
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
      carNumber: '',

      kfxm: '',
      lxsj: '',
      studentID: '',
      studentName: '',
      exammonitorName: '',
      carno: '',
      ksid: '',
      lsh: '',
      videoId: '',

      ruleChn: '',
      ksxm: '',
      zdppjg: '',
      projectName: '',
      verifyReason: '',


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
      openLine: false,

      guestureMap: {},
      obdMap: {},
      cheatMap: {},

      url: '',

      checkList: [],
      loading: 1,
      cheatLoading: false,
      normalLoading: false,
      fileName: '',
      inputPs: '', //评审内容
      psErrorLoading: false,
      psNormalLoading: false,
    }
  },
  computed: {
    animatedSpeed: function() {
      return this.tweenedSpeed.toFixed(0);
    },
    // animatedRp: function () {
    //   return this.tweenedRp.toFixed(0);
    // }

    videoHeight() {
      let wH = document.body.offsetHeight;
      console.log(wH);
      let vH = wH - 50 - 34 - 18 - 50 - 304 - 40;
      return vH + 'px'
    }
  },
  watch: {
    speed: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedSpeed: newValue });
    },
  },
  created() {
    console.log('激活页面')
    this.init()

  },

  beforeDestroy() {
    console.log('预备销毁页面')
  },
  destroyed() {
    clearInterval(this.ajaxTimer);
    this.endPlay()
  },
  mounted: function() {

    this.loading = 1
    this.ajaxTimer = setInterval(this.request, 1000)
    // this.getDesc();
  },
  methods: {
    init() {
      let rowData = JSON.parse(window.sessionStorage.getItem('subject_three'));
      this.carNumber = rowData.carCode;

      this.videoId = rowData.id;
      this.studentID = rowData.sfzhm;
      this.studentName = rowData.name;
      this.carno = rowData.carno;
      this.ksid = rowData.ksid;
      this.lsh = rowData.lsh;

      this.lxsj = rowData.lxsj;
      this.kfxm = rowData.kfxm;
      this.ruleChn = rowData.ruleChn;
      this.kfxm = rowData.kfxm;
      this.zdppjg = rowData.zdppjg;
      this.projectName = rowData.projectName;
      this.verifyFlag = rowData.verifyFlag;
      this.inputPs = rowData.verifyReason === '还未人工审核' ? '' : rowData.verifyReason;
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
    request() {
      console.log('发送请求')
      startRecordVideo({ id: this.$route.query.id }).then(response => {
        console.log(response)
        if (response.code === -2) {
          return
        } else if (response.code === -1 || response.code === -3) {
          this.loading = 0
          clearInterval(this.ajaxTimer)
          this.$message.error('加载失败');
          return
        }

        this.loading = 0
        clearInterval(this.ajaxTimer)

        this.fileName = response.data.fileName;

        //如果是nano，开启画骨骼
        if (response.data.deviceType === '2' || response.data.deviceType === '1') this.openLine = true;

        // this.url = response.data.fileStr
        this.url = response.data.videoUrl
        this.checkList = response.data.type ? response.data.type.split(',') : [];

        let re = '';
        try {
          re = JSON.parse(response.data.signalInfo)
          this.timestamp = Math.floor(re.startTime / 100);

          let guestureMap = re.guestureMap
          let obdMap = re.obdMap
          let cheatMap = re.cheatMap

          //处理姿态数据
          if (guestureMap) {
            let keyarr1 = Object.keys(guestureMap)
            let l1 = keyarr1.length
            for (let i = 0; i < l1; i++) {

              this.guestureMap[Math.floor(keyarr1[i] / 100)] = guestureMap[keyarr1[i]];

            }
          }

          if (obdMap) {
            //处理obd数据
            let keyarr2 = Object.keys(obdMap)
            let l2 = keyarr2.length
            for (let i = 0; i < l2; i++) {
              this.obdMap[Math.floor(keyarr2[i] / 100)] = obdMap[keyarr2[i]]
            }
          }

          if (cheatMap) {
            //处理作弊数据
            let keyarr3 = Object.keys(cheatMap)
            let l3 = keyarr3.length
            for (let i = 0; i < l3; i++) {
              this.cheatMap[Math.floor(keyarr3[i] / 100)] = cheatMap[keyarr3[i]]
            }
          }
        } catch (e) {
          console.log('signalInfo 字段不合法');
        }

        this.initDraw()
        this.initVideo()
      }).catch(function(err) {
        console.log(err);
      })
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
      let canvasLine = document.getElementById('canvasLine')
      this.ctLine = canvasLine.getContext('2d')
    },
    startPlay() {
      this.playTimer = setInterval(this.refreshData, 100)
    },
    endPlay() {
      console.log('this.playTimer end playTimer== ', this.playTimer);
      clearInterval(this.playTimer)
    },
    videoPlay() {
      if (this.video.paused) {
        this.video.play();
      } else {
        this.video.pause()
      }
    },

    normal() {
      this.normalLoading = true
      updateExamInfoDetail({ id: this.$route.query.id, handleFlag: 2 }).then(response => {
        this.normalLoading = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        console.log('$emit("changeSuccessNew")');
        this.$EventBus.$emit("changeSuccessNew");
      })
    },
    psError() {
      if (!this.inputPs) {
        return this.$message({
          message: '评审内容不能为空',
          type: 'error'
        })
      }
      this.psErrorLoading = true;
      doVerify({ id: this.$route.query.id, verifyReason: this.inputPs, verifyFlag: '3' }).then(response => {
        this.verifyFlag = '3';
        this.psErrorLoading = false;
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        console.log('$emit("changeSuccessNew")');
        this.$EventBus.$emit("changeSuccessNew");
      })
    },
    psNormal() {
      this.psNormalLoading = true;
      doVerify({ id: this.$route.query.id, verifyReason: this.inputPs, verifyFlag: '2' }).then(response => {
        this.verifyFlag = '2';
        this.psNormalLoading = false;
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        console.log('$emit("changeSuccessNew")');
        this.$EventBus.$emit("changeSuccessNew");
      })
    },

    getNextData(flag) {
      getNearData({
        id: this.videoId,
        dataFlag: flag
      }).then(res => {
        console.log(res);
        if (res.data) {
          window.sessionStorage.setItem('subject_three', JSON.stringify(res.data))
          this.$router.replace({ path: '/subject_three/video', query: { id: res.data.id } })

          this.init();
        } else {
          this.$message({
            message: '没有下一条视频了',
            type: 'success'
          })
        }
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
  cursor: pointer;
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
    width: 40%;
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
