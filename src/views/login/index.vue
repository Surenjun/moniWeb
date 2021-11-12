<template>
  <div class="login-container">
    <div class="version">多伦V1.0</div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">

        </h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" :placeholder="$t('login.nameTip')" name="username" type="text" auto-complete="on" />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" :placeholder="$t('login.pwdTip')" name="password" @keyup.native="checkCapslock" @blur="capsTooltip = false"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="code" >
        <el-input ref="code" v-model="loginForm.verifyCode" :placeholder="$t('login.codeTip')" name="code" type="text" class='captchaImagInput' @keyup.enter.native="handleLogin" />
        <img class="captchaImag" :src="captchaImag" @click="getCaptchaFn()">
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
    </el-form>
    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

    <div class="title">
      基于智能车路系统的道路驾驶测评软件
    </div>
  </div>
</template>
<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialSignin'
import { getCaptcha,getSystemInfo } from '@/api/user'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        // callback()
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
        verifyCode: '',
        loginChannel: 0
      },
      version: 0,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      captchaImag: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },

  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getCaptchaFn();
    this.getSystemInfoFn();
  },

  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },

  methods: {

    getCaptchaFn() {
      getCaptcha().then(response => {
        console.log(response);
        this.captchaImag = 'data:image/gif;base64,' + response.data.captchaImg
        this.loginForm.verifyCodeKey = response.data.captchaKey;
      })
    },

    getSystemInfoFn() {
      getSystemInfo().then(response => {
        this.version = response.data.version
        console.log(response);
      })
    },

    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((resp) => {
              this.$message({
                type: 'success',
                message: resp.message
              });
              this.loading = false;
              this.getCaptchaFn()
            })
        } else {
          console.log('error submit!!');
          this.getCaptchaFn()
          return false
        }
      })
    }
  }
}

</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#000;
$cursor: #fff;
@import "~@/styles/variables.scss";

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  .title{
    position: absolute;
    bottom: 50px;
    left: 35%;
    color: #FFF;
    font-size: 28px;
  }
  .version{
    width: 100%;
    text-align: right;
    padding-right: 30px;
    padding-top: 20px;
    color: white;
  }
  .el-input {
    display: inline-block;
    height: 37px;
    width: 85%;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 37px;
      /*caret-color: $cursor;*/
      width: 100%;
      margin: 1px 0;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $cursor inset !important;
        -webkit-text-fill-color: black;
      }
    }

  }

  .captchaImagInput {
    width: 65%;
  }

  .captchaImag {
    cursor: pointer;
    height: 37px;
    vertical-align: bottom;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    color: #454545;
  }

  .el-button {
    margin-top: 12px;
    height: 52px;
    font-size: 26px;
    background-color: $orange;
    border-color: $orange;
    padding: 8px 20px 12px 20px;
  }
}

</style>
<style lang="scss" scoped>
$bg:"../../assets/image/login-bg.jpg";
$box_bg: "../../assets/image/box.png";
$dark_gray:#000;
$light_gray:#fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url($bg);
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  overflow: hidden;

  .login-form {
    background: url($box_bg);
    position: absolute;
    width: 402px;
    max-width: 100%;
    padding: 20px 52px 0;
    margin: 0 auto;
    overflow: hidden;
    right: 10%;
    top: 50%;
    margin-top: -182px;
    height: 365px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0px 5px 0px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    margin-bottom: 58px;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
      /*border-bottom: 1px solid white;*/
      padding-bottom: 10px;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

</style>
