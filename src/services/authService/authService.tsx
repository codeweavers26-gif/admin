import { URL_UTILITY } from "../../utls/urlUtls";
import { postApi, getApi, putApi, deleteApi } from "../../utls/http";

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
export async function updateProduct(id: string, payload: any) {
  const url = URL_UTILITY.adminUrl + `products/${id}`;
  return await putApi(url, payload);
}
export async function deactivateProduct(id: string) {
  const url = URL_UTILITY.adminUrl + `products/${id}`;
  return await deleteApi(url);
}
export async function getProduct() {
  const url = URL_UTILITY.adminUrl + "products";
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
export async function getOrders(page: string, limit: string) {
  const url = URL_UTILITY.adminUrl + `orders?page=${page}&size=${limit}`;
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
export async function getUsers() {
  const url = URL_UTILITY.adminUrl + `users`;
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
  const url = URL_UTILITY.adminUrl + `catalog/sections/${sec_id}/categories`;
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