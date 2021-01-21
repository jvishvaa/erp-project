const HOSTNAME = 'localhost'
const PORT = '9000'
const PROTO = 'http'
const BASE = `${PROTO}://${HOSTNAME}:${PORT}`

const urls = {
  base: `${BASE}`,
  discussion_form_loginApi: `${BASE}/qbox/authenticate/login/`,
  addAndGetCategoryUrl: `${BASE}/qbox/discuss/create_retrieve_category/`,
  updateCategoryApi: `${BASE}/qbox/discuss`,
  getCategoryListApi: `${BASE}/qbox/discuss/list_category/`,
  addAndGetSubCategoryApi: `${BASE}/qbox/discuss/create_retrieve_subcategory/`,
  updateSubCategoryApi: `${BASE}/qbox/discuss`,
  addAndGetSubSubCategoryApi: `${BASE}/qbox/discuss/create_retrieve_subsub_category/`,
  getSubCategoryListApi: `${BASE}/qbox/discuss/list_subcategory/`,
  updateSubSubCategoryApi: `${BASE}/qbox/discuss`,
  roleListApi: `${BASE}/qbox/authenticate/list_roles/`,
  usersListApi: `${BASE}/qbox/authenticate/list_users/`,
  createandGetUserAccessViewApi: `${BASE}/qbox/authenticate/create_retrieve_user_access/`,
  updateUserAccessApi: `${BASE}/qbox/authenticate/`,
  subSubCategoryGetListApi: `${BASE}/qbox/discuss/list_sub_subcategory/`,
  getPostListApi: `${BASE}/qbox/discuss/list_posts/`
}
export default urls
