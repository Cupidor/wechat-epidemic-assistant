import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtNoticebar, AtIcon, AtMessage } from "taro-ui";
import "./index.scss";
import api from "../../service/api";
import { showMessage, getLength } from "../../utils/common";
import { set as setGlobalData } from "../../utils/global_data";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "备用手机号",
    navigationBarBackgroundColor: "#00C0DD",
  };

  constructor() {
    super();
    this.state = {
      telephones: [],
      count: 0,
      value: "",
    };
  }

  // 添加备用手机号
  onAddTelephone() {
    const { telephones, value } = this.state;
    let tele = telephones.slice();
    if (value === "") {
      Taro.atMessage({
        message: "手机号码不可以为空",
        type: "warning",
      });
    } else if (getLength(value) < 11) {
      Taro.atMessage({
        message: "手机号码必须为11位",
        type: "warning",
      });
    } else {
      if (tele.length >= 5) {
        Taro.atMessage({
          message: "最多添加5个备用手机",
          type: "warning",
        });
      } else {
        let isexist = false;
        for (let item of tele) {
          if (item === value) {
            isexist = true;
            Taro.atMessage({
              message: "该手机号码已存在",
              type: "warning",
            });
            break;
          }
        }
        if (isexist === false) {
          tele.push(value);
          this.onUpdate(tele);
        }
      }
    }
  }

  // 删除备用手机号
  onDeteleTelephone = (index, e) => {
    const { telephones } = this.state;
    telephones.splice(index, 1);
    this.onUpdate(telephones);
  };

  // 提交更新
  onUpdate = async (tele) => {
    let parma = {
      telephones: tele,
    };
    Taro.showLoading({
      title: "loading",
    });
    const res = await api.post("/user/update_login_user_detail", parma);
    if (res.data.op === true) {
      Taro.hideLoading();
      Taro.atMessage({
        message: "操作成功",
        type: "success",
      });
      this.setState({
        telephones: tele,
        count: tele.length,
      });
      setGlobalData("pagetwo", 1);
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: res.data.message,
        type: "error",
      });
    }
  };

  handleChange(value) {
    this.setState({
      value: value.target.value,
    });
  }

  componentWillMount() {}

  componentDidMount() {
    this.getOtherPhones();
  }

  // 获取备用手机号列表
  getOtherPhones = async () => {
    const res = await api.post("/user/select_admin_detail");
    Taro.showLoading({
      title: "loading",
    });
    if (res.data.op === true) {
      if (res.data.result.userDetail !== null) {
        let detail = res.data.result.userDetail;
        if (
          detail.telephones &&
          detail.telephones.length !== 0 &&
          detail.telephones[0] !== ""
        ) {
          this.setState({
            telephones: detail.telephones,
            count: detail.telephones.length,
          });
        }
      }
      Taro.hideLoading();
    } else {
      showMessage(res.data.message);
    }
  };

  componentWillUnmout() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    const { telephones } = this.state;
    const content = telephones.map((item, index) => {
      return (
        <View key={index} className="phone-line">
          <View>
            <AtIcon value="phone" className="phone-icon" />
            {item}
          </View>
          <View
            className="phone-detele"
            onClick={this.onDeteleTelephone.bind(this, index)}
          >
            删除
          </View>
        </View>
      );
    });
    return (
      <View className="container">
        <AtMessage />
        <AtNoticebar>
          注意：主手机号可用来接收报警；备用手机号只可用来接收报警（最多添加5个）
        </AtNoticebar>
        <View className="phone">
          <Input
            className="phone-input"
            type="number"
            maxLength="11"
            placeholder="请输入11位手机号码"
            placeholder-class="placeholder"
            value={this.state.value}
            onInput={this.handleChange.bind(this)}
          />
          <View className="phone-add" onClick={this.onAddTelephone}>
            添加
          </View>
        </View>
        {count === 0 && (
          <View className="phone-nodata">暂时未绑定备用手机号</View>
        )}
        {count !== 0 && content}
      </View>
    );
  }
}
