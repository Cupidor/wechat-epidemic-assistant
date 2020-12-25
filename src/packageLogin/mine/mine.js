import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import {
  AtAvatar,
  AtMessage,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { base, imageUrl, version } from "../../service/config";
import { showMessage } from "../../utils/common";
import { set as setGlobalData } from "../../utils/global_data";

import Man from "../../assets/images/icon_man.png";
import Women from "../../assets/images/icon_women.png";
import Project from "../../assets/images/icon_project.png";
import ProjectChild from "../../assets/images/icon_project_child.png";
import Help from "../../assets/images/icon_help.png";
import About from "../../assets/images/icon_about.png";
import In from "../../assets/images/icon_in.png";
import IsUp from "../../assets/images/icon_down_2.png";
import IsDown from "../../assets/images/icon_up.png";
import IsRight from "../../assets/images/icon_right.png";
import Avatar from "../../assets/images/icon_avatar_person.png";
const MyBg = imageUrl + "/bg_my_new.png";
import MyTabBar from "../../pages/guide/components/tabBar";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "我的",
  };

  constructor() {
    super();
    this.state = {
      current: 1,
      username: "",
      headimgurl: "",
      sex: "nan",
      admin: "",
      showpj: true,
      isOpened: false,
      isOpened_bind: false,
      isOpened_wechat: false,
      openid: "",
      isLogin: false,
      organizationId: "",
      organizationList: [],
    };
  }

  // 关闭解绑微信弹出框
  handleWechatClose() {
    this.setState({
      isOpened_wechat: false,
    });
  }

  // 关闭绑定微信弹出框
  handleWechatBindClose = () => {
    this.setState({
      isOpened_bind: false,
    });
  };

  // 微信绑定
  handleWechatBindConfirm = async () => {
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
      this.handleWechatBindClose();
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: `微信绑定失败：${response.data.message}`,
        type: "error",
      });
    }
  };

  // 确认微信解绑
  handleWechatConfirm = async () => {
    const res = await Taro.login();
    let parma = {
      weixinCode: res.code,
    };
    const list = await api.post("/user/user_unbind_weixin_applet", parma);
    this.setState({
      isOpened_wechat: false,
    });
    if (list.data.op === true) {
      Taro.atMessage({
        message: `解绑成功`,
        type: "success",
      });
    } else {
      Taro.atMessage({
        message: list.data.message,
        type: "warning",
      });
    }
  };

  // 微信解绑
  onWechatUntying() {
    const { openid } = this.state;
    if (openid === "") {
      Taro.atMessage({
        message: "您的用户账号未绑定微信",
        type: "warning",
      });
    } else {
      this.setState({
        isOpened_wechat: true,
      });
    }
  }

  // 退出登录
  onLoginOut = async () => {
    this.onLogin();
  };

  // 进入个人信息页面
  onIntoMyInfo() {
    Taro.navigateTo({
      url: "/packageLogin/personalinfo/index",
    });
  }

  // 进入关于我们（版权信息）
  onIntoAboutUs() {
    Taro.navigateTo({
      url: "/packageLogin/aboutus/index",
    });
  }

  //联系我们弹出框
  onIntoContentUs = () => {
    this.setState({
      isOpened: true,
    });
  };

  // 关闭弹出框
  handleClose() {
    this.setState({
      isOpened: false,
    });
  }

  // 显示和关闭工程列表手风琴
  onShowProjectList() {
    if (this.state.showpj === false) {
      this.setState({
        showpj: true,
      });
    } else {
      this.setState({
        showpj: false,
      });
    }
  }

  // 获取我的头像、性别
  getAdminDetail = async () => {
    const res = await api.post("/user/select_admin_detail");
    if (res.data.op === true) {
      setGlobalData("userId", res.data.result.id);
      setGlobalData("organizationId", res.data.result.organizationId);
      let myOrganizations = Taro.getStorageSync("myOrganizations");
      let organizationList = [];
      if (myOrganizations !== "" && typeof myOrganizations === "object") {
        let isExist = false;
        for (let item of myOrganizations) {
          if (item.id === res.data.result.organizationId) {
            isExist = true;
          }
        }
        if (isExist) {
          organizationList = myOrganizations;
        } else {
          let obj = Object.create(null);
          obj.name = res.data.result.organization.name;
          obj.id = res.data.result.organization.id;
          organizationList.push(obj);
        }
      } else {
        let obj = Object.create(null);
        obj.name = res.data.result.organization.name;
        obj.id = res.data.result.organization.id;
        organizationList.push(obj);
      }
      this.setState({
        isLogin: true,
        username: res.data.result.username,
        openid: res.data.result.weixin,
        organizationId: res.data.result.organizationId,
        organizationList,
      });
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
      }
      if (
        res.data.result.weixin === "" &&
        this.$router.params.type === "firstLogin"
      ) {
        this.setState({
          isOpened_bind: true,
        });
      }
    } else {
      this.setState({
        isLogin: false,
      });
    }
  };

  componentWillMount() {
    this.getAdminDetail();
  }

  render() {
    const { organizationList, organizationId, isLogin } = this.state;
    const content = organizationList.map((item) => {
      return (
        <View
          key={item.value}
          className={`${
            item.id === organizationId ? "project-list-1" : "project-list"
          }`}
        >
          <View
            className="project-line"
            onClick={this.OnSelecteOrgan.bind(this, item)}
          >
            <View className="project-left">
              <View className="project-left-img">
                <Image src={ProjectChild} className="project-img" />
              </View>
              <View>{item.name}</View>
            </View>
          </View>
        </View>
      );
    });
    return (
      <View className="container">
        <AtMessage />
        <View className="setting-bg">
          <Image src={MyBg} className="setting-bg-img" />
        </View>
        <View className="setting-other" />
        <View className="setting">
          <View className="setting-header">
            <View className="setting-info">
              <AtAvatar
                className="info-img"
                circle
                size="large"
                image={Avatar}
              />
              <View className="info">admin</View>
            </View>
          </View>
          <View className="setting-content">
            <View className="item" onClick={this.onIntoAboutUs}>
              <View className="item-left">
                <Image src={About} className="content-icon" />
                <View className="content-name">关于我们</View>
              </View>
              <View style="display:flex;align-items: center;">
                <View className="content-edition">版本{version}</View>
                <Image
                  src={IsRight}
                  className="content-icon-right content-icon-left"
                />
              </View>
            </View>
            <View className="login-out">
              <Text onClick={this.onLoginOut}>退出登录</Text>
            </View>
          </View>
        </View>

        <MyTabBar index={this.state.current}></MyTabBar>
      </View>
    );
  }
}
