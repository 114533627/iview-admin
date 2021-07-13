import axios from '@/libs/api.request'

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
    url: 'save_error_logger',
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
// 获取用户列表

export const getUserList = (params) => {
  return axios.request({
    url: '/v1/admin/user',
    method: 'get',
    params: params
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
