import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import {
  AtAvatar,
  AtMessage,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtButton,
  AtInput,
} from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { base, imageUrl } from "../../service/config";
import {
  showMessage,
  getLength,
  removeLastlastComma,
} from "../../utils/common";

import Man from "../../assets/images/icon_man.png";
import Women from "../../assets/images/icon_women.png";
import Edit from "../../assets/images/icon_edit.png";
import Avatar from "../../assets/images/icon_avatar_person.png";
import ModalClose from "../../assets/images/icon_close.png";
const BgPerson = imageUrl + "/bg_person.png";
export default class Index extends Component {
  config = {
    navigationBarTitleText: "个人信息",
    navigationBarBackgroundColor: "#00C0DD",
  };

  constructor() {
    super();
    this.state = {
      username: "",
      headimgurl: "",
      sex: "nan",
      admin: "",
      realname: "未填写",
      telephone: "",
      telephones: "未填写",
      email: "",
      weixin: false,
      department: "未填写",
      profession: "未填写",
      introduce: "未填写",
      // 绑定微信
      bindwechat: false,
      // 绑定手机
      showphone: false,
      telephone_: "",
      verify_: "",
      title: "绑定手机号",
      phonesend: "发送验证码",
      countdown: 60,
      disabled: false,
      // 绑定邮箱
      showemail: false,
      email_: "",
      emailverify_: "",
      titlemail: "绑定邮箱",
      emailsend: "发送验证码",
      emailcountdown: 60,
      emaildisabled: false,
    };
  }

  // 跳转至编辑个人信息
  onIntoEdit() {
    Taro.navigateTo({
      url: "/packageLogin/editinfo/index",
    });
  }

  // 绑定手机号
  onBindTelephone(title, e) {
    this.setState({
      showphone: true,
      title: title,
      telephone_: "",
      verify_: "",
    });
  }

