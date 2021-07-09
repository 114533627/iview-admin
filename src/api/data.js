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
// 上传文件
export const uploadImg = (params) => {
  return axios.request({
    url: '/v1/common/upload_file',
    method: 'post',
    data: params
  })
}
