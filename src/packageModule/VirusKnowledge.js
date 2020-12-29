import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage } from "taro-ui";
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
        obj.content = item.content;
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
    let content = list.map((item, index) => {
      return (
        <View className="at-article" key={index}>
          <View className="at-article__h2">
            {index + 1}.{item.title}
          </View>
          <View className="at-article__content">
            <View className="at-article__section">
              <View className="at-article__p">{item.content}</View>
            </View>
          </View>
        </View>
      );
    });
    return (
      <View className="container">
        <AtMessage />
        {content}
      </View>
    );
  }
}
