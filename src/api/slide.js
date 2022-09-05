import request from "./request";

//获取轮播图列表

export function getSlideListRequest(queryInfo) {
    return request({
      url: "/api/admin/slides",
      method: "get",
      params: {
        ...queryInfo
      },
    });
  }

  //2.	修改轮播图锁定状态
  export function changeSlideStateRequest(uid) {
    return request({
      url: `/api/admin/slides/${uid}/status`,
      method: "PATCH",
    });
  }

//   3.	修改轮播图的排序
export function changeSlideSeqRequest(sildeinfo) {
    return request({
      url: `/api/admin/slides/${sildeinfo.id}/seq`,
      method: "PATCH",
      data:{
        seq:sildeinfo.seq
      }
    });
  }

  //添加新轮播图
  export function addUserRequest(userinfo) {
    console.log(userinfo)
    return request({
      url: "/api/admin/slides",
      method: "post",
      data:{
        ...userinfo
      }
    });
  }

//   5.	根据ID查询轮播图信息
export function getSlideByIdRequest(uid) {
    return request({
      url: `/api/admin/slides/${uid}`,
      method: "get",
    });
  }

  //编辑轮播图
  export function editSlideByIdRequest(userInfo) {
    return request({
      url: `/api/admin/slides/${userInfo.id}`,
      method:"put",
      data:{
        title:userInfo.title,
        img:userInfo.img,
        url:userInfo.url
      }
    });
  }

//   7.	删除轮播图
export function removeSlideByIdRequest(id) {
    return request({
      url: `/api/admin/slides/${id}`,
      method:"DELETE"
    });
  }