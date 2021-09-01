import axios from '@/libs/api.request'
import { encryption } from '@/libs/util'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return axios.request({
    url: '/v1/save_error_logger',
    data: info,
    method: 'post'
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}

// ------------------------以下是新加的-----------------

export const getSysEnums = () => {
  return axios.request({
    url: '/v1/common/enums',
    method: 'get'
  })
}

// 获取区域列表
export const getAreaList = (params) => {
  return axios.request({
    url: '/v1/area',
    method: 'get',
    params: params
  })
}
// 获取区域的关联区域（机构）
export const getAreaAreas = (params) => {
  return axios.request({
    url: '/v1/area/relation',
    method: 'get',
    params: params
  })
}
// 添加区域的关联区域（机构）
export const addAreaAreas = (params) => {
  return axios.request({
    url: '/v1/area/relation',
    method: 'post',
    data: params
  })
}
// 解除区域的关联区域（机构）
export const delAreaAreas = (params) => {
  return axios.request({
    url: '/v1/area/relation',
    method: 'delete',
    data: params
  })
}
// 添加区域信息
export const addArea = (params) => {
  return axios.request({
    url: '/v1/area',
    method: 'post',
    data: params
  })
}
// 修改区域信息
export const updateArea = (params) => {
  return axios.request({
    url: '/v1/area',
    method: 'put',
    data: params
  })
}
// 修改区域状态
export const updateAreaStatus = (params) => {
  return axios.request({
    url: '/v1/area/status',
    method: 'put',
    data: params
  })
}
// 删除区域信息
export const delArea = ({ id }) => {
  return axios.request({
    url: '/v1/area',
    method: 'delete',
    params: { id }
  })
}
// 根据区域获取机构详情
export const getAreaOrganization = (params) => {
  return axios.request({
    url: '/v1/frontend/area_organization',
    method: 'get',
    params: params
  })
}
// 获取机构列表
export const getOrganizationList = (params) => {
  return axios.request({
    url: '/v1/organization',
    method: 'get',
    params: params
  })
}
// 添加机构信息
export const addOrganization = (params) => {
  return axios.request({
    url: '/v1/organization',
    method: 'post',
    data: params
  })
}
// 修改机构信息
export const updateOrganization = (params) => {
  return axios.request({
    url: '/v1/organization',
    method: 'put',
    data: params
  })
}
// 删除机构信息
export const delOrganization = ({ id }) => {
  return axios.request({
    url: '/v1/organization',
    method: 'delete',
    params: { id }
  })
}

// 获取机构关联的内容列表
export const getOrgCanRecommendArticles = (params) => {
  return axios.request({
    url: '/v1/article/can_relation_list',
    method: 'get',
    params: params
  })
}
// 添加机构内关联
export const addOrgRecommendArticle = (params) => {
  return axios.request({
    url: '/v1/article/show_location',
    method: 'post',
    data: params
  })
}
// 解除机构内关联
export const delOrgRecommendArticle = (params) => {
  return axios.request({
    url: '/v1/article/show_location',
    method: 'delete',
    data: params
  })
}

// 上传文件
export const uploadImg = (params) => {
  return axios.request({
    url: '/v1/common/upload_file',
    method: 'post',
    data: params
  })
}
// 删除文件
export const delMedia = (params) => {
  return axios.request({
    url: '/v1/common/del_media',
    method: 'delete',
    data: params
  })
}
// 保存SEO
export const saveSeo = (params) => {
  return axios.request({
    url: '/v1/common/seo',
    method: 'post',
    data: params
  })
}
// 获取SEO
export const getSeo = (params) => {
  return axios.request({
    url: '/v1/common/seo',
    method: 'get',
    params: params
  })
}
// 获取内容列表
export const getArticleList = (params) => {
  return axios.request({
    url: '/v1/article',
    method: 'get',
    params: params
  })
}
// 添加内容信息
export const addArticle = (params) => {
  return axios.request({
    url: '/v1/article',
    method: 'post',
    data: params
  })
}
// 修改内容信息
export const updateArticle = (params) => {
  return axios.request({
    url: '/v1/article',
    method: 'put',
    data: params
  })
}
// 删除内容信息
export const delArticle = ({ id }) => {
  return axios.request({
    url: '/v1/article',
    method: 'delete',
    params: { id }
  })
}
// 获取用户列表
export const getUserList = (params) => {
  return axios.request({
    url: '/v1/admin/user',
    method: 'get',
    params: params
  })
}
// 添加用户信息
export const addUser = (params) => {
  const param = encryption({
    data: params,
    key: '1234567887654321',
    param: ['password']
  })
  return axios.request({
    url: '/v1/admin/user',
    method: 'post',
    data: param
  })
}
// 修改用户信息
export const updateUser = (params) => {
  const param = encryption({
    data: params,
    key: '1234567887654321',
    param: ['password']
  })
  return axios.request({
    url: '/v1/admin/user',
    method: 'put',
    data: param
  })
}
// 删除用户信息
export const delUser = ({ id }) => {
  return axios.request({
    url: '/v1/admin/user',
    method: 'delete',
    params: { id }
  })
}
// 获取角色列表
export const getRoleList = (params) => {
  return axios.request({
    url: '/v1/admin/role',
    method: 'get',
    params: params
  })
}
// 添加角色信息
export const addRole = (params) => {
  return axios.request({
    url: '/v1/admin/role',
    method: 'post',
    data: params
  })
}
// 修改角色信息
export const updateRole = (params) => {
  return axios.request({
    url: '/v1/admin/role',
    method: 'put',
    data: params
  })
}
// 删除角色信息
export const delRole = ({ id }) => {
  return axios.request({
    url: '/v1/admin/role',
    method: 'delete',
    params: { id }
  })
}
// 获取权限列表
export const getPrivilegesList = (params) => {
  return axios.request({
    url: '/v1/admin/privileges',
    method: 'get',
    params: params
  })
}
// 添加权限信息
export const addPrivileges = (params) => {
  return axios.request({
    url: '/v1/admin/privileges',
    method: 'post',
    data: params
  })
}
// 修改权限信息
export const updatePrivileges = (params) => {
  return axios.request({
    url: '/v1/admin/privileges',
    method: 'put',
    data: params
  })
}
// 删除用户信息
export const delPrivileges = ({ id }) => {
  return axios.request({
    url: '/v1/admin/privileges',
    method: 'delete',
    params: { id }
  })
}
// 保存用户角色
export const saveUserRole = (params) => {
  return axios.request({
    url: '/v1/admin/user_role',
    method: 'put',
    data: params
  })
}
// 保存角色权限
export const saveRolePrivileges = (params) => {
  return axios.request({
    url: '/v1/admin/role_privileges',
    method: 'put',
    data: params
  })
}
// 获取权限列表
export const getNavigationList = (params) => {
  return axios.request({
    url: '/v1/admin/navigation',
    method: 'get',
    params: params
  })
}
// 添加权限信息
export const addNavigation = (params) => {
  return axios.request({
    url: '/v1/admin/navigation',
    method: 'post',
    data: params
  })
}
// 修改权限信息
export const updateNavigation = (params) => {
  return axios.request({
    url: '/v1/admin/navigation',
    method: 'put',
    data: params
  })
}
// 删除用户信息
export const delNavigation = ({ id }) => {
  return axios.request({
    url: '/v1/admin/navigation',
    method: 'delete',
    params: { id }
  })
}
// 获取配置列表
export const getSysConfigList = (params) => {
  return axios.request({
    url: '/v1/admin/sys_config',
    method: 'get',
    params: params
  })
}
// 添加配置信息
export const addSysConfig = (params) => {
  return axios.request({
    url: '/v1/admin/sys_config',
    method: 'post',
    data: params
  })
}
// 修改配置信息
export const updateSysConfig = (params) => {
  return axios.request({
    url: '/v1/admin/sys_config',
    method: 'put',
    data: params
  })
}
// 删除配置信息
export const delSysConfig = ({ id }) => {
  return axios.request({
    url: '/v1/admin/sys_config',
    method: 'delete',
    params: { id }
  })
}
// 获取消息列表
export const getMessageList = (params) => {
  return axios.request({
    url: '/v1/admin/message',
    method: 'get',
    params: params
  })
}
// 查看消息详情
export const getMessage = ({ id }) => {
  return axios.request({
    url: '/v1/admin/message/' + id,
    method: 'get',
    data: params
  })
}
// 回复消息信息
export const addMessage = (params) => {
  return axios.request({
    url: '/v1/admin/message',
    method: 'post',
    data: params
  })
}
// 删除消息信息
export const delMessage = ({ id }) => {
  return axios.request({
    url: '/v1/admin/message',
    method: 'delete',
    params: { id }
  })
}
// 获取消息数统计
export const getMessageNum = (params) => {
  return axios.request({
    url: '/v1/admin/message_num',
    method: 'get',
    params
  })
}
