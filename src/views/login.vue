<template>
  <Row type="flex" justify="start" align="middle" class="login" @keydown.enter.native="submitLogin">
    <Col :xs="{span:22}" style="width: 368px;">
      <Row class="header">
        <div class="description" style="color: #333;">
          <img src="@/assets/logo1.png" style="float: left;margin-left: 50px;" />法宝云平台
        </div>
      </Row>

      <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>

      <Row class="login-form" v-if="!socialLogining">
        <Tabs v-model="tabName" style="width: 100%;text-align: center;">
          <TabPane name="username" label="账号登录" style="width: 100%;text-align: center;">
            <Form
              ref="usernameLoginForm"
              :model="form"
              :rules="rules"
              class="form"
              v-if="tabName=='username'"
            >
              <FormItem prop="username">
                <Input
                  v-model="form.username"
                  prefix="ios-contact"
                  size="large"
                  clearable
                  placeholder="请输入用户名"
                  autocomplete="off"
                />
              </FormItem>
              <FormItem prop="password">
                <Input
                  type="password"
                  v-model="form.password"
                  prefix="ios-lock"
                  size="large"
                  clearable
                  placeholder="请输入密码"
                  autocomplete="off"
                />
              </FormItem>
            </Form>
          </TabPane>
          <!-- <TabPane label="手机号登录" name="mobile" icon="ios-phone-portrait">
          <Form ref="mobileLoginForm" :model="form" :rules="rules" class="form" v-if="tabName=='mobile'">
            <FormItem prop="mobile">
              <Input v-model="form.mobile" prefix="ios-phone-portrait" size="large" clearable placeholder="请输入手机号" />
            </FormItem>
            <FormItem prop="code" :error="errorCode">
              <Row type="flex" justify="space-between">
                <Input v-model="form.code" prefix="ios-mail-outline" size="large" clearable placeholder="请输入短信验证码" :maxlength="maxLength" class="input-verify" />
                <Button size="large" :loading="sending" @click="sendVerify" v-if="!sended" class="send-verify">
                  <span v-if="!sending">获取验证码</span>
                  <span v-else>发送中</span>
                </Button>
                <Button size="large" disabled v-if="sended" class="count-verify">{{countButton}}</Button>
              </Row>
            </FormItem>
          </Form>
          </TabPane>-->
        </Tabs>

        <Row type="flex" justify="space-between">
          <Checkbox v-model="saveLogin" size="large">自动登录</Checkbox>
          <!-- <Dropdown trigger="click" @on-click="handleDropDown">
          <a class="forget-pass">
            忘记密码
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="showAccount">体验测试账号</DropdownItem>
            <DropdownItem name="resetByMobile">使用手机号重置密码(付费)</DropdownItem>
            <DropdownItem name="resetByEmail">使用邮箱重置密码(付费)</DropdownItem>
          </DropdownMenu>
          </Dropdown>-->
        </Row>
        <Row>
          <Button
            class="login-btn"
            type="primary"
            size="large"
            :loading="loading"
            @click="submitLogin"
            long
          >
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </Button>
        </Row>
        <!-- <Row type="flex" justify="space-between" class="other-login">
        <div class="other-way icons">
          其它方式登录
          <div class="other-icon" @click="toGithubLogin">
            <icon scale="1.1" name="brands/github"></icon>
          </div>
          <div class="other-icon" @click="toQQLogin">
            <icon name="brands/qq"></icon>
          </div>
          <div class="other-icon" @click="toWeiboLogin">
            <icon scale="1.2" name="brands/weibo"></icon>
          </div>
          <div class="other-icon" @click="toWeixinLogin">
            <icon scale="1.2" name="brands/weixin"></icon>
          </div>
        </div>
        <router-link to="/regist"><a class="forget-pass">注册账户</a></router-link>
        </Row>-->
      </Row>
      <!-- <div v-if="socialLogining" class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
      <!-- <span>用户数据加载中...</span>-->
      <!-- </div> -->

      <!-- <Row class="foot">
       <Row type="flex" justify="space-around" class="help">
         <a class="item" href="https://github.com/Exrick/x-boot" target="_blank">帮助</a>
         <a class="item" href="https://github.com/Exrick/x-boot" target="_blank">隐私</a>
         <a class="item" href="https://github.com/Exrick/x-boot" target="_blank">条款</a>
       </Row>
       <Row type="flex" justify="center" class="copyright">
         Copyright © 2018 - Present <a href="http://exrick.cn" target="_blank" style="margin:0 5px;">Exrick</a> 版权所有
       </Row>
      </Row>-->
    </Col>
  </Row>
</template>

