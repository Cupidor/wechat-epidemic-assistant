import Taro, { Component } from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
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
    enablePullDownRefresh: true,
  };

  constructor() {
    super();
    this.state = {
      time: "",
      current: 0,
      suspect: 0,
      heal: 0,
      confirm: 0,
      dead: 0,
    };
    this.areaTotal = [];
  }

  // 下拉刷新
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.getRealTimeData();
  }

  componentDidMount() {
    this.getRealTimeData();
  }

  // 获取实时数据
  getRealTimeData = async () => {
    Taro.showLoading({
      title: "loading",
    });
    const res = await api.post("/getReal");
    if (res.data.op === "success") {
      Taro.hideLoading();
      let json = res.data.data.chinaTotal;
      if (json) {
        this.setState({
          time: res.data.data.lastUpdateTime,
          suspect: json.suspect,
          heal: json.heal,
          confirm: json.confirm,
          dead: json.dead,
        });
      }
      this.areaTotal = res.data.data.areaTree[0].children;
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: "获取实时疫情数据失败",
        type: "error",
      });
    }
  };

  // 选择工具
  handleToolClick = (item, index) => {
    switch (item.value) {
      case "病毒知识":
        Taro.navigateTo({
          url: `/packageModule/VirusKnowledge?type=${item.value}`,
        });
        break;
      case "健康科普":
        Taro.navigateTo({
          url: `/packageModule/VirusKnowledge?type=${item.value}`,
        });
        break;
      case "科研进度":
        Taro.navigateTo({
          url: `/packageModule/ResearchProgress?type=${item.value}`,
        });
        break;
      case "战疫故事":
        Taro.navigateTo({
          url: `/packageModule/ResearchProgress?type=${item.value}`,
        });
        break;
      case "科学辟谣":
        Taro.navigateTo({
          url: `/packageModule/RefutesRumors?type=${item.value}`,
        });
        break;
      case "病毒知识":
        break;
      default:
        Taro.showToast({
          title: "即将上线，敬请期待",
          icon: "none",
        });
        break;
    }
  };

  // 查看各省疫情
  onShowDetail = () => {
    Taro.navigateTo({
      url: `/packageModule/EpidemicCount?data=${JSON.stringify(
        this.areaTotal
      )}`,
    });
  };

  render() {
    const { time, suspect, heal, confirm, dead } = this.state;
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
          <View className="at-article__info">截至 {time}</View>
          <View
            className="at-article__info"
            style={{ color: "#373435" }}
            onClick={this.onShowDetail}
          >
            各省疫情
            <AtIcon value="chevron-right" size="22" color="#373435"></AtIcon>
          </View>
        </View>
        <View className="now-content">
          <View className="now-data" style={{ backgroundColor: "#FD643A" }}>
            <View className="at-article-up">{confirm}</View>
            <View className="at-article-down">累计确诊</View>
          </View>
          <View className="now-data" style={{ backgroundColor: "#FDC43A" }}>
            <View className="at-article-up">{suspect}</View>
            <View className="at-article-down">现存疑似</View>
          </View>
          <View className="now-data" style={{ backgroundColor: "#3A820D" }}>
            <View className="at-article-up">{heal}</View>
            <View className="at-article-down">累计治愈</View>
          </View>
          <View className="now-data" style={{ backgroundColor: "#8C8A8A" }}>
            <View className="at-article-up">{dead}</View>
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
