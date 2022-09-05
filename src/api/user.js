import request from "./request";

//用户列表
export function getUserListRequest(queryInfo) {
  return request({
    url: "/api/admin/users",
    method: "get",
    params: {
      ...queryInfo
    },
  });
}


//修改用户锁定状态
export function changUserStateRequest(uid) {
    return request({
      url: `/api/admin/users/${uid}/lock`,
      method: "PATCH",
    });
  }


//添加新用户
  export function addUserRequest(userinfo) {
    return request({
      url: "/api/admin/users",
      method: "post",
      data:{
        ...userinfo
      }
    });
  }


  export function getUserByIdRequest(uid) {
    return request({
      url: `/api/admin/users/${uid}`,
      
    });
  }



  export function editUserByIdRequest(userInfo) {
    return request({
      url: `/api/admin/users/${userInfo.id}`,
      method:"put",
      data:{
        name:userInfo.name,
        email:userInfo.email
      }
    });
  }