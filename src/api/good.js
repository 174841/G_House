import request from "./request";

//1.	获取商品列表
export function getGoodsListRequest(queryInfo) {
  return request({
    url: "/api/admin/goods",
    method: "get",
    params: {
      ...queryInfo
    },
  });
}


//2.	修改商品上架状态  
export function changGoodOnRequest(uid) {
    return request({
      url: `/api/admin/goods/${uid}/on`,
      method: "PATCH",
    });
  }


//3.	修改商品推荐状态  
  export function changGoodRecommendRequest(uid) {
    return request({
        url: `/api/admin/goods/${uid}/recommend`,
        method: "PATCH",
      });
  }

//   4.	添加新商品  
  export function addGoodRequest(userinfo) {
    console.log(userinfo);
    return request({
      url: "/api/admin/goods",
      method: "post",
      data:{
        category_id:userinfo.category_id,
        title:userinfo.title,
        description:userinfo.description,
        price:userinfo.price,
        stock:userinfo.stock,
        cover:userinfo.cover,
        details:userinfo.details,
      }
    });
  }


//   5.	根据ID查询商品信息
  export function getGoodByIdRequest(uid) {
    return request({
        url: `/api/admin/goods/${uid}`,
      });
  }

//   6.	编辑商品
export function editGoodByIdRequest(userInfo) {
    return request({
      url: `/api/admin/goods/${userInfo.id}`,
      method:"put",
      data:{
        category_id:userInfo.category_id,
        title:userInfo.title,
        description:userInfo.description,
        price:userInfo.price,
        stock:userInfo.stock,
        cover:userInfo.cover,
        details:userInfo.details,
      }
    });
  }

//   7.	获取商品分类信息  
export function getCategoriesListRequest(queryInfo) {
  return request({
    url: "/api/admin/category",
    method: "get",
    params: {
      ...queryInfo
    },
  });
}