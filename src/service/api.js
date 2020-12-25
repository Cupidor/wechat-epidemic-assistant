import Taro from "@tarojs/taro";
import { base } from "./config";
const token = "";

export default {
  baseOptions(params, method = "GET") {
    let { url, data } = params;
    let contentType = "application/x-www-form-urlencoded";
    contentType = params.contentType || contentType;
    const option = {
      isShowLoading: false,
      loadingText: "正在加载",
      url: base + url,
      data: data,
      method: method,
      header: { "content-type": contentType },
      success(res) {
        if (res.statusCode === 400) {
          /*Taro.reLaunch({
            url: "/pages/guide/home",
          });*/
        }
        return res.data;
      },
      error(e) {
        console.log("请求接口出现问题", e);
      },
    };
    return Taro.request(option);
  },
  get(url, data = "") {
    let option = { url, data };
    return this.baseOptions(option);
  },
  post: function (url, data, contentType) {
    let params = { url, data, contentType };
    return this.baseOptions(params, "POST");
  },
};
