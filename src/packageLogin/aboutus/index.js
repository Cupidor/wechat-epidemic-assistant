import { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "关于我们",
  };

  constructor() {
    super();
  }

  render() {
    return (
      <View className="container">
        <View className="at-article">
          <View className="at-article__content">
            <View className="at-article__section">
              <View className="at-article__p">
                新冠肺炎疫情是今年最热门的话题，一场突如其来的疫情让人们都重视起来，我国是最早发现新冠肺炎疫情的地方，也是防控疫情做的最好的国家。国家投入大量人力物力打开一场疫情攻坚战，目前国内疫情控制效果非常良好，但是不排除有病毒卷土重来的可能性，况且国外的形式一直不容乐观。通过好的疫情防控小程序人们可以更好的查看出疫情实时数据以及日常生活中我们该怎样进行疫情防控，一有发现及时就医，进而让我们的生活更加轻松简单。
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
