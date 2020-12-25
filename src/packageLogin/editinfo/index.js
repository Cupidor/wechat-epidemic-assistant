import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Picker } from "@tarojs/components";
import {
  AtAvatar,
  AtInput,
  AtForm,
  AtTextarea,
  AtList,
  AtListItem,
  AtMessage,
} from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { base } from "../../service/config";
import { showMessage } from "../../utils/common";
import {
  set as setGlobalData,
  get as getGlobalData,
} from "../../utils/global_data";

import Avatar from "../../assets/images/icon_avatar_person.png";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "编辑个人信息",
    navigationBarBackgroundColor: "#00C0DD",
  };

  constructor() {
    super();
    this.state = {
      username: "",
      realname: "",
      headimgurl: "",
      telephones: "",
      telephonecounts: "",
      department: "",
      profession: "",
      introduce: "",
      selector: ["男", "女"],
      selectorChecked: "",
      detail: "",
      ident: "",
      pk: "",
      noborder: false,
    };
  }

  // 监听修改真实姓名
  handleRNChange(event) {
    this.setState({
      realname: event,
    });
  }

  onChange = (e) => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
    });
  };

  // 监听修改工作单位
  handleDMChange(event) {
    this.setState({
      department: event,
    });
  }

  // 监听修改职称
  handlePFChange(event) {
    this.setState({
      profession: event,
    });
  }

  // 监听修改简介
  handleINChange(event) {
    this.setState({
      introduce: event.target.value,
    });
  }

  // 重置
  onReset() {
    this.getPersonalInfo();
  }

  // 提交更新
  onUpdate = async () => {
    let {
      realname,
      department,
      profession,
      selectorChecked,
      introduce,
      pk,
    } = this.state;
    let sex = "";
    if (selectorChecked === "男") {
      sex = "nan";
    } else {
      sex = "nv";
    }
    let parma = {
      realName: realname,
      sex: sex,
      workUnit: department,
      position: profession,
      detail: introduce,
      image: pk,
    };
    const res = await api.post("/user/update_login_user_detail", parma);
    if (res.data.op === true) {
      Taro.atMessage({
        message: "成功更新基本信息",
        type: "success",
      });
      setGlobalData("pageone", 1);
      this.getPersonalInfo();
    } else {
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
  };

  // 修改头像（Bug:取消选择会报错,但不影响）
  onChooseImage() {
    let _this = this;
    Taro.chooseImage &&
      Taro.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let tempFilePaths = res.tempFilePaths;
          _this.setState({
            headimgurl: tempFilePaths,
          });
          //发起上传
          Taro.uploadFile({
            url: `${base}/user/update_admin_image`,
            header: {
              "content-type": "multipart/form-data",
            },
            name: "imageFile",
            filePath: tempFilePaths[0],
            success: (resp) => {
              // 与wx.request不同，wx.uploadFile返回的是[字符串]，需要自己转为JSON格式
              let resultData = JSON.parse(resp.data);
              if (resultData.op === true) {
                Taro.atMessage({
                  message: "成功更新头像",
                  type: "success",
                });
              }
            },
            fail: () => {},
            complete: () => {},
          });
        },
        fail: function (err) {},
      });
  }

  // 跳转编辑备用手机号
  onEditTelephone() {
    Taro.navigateTo({
      url: "/packageLogin/editphone/index",
    });
  }

  componentDidMount() {
    this.getPersonalInfo();
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
      if (res.data.result.userDetail !== null) {
        let detail = res.data.result.userDetail;
        if (detail.sex) {
          let sex = "";
          if (detail.sex === "nan") {
            sex = "男";
          } else {
            sex = "女";
          }
          this.setState({
            selectorChecked: sex,
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
            pk: detail.image,
            headimgurl: fileurl,
          });
        } else {
          this.setState({
            pk: "",
            headimgurl: "",
          });
        }
        if (detail.realName && detail.realName !== "") {
          this.setState({
            realname: detail.realName,
          });
        } else {
          this.setState({
            realname: "",
          });
        }
        if (
          detail.telephones &&
          detail.telephones.length !== 0 &&
          detail.telephones[0] !== ""
        ) {
          this.setState({
            telephones: detail.telephones,
            telephonecounts: `${detail.telephones.length}个`,
          });
        } else {
          this.setState({
            telephones: [],
            telephonecounts: `0个`,
          });
        }
        if (detail.position && detail.position !== "") {
          this.setState({
            profession: detail.position,
          });
        } else {
          this.setState({
            profession: "",
          });
        }
        if (detail.workUnit && detail.workUnit !== "") {
          this.setState({
            department: detail.workUnit,
          });
        } else {
          this.setState({
            department: "",
          });
        }
        if (detail.detail && detail.detail !== "") {
          this.setState({
            introduce: detail.detail,
          });
        } else {
          this.setState({
            introduce: "",
          });
        }
      }
      Taro.hideLoading();
    } else {
      showMessage(res.data.message);
    }
  };

  componentDidShow() {
    if (getGlobalData("pagetwo") && getGlobalData("pagetwo") === 1) {
      this.getPersonalInfo();
      setGlobalData("pagetwo", 0);
    }
  }

  render() {
    return (
      <View className="container">
        <AtMessage />
        <View className="change-header" onClick={this.onChooseImage}>
          <View className="header-name">头像</View>
          {headimgurl === "" && (
            <AtAvatar className="header-pic" circle image={Avatar} />
          )}
          {headimgurl !== "" && (
            <AtAvatar className="header-pic" circle image={headimgurl} />
          )}
        </View>
        <View className="change-line" />
        <AtInput
          name="name"
          title="真实姓名"
          type="text"
          placeholder="请输入姓名"
          border={noborder}
          value={this.state.realname}
          onChange={this.handleRNChange.bind(this)}
        />
        <View className="change-line" />
        <Picker
          mode="selector"
          range={this.state.selector}
          onChange={this.onChange}
        >
          <AtListItem
            className="input-sex"
            arrow="right"
            title="性别"
            hasBorder={noborder}
            extraText={this.state.selectorChecked}
          />
        </Picker>
        <View className="change-line" />
        <AtListItem
          className="input-sex"
          arrow="right"
          title="备用号码"
          hasBorder={noborder}
          extraText={this.state.telephonecounts}
          onClick={this.onEditTelephone}
        />
        <View className="input-line" />
        <AtInput
          name="department"
          title="工作单位"
          type="text"
          placeholder="请输入工作单位"
          border={noborder}
          value={this.state.department}
          onChange={this.handleDMChange.bind(this)}
        />
        <View className="change-line" />
        <AtInput
          name="position"
          title="职位"
          type="text"
          placeholder="请输入职位"
          border={noborder}
          value={this.state.profession}
          onChange={this.handlePFChange.bind(this)}
        />
        <View className="input-line" />
        <View className="at-row row">
          <View className="at-col at-col-1 at-col--auto col">简介</View>
          <View className="at-col col-1">
            <AtTextarea
              value={this.state.introduce}
              onChange={this.handleINChange.bind(this)}
              maxLength={200}
              placeholder="输入简介..."
            />
          </View>
        </View>
        <View className="input-button">
          <View className="button-reset" onClick={this.onReset}>
            重置
          </View>
          <View className="button-submit" onClick={this.onUpdate}>
            确定
          </View>
        </View>
      </View>
    );
  }
}
