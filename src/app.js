import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";

import Index from "./pages/login/index";
import "weapp-cookie";

import "./app.scss";
import "taro-ui/dist/style/index.scss"; // 全局引入一次即可

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: [
      // 登录
      "pages/login/index",
      // 首页
      "pages/guide/home",
    ],
    subPackages: [
      {
        root: "packageLogin",
        pages: [
          // 注册
          "register/index",
          // 我的
          "mine/mine",
          // 关于我们
          "aboutus/index",
        ],
      },
      {
        root: "packageModule",
        pages: [
          // 各省疫情
          "EpidemicCount",
          // 病毒知识,健康科普
          "VirusKnowledge",
          // 科研进度,战疫故事
          "ResearchProgress",
          // 科学辟谣
          "RefutesRumors",
        ],
      },
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#2a8cff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "white",
    },
  };

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />;
  }
}

Taro.render(<App />, document.getElementById("app"));