<script>
import Cookies from "js-cookie";
const queryString = require('query-string');
import {
  login,
  userInfo,
  githubLogin,
  qqLogin,
  weiboLogin,
  getJWT,
  sendSms,
  smsLogin
} from "@/api/index";
import util from "@/libs/util.js";
export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      socialLogining: true,
      error: false,
      errorMsg: "",
      tabName: "username",
      saveLogin: true,
      loading: false,
      sending: false,
      sended: false,
      count: 60,
      countButton: "60 s",
      maxLength: 6,
      errorCode: "",
      form: {
        username: "",
        password: "",
        mobile: "",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            validator: validateMobile,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    showErrorMsg(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    sendVerify() {
      this.$refs.mobileLoginForm.validate(valid => {
        if (valid) {
          this.sending = true;
          sendSms(this.form.mobile, { type: 1 }).then(res => {
            this.sending = false;
            if (res.success) {
              this.$Message.success("发送短信验证码成功");
              this.sended = true;
              this.countDown();
            }
          });
        }
      });
    },
    countDown() {
      let that = this;
      if (this.count === 0) {
        this.sended = false;
        this.count = 60;
        return;
      } else {
        this.countButton = this.count + " s";
        this.count--;
      }
      setTimeout(function() {
        that.countDown();
      }, 1000);
    },
    submitLogin() {
      let that = this;
      if (that.tabName === "username") {
        that.$refs.usernameLoginForm.validate(valid => {
          if (valid) {
            that.loading = true;
            login({
              username: that.form.username,
              password: that.form.password,
              loginType: "userLogin",
              saveLogin: that.saveLogin
            }).then(res => {
              if (res.success) {
                that.setStore("accessToken", res.result.access_token);
                // 获取用户信息
                userInfo().then(res => {
                  if (res.success) {
                    // 避免超过大小限制
                    delete res.result.permissions;
                    let roles = [];
                    res.result.roles.forEach(e => {
                      roles.push(e.name);
                    });
                    that.setStore("roles", roles);
                    that.setStore("saveLogin", that.saveLogin);
                    localStorage.setItem(
                      "userInfo",
                      JSON.stringify(res.result)
                    );
                    if (that.saveLogin) {
                      // 保存7天
                      Cookies.set("userInfo", queryString.stringify(res.result), {
                        expires: 7
                      });
                    } else {
                      Cookies.set("userInfo", queryString.stringify(res.result));
                    }
                    that.setStore("userInfo", res.result);
                    that.$store.commit("setAvatarPath", res.result.avatar);
                    // 加载菜单
                    util.initRouter(that);
                    this.$router.push({
                      name: "home_index"
                    });
                  } else {
                    that.loading = false;
                  }
                });
              } else {
                that.loading = false;
              }
            });
          }
        });
      } else if (this.tabName === "mobile") {
        this.$refs.mobileLoginForm.validate(valid => {
          if (valid) {
            if (this.form.code === "") {
              this.errorCode = "验证码不能为空";
              return;
            } else {
              this.errorCode = "";
            }
            this.loading = true;
            this.form.saveLogin = this.saveLogin;
            smsLogin(this.form).then(res => {
              if (res.success) {
                this.setStore("accessToken", res.result);
                // 获取用户信息
                userInfo().then(res => {
                  if (res.success === true) {
                    // 避免超过大小限制
                    delete res.result.permissions;
                    let roles = [];
                    res.result.roles.forEach(e => {
                      roles.push(e.name);
                    });
                    this.setStore("roles", roles);
                    if (this.saveLogin) {
                      // 保存7天
                      Cookies.set("userInfo", queryString.stringify(res.result), {
                        expires: 7
                      });
                    } else {
                      Cookies.set("userInfo", queryString.stringify(res.result));
                    }
                    this.setStore("userInfo", res.result);
                    this.$store.commit("setAvatarPath", res.result.avatar);
                    // 加载菜单
                    util.initRouter(this);
                    this.$router.push({
                      name: "home_index"
                    });
                  } else {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
              }
            });
          }
        });
      }
    },
    toGithubLogin() {
      this.socialLogining = true;
      githubLogin().then(res => {
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.socialLogining = false;
        }
      });
    },
    toQQLogin() {
      this.socialLogining = true;
      qqLogin().then(res => {
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.socialLogining = false;
        }
      });
    },
    toWeiboLogin() {
      this.socialLogining = true;
      weiboLogin().then(res => {
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.socialLogining = false;
        }
      });
    },
    toWeixinLogin() {
      this.$Message.error("开通微信登录官方收费300/年");
    },
    relatedLogin() {
      let q = this.$route.query;
      let error = q.error;
      if (error !== "" && error !== undefined) {
        this.$Message.error(error);
      }
      let related = q.related;
      let JWTKey = q.JWTKey;
      if (related && related === "1") {
        if (JWTKey !== "" && JWTKey !== undefined) {
          getJWT({ JWTKey: JWTKey }).then(res => {
            if (res.success) {
              this.socialLogining = true;
              this.setStore("accessToken", res.result);
              // 获取用户信息
              userInfo().then(res => {
                if (res.success === true) {
                  // 避免超过大小限制
                  delete res.result.permissions;
                  let roles = [];
                  res.result.roles.forEach(e => {
                    roles.push(e.name);
                  });
                  this.setStore("roles", roles);
                  // 保存7天
                  Cookies.set("userInfo", queryString.stringify(res.result), {
                    expires: 7
                  });
                  this.setStore("userInfo", res.result);
                  this.$store.commit("setAvatarPath", res.result.avatar);
                  // 加载菜单
                  util.initRouter(this);
                  this.$router.push({
                    name: "home_index"
                  });
                } else {
                  this.socialLogining = false;
                  this.$Message.error("使用第三方账号登录失败");
                }
              });
            } else {
              this.socialLogining = false;
              this.$Message.error("使用第三方账号登录失败");
            }
          });
        }
      } else {
        this.socialLogining = false;
      }
    },
    handleDropDown(v) {
      if (v == "showAccount") {
        this.showAccount();
      } else if (v == "resetByMobile") {
        this.$router.push({
          name: "reset"
        });
      } else if (v == "resetByEmail") {
        this.$router.push({
          name: "reset",
          query: {
            type: "1"
          }
        });
      }
    },
    showAccount() {
      this.$Notice.info({
        title: "体验账号密码",
        desc:
          "账号1：test 密码：123456 <br>账号2：test2 密码：123456 已开放注册！",
        duration: 10
      });
    },
    showMessage() {
      this.$Notice.success({
        title: "已升级至iView3.0",
        desc:
          "完善多项功能，包括数据权限、部门管理、定时任务、数据字典、前端模版等 修复已知BUG",
        duration: 5
      });
    }
  },
  mounted() {
    // this.showMessage();
    // this.showAccount();
    this.relatedLogin();
  }
};
</script>

<style lang="less">
@import "./login.less";
</style>