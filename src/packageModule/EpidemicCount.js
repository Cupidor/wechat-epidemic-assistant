import { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import "./style.scss";
import "../pages/guide/index.scss";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "各省疫情",
  };

  constructor() {
    super();
    this.state = {
      list: [
        {
          province: "湖北",
          diagnosed: 67794,
          suspected: 0,
          cured: 54278,
          died: 3085,
        },
        {
          province: "广东",
          diagnosed: 1357,
          suspected: 0,
          cured: 1303,
          died: 8,
        },
        {
          province: "河南",
          diagnosed: 1273,
          suspected: 0,
          cured: 1250,
          died: 22,
        },
        {
          province: "浙江",
          diagnosed: 1231,
          suspected: 0,
          cured: 1211,
          died: 1,
        },
      ],
    };
  }

  render() {
    const { list } = this.state;
    let content = list.map((item, index) => {
      return (
        <View key={index} className="table-content">
          <View className="table-line">{item.province}</View>
          <View className="table-line">{item.diagnosed}</View>
          <View className="table-line">{item.suspected}</View>
          <View className="table-line">{item.cured}</View>
          <View className="table-line">{item.died}</View>
        </View>
      );
    });
    return (
      <View className="container">
        <AtMessage />
        <View className="panel">
          <View className="panel__title">各省疫情 ( {list.length}行政区)</View>
        </View>
        <View className="table-content">
          <View className="table-line">城市</View>
          <View className="table-line">确诊</View>
          <View className="table-line">疑似</View>
          <View className="table-line">治愈</View>
          <View className="table-line">死亡</View>
        </View>
        {content}
      </View>
    );
  }
}
