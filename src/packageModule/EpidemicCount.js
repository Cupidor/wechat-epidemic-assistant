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
      list: [],
    };
  }

  componentDidMount() {
    let data = JSON.parse(this.$router.params.data);
    let list = [];
    for (let item of data) {
      let obj = Object.create(null);
      obj.city = item.name;
      obj.confirm = item.total.confirm;
      obj.suspect = item.total.suspect;
      obj.heal = item.total.heal;
      obj.dead = item.total.dead;
      list.push(obj);
    }
    this.setState({
      list,
    });
  }

  render() {
    const { list } = this.state;
    let content = list.map((item, index) => {
      return (
        <View key={index} className="table-content">
          <View className="table-line">{item.city}</View>
          <View className="table-line">{item.confirm}</View>
          <View className="table-line">{item.suspect}</View>
          <View className="table-line">{item.heal}</View>
          <View className="table-line">{item.dead}</View>
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
