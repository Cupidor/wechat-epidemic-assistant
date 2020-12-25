import Taro, { Component } from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
import { systemId, imageUrl, base } from "../../service/config";
import { AtGrid, AtMessage, AtIcon } from "taro-ui";
import MyTabBar from "./components/tabBar";
import api from "../../service/api";

import Banner1 from "../../assets/img/logo_bannenr.png";
import icon_bd from "../../assets/img/icon_bd.png";
import icon_jk from "../../assets/img/icon_jk.png";
import icon_py from "../../assets/img/icon_py.png";
import icon_ky from "../../assets/img/icon_ky.png";
import icon_gs from "../../assets/img/icon_gs.png";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "首页",
  };

  constructor() {
    super();
    this.state = {
      current: 0,
    };
  }

  componentDidMount() {}

  // 选择工具
  handleToolClick = (item, index) => {
    switch (item.value) {
      case "产品查询":
        Taro.scanCode({
          success: (res) => {
            this.getProductDetail(res.result);
          },
          fail: (res) => {
            Taro.atMessage({
              message: "扫描失败",
              type: "warning",
            });
          },
        });
        break;
      case "物流查询":
        Taro.navigateTo({
          url: `/packageLogin/express/index`,
        });
        break;
      default:
        Taro.showToast({
          title: "即将上线，敬请期待",
          icon: "none",
        });
        break;
    }
  };

  render() {
    return (
      <View className="container">
        <AtMessage />
        <Swiper
          className="swiper"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          indicatorDots={false}
          autoplay
        >
          <SwiperItem>
            <Image className="banner-img" src={Banner1} />
          </SwiperItem>
        </Swiper>
        <View className="panel">
          <View className="panel__title">全国疫情统计</View>
        </View>
        <View className="now-content">
          <View className="at-article__info">截至 2020-12-24 17:20:59</View>
          <View className="at-article__info" style={{ color: "#373435" }}>
            各省疫情
            <AtIcon value="chevron-right" size="22" color="#373435"></AtIcon>
          </View>
        </View>
        <View className="now-content">
          <View className="now-data" style={{ backgroundColor: "#FD643A" }}>
            <View className="at-article-up">96145</View>
            <View className="at-article-down">累计确诊</View>
          </View>
          <View className="now-data" style={{ backgroundColor: "#FDC43A" }}>
            <View className="at-article-up">0</View>
            <View className="at-article-down">现存疑似</View>
          </View>
          <View className="now-data" style={{ backgroundColor: "#3A820D" }}>
            <View className="at-article-up">898301</View>
            <View className="at-article-down">累计治愈</View>
          </View>
          <View className="now-data" style={{ backgroundColor: "#8C8A8A" }}>
            <View className="at-article-up">4776</View>
            <View className="at-article-down">累计死亡</View>
          </View>
        </View>
        <View className="panel">
          <View className="panel__title">疫情百科</View>
        </View>
        <AtGrid
          className="tool-module"
          columnNum={2}
          mode="rect"
          hasBorder={true}
          data={[
            {
              image: icon_bd,
              value: "病毒知识",
            },
            {
              image: icon_jk,
              value: "健康科普",
            },
            {
              image: icon_ky,
              value: "科研进度",
            },
            {
              image: icon_gs,
              value: "战疫故事",
            },
            {
              image: icon_py,
              value: "科学辟谣",
            },
          ]}
          onClick={this.handleToolClick.bind(this)}
        />
        <MyTabBar index={this.state.current}></MyTabBar>
      </View>
    );
  }
}
