import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage, AtTimeline } from "taro-ui";
import api from "../service/api";
import "./style.scss";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "",
    enablePullDownRefresh: true,
  };

  constructor() {
    super();
    this.state = {
      type: "",
      list: [],
    };
  }

  // 下拉刷新
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.getNews();
  }

  componentDidMount() {
    this.setState(
      {
        ...this.$router.params,
      },
      () => {
        Taro.setNavigationBarTitle({
          title: this.state.type,
        });
        this.getNews();
      }
    );
  }

  // 获取数据
  getNews = async () => {
    const { type } = this.state;
    Taro.showLoading({
      title: "loading",
    });
    let parma = {
      type: type,
    };
    const res = await api.post("/getNews", parma);
    if (res.data.op === "success") {
      let list = [];
      for (let item of res.data.data) {
        let obj = Object.create(null);
        obj.time = new Date(item.time).getTime();
        obj.title = item.title;
        let arr = [];
        arr.push(item.content);
        obj.content = arr;
        list.push(obj);
      }
      list.sort((a, b) => b.time - a.time);
      Taro.hideLoading();
      this.setState({
        list,
      });
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
  };

  render() {
    const { list } = this.state;
    return (
      <View className="progress-container">
        <AtMessage />
        <AtTimeline
          pending
          items={list}
          className="progress-timeline"
        ></AtTimeline>
      </View>
    );
  }
}
