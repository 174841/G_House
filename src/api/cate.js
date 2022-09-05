import request from "./request";

//1.	获取分类列表
export function getCategoriesListRequest(queryInfo) {
  return request({
    url: "/api/admin/category",
    method: "get",
    params: {
      ...queryInfo
    },
  });
}


//2.	修改分类启用状态
export function changCategoryStateRequest(uid) {
    return request({
      url: `/api/admin/category/${uid}/status`,
      method: "PATCH",
    });
  }


//3.	添加新分类
  export function addCategoryRequest(userinfo) {
    return request({
      url: "/api/admin/category",
      method: "post",
      data:{
        ...userinfo
      }
    });
  }

//   4.	根据ID查询分类信息
  export function getCategoryByIdRequest(uid) {
    return request({
      url: `/api/admin/category/${uid}`,
      
    });
  }


//   5.	编辑分类
  export function editCategoryByIdRequest(userInfo) {
    return request({
      url: `/api/admin/category/${userInfo.id}`,
      method:"put",
      data:{
        name:userInfo.name,
        pid:userInfo.pid
      }
    });
  }