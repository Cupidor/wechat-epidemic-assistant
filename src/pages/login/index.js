import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text, Button } from "@tarojs/components";
import { AtButton, AtIcon, AtMessage, AtInput } from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { showMessage, getLength } from "../../utils/common";
import { md5 } from "../../utils/md5.js";
import cookies from "weapp-cookie";
import { base, systemId, imageUrl } from "../../service/config";
import LoginName from "../../assets/images/icon_name.png";
import LoginPass from "../../assets/images/icon_screct.png";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "",
  };

  constructor() {
    super();
    this.state = {
      name: "",
      organ: "",
      password: "",
      passorgan: "",
      user: "",
      login: true,
      phonenumber: "",
      phoneverify: "",
      phonesend: "发送验证码",
      countdown: 60,
      disabled: false,
      organizationId: "",
      iam: true,
      year: new Date().getFullYear(),
    };
  }

  componentWillMount() {
    let username = cookies.get("username", base);
    let password = cookies.get("password", base);
    let organ = cookies.get("organ", base);
    let userorgan = cookies.get("userorgan", base);
    let passorgan = cookies.get("passorgan", base);
    if (username && password) {
      this.setState({
        name: username,
        password: password,
      });
    }
    if (organ && userorgan && passorgan) {
      this.setState({
        organ: organ,
        user: userorgan,
        passorgan: passorgan,
      });
    }
  }

  // 监听账号
  handleNameChange(name) {
    this.setState({
      name,
    });
  }

  // 监听密码
  handlePassChange(password) {
    this.setState({
      password,
    });
  }

  // 监听机构别名
  handleOrganChange(organ) {
    this.setState({
      organ,
    });
  }

  // 监听用户名
  handleUserChange(user) {
    this.setState({
      user,
    });
  }

  // 监听机构号密码
  handlePassOrganChange(passorgan) {
    this.setState({
      passorgan,
    });
  }

  // 监听手机号码
  handlePNChange(phonenumber) {
    this.setState({
      phonenumber,
    });
  }

  // 监听短信验证码
  handlePVChange(phoneverify) {
    this.setState({
      phoneverify,
    });
  }

  // 登录
  login = async () => {
    let { name, password } = this.state;
    let username = `${name.trim()}`;
    if (username === "") {
      Taro.atMessage({
        message: "账号不可以为空",
        type: "warning",
      });
      return;
    }
    if (password === "") {
      Taro.atMessage({
        message: "密码不可以为空",
        type: "warning",
      });
      return;
    }
    this.loginSuccess();
    /*let parma = {
      username: username,
      password: md5(password.trim()),
      systemId: systemId,
      durationMinutes: 60 * 24 * 365,
    };
    Taro.showLoading({
      title: "loading",
    });
    const res = await api.post("/common_api/login/super_login_system", parma);
    if (res.data.op === true) {

    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }*/
  };

  // 登录成功
  loginSuccess = () => {
    Taro.hideLoading();
    Taro.showToast({
      title: "登录成功",
      icon: "success",
      duration: 1500,
      mask: false,
    });
    setTimeout(() => {
      Taro.redirectTo({
        url: `/pages/guide/home`,
      });
    }, 1500);
  };

  // 忘记密码
  onForgetPassWord = (e) => {
    Taro.navigateTo({
      url: `/packageLogin/resetpw/index`,
    });
  };

  render() {
    return (
      <View className="container">
        <AtMessage />
        <View className="login-image">
          <View className="login-title">疫情小助手</View>
        </View>
        <View className="login-module">
          <P class="login-name">账号</P>
          <View className="container-line">
            <Image src={LoginName} className="login-icon" />
            <View className="container-input">
              <AtInput
                clear
                placeholder="请输入账号"
                type="text"
                value={this.state.name}
                onChange={this.handleNameChange.bind(this)}
              />
            </View>
          </View>
          <P class="login-password">密码</P>
          <View className="container-line">
            <Image src={LoginPass} className="login-icon" />
            <View className="container-input">
              <AtInput
                clear
                adjustPosition
                placeholder="请输入密码"
                type="password"
                value={this.state.password}
                onChange={this.handlePassChange.bind(this)}
              />
            </View>
          </View>
        </View>
        <View class="login-forget" onClick={this.onForgetPassWord.bind(this)}>
          立即注册
        </View>
        <AtButton type="primary" className="login-button" onClick={this.login}>
          登录
        </AtButton>
      </View>
    );
  }
}
