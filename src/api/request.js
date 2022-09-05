import axios from "axios";
import { Message } from "element-ui";

// 创建axios实例
const service = axios.create({
  baseURL: "https://api.shop.eduwork.cn", // 用于配置请求接口公用部分，请求时会自动拼接在你定义的url前面。
  timeout: 3000, // 请求超时时间
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 设置token
    const token = window.sessionStorage.getItem("token")
      ? "Bearer " + window.sessionStorage.getItem("token")
      : "";
    config.headers.Authorization = token;

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    console.log(response);

    const { data, status, config } = response;
    if (status == 200) {
      return data;
    } else if (status == 204) {
      switch (config.method) {
        case "delete":
          Message.success("删除数据成功");
          break;
        case "put":
        case "patch":
          Message.success("修改数据成功");
          break;
        default:
          break;
      }
    } else if (status == 201) {
      Message.success("添加数据成功");
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const { data, status ,config } = error.response;
    if (status == 401) {
      // 登录信息错误情况
      if (data.message == "Unauthorized") {
        Message.error("登录失败");
      } else if (status == 404) {
        Message.error("获取数据失败");
      } else if (status == 422) {
        if (data.message == "The given data was invalid.") {
          switch(config.method){
            case "post" :
              Message.error("添加失败,请检查信息是否正确");
              break;
            case "put":
            case "patch":
              Message.error("修改数据失败,请检查信息是否正确");
              break;
            default:
              break;
          }
        }
      }
    }

    console.log(error);
    return Promise.reject(error);
  }
);

export default service;
