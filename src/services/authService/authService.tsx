import { URL_UTILITY } from "../../utls/urlUtls";
import { postApi, getApi, putApi, deleteApi, patchApi } from "../../utls/http";
import axios from "axios";

export async function userRegisterApi(payload: any) {
  const url = URL_UTILITY.authUrl + "register";
  return await postApi(url, payload);
}

export async function adminLogin(payload: {
  email: string;
  password: string;
}) {
  const url = URL_UTILITY.authUrl + "admin/login";
  return await postApi(url, payload);
}
export async function sendOtpApi(payload: any) {
  const url = URL_UTILITY.authUrl + "request-otp";
  return await postApi(url, payload);
}
export async function verifyOtpApi(payload: any) {
  const url = URL_UTILITY.authUrl + "verify-otp";
  return await postApi(url, payload);
}
export async function refereshToken(payload: {
  refreshToken: string;
}) {
  const url = URL_UTILITY.authUrl + "refresh";
  return await postApi(url, payload);
}

export async function adminlogout(payload: {
  message: string;
}) {
  const url = URL_UTILITY.authUrl + "logout";
  return await postApi(url, payload);
}

export async function addProduct(payload: any) {
  const url = URL_UTILITY.adminUrl + "products";
  return await postApi(url, payload);
}
// export async function addProduct(payload: any) {
//   const url = URL_UTILITY.adminUrl + "products";
//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       'Authorization': `Bearer ${localStorage.getItem('token')}`
//     },
//     body: payload,
//   });
//   return await response.json();
// }

