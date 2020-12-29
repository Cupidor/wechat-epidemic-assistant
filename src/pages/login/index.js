import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtButton, AtMessage, AtInput } from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import cookies from "weapp-cookie";
import { base } from "../../service/config";
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
      password: "",
    };
  }

  componentWillMount() {
    let username = cookies.get("username", base);
    let password = cookies.get("password", base);
    if (username && password) {
      this.setState({
        name: username,
        password: password,
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
    let parma = {
      username: username,
      password: password,
    };
    Taro.showLoading({
      title: "loading",
    });
    const res = await api.post("/login", parma);
    if (res.data.op === "success") {
      this.loginSuccess();
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
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

  // 注册
  onForgetPassWord = (e) => {
    Taro.navigateTo({
      url: `/packageLogin/register/index`,
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
