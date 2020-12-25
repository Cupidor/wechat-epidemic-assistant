import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtActivityIndicator, AtMessage, AtSearchBar, AtCard } from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { formatTime } from "../../utils/common";
import ExpressSF from "../../assets/images/menu_express_sf.png";
import ExpressZTO from "../../assets/images/menu_express_zto.png";
import ExpressDeppon from "../../assets/images/menu_express_debang.png";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "物流查询",
    navigationBarBackgroundColor: "#00C0DD",
    enablePullDownRefresh: true,
  };

  constructor() {
    super();
    this.state = {
      searchValue: "",
      expressList: [],
      loading: false,
    };
  }

  // 下拉事件
  onPullDownRefresh() {
    Taro.stopPullDownRefresh();
    this.onActionClick();
  }

  // 监听输入
  onChange = (e) => {
    this.setState({
      searchValue: e.trim(),
    });
  };

  // 搜索
  onActionClick = async () => {
    const { searchValue } = this.state;
    if (searchValue === "") {
      Taro.atMessage({
        message: `收件人不可为空`,
        type: "warning",
      });
      return;
    }
    this.setState({
      loading: true,
    });
    let parma = {
      name: searchValue,
      fromOrigin: "njgn.com",
    };
    const list = await api.post(
      "/common_api/logistic/query_logistic_trace_by_name",
      parma
    );
    if (list.data.op === true) {
      let json = list.data.result;
      let expressList = [];
      for (let item of json) {
        let obj = Object.create(null);
        obj.logisticCode = item.logisticCode;
        obj.sendTime = item.sendTime;
        obj.count = item.count;
        obj.customerName = item.customerName;
        obj.shipperCompany = item.shipperCompany;
        switch (item.shipperCompany) {
          case "顺丰快递":
            obj.thumb = ExpressSF;
            //obj.companyCode = "shunfeng";
            obj.companyCode = "";
            break;
          case "中通快递":
            obj.thumb = ExpressZTO;
            obj.companyCode = "zhongtong";
            break;
          case "德邦物流":
            obj.thumb = ExpressDeppon;
            obj.companyCode = "debangwuliu";
            break;
          default:
            obj.companyCode = "";
            break;
        }
        obj.address = `${item.province}${item.city}${item.district}${item.detailAddress}`;
        expressList.push(obj);
      }
      expressList.sort((a, b) => b.sendTime - a.sendTime);
      this.setState({
        loading: false,
        expressList,
      });
    } else {
      this.setState({
        loading: false,
      });
      Taro.atMessage({
        message: list.data.message,
        type: "error",
      });
    }
  };

  // 查看物流轨迹
  onShowExpressDetail = (item, e) => {
    let number = item.logisticCode;
    let company = item.companyCode;
    Taro.navigateToMiniProgram({
      appId: "wx6885acbedba59c14",
      path: `/pages/result/result?nu=${number}&com=${company}&querysource=third_xcx`,
      success(res) {},
    });
  };

  render() {
    const { expressList } = this.state;
    const content = expressList.map((item, index) => {
      return (
        <AtCard
          className="card"
          key={index}
          extra="查看详情"
          title={item.logisticCode}
          thumb={item.thumb}
          onClick={this.onShowExpressDetail.bind(this, item)}
        >
          <View className="at-article__h3">
            发货时间：{formatTime(item.sendTime)}
          </View>
          <View className="at-article__h3">件数：{item.count}件</View>
          <View className="at-article__h3">收货人：{item.customerName}</View>
          <View className="at-article__h3">收货地址：{item.address}</View>
        </AtCard>
      );
    });
    return (
      <View className="container">
        <AtMessage />
        <AtSearchBar
          showActionButton
          value={this.state.searchValue}
          placeholder="请输入收件人姓名查询"
          onChange={this.onChange.bind(this)}
          onActionClick={this.onActionClick.bind(this)}
        />
        {expressList.length === 0 ? (
          <View className="express-nodata" style="position: relative">
            {loading ? (
              <AtActivityIndicator content="加载中..."></AtActivityIndicator>
            ) : (
              <Text>暂无物流信息</Text>
            )}
          </View>
        ) : (
          <View>
            <View className="express-info at-article__h3">
              您共有
              <Text style={{ color: "#20BC6E" }}>{expressList.length}条</Text>
              快递信息
            </View>
            {content}
          </View>
        )}
      </View>
    );
  }
}