export async function updateProduct(id: string, payload: any) {
  const url = URL_UTILITY.adminUrl + `products/${id}`;
  return await putApi(url, payload);
}
export async function deactivateProduct(id: string) {
  const url = URL_UTILITY.adminUrl + `products/${id}`;
  return await deleteApi(url);
}
export async function getProduct(reqParams: any) {
  const url = URL_UTILITY.adminUrl + "products" + reqParams;
  return await getApi(url);
}
export async function getProductById(id: number) {
  const url = URL_UTILITY.adminUrl + `products/${id}`;
  return await getApi(url);
}
export async function getDashboardMetrics() {
  const url = URL_UTILITY.adminUrl + "dashboard";
  return await getApi(url);
}
export async function getRevenueSummay() {
  const url = URL_UTILITY.adminUrl + "revenue-summary";
  return await getApi(url);
}
export async function getOrderSummary() {
  const url = URL_UTILITY.adminUrl + "orders-summary";
  return await getApi(url);
}
export async function getOrderStatusSummary() {
  const url = URL_UTILITY.adminUrl + "order-status-count";
  return await getApi(url);
}
export async function getCustomerSummary() {
  const url = URL_UTILITY.adminUrl + "new-customers";
  return await getApi(url);
}
export async function getOrders(req: any) {
  const url = URL_UTILITY.adminUrl + `orders?${req}`;
  return await getApi(url);
}
export async function getLocations() {
  const url = URL_UTILITY.adminUrl + `locations`;
  return await getApi(url);
}
export async function addLocation(payload: any) {
  const url = URL_UTILITY.adminUrl + `locations`;
  return await postApi(url, payload);
}
export async function updateLocation(id: string, payload: any) {
  const url = URL_UTILITY.adminUrl + `locations/${id}`;
  return await putApi(url, payload);
}
export async function deactivateLocation(id: string) {
  const url = URL_UTILITY.adminUrl + `locations/${id}`;
  return await deleteApi(url);
}
export async function getUsers(reqParams: any) {
  const url = URL_UTILITY.adminUrl + `users` + reqParams;
  return await getApi(url);
}
export async function cancelOrder(id: any) {
  const url = URL_UTILITY.adminUrl + `orders/${id}/cancel`;
  return await putApi(url);
}
export async function updateOrderStatus(id: any, status: any) {
  const url = URL_UTILITY.adminUrl + `orders/${id}/status`;
  return await putApi(url, status);
}
export async function getSections() {
  const url = URL_UTILITY.adminUrl + `catalog/sections`;
  return await getApi(url);
}
export async function addSection(payload: any) {
  const url = URL_UTILITY.adminUrl + "catalog/sections";
  return await postApi(url, payload);
}
export async function getCategories(sec_id: string) {
  const url = URL_UTILITY.adminUrl + `catalog/categories?sectionId=${sec_id}`;
  return await getApi(url);
}
export async function addCategory(payload: any) {
  const url = URL_UTILITY.adminUrl + "catalog/categories";
  return await postApi(url, payload);
}
export async function getSubCategories(cat_id: string) {
  const url = URL_UTILITY.adminUrl + `catalog/categories/${cat_id}/subcategories`;
  return await getApi(url);
}
export async function addSubCategory(payload: any) {
  const url = URL_UTILITY.adminUrl + "catalog/subcategories";
  return await postApi(url, payload);
}
export async function getOrdersByUserId(id: string) {
  const url = URL_UTILITY.adminUrl + `orders/user/${id}/orders`;
  return await getApi(url);
}
export async function getReturnsByUserId(id: string) {
  const url = URL_UTILITY.adminUrl + `returns/user/${id}`;
  return await getApi(url);
}
export async function getInventories() {
  const url = URL_UTILITY.adminUrl + `inventory`;
  return await getApi(url);
}
export async function getOutOfStockInventories() {
  const url = URL_UTILITY.adminUrl + `inventory/out-of-stock`;
  return await getApi(url);
}
export async function getLowStockInventories() {
  const url = URL_UTILITY.adminUrl + `inventory/low-stock`;
  return await getApi(url);
}
export async function addInventory(payload: any) {
  const url = URL_UTILITY.adminUrl + "inventory";
  return await postApi(url, payload);
}
export async function getAllAttribute() {
  const url = URL_UTILITY.adminUrl + `catalog/attributes`;
  return await getApi(url);
}
export async function updateInventory(id: string, payload: object) {
  const url = URL_UTILITY.adminUrl + `inventory/${id}/adjust`;
  return await putApi(url, payload);
}
export async function getCartbyUserId(user_id: string) {
  const url = URL_UTILITY.adminUrl + `carts/users/${user_id}`;
  return await getApi(url);
}
export async function getInventorybyProductId(prod_id: string) {
  const url = URL_UTILITY.adminUrl + `inventory/product/${prod_id}`;
  return await getApi(url);
}
export async function getInventorybyLocId(loc_id: string) {
  const url = URL_UTILITY.adminUrl + `inventory/location/${loc_id}`;
  return await getApi(url);
}
export async function getAllReturns() {
  const url = URL_UTILITY.adminUrl + `returns/returns?page=0&size=1000`;
  return await getApi(url);
}
export async function updateReturnStatus(id: any, payload: any) {
  const url = URL_UTILITY.adminUrl + `returns/${id}`;
  return await putApi(url, payload);
}
export async function activateProductbyId(id: any) {
  const url = URL_UTILITY.adminUrl + `products/${id}/activate`;
  return await postApi(url);
}
export async function addVarients(id: any, payload: any) {
  const url = URL_UTILITY.adminUrl + `products/${id}/variants`;
  return await postApi(url, payload);
}
export async function addImages(id: any, payload: any) {
  const url = URL_UTILITY.adminUrl + `products/${id}/upload-images`;
  return await postApi(url, payload);
}
export async function getCartSummary() {
  const url = URL_UTILITY.adminUrl + `carts/summaries`;
  return await getApi(url);
}
export async function getAbandonedCart() {
  const url = URL_UTILITY.adminUrl + `carts/abandoned`;
  return await getApi(url);
}
export async function deactivateProductbyId(id: string) {
  const url = URL_UTILITY.adminUrl + `products/${id}`;
  return await deleteApi(url);
}
export async function deactivateVariantById(id: any) {
  const url = URL_UTILITY.adminUrl + `products/variants/${id}`;
  return await deleteApi(url);
}
export async function uploadVariantImage(variantId: number, imageFile: File) {
  const url = URL_UTILITY.adminUrl + `products/variants/${variantId}/image`;
  const formData = new FormData();
  formData.append("image", imageFile);
  return await postApi(url, formData);
}
export async function getWarehouses() {
  const url = URL_UTILITY.adminUrl + `warehouses`;
  return await getApi(url);
}
export async function addWarehouse(payload: any) {
  const url = URL_UTILITY.adminUrl + `warehouses`;
  return await postApi(url, payload);
}
export async function updateWarehouse(id: any, payload: any) {
  const url = URL_UTILITY.adminUrl + `warehouses/${id}`;
  return await putApi(url, payload);
}
export async function deactivateWarehouse(id: any) {
  const url = URL_UTILITY.adminUrl + `warehouses/${id}/deactivate`;
  return await patchApi(url);
}
export async function deleteWarehouse(id: any) {
  const url = URL_UTILITY.adminUrl + `warehouses/${id}`;
  return await deleteApi(url);
}
export async function getCatalogSections() {
  const url = URL_UTILITY.adminUrl + `catalog/sections`;
  return await getApi(url);
}
export async function getCatalogCategories(sec_id: any) {
  const url = URL_UTILITY.adminUrl + `catalog/categories?sectionId=${sec_id}`;
  return await getApi(url);
}
export async function getPendingReturns() {
  const url = URL_UTILITY.adminUrl + `returns/returns/pending`;
  return await getApi(url);
}
export async function approveReturn(id: any, payload: object) {
  const url = URL_UTILITY.adminUrl + `returns/returns/${id}/approve`;
  return await postApi(url, payload);
}
export async function rejectReturn(id: any, payload: object) {
  const url = URL_UTILITY.adminUrl + `returns/returns/${id}/approve`;
  return await postApi(url, payload);
}
export async function getCoupons(reqParams: any) {
  const url = URL_UTILITY.adminUrl + `coupon/coupons` + reqParams;
  return await getApi(url);
}
export async function createCoupon(payload: object) {
  const url = URL_UTILITY.adminUrl + `coupon`;
  return await postApi(url, payload);
}
export async function bulkCreateCoupon(payload: object) {
  const url = URL_UTILITY.adminUrl + `coupon/bulk`;
  return await postApi(url, payload);
}
export async function deleteCoupon(id: any) {
  const url = URL_UTILITY.adminUrl + `coupon/${id}`;
  return await deleteApi(url);
}
export async function updateCoupon(id: any, payload: object) {
  const url = URL_UTILITY.adminUrl + `coupon/${id}`;
  return await putApi(url, payload);
}
export async function getCouponUsage(id: any, reqParams: any) {
  const url = URL_UTILITY.adminUrl + `coupon/${id}/usage` + reqParams;
  return await getApi(url);
}
export async function addCatalogCategory(payload: object) {
  const url = URL_UTILITY.adminUrl + `catalog/categories`;
  return await postApi(url, payload);
}
export async function updateCatalogCategory(id: any, payload: object) {
  const url = URL_UTILITY.adminUrl + `catalog/${id}`;
  return await putApi(url, payload);
}
export async function deleteCatalogCategory(id: any) {
  const url = URL_UTILITY.adminUrl + `catalog/${id}`;
  return await deleteApi(url);
}