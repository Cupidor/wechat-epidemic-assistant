import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtRadio, AtMessage, AtSearchBar } from "taro-ui";
import "./index.scss";
import { set as setGlobalData } from "../../utils/global_data";
import api from "../../service/api";
import { waterId } from "../../service/config";

export default class Index extends Component {
  config = {
    navigationBarTitleText: "工程列表",
  };

  constructor() {
    super();
    this.state = {
      projectList: [],
      searchValue: "",
    };
    this.projects = [];
  }

  // 监听搜索条件改变
  onProjectChange = (e) => {
    this.setState({
      searchValue: e.trim(),
    });
  };

  // 搜索
  onActionClick() {
    const { searchValue } = this.state;
    let projectList = [];
    for (let item of this.projects) {
      if (item.label.indexOf(searchValue) !== -1) {
        projectList.push(item);
      }
    }
    this.setState({
      projectList,
    });
  }

  // 确认工程
  handleConfirm(id) {
    const { projectList } = this.state;
    let project = projectList.find((item) => {
      return item.value === id;
    });
    setGlobalData("project", project);
    Taro.setStorageSync("defaultNgnProjectId", id);
    if (project.value === waterId) {
      Taro.navigateTo({
        url: `/packageWater/module/index`,
      });
    } else {
      Taro.switchTab({
        url: "/pages/maps/index",
      });
    }
  }

  componentWillMount() {
    this.showProject();
  }

  // 获取工程列表
  showProject = async () => {
    Taro.showLoading({
      title: "loading",
    });
    const list = await api.post("/project/search_all_project_tree_by_user");
    if (list.data.op === true) {
      let data = [];
      for (let i = 0; i < list.data.result.length; i++) {
        let obj = {};
        obj.label = list.data.result[i].name;
        obj.value = list.data.result[i].id;
        obj.longitude = list.data.result[i].longitude;
        obj.latitude = list.data.result[i].latitude;
        data[i] = obj;
      }
      Taro.hideLoading();
      this.projects = data;
      let projectList = data.slice();
      this.setState(
        {
          projectList,
        },
        () => {
          if (this.$router.params.type === undefined) {
            if (projectList.length === 1) {
              this.handleConfirm(projectList[0].value);
            } else {
              let defaultNgnProjectId = Taro.getStorageSync(
                "defaultNgnProjectId"
              );
              if (defaultNgnProjectId !== "") {
                for (let item of projectList) {
                  if (item.value === defaultNgnProjectId) {
                    this.handleConfirm(defaultNgnProjectId);
                    return;
                  }
                }
              }
            }
          }
        }
      );
    } else {
      Taro.hideLoading();
      Taro.atMessage({
        message: list.data.message,
        type: "error",
      });
    }
  };

  componentDidMount() {}

  render() {
    const { projectList } = this.state;
    return (
      <View className="container">
        <AtMessage />
        <View className="panel">
          <AtSearchBar
            value={this.state.searchValue}
            onChange={this.onProjectChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
          />
          <View className="panel__title">选择工程（选择后下次默认进入）</View>
          <View className="panel__content no-padding">
            {projectList.length !== 0 ? (
              <View className="radio-container">
                <AtRadio
                  className="radio"
                  options={this.state.projectList}
                  onClick={this.handleConfirm.bind(this)}
                />
              </View>
            ) : (
              <View className="noproject">暂无工程</View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