  // 发送绑定手机验证码
  onSendVerify = async () => {
    const { telephone_ } = this.state;
    if (telephone_ === "") {
      Taro.atMessage({
        message: "手机号码不可以为空",
        type: "warning",
      });
    } else if (getLength(telephone_) < 11) {
      Taro.atMessage({
        message: "手机号码必须为11位",
        type: "warning",
      });
    } else {
      let parma = {
        telephone: telephone_,
      };
      const res = await api.post("/user/send_bind_telephone_msg", parma);
      if (res.data.op === true) {
        Taro.atMessage({
          message: "成功发送短信验证码",
          type: "success",
        });
        let timer = setInterval(
          function () {
            this.setState({
              phonesend: `${this.state.countdown}s重新发送`,
              countdown: this.state.countdown - 1,
              disabled: true,
            });
            if (this.state.countdown < 0) {
              clearInterval(timer);
              this.setState({
                phonesend: "发送验证码",
                countdown: 60,
                disabled: false,
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

  // 绑定手机号确定
  onUpdateTel = async () => {
    const { telephone_, verify_ } = this.state;
    if (telephone_ === "" || verify_ === "") {
      Taro.atMessage({
        message: "手机号或验证码不可以为空",
        type: "warning",
      });
      return;
    }
    let parma = {
      telephone: telephone_,
      code: verify_,
    };
    const res = await api.post("/user/update_account_telephone", parma);
    if (res.data.op === true) {
      Taro.atMessage({
        message: "手机号绑定成功",
        type: "success",
      });
      this.handleClose();
      this.getPersonalInfo();
    } else {
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
  };

  // 发送绑定邮箱验证码
  onSendEmailVerify = async () => {
    const { email_ } = this.state;
    if (email_ === "") {
      Taro.atMessage({
        message: "邮箱不可以为空",
        type: "warning",
      });
    } else {
      let parma = {
        emailAccount: email_,
      };
      const res = await api.post("/user/send_bind_email_msg", parma);
      if (res.data.op === true) {
        Taro.atMessage({
          message: "成功发送邮箱验证码",
          type: "success",
        });
        let emailtimer = setInterval(
          function () {
            this.setState({
              emailsend: `${this.state.emailcountdown}s重新发送`,
              emailcountdown: this.state.emailcountdown - 1,
              emaildisabled: true,
            });
            if (this.state.emailcountdown < 0) {
              clearInterval(emailtimer);
              this.setState({
                emailsend: "发送验证码",
                emailcountdown: 60,
                emaildisabled: false,
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

  // 绑定邮箱确定
  onUpdateEmail = async () => {
    const { email_, emailverify_ } = this.state;
    if (email_ === "" || emailverify_ === "") {
      Taro.atMessage({
        message: "邮箱账号或验证码不可以为空",
        type: "warning",
      });
      return;
    }
    let parma = {
      emailAccount: email_,
      code: emailverify_,
    };
    const res = await api.post("/user/update_account_email", parma);
    if (res.data.op === true) {
      Taro.atMessage({
        message: "邮箱绑定成功",
        type: "success",
      });
      this.handleEmailClose();
      this.getPersonalInfo();
    } else {
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
  };

  // 关闭绑定手机号弹出框
  handleClose() {
    this.setState({
      showphone: false,
    });
  }

  // 关闭绑定邮箱弹出框
  handleEmailClose() {
    this.setState({
      showemail: false,
    });
  }

  // 绑定邮箱
  onBindEmail(title, e) {
    this.setState({
      showemail: true,
      titlemail: title,
      email_: "",
      emailverify_: "",
    });
  }

  // 打开微信绑定弹出框
  onOpenBindWeixin() {
    this.setState({
      bindwechat: true,
    });
  }

  // 微信绑定取消
  handleBindWechatClose() {
    this.setState({
      bindwechat: false,
    });
  }

  // 微信绑定确认
  handleBindWechatConfirm() {
    this.onBindWeixin();
  }

  // 微信绑定
  onBindWeixin = async () => {
    const res = await Taro.login();
    let parma = {
      weixinCode: res.code,
    };
    const response = await api.post("/user/user_bind_weixin_applet", parma);
    this.setState({
      bindwechat: false,
    });
    if (response.data.op === true) {
      Taro.hideLoading();
      Taro.atMessage({
        message: "微信绑定成功",
        type: "success",
      });
      this.setState({
        weixin: true,
      });
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: `微信绑定失败：${response.data.message}`,
        type: "error",
      });
    }
  };

  handleTelnumChange(e) {
    this.setState({
      telephone_: e,
    });
  }

  handleEmailChange(e) {
    this.setState({
      email_: e,
    });
  }

  handleVerifyChange(e) {
    this.setState({
      verify_: e,
    });
  }

  handleEmailVerifyChange(e) {
    this.setState({
      emailverify_: e,
    });
  }

  // 获取个人信息
  getPersonalInfo = async () => {
    const res = await api.post("/user/select_admin_detail");
    Taro.showLoading({
      title: "loading",
    });
    if (res.data.op === true) {
      this.setState({
        username: res.data.result.username,
        telephone: res.data.result.telephone,
        email: res.data.result.email,
      });
      if (res.data.result.weixin !== "") {
        this.setState({
          weixin: true,
        });
      }
      if (res.data.result.userDetail !== null) {
        let detail = res.data.result.userDetail;
        if (detail.sex) {
          this.setState({
            sex: detail.sex,
          });
        }
        if (detail.image) {
          const list = await Taro.request({
            url: `${base}/up_down/download?filePK=${detail.image}`,
            responseType: "arraybuffer",
          });
          let fileurl = `data:image/png;base64,${Taro.arrayBufferToBase64(
            list.data
          )}`;
          this.setState({
            headimgurl: fileurl,
          });
        }
        if (detail.realName && detail.realName !== "") {
          this.setState({
            realname: detail.realName,
          });
        }
        if (
          detail.telephones &&
          detail.telephones.length !== 0 &&
          detail.telephones[0] !== ""
        ) {
          let list = "";
          for (let item of detail.telephones) {
            list += `${item}、`;
          }
          this.setState({
            telephones: removeLastlastComma(list),
          });
        } else {
          this.setState({
            telephones: "未填写",
          });
        }
        if (detail.position && detail.position !== "") {
          this.setState({
            profession: detail.position,
          });
        }
        if (detail.workUnit && detail.workUnit !== "") {
          this.setState({
            department: detail.workUnit,
          });
        }
        if (detail.detail && detail.detail !== "") {
          this.setState({
            introduce: detail.detail,
          });
        }
      }
      Taro.hideLoading();
    } else {
      showMessage(res.data.message);
    }
  };

  componentDidShow() {
    this.getPersonalInfo();
  }

  render() {
    const {
      headimgurl,
      username,
      sex,
      admin,
      realname,
      telephone,
      telephones,
      email,
      weixin,
      department,
      profession,
      introduce,
      showphone,
      showemail,
    } = this.state;
    return (
      <View className="container">
        <View className="info-backimg">
          <Image src={BgPerson} className="bg-person" />
        </View>
        <AtMessage />
        <View className="info-mypic">
          {headimgurl === "" && (
            <AtAvatar className="info-pic" circle size="large" image={Avatar} />
          )}
          {headimgurl !== "" && (
            <AtAvatar
              className="info-pic"
              circle
              size="large"
              image={headimgurl}
            />
          )}
        </View>
        <View className="info-edit" onClick={this.onIntoEdit}>
          <Image src={Edit} className="info-edit-img" />
          编辑
        </View>
        <View className="info-title">
          <View className="info-name">
            {username}
            {sex === "nan" && <Image src={Man} className="info-sex" />}
            {sex === "nv" && <Image src={Women} className="info-sex" />}
          </View>
          <View className="info-post">{admin}</View>
        </View>
        <View className="info-desc">
          <View className="info-line">
            <View className="info-left">真实姓名：</View>
            <View className="info-right">{realname}</View>
          </View>
          <View className="info-line">
            <View className="info-left">手机号码：</View>
            {telephone === "" && (
              <View style="display:flex">
                <View className="info-right">未绑定</View>
                <View
                  className="info-bind"
                  onClick={this.onBindTelephone.bind(this, "绑定手机号")}
                >
                  立即绑定
                </View>
              </View>
            )}
            {telephone !== "" && (
              <View style="display:flex">
                <View className="info-right">{telephone}</View>
                <View className="info-verify">已验证</View>
                <View
                  className="info-change"
                  onClick={this.onBindTelephone.bind(this, "更换绑定手机号")}
                >
                  （更换手机号）
                </View>
              </View>
            )}
          </View>
          <View className="info-line">
            <View className="info-left">备用号码：</View>
            <View className="info-right">{telephones}</View>
          </View>
          <View className="info-line">
            <View className="info-left">邮箱：</View>
            {email === "" && (
              <View style="display:flex">
                <View className="info-right">未绑定</View>
                <View
                  className="info-bind"
                  onClick={this.onBindEmail.bind(this, "绑定邮箱")}
                >
                  立即绑定
                </View>
              </View>
            )}
            {email !== "" && (
              <View style="display:flex">
                <View className="info-right">{email}</View>
                <View className="info-verify">已验证</View>
                <View
                  className="info-change"
                  onClick={this.onBindEmail.bind(this, "更换邮箱")}
                >
                  （更换）
                </View>
              </View>
            )}
          </View>
          <View className="info-line">
            <View className="info-left">微信：</View>
            {weixin ? (
              <View style="display:flex">
                <View className="info-verify">已绑定</View>
              </View>
            ) : (
              <View style="display:flex">
                <View className="info-right">未绑定</View>
                <View className="info-bind" onClick={this.onOpenBindWeixin}>
                  立即绑定
                </View>
              </View>
            )}
          </View>
          <View className="line-separate" />
          <View className="info-line">
            <View className="info-left">工作单位：</View>
            <View className="info-right">{department}</View>
          </View>
          <View className="info-line">
            <View className="info-left">职位：</View>
            <View className="info-right">{profession}</View>
          </View>
          <View className="line-separate" />
          <View>
            <Text className="info-left">简介：</Text>
            <Text className="info-right">{introduce}</Text>
          </View>
        </View>
        {/*绑定手机号*/}
        <AtModal isOpened={showphone} onClose={this.handleClose}>
          <AtModalHeader>
            <Text className="modal-title">{title}</Text>
            <Image
              src={ModalClose}
              className="modal-close"
              onClick={this.handleClose}
            />
          </AtModalHeader>
          {showphone && (
            <AtModalContent>
              <AtInput
                name="telephone_"
                clear
                title="手机号码"
                type="phone"
                placeholder="请输入手机号码"
                value={this.state.telephone_}
                onChange={this.handleTelnumChange.bind(this)}
              />
              <AtInput
                name="verify_"
                clear
                title="验证码"
                type="text"
                maxLength="4"
                placeholder="验证码"
                value={this.state.verify_}
                onChange={this.handleVerifyChange.bind(this)}
              >
                <AtButton
                  className="input-send"
                  disabled={this.state.disabled}
                  onClick={this.onSendVerify}
                >
                  {phonesend}
                </AtButton>
              </AtInput>
              <View className="modal-button">
                <View className="modal-button-1" onClick={this.handleClose}>
                  取消
                </View>
                <View className="modal-button-2" onClick={this.onUpdateTel}>
                  确定
                </View>
              </View>
            </AtModalContent>
          )}
        </AtModal>
        {/*绑定邮箱*/}
        <AtModal isOpened={showemail} onClose={this.handleEmailClose}>
          <AtModalHeader>
            <Text className="modal-title">{titlemail}</Text>
            <Image
              src={ModalClose}
              className="modal-close"
              onClick={this.handleEmailClose}
            />
          </AtModalHeader>
          {showemail && (
            <AtModalContent>
              <AtInput
                name="email_"
                clear
                title="邮箱账号"
                type="text"
                placeholder="请输入邮箱账号"
                value={this.state.email_}
                onChange={this.handleEmailChange.bind(this)}
              />
              <AtInput
                name="emailverify_"
                clear
                title="验证码"
                type="text"
                maxLength="8"
                placeholder="验证码"
                value={this.state.emailverify_}
                onChange={this.handleEmailVerifyChange.bind(this)}
              >
                <AtButton
                  className="input-send"
                  disabled={this.state.emaildisabled}
                  onClick={this.onSendEmailVerify}
                >
                  {emailsend}
                </AtButton>
              </AtInput>
              <View className="modal-button">
                <View
                  className="modal-button-1"
                  onClick={this.handleEmailClose}
                >
                  取消
                </View>
                <View className="modal-button-2" onClick={this.onUpdateEmail}>
                  确定
                </View>
              </View>
            </AtModalContent>
          )}
        </AtModal>
        {/*确认绑定微信*/}
        <AtModal
          isOpened={this.state.bindwechat}
          onClose={this.handleBindWechatClose}
        >
          <AtModalHeader>
            <Text className="modal-title">提示</Text>
            <Image
              src={ModalClose}
              className="modal-close"
              onClick={this.handleBindWechatClose}
            />
          </AtModalHeader>
          <AtModalContent>
            <View
              className="modal-line"
              style="display:flex;justify-content:center;margin-top:30px;"
            >
              您确定要绑定当前微信吗？
            </View>
            <View className="modal-button" style="margin-top:55px;">
              <View
                className="modal-button-1"
                onClick={this.handleBindWechatClose}
              >
                取消
              </View>
              <View
                className="modal-button-2"
                onClick={this.handleBindWechatConfirm}
              >
                确定
              </View>
            </View>
          </AtModalContent>
        </AtModal>
      </View>
    );
  }
}
