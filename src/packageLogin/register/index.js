import { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage, AtInput, AtButton, AtNoticebar } from "taro-ui";
import "./index.scss";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "注册",
  };

  constructor() {
    super();
    this.state = {
      newPassword: "",
    };
  }

  // 监听新密码
  handlePwChange(e) {
    this.setState({
      newPassword: e,
    });
  }

  // 注册
  onSubmitPW = () => {};

  render() {
    return (
      <View className="container">
        <AtMessage />
        <View className="steps">
          <AtNoticebar icon="bell" single>
            密码必须由字母、数字、特殊符号组成，长度6-12位
          </AtNoticebar>
          <AtInput
            clear
            className="steps"
            title="账号"
            placeholder="请输入账号"
            value={this.state.newPassword}
            onChange={this.handlePwChange.bind(this)}
          />
          <AtInput
            clear
            className="steps"
            title="密码"
            type="password"
            placeholder="请输入密码"
            value={this.state.newPassword}
            onChange={this.handlePwChange.bind(this)}
          />
          <AtButton className="next" onClick={this.onSubmitPW.bind(this)}>
            确定
          </AtButton>
        </View>
      </View>
    );
  }
}
