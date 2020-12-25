import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import {
  AtMessage,
  AtSteps,
  AtInput,
  AtButton,
  AtTabs,
  AtTabsPane,
  AtNoticebar,
} from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { getLength } from "../../utils/common";
import { md5 } from "../../utils/md5.js";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "重置密码",
  };

  constructor() {
    super();
    this.state = {
      current: 0,
      orgDomain: "",
      tabCurrent: 0,
      phone: "",
      phoneCode: "",
      phoneCountDown: 60,
      phoneSend: "发送验证码",
      email: "",
      emailCode: "",
      emailCountDown: 60,
      emailSend: "发送验证码",
      newPassword: "",
      newPasswordRepeat: "",
    };
  }

  // 监听机构名
  handleOrgChange(e) {
    this.setState({
      orgDomain: e,
    });
  }

  // 监听手机号
  handlePhoneChange(e) {
    this.setState({
      phone: e,
    });
  }

  // 监听手机验证码
  handlePhoneCodeChange(e) {
    this.setState({
      phoneCode: e,
    });
  }

  // 监听邮箱
  handleEmailChange(e) {
    this.setState({
      email: e,
    });
  }

  // 监听邮箱验证码
  handleEmailCodeChange(e) {
    this.setState({
      emailCode: e,
    });
  }

  // 监听新密码
  handlePwChange(e) {
    this.setState({
      newPassword: e,
    });
  }

  // 监听确认新密码
  handlePwRepeatChange(e) {
    this.setState({
      newPasswordRepeat: e,
    });
  }

  // 进入步骤2
  onSubmitStepOne = async () => {
    const { orgDomain } = this.state;
    if (orgDomain === "") {
      Taro.atMessage({
        message: "请输入机构名",
        type: "warning",
      });
    } else {
      let parma = {
        orgDomain: orgDomain,
      };
      const res = await api.post(
        `/common_api/login/check_organization_domain_existed`,
        parma
      );
      if (res.data.op === true) {
        this.setState({
          current: 1,
        });
      } else {
        Taro.atMessage({
          message: res.data.message,
          type: "error",
        });
      }
    }
  };

  // 进入步骤3
  onSubmitStepTwo = async () => {
    const {
      tabCurrent,
      orgDomain,
      phoneCode,
      phone,
      emailCode,
      email,
    } = this.state;
    let parma = {},
      type = "";
    if (tabCurrent === 0) {
      parma = {
        telephone: phone,
        smsCode: phoneCode,
        orgDomain: orgDomain,
      };
      type = "phone";
    } else {
      parma = {
        emailAccount: email,
        emailCode: emailCode,
        orgDomain: orgDomain,
      };
      type = "email";
    }
    const res = await api.post(
      `/common_api/login/check_reset_password_by_${type}`,
      parma
    );
    if (res.data.op === true) {
      this.setState({
        current: 2,
      });
    } else {
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
  };

  // 选择验证方式
  handleClick(value) {
    this.setState({
      tabCurrent: value,
    });
  }

  // 上一步
  onPrev = () => {
    this.setState({
      current: this.state.current - 1,
    });
  };

  // 发送手机验证码
  onSendPhoneCode = async () => {
    const { orgDomain, phone } = this.state;
    if (phone === "") {
      Taro.atMessage({
        message: "手机号码不可以为空",
        type: "warning",
      });
    } else if (getLength(phone) < 11) {
      Taro.atMessage({
        message: "手机号码必须为11位",
        type: "warning",
      });
    } else {
      let parma = {
        telephone: phone,
        orgDomain: orgDomain,
      };
      const res = await api.post(
        "/common_api/login/send_reset_password_by_phone",
        parma
      );
      if (res.data.op === true) {
        Taro.atMessage({
          message: "验证码发送成功",
          type: "success",
        });
        let inter = setInterval(
          function () {
            this.setState({
              phoneSend: `${this.state.phoneCountDown}s重新发送`,
              phoneCountDown: this.state.phoneCountDown - 1,
            });
            if (this.state.phoneCountDown < 0) {
              clearInterval(inter);
              this.setState({
                phoneSend: "发送验证码",
                phoneCountDown: 60,
              });
            }
          }.bind(this),
          1000
        );
      } else {
        Taro.atMessage({
          message: res.data.message,
          type: "error",
        });
      }
    }
  };

  // 发送邮箱验证码
  onSendEmailCode = async () => {
    const { orgDomain, email } = this.state;
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (email === "") {
      Taro.atMessage({
        message: "邮箱地址不可以为空",
        type: "warning",
      });
    } else if (!reg.test(email)) {
      Taro.atMessage({
        message: "邮箱格式不正确",
        type: "warning",
      });
    } else {
      let parma = {
        emailAccount: email,
        orgDomain: orgDomain,
      };
      const res = await api.post(
        "/common_api/login/send_reset_password_by_email",
        parma
      );
      if (res.data.op === true) {
        Taro.atMessage({
          message: "成功发送邮件验证码，请登录邮箱查收",
          type: "success",
        });
        let inter = setInterval(
          function () {
            this.setState({
              emailSend: `${this.state.emailCountDown}s重新发送`,
              emailCountDown: this.state.emailCountDown - 1,
            });
            if (this.state.emailCountDown < 0) {
              clearInterval(inter);
              this.setState({
                emailSend: "发送验证码",
                emailCountDown: 60,
              });
            }
          }.bind(this),
          1000
        );
      } else {
        Taro.atMessage({
          message: res.data.message,
          type: "error",
        });
      }
    }
  };

  // 确认新密码
  onSubmitPW = async () => {
    const { tabCurrent, newPassword, newPasswordRepeat } = this.state;
    let pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{6,12}/;
    if (newPassword === "") {
      Taro.atMessage({
        message: "请设置您的新密码",
        type: "warning",
      });
    } else if (!pattern.test(newPassword)) {
      Taro.atMessage({
        message: "密码必须由字母、数字、特殊符号组成，长度6-12位",
        type: "warning",
      });
    } else if (newPassword !== newPasswordRepeat) {
      Taro.atMessage({
        message: "两次密码输入不一致",
        type: "warning",
      });
    } else {
      let parma = {},
        type = "";
      if (tabCurrent === 0) {
        parma = {
          newPassword: md5(newPassword),
          orgDomain: this.state.orgDomain,
          telephone: this.state.phone,
          smsCode: this.state.phoneCode,
        };
        type = "phone";
      } else {
        parma = {
          newPassword: md5(newPassword),
          orgDomain: this.state.orgDomain,
          emailAccount: this.state.email,
          emailCode: this.state.emailCode,
        };
        type = "email";
      }
      const res = await api.post(
        `/common_api/login/reset_password_by_${type}`,
        parma
      );
      if (res.data.op === true) {
        let n = 3;
        let Timer = setInterval(() => {
          if (n === 0) {
            clearInterval(Timer);
            Taro.navigateBack({
              delta: 1,
            });
          } else {
            Taro.atMessage({
              message: `密码重置成功，${n}秒后跳转至登录界面`,
              type: "success",
            });
          }
          n--;
        }, 1000);
      } else {
        Taro.atMessage({
          message: res.data.message,
          type: "error",
        });
      }
    }
  };

  render() {
    const { current } = this.state;
    const items = [
      {
        title: "填写机构别名",
      },
      {
        title: "选择验证方式",
      },
      {
        title: "设置新密码",
      },
    ];
    const tabList = [{ title: "手机号验证" }, { title: "邮箱验证" }];
    return (
      <View className="container">
        <AtMessage />
        <AtSteps className="steps" items={items} current={current} />
        {current === 0 && (
          <View className="form">
            <AtInput
              clear
              title="机构别名"
              type="text"
              placeholder="请输入机构别名"
              value={this.state.orgDomain}
              onChange={this.handleOrgChange.bind(this)}
            />
            <AtButton
              className="next"
              onClick={this.onSubmitStepOne.bind(this)}
            >
              下一步
            </AtButton>
          </View>
        )}
        {current === 1 && (
          <View className="steps">
            <AtTabs
              current={this.state.tabCurrent}
              tabList={tabList}
              onClick={this.handleClick.bind(this)}
            >
              <AtTabsPane
                className="steps"
                current={this.state.tabCurrent}
                index={0}
              >
                <AtInput
                  clear
                  title="手机号"
                  type="phone"
                  placeholder="请输入绑定的手机号"
                  value={this.state.phone}
                  onChange={this.handlePhoneChange.bind(this)}
                >
                  {this.state.phoneSend === "发送验证码" ? (
                    <Text
                      style="color:#2782ed"
                      onClick={this.onSendPhoneCode.bind(this)}
                    >
                      发送验证码
                    </Text>
                  ) : (
                    <Text style="color:rgba(0, 0, 0, .25)">
                      {this.state.phoneSend}
                    </Text>
                  )}
                </AtInput>
                <AtInput
                  clear
                  title="短信验证码"
                  type="text"
                  placeholder="请输入短信验证码"
                  value={this.state.phoneCode}
                  onChange={this.handlePhoneCodeChange.bind(this)}
                />
              </AtTabsPane>
              <AtTabsPane
                className="steps"
                current={this.state.tabCurrent}
                index={1}
              >
                <AtInput
                  clear
                  title="邮箱"
                  type="text"
                  placeholder="请输入绑定的邮箱"
                  value={this.state.email}
                  onChange={this.handleEmailChange.bind(this)}
                >
                  {this.state.emailSend === "发送验证码" ? (
                    <Text
                      style="color:#2782ed"
                      onClick={this.onSendEmailCode.bind(this)}
                    >
                      发送验证码
                    </Text>
                  ) : (
                    <Text style="color:rgba(0, 0, 0, .25)">
                      {this.state.emailSend}
                    </Text>
                  )}
                </AtInput>
                <AtInput
                  clear
                  title="邮箱验证码"
                  type="text"
                  placeholder="请输入邮箱验证码"
                  value={this.state.emailCode}
                  onChange={this.handleEmailCodeChange.bind(this)}
                />
              </AtTabsPane>
            </AtTabs>
            <View className="buttons">
              <AtButton className="next" onClick={this.onPrev.bind(this)}>
                上一步
              </AtButton>
              <AtButton
                className="next"
                onClick={this.onSubmitStepTwo.bind(this)}
              >
                下一步
              </AtButton>
            </View>
          </View>
        )}
        {current === 2 && (
          <View className="steps">
            <AtNoticebar icon="bell" single>
              密码必须由字母、数字、特殊符号组成，长度6-12位
            </AtNoticebar>
            <AtInput
              clear
              className="steps"
              title="新密码"
              type="password"
              placeholder="请输入新密码"
              value={this.state.newPassword}
              onChange={this.handlePwChange.bind(this)}
            />
            <AtInput
              clear
              title="确认新密码"
              type="password"
              placeholder="请再次输入密码"
              value={this.state.newPasswordRepeat}
              onChange={this.handlePwRepeatChange.bind(this)}
            />
            <AtButton className="next" onClick={this.onSubmitPW.bind(this)}>
              确定
            </AtButton>
          </View>
        )}
      </View>
    );
  }
}
