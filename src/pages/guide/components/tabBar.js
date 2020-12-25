import Taro, { Component } from "@tarojs/taro";
import { AtTabBar } from "taro-ui";
import MenuHome from "../../../assets/images/menu_home.png";
import MenuHomeSelected from "../../../assets/images/menu_home_selected.png";
import MenuNews from "../../../assets/images/menu_news.png";
import MenuNewsSelected from "../../../assets/images/menu_news_selected.png";
import MenuMy from "../../../assets/images/menu_my.png";
import MenuMySelected from "../../../assets/images/menu_my_selected.png";

export default class Index extends Component {
  constructor() {
    super();
    this.state = {};
  }

  // 切换TabBar
  handleClick = (e) => {
    if (this.props.index !== e) {
      switch (e) {
        case 0:
          Taro.redirectTo({
            url: `/pages/guide/home`,
          });
          break;
        case 1:
          Taro.redirectTo({
            url: `/packageLogin/mine/mine`,
          });
          break;
        default:
          Taro.showToast({
            title: "即将上线，敬请期待",
            icon: "none",
          });
          break;
      }
    }
  };

  render() {
    return (
      <AtTabBar
        fixed
        color="grey"
        selectedColor="#00C0DD"
        tabList={[
          {
            title: "首页",
            image: MenuHome,
            selectedImage: MenuHomeSelected,
          },
          /*{
            title: "动态",
            text: "new",
            image: MenuNews,
            selectedImage: MenuNewsSelected,
          },*/
          { title: "我的", image: MenuMy, selectedImage: MenuMySelected },
        ]}
        onClick={this.handleClick.bind(this)}
        current={this.props.index}
      />
    );
  }
}
