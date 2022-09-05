import request from "./request";

//获取订单列表
export function getOrders(userInfo) {
  return request({
    url: "/api/admin/orders",
    method: "GET",
    params:{
      current:userInfo.current,
      order_no:userInfo.order_no,
      trade_no:userInfo.trade_no
    }
  });
}
// 获取订单详情
export function getXiangqin(uid) {
  return request({
    url: `/api/admin/orders/${uid}`,
    method: "GET",
  });
}
// 订单发货
// export function getXiangqin(userInfo) {
//   return request({
//     url: `/api/admin/orders/${userInfo.id}/post`,
//     method: "PATCH",
//     data:{
//       express_type:userInfo.express_type,
//       express_no:userInfo.express_no
//     }
//   });
// }