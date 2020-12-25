import { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import "./style.scss";
import logo_false from "../assets/img/logo_false.png";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "科学辟谣",
  };

  constructor() {
    super();
    this.state = {
      list: [
        {
          id: 1,
          title: "喝酒可以抗病毒",
          content:
            "李兰娟院士辟谣：我说酒精消毒，可没让你们多喝酒啊!喝进身体的高度酒，只会被吸收代谢，不会作用于病毒。",
        },
        {
          id: 2,
          title: "双黄连可以预防新冠病毒？",
          content:
            "现有临床研究数据不足，不建议用双黄连预防新冠病毒,2013和2014年的国家药品不良反应监测年度报告显示，双黄连合剂（口服液、颗粒、胶囊、片）在中成药口服制剂中不良反应中分列第二名和第一名。而关于它在人体中「可抑制新型冠状病毒」的效果，目前的公开数据不足以得到证明。",
        },
        {
          id: 3,
          title: "确诊患者要自己承担40%的治疗费用？",
          content:
            "确诊患者不需要自己承担费用，各级财政会进行兜底,2月7日，财政部副部长余蔚平在新闻发布会上说，对确诊患者个人负担费用进行财政兜底，其中，中央财政补助 60% ；对疑似患者，由就医地制定财政补助政策，中央财政视情给予适当补助。丁香医生团队向政府相关部门求证：确诊患者不需要自己承担费用，各级财政会进行兜底。我们也在此呼吁：千万不要因为钱的问题逃避治疗！",
        },
        {
          id: 4,
          title: "用微波炉加热口罩可以消毒？",
          content:
            "不可以。如果用微波炉或电烤箱加热口罩，一方面口罩内部结构破坏，口罩无法再次使用；另一方面，微波炉或电烤箱由于处理医疗垃圾，也不能继续加热食物。",
        },
        {
          id: 5,
          title: "喝60℃的水可以杀死病毒？",
          content:
            "人体是恒温的，会散热。另外全球肿瘤医生网提醒大家，喝过烫的水容易损伤食管，增加患食管癌的风险。",
        },
      ],
    };
  }

  render() {
    const { list } = this.state;
    let content = list.map((item, index) => {
      return (
        <View className="rumor" key={index}>
          <View className="at-article__h2 rumor-title">{item.title}</View>
          <View className="at-article__content rumor-content">
            <View className="at-article__section">
              <View className="at-article__p">{item.content}</View>
            </View>
          </View>
          <Image src={logo_false} className="rumor-img"></Image>
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
