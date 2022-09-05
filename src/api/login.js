import request from "./request";

//登录验证
export function loginRequest(loginData) {
  return request({
    url: "/api/auth/login",
    method: "post",
    data: {
      email: loginData.email,
      password: loginData.password,
    },
  });
}