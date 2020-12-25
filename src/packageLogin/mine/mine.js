import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtAvatar, AtMessage } from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { base, imageUrl, version } from "../../service/config";
import { showMessage } from "../../utils/common";
import { set as setGlobalData } from "../../utils/global_data";

import About from "../../assets/images/icon_about.png";
import IsRight from "../../assets/images/icon_right.png";
import Avatar from "../../assets/images/icon_avatar_person.png";
import MyBg from "../../assets/img/logo_direct.png";

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
    };
  }

  // 退出登录
  onLoginOut = () => {
    Taro.reLaunch({
      url: "/pages/login/index",
    });
  };

  // 进入关于我们（版权信息）
  onIntoAboutUs() {
    Taro.navigateTo({
      url: "/packageLogin/aboutus/index",
    });
  }

  componentWillMount() {}

  render() {
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
