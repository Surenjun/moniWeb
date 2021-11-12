<template>
  <div class="app-container">
    <div id="object">
      <OBJECT id="activex" WIDTH="0" HEIGHT="0" CLASSID="clsid:f81c6df9-8b37-4550-a050-b2551fa531db">
        <span class="color1">不支持ActiveX控件，请使用IE11浏览器！</span>
      </OBJECT>
    </div>
    <div id="message" style="display: flex;justify-content: center; margin-bottom: 1em;">
      <input v-model="ip" width="500px" placeholder="请输入直播IP地址" style="display: inline"></input>
      <el-button @click="init" type="success">播放</el-button>
      <el-button @click="release" type="danger">结束</el-button>

      <!--<span style="margin-left: 1em;" class="color1">播放器状态：{{message}}</span>-->
      <!--<span style="margin-left: 1em;" class="color1">视频流数据：{{activexMsg}}</span>-->
      <!--<span style="margin-left: 1em;" class="color1">姿态数据：{{websockMsg}}</span>-->
    </div>
    <div id="main">
      <div class="stage border"
           v-loading="loading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <canvas id="canvasImg" width="640" height="480">您的浏览器不支持画布。</canvas>
        <canvas id="canvasLine" width="640" height="480">您的浏览器不支持画布。</canvas>
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
      <div class="info font1"
           v-loading="loading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="border" style="padding: 1em;">
          <div class="row" style="margin-top: 0">
            <span style="text-align: justify;text-align-last: justify;" class="color3">身份证号：</span><span class="color1">{{studentID}}</span>
          </div>
          <div class="row">
            <span class="color3">考生姓名：</span><span style="width:180px;" class="color1">{{studentName}}</span>
            <span class="color3">考试员号：</span><span class="color1">{{examnierId}}</span>
          </div>
          <div class="row">
            <span class="color3">车&nbsp牌&nbsp号<span style="margin-left: 5px;">：</span></span><span style="width:180px;" class="color1">{{carNumber}}</span>
            <span class="color3">考试车型：</span><span class="color1">{{carType}}</span>
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
            <span class="color2" style="flex-shrink: 0;">扣分原因：</span>
            <span style="word-wrap: break-word;word-break: break-all;overflow: hidden;" class="color1">{{deduct}}</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {startRecordVideo} from '@/api/cheat'

  export default {
    name: "start",
    data() {
      return {
        examDesc:{
          "1": "上车准备",
          "2": "起步",
          "3": "直线行驶",
          "4": "变更车道",
          "5": "直行通过路口",
          "6": "通过人行横道线",
          "7": "通过学校区域",
          "8": "通过公共汽车站",
          "9": "会车",
          "10": "超车",
          "11": "靠边停车",
          "12": "掉头",
          "13": "夜间行驶",
          "14": "加减档位操作",
          "15": "路口左转弯",
          "16": "路口右转弯",
          "41": "模拟夜间驾驶"
        },
        cheatDesc:{
          "1.01": "未逆时针绕车一周检查车辆外观及周围环境",
          "1.101": "打开车门前不观察后方交通情况",
          "1.106": "未逆时针绕车一周检查车辆外观及周围环境",
          "2.01": "制动气压不足起步",
          "2.02": "车门未关闭起步",
          "2.03": "起步前，未观察内、外后视镜，回头观察后方交通情况",
          "2.04": "启动发动机时，挡位未置于空挡（驻车挡）",
          "2.05": "发动机启动后，不及时松开启动开关",
          "2.06": "不松驻车制动器起步，但能及时纠正",
          "2.07": "道路交通情况复杂时起步不能合理使用喇叭",
          "2.08": "起步时车辆发生闯动",
          "2.09": "起步时，加速踏板控制不当，致使发动机转速过高",
          "2.10": "不松驻车制动器起步，未及时纠正",
          "2.101": "起步前，未观察内、外后视镜，回头观察后方交通情况",
          "2.102": "道路交通情况复杂时起步不能合理使用喇叭",
          "2.103": "启动发动机前，不检查调整驾驶座椅、后视镜、检查仪表",
          "2.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "2.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "2.44": "起步或行驶中挂错挡，不能及时纠正",
          "2.46": "起步时车辆后溜距离大于30cm",
          "2.47": "起步时车辆后溜，但后溜距离小于30cm",
          "2.48": "驾驶姿势不正确",
          "2.50": "启动发动机前，不检查调整驾驶座椅、后视镜、检查仪表",
          "3.01": "方向控制不稳，不能保持车辆直线运行",
          "3.02": "遇前车制动时不及时采取减速措施",
          "3.03": "不适时通过内、外后视镜观察后方交通情况",
          "3.04": "不按规定速度行驶",
          "3.05": "未及时发现路面障碍物或发现路面障碍物未及时采取减速措施不按规定速度行驶",
          "3.101": "遇前车制动时不及时采取减速措施",
          "3.102": "不适时通过内、外后视镜观察后方交通情况",
          "3.103": "未及时发现路面障碍物或发现路面障碍物未及时采取减速措施不按规定速度行驶",
          "4.01": "变更车道前，未通过内、外后视镜观察后方道路交通情况",
          "4.101": "变更车道前，未通过内、外后视镜观察后方道路交通情况",
          "4.102": "变更车道时，判断车辆安全距离不合理，妨碍其他车辆正常行驶",
          "4.103": "变更车道时，控制行驶速度不合理，妨碍其他车辆正常行驶",
          "4.41": "不按考试员指令驾驶",
          "4.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "4.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "5.01": "不按规定减速或停车瞭望",
          "5.02": "不观察左、右方交通情况",
          "5.03": "不按规定减速或停车瞭望",
          "5.04": "遇有路口交通阻塞时进入路口，将车辆停在路口内等候",
          "5.101": "不按规定减速或停车瞭望",
          "5.102": "不观察左、右方交通情况",
          "5.103": "不主动避让优先通行的车辆、行人、非机动车",
          "5.104": "遇有路口交通阻塞时进入路口，将车辆停在路口内等候",
          "5.41": "不按考试员指令驾驶",
          "5.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "5.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "5.44": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "5.45": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "6.01": "不观察左、右方交通情况",
          "6.02": "不按规定减速慢行",
          "6.03": "未停车礼让行人",
          "6.101": "不观察左、右方交通情况",
          "6.102": "未停车礼让行人",
          "7.01": "不观察左、右方交通情况",
          "7.02": "不按规定减速慢行",
          "7.03": "未停车礼让行人",
          "7.101": "不观察左、右方交通情况",
          "7.102": "未停车礼让行人",
          "8.01": "不观察左、右方交通情况",
          "8.02": "不按规定减速慢行",
          "8.03": "未停车礼让行人",
          "8.101": "不观察左、右方交通情况",
          "8.102": "未停车礼让行人",
          "9.01": "在没有中心隔离设施或者中心线的道路上会车时，不减速靠右行驶，或未与其他车辆、行人、非机动车保持安全距离",
          "9.03": "横向安全间距判断差，紧急转向避让对方来车",
          "9.101": "在没有中心隔离设施或者中心线的道路上会车时，不减速靠右行驶，或未与其他车辆、行人、非机动车保持安全距离",
          "9.102": "会车困难时不让行",
          "9.103": "横向安全间距判断差，紧急转向避让对方来车",
          "10.01": "超车前，不通过内、外后视镜观察后方和左侧交通情况并回头观察确认安全",
          "10.03": "超车时未与被超越车辆保持安全距离车",
          "10.04": "超车后，驶回原车道前，不通过内、外后视镜观察后方和右侧交通情况并回头观察确认安全",
          "10.05": "在没有中心线或同方向只有一条行车道的道路上从右侧超车",
          "10.101": "超车前，不通过内、外后视镜观察后方和左侧交通情况并回头观察确认安全",
          "10.102": "超车时机选择不合理，影响其他车辆正常行驶",
          "10.103": "超车时，未回头观察被超越车辆动态",
          "10.104": "超车时未与被超越车辆保持安全距离",
          "10.105": "超车后，驶回原车道前，不通过内、外后视镜观察后方和右侧交通情况并回头观察确认安全",
          "10.106": "在没有中心线或同方向只有一条行车道的道路上从右侧超车",
          "10.107": "当后车发出超车信号时，具备让车条件不减速靠右让行",
          "10.41": "不按考试员指令驾驶",
          "10.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "10.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "11.01": "停车前，不通过内、外后视镜观察后方和右侧交通情况，并回头观察确认安全",
          "11.02": "需要下车的，在打开车门前不回头观察左后方交通情况",
          "11.03": "停车后，车身超过道路右侧边缘线或者人行道边缘",
          "11.04": "停车后，车身距离道路右侧边缘线或者人行道边缘超出50cm",
          "11.05": "停车后，未拉紧驻车制动器",
          "11.06": "拉紧驻车制动器前放松行车制动踏板",
          "11.07": "下车后不关闭车门",
          "11.08": "下车前不将发动机熄火",
          "11.09": "在路边临时停车不关闭前照灯或不开启示廓灯",
          "11.10": "停车后，车身距离道路右侧边缘线或者人行道边缘超出30cm，未超出50cm",
          "11.101": "停车前，不通过内、外后视镜观察后方和右侧交通情况，并回头观察确认安全",
          "11.102": "需要下车的，在打开车门前不回头观察左后方交通情况",
          "11.41": "考试员发出靠边停车指令后，未能在规定的距离内停车",
          "11.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "11.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "11.44": "制动不平顺",
          "12.02": "掉头地点选择不当",
          "12.101": "不能正确观察交通情况选择掉头时机",
          "12.102": "掉头地点选择不当",
          "12.103": "掉头时，妨碍正常行驶的其他车辆和行人通行",
          "12.41": "不按考试员指令驾驶",
          "12.42": "掉头前未开启左转向灯",
          "12.44": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "12.45": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "12.46": "不按考试员指令驾驶",
          "13.01": "不能正确开启灯光",
          "13.03": "通过急弯、坡路、拱桥、人行横道或者没有交通信号灯控制的路口时，不交替使用远近光灯示意",
          "13.04": "会车时不按规定使用近光灯",
          "13.05": "通过路口时使用远光灯",
          "13.06": "超车时未交替使用远近光灯提醒被超越车辆",
          "13.08": "在有路灯、照明良好的道路上行驶时，使用远光灯",
          "13.09": "进入无照明、照明不良的道路行驶时不使用远光灯",
          "13.101": "同方向近距离跟车行驶时，使用远光灯",
          "13.102": "会车时不按规定使用近光灯",
          "13.103": "超车时未交替使用远近光灯提醒被超越车辆",
          "14.01": "未按指令平稳加、减挡",
          "14.02": "车辆运行速度和挡位不匹配",
          "14.03": "未按指令平稳加、减挡",
          "14.66": "车辆运行速度和挡位不匹配",
          "14.67": "车辆运行速度和挡位不匹配",
          "14.68": "车辆运行速度和挡位不匹配",
          "14.71": "车辆运行速度和挡位不匹配",
          "14.72": "车辆运行速度和挡位不匹配",
          "14.82": "车辆运行速度和挡位不匹配",
          "14.90": "车辆运行速度和挡位不匹配",
          "14.91": "车辆运行速度和挡位不匹配",
          "15.01": "不按规定减速或停车瞭望",
          "15.02": "不观察左、右方交通情况，转弯通过路口时，未观察侧前方交通情况",
          "15.03": "不按规定减速或停车瞭望",
          "15.04": "遇有路口交通阻塞时进入路口，将车辆停在路口内等候",
          "15.05": "左转通过路口时，未靠路口中心点左侧转弯",
          "15.101": "不观察左、右方交通情况，转弯通过路口时，未观察侧前方交通情况",
          "15.102": "不主动避让优先通行的车辆、行人、非机动车",
          "15.103": "遇有路口交通阻塞时进入路口，将车辆停在路口内等候",
          "15.41": "不按考试员指令驾驶",
          "15.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "15.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "15.44": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "15.45": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "16.01": "不按规定减速或停车瞭望",
          "16.02": "不观察左、右方交通情况，转弯通过路口时，未观察侧前方交通情况",
          "16.03": "不按规定减速或停车瞭望",
          "16.04": "遇有路口交通阻塞时进入路口，将车辆停在路口内等候",
          "16.101": "不观察左、右方交通情况，转弯通过路口时，未观察侧前方交通情况",
          "16.102": "不主动避让优先通行的车辆、行人、非机动车",
          "16.103": "遇有路口交通阻塞时进入路口，将车辆停在路口内等候",
          "16.41": "不按考试员指令驾驶",
          "16.42": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "16.43": "起步、转向、变更车道、超车、停车前，开转向灯少于3s即转向",
          "16.44": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "16.45": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.01": "不按规定使用安全带或者戴安全头盔",
          "20.05": "启动发动机时挡位未置于空挡（驻车挡）",
          "20.06": "车辆行驶方向控制不准确，方向晃动，车辆偏离正确行驶方向",
          "20.101": "不能正确使用灯光、雨刮器等车辆常用操纵件",
          "20.102": "绿灯亮起后，前方无其他车辆、行人等影响通行时，10秒内未完成起步",
          "20.103": "驾驶汽车双手同时离开转向盘",
          "20.104": "单手控制转向盘时,不能有效、平稳控制行驶方向",
          "20.105": "车辆行驶方向控制不准确，方向晃动，车辆偏离正确行驶方向",
          "20.106": "不能根据交通情况合理选择行驶车道、速度",
          "20.107": "车辆在行驶中低头看挡或连续2次挂挡不进",
          "20.108": "视线离开行驶方向超过2s",
          "20.109": "违反交通安全法律、法规，影响交通安全",
          "20.11": "行驶中空挡滑行",
          "20.110": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.111": "车辆行驶中骑轧车道中心实线或者车道边缘实线",
          "20.112": "争道抢行，妨碍其他车辆正常行驶",
          "20.113": "行驶中不能保持安全距离和安全车速",
          "20.114": "通过积水路面遇行人、非机动车时，有不减速等不文明驾驶行为",
          "20.115": "遇行人通过人行横道不停车让行，不主动避让优先通行的车辆、行人、非机动车",
          "20.116": "将车辆停在人行横道、网状线内等禁止停车区域",
          "20.117": "行驶中身体任何部位伸出窗外",
          "20.118": "制动、加速踏板使用错误",
          "20.119": "对可能出现危险的情形未采取减速、鸣喇叭等安全措施",
          "20.120": "因观察、判断或者操作不当出现危险情况",
          "20.121": "驾驶姿势不正确",
          "20.122": "操纵转向盘手法不合理",
          "20.123": "转弯时，转、回方向过早、过晚，或者转向角度过大、过小",
          "20.124": "换挡时发生齿轮撞击",
          "20.125": "遇情况时不会合理使用离合器半联动控制车速",
          "20.126": "不能根据交通情况合理使用喇叭",
          "20.127": "制动不平顺",
          "20.128": "遇后车发出超车信号，不按规定让行",
          "20.15": "因观察、判断或者操作不当出现危险情况",
          "20.35": "遇情况时不会合理使用离合器半联动控制车速",
          "20.36": "因操作不当造成发动机熄火一次",
          "20.39": "转弯时，转、回方向过早、过晚，或者转向角度过大、过小",
          "20.40": "不按考试员指令驾驶",
          "20.41": "驾驶姿势不正确",
          "20.42": "不能根据交通情况合理使用喇叭",
          "20.44": "制动不平顺",
          "20.51": "不能根据交通情况合理使用喇叭",
          "20.52": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.53": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.54": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.55": "对可能出现危险的情形未采取减速、鸣喇叭等安全措施",
          "20.56": "车辆行驶中骑轧车道中心实线或者车道边缘实线",
          "20.57": "车辆行驶中骑轧车道中心实线或者车道边缘实线",
          "20.58": "不按规定速度行驶",
          "20.59": "不按规定速度行驶",
          "20.60": "不能根据交通情况合理选择行驶车道、速度",
          "20.64": "将车辆停在人行横道、网状线内等禁止停车区域",
          "20.65": "长时间骑轧车道分界线行驶",
          "20.70": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.73": "起步、转向、变更车道、超车、停车前不使用或错误使用转向灯",
          "20.75": "制动、加速踏板使用错误",
          "20.76": "争道抢行，妨碍其他车辆正常行驶",
          "20.78": "对可能出现危险的情形未采取减速、鸣喇叭等安全措施",
          "20.79": "驾驶姿势不正确",
          "20.80": "驾驶姿势不正确",
          "20.81": "违反交通安全法律、法规，影响交通安全",
          "20.83": "通过积水路面遇行人、非机动车时，有不减速等不文明驾驶行为",
          "20.84": "不能根据交通情况合理选择行驶车道、速度",
          "20.85": "车辆在行驶中低头看挡或连续2次挂挡不进",
          "20.86": "使用挡位与车速长时间不匹配，造成车辆发动机转速过高或过低",
          "20.87": "遮挡、关闭车内音视频监控设备",
          "20.88": "违反交通安全法律、法规，影响交通安全",
          "20.89": "连续变更两条或两条以上车道",
          "20.90": "因观察、判断或者操作不当出现危险情况",
          "20.91": "不能根据交通情况合理选择行驶车道、速度",
          "20.93": "不能正确使用灯光、雨刮器等车辆常用操纵件",
          "20.94": "不按考试员指令驾驶",
          "20.95": "不按交通信号灯、标志、标线或者民警指挥信号行驶",
          "20.97": "不按考试员指令驾驶",
          "20.98": "起步或行驶中挂错挡，不能及时纠正",
          "20.99": "左转通过路口时，未靠路口中心点左侧转弯",
          "41.01": "不能正确开启灯光",
          "41.02": "同方向近距离跟车行驶时，使用远光灯",
          "41.03": "通过急弯、坡路、拱桥、人行横道或者没有交通信号灯控制的路口时，不交替使用远近光灯示意",
          "41.04": "会车时不按规定使用近光灯",
          "41.05": "通过路口时使用远光灯",
          "41.06": "在路边临时停车不关闭前照灯或不开启示廓灯",
          "41.07": "在有路灯、照明良好的道路上行驶时，使用远光灯",
          "41.08": "超车时未变换使用远近光灯提醒被超越车辆",
          "41.09": "进入无照明、照明不良的道路行驶时不使用远光灯",
          "41.42": "不按考试员指令驾驶"
        },

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
        examnierId:'',
        carType: '',
        carNumber: '',
        startTime: '',
        examName: '',
        score:'',
        deduct: '',

        speed: 0,    //速度
        tweenedSpeed: 0,
        rp: 0,   //转速
        tweenedRp: 0,
        gear: 0, //档位

        ip:'', //直播流ip

        // wsip: '', //websocke地址
        // rtsp: '', //rtsp地址

        //对象
        websock: {},
        activex: {},
        ctImg: {}, //canvas
        ctLine: {}, //canvas
        checkTimer: '',//检测定时器
        playTimer: '', //播放的定时器
        bufferTimer:'',  //缓冲定时器

        //数据
        frame: 100,  //画布的刷新间隔 帧率是 1000/frame
        timestamp: -1,  //当前时间戳   该时间戳是 被刷新时间约分过的


        zoom: 1,       //画布缩放值
        status: 0,   //播放状态 0 播放结束 1 正在播放
        image: new Image(),

        wsBuffer: {}, //obd数据缓存
        skeletonBuffer: {}, //骨骼数据缓存
        axBuffer: {}, //视频图片缓存

        // package:{}, //数据包 key 时间戳 value 数据包

        //消息
        websockMsg: '关闭',
        activexMsg: '关闭',
        message: '请点击开始',

        loading:false   //加载框
      }
    },
    computed: {
      animatedSpeed: function () {
        return this.tweenedSpeed.toFixed(0);
      },
      // animatedRp: function () {
      //   return this.tweenedRp.toFixed(0);
      // }
    },
    watch: {
      speed: function (newValue) {
        TweenLite.to(this.$data, 0.5, {tweenedSpeed: newValue});
      },
      // rp: function (newValue) {
      //   TweenLite.to(this.$data, 1, {tweenedRp: newValue});
      // }
    },
    created() {
      console.log('创建页面')
    },
    beforeDestroy(){
      console.log('预备销毁页面')
      this.release()
    },
    destroyed() {
      console.log('销毁页面')
    },
    mounted: function () {
      this.initDraw()
    },
    methods:
      {
        init() { //开始
          if(!this.ip) {
            alert('请输入ip')
            return
          }
          if (this.status === 1) return
          console.log('初始化')
          this.status = 1
          this.loading = true
          this.initActivex()
          this.initWebSocket()

          this.ctImg.clearRect(0, 0, 640, 960)
          this.ctLine.clearRect(0, 0, 640, 960)
          this.axBuffer = {}
          this.wsBuffer = {}
          this.skeletonBuffer = {}
          this.timestamp = -1
          this.checkTimer = setInterval(this.checkTimestamp, 200)
        },
        release() { //结束
          if (this.status === 0) return
          console.log('释放')
          this.status = 0
          this.loading = false

          this.websocketclose()
          this.activeClose()
          this.clearData()
          this.ctImg.clearRect(0, 0, 640, 960)
          this.ctLine.clearRect(0, 0, 640, 960)

          this.axBuffer = {}
          this.wsBuffer = {}
          this.skeletonBuffer = {}
          this.timestamp = -1

          clearInterval(this.checkTimer)
          clearInterval(this.playTimer)
        },
        //播放逻辑
        checkTimestamp() { //寻找开始的时间戳
          if(!this.loading) this.loading = true

          let timestamp = false
          let k = Object.keys(this.axBuffer)
          for (let i = 0; i < k.length; i++) {
            if (this.wsBuffer[k[i]] && timestamp < k[i]) { //如果有数据就从这开始播放，取最早的时间戳
              timestamp = k[i]
            }
          }
          if(!timestamp) return //没找到返回

          //清理之前缓存的数据
          for (let i = 0; i < k.length; i++) {
            if(k[i] < timestamp) delete this.axBuffer[k[i]]
          }
          let kw = Object.keys(this.wsBuffer)
          for (let i = 0; i < kw.length; i++) {
            if(kw[i] < timestamp) delete this.wsBuffer[kw[i]]
          }

          clearInterval(this.checkTimer)  //结束检测
          this.timestamp = timestamp  //设置起始时间戳
          setTimeout(this.initPlay,1000)
          // this.initPlay()
          console.log(this.timestamp)
          console.log(this.axBuffer)
          console.log('检测结束')
        },
        initPlay(){
          this.playTimer = setInterval(this.play, this.frame) //开始播放
        },
        play() {
          if(this.loading) this.loading = false
          /**
           * 检测缓冲机制 如果画面加载速度跟不上播放速度
           * 则从当前帧暂停等待缓冲
           * 图片是否准备到位即可 axBuffer count = 0
           */
          let axCheck = false //未来十帧没有数据
          let wsCheck = false //未来十帧没有数据
          for (let i=0;i<10;i++){
            if(this.axBuffer[Number(this.timestamp)+i]){
              axCheck = true
            }
            // if(this.wsBuffer[Number(this.timestamp)+i]){
            //   wsCheck = true
            // }
          }
          if(!axCheck)
          {
            clearInterval(this.playTimer)  //结束播放
            this.checkTimer = setInterval(this.checkTimestamp, 200)
            console.log('重新检测播放时间')
            return
          }

          let image = this.axBuffer[this.timestamp]
          let obdData = this.wsBuffer[this.timestamp]
          let skeletonData = this.skeletonBuffer[this.timestamp]

          if (image) {
            this.drawImg(this.timestamp, image)
          }
          if (obdData) {
            this.refreshData(obdData)
            delete this.wsBuffer[this.timestamp]
          }
          if(skeletonData){
            this.clearLine()
            this.drawLine(skeletonData.points)
            delete this.skeletonBuffer[this.timestamp]
          }else{
            this.clearLine()
          }
          this.timestamp++
        },
        // buffer(){
        //   if(!this.loading) this.loading = true
        //   let axKeys = Object.keys(this.axBuffer)
        //   let wsKeys = Object.keys(this.wsBuffer)
        //
        //   // if(axKeys.length < 5 || ) return
        //   console.log('缓冲结束')
        //   clearInterval(this.bufferTimer)  //缓冲结束
        //   this.playTimer = setInterval(this.play, this.frame) //开始播放
        // },

        initActivex() {  //初始化activex控件
          this.activex = document.getElementById('activex')
          this.activex.AttachEvent('ImgCallBack', this.AxImgCallBack) //注册activex事件
          this.activex.AttachEvent('UrlConState', this.AxUrlConState) //注册activex事件
          this.activeInit()
        },
        activeInit(){
          this.activex.on_Play_slot('rtsp://'+this.ip+':8554/exammonitor2')
        },
        activeClose() {
          // this.activexMsg = '关闭'
          this.activex.on_Close_slot()
          this.activex.on_btnAudioContol_slot(false) //打开声音
        },
        AxImgCallBack(x, y, z, s) {
          // this.activexMsg = '接受数据长度：' + z
          this.axBuffer[Math.floor((x * 1000 + y) / this.frame)] = s
          // this.axBuffer = s
        },
        AxUrlConState(s) {
          if (s === 1) {
            console.log('视频连接成功')
            this.activex.on_btnAudioContol_slot(true) //打开声音
          } else{
            if(this.status === 1)
            {
              //重新连接
              console.log('重新连接atx')
              // this.axBuffer = {}
              // this.wsBuffer = {}
              // this.skeletonBuffer = {}
              // this.timestamp = -1
              setTimeout(this.activeInit,1000)
            }
          }
        },
        initWebSocket() { //初始化weosocket
          this.websock = new WebSocket('ws://'+this.ip+':9088');
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onclose = this.websocketonclose;
        },
        websocketclose() {
          if (this.websock instanceof WebSocket) {
            this.websock.close()
          }
        },
        websocketonopen() {
          // this.websockMsg = "连接成功"
          // this.message = '初始化websocket成功！'
          // this.wsloading = 0
          // this.websock_recon = 3
          // this.$message({
          //   message: '数据连接成功',
          //   type: 'success'
          // });
          // this.score = 100
          console.log('初始化websocket成功')
        },
        websocketonerror(e) { //错误
          console.log('ws错误'+e)
          console.log(e)
          // this.websockMsg = "WebSocket连接发生错误"
          // this.$message.error('姿态数据未知错误')
        },
        websocketonclose(e) { //关闭
          console.log('ws关闭')
          // this.websockMsg = "关闭"
          // this.release()
          // this.$message.error('姿态数据连接断开')
          if(this.status === 1)
          {
            //重新连接
            console.log('重新连接ws')
            // this.axBuffer = {}
            // this.wsBuffer = {}
            // this.skeletonBuffer = {}
            // this.timestamp = -1
            setTimeout(this.initWebSocket,1000)
          }
        },
        websocketonmessage(e) { //数据接收
          let r = JSON.parse(e.data)
          if (!r || !r.code) return false
          // console.log(redata)
          let data = r.data
          if(r.code === 100){
            // console.log('获取姿态数据100')
            this.skeletonBuffer[Math.floor(data.timeStamp / this.frame)] = data
          }else if(r.code === 200){
            // console.log('获取obd数据200')
            this.wsBuffer[Math.floor(data.timeStamp / this.frame)] = data
          }
        },

        // 初始化绘制信息
        initDraw() { // 初始化画布
          let canvasImg = document.getElementById('canvasImg')
          let canvasLine = document.getElementById('canvasLine')
          this.ctImg = canvasImg.getContext('2d')
          this.ctLine = canvasLine.getContext('2d')
        },
        drawImg(timestamp, img) { //画一张图片
          this.image.src = 'data:image/png;base64,' + img
          this.image.onload = () => { //加载完成，不然加载有间隔会频闪
            this.ctImg.clearRect(0, 0, 640, 960)
            this.ctImg.drawImage(this.image, 0, 0)
            delete this.axBuffer[timestamp]
          }
        },
        drawLine(p) {
          if(!p || p == null || p.length == 0) return

          //先整理数据 将p中的点坐标都取整
          for (let i = 0; i < p.length; i++) {
            p[i].x = Math.floor(p[i].x)
            p[i].y = Math.floor(p[i].y)
            p[i].score = Math.floor(p[i].score)
          }

          let ct = this.ctLine
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
        clearLine(){
          this.ctLine.clearRect(0, 0, 640, 960)
        },
        refreshData(data) {  //刷新数据
          if(!data) return
          let sign = data.devicesInfo
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

          if(data.cheatTypeBean.gesture) this.animateCSS('.behavior1','flash')
          if(data.cheatTypeBean.sound) this.animateCSS('.behavior2','flash')
          if(data.cheatTypeBean.sound) this.animateCSS('.behavior3','flash')
          if(data.cheatTypeBean.fusha) this.animateCSS('.behavior4','flash')

          this.examnierId = data.examnierId
          this.carType = data.examCarType
          this.carNumber = data.carNumber
          this.studentName = data.studentId
          this.studentID = data.studentExamInfo.idCard
          this.startTime = data.studentExamInfo.startTime

          let last = data.deductionIDs.split(';').filter(item => item).pop()
          this.examName = this.examDesc[data.projectId]?this.examDesc[data.projectId]:''
          this.deduct = this.cheatDesc[last]?this.cheatDesc[last]:''

          this.speed = data.carSpeed ? data.carSpeed : 0
          this.rp = data.engineSpeed ? data.engineSpeed : 0

          this.score = data.deductionValue
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

          this.examnierId = ''
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
        // changeCar(number){
        //   if(number === 54){
        //     this.wsip = 'ws://192.168.2.64:9088'
        //     this.rtsp = 'rtsp://192.168.2.64:8554/exammonitor2'
        //     this.init()
        //   }else if(number === 43){
        //     this.wsip = 'ws://192.168.2.53:9088'
        //     this.rtsp = 'rtsp://192.168.2.53:8554/exammonitor2'
        //     this.init()
        //   }
        // },
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
    padding: .75rem 0 0;
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
