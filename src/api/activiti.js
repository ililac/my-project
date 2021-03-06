// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest, importRequest, uploadFileRequest } from '@/libs/axios';



// 导出模型
export const exportModel = "/zhfw/active/actModel/export/"
// 通过文件部署模型流程
export const deployByFile = "/zhfw/active/actModel/deployByFile"
// 导出流程资源
export const exportResource = "/zhfw/active/actProcess/export"
// 获取高亮实时流程图
export const getHighlightImg = "/zhfw/active/actProcess/getHighlightImg/"



// 获取模型
export const getModelDataList = (params) => {
    return getRequest('/active/actModel/getByCondition', params)
}
// 添加模型
export const addModel = (params) => {
    return postRequest('/active/actModel/add', params)
}
// 部署模型
export const deployModel = (id, params) => {
    return getRequest(`/active/actModel/deploy/${id}`, params)
}
// 删除模型
export const deleteModel = (ids, params) => {
    return deleteRequest(`/active/actModel/delByIds/${ids}`, params)
}



// 获取流程数据
export const getProcessDataList = (params) => {
    return postRequest('/active/actProcess/getByCondition', params)
}
// 编辑流程信息
export const updateInfo = (params) => {
    return postRequest('/active/actProcess/updateInfo', params)
}
// 修改流程状态 激活/挂起
export const updateStatus = (params) => {
    return postRequest('/active/actProcess/updateStatus', params)
}
// 转化流程为模型
export const convertToModel = (id, params) => {
    return getRequest(`/active/actProcess/convertToModel/${id}`, params)
}
// 节点设置
export const getProcessNode = (id, params) => {
    return getRequest(`/active/actProcess/getProcessNode/${id}`, params)
}
// 节点用户设置
export const editNodeUser = (params) => {
    return postRequest('/active/actProcess/editNodeUser', params)
}
// 删除流程定义
export const deleteProcess = (ids, params) => {
    return deleteRequest(`/active/actProcess/delByIds/${ids}`, params)
}



// 获取流程数据
export const getRunningProcess = (params) => {
    return getRequest('/active/actProcess/getRunningProcess', params)
}
// 通过流程定义id获取第一个任务节点
export const getFirstNode = (id, params) => {
    return getRequest(`/active/actProcess/getFirstNode/${id}`, params)
}
// 通过流程实例id获取下一个任务节点
export const getNextNode = (id, params) => {
    return getRequest(`/active/actProcess/getNextNode/${id}`, params)
}
// 修改流程状态 激活/挂起
export const updateInsStatus = (params) => {
    return postRequest('/active/actProcess/updateInsStatus', params)
}
// 删除流程运行实例
export const deleteProcessIns = (ids, params) => {
    return deleteRequest(`/active/actProcess/delInsByIds/${ids}`, params)
}



// 获取代办列表
export const todoList = (params) => {
    return getRequest('/active/actTask/todoList', params)
}
// 获取已办列表
export const doneList = (params) => {
    return postRequest('/active/actTask/doneList', params)
}
// 获取流程流转历史
export const historicFlow = (id, params) => {
    return getRequest(`/active/actTask/historicFlow/${id}`, params)
}
// 委托他人代办
export const delegate = (params) => {
    return postRequest('/active/actTask/delegate', params)
}
// 审批任务通过
export const pass = (params) => {
    return postRequest('/active/active/actTask/pass', params)
}
// 审批任务驳回
export const back = (params) => {
    return postRequest('/active/actTask/back', params)
}
// 删除任务
export const deleteTask = (ids, params) => {
    return deleteRequest(`/active/actTask/delete/${ids}`, params)
}
// 删除历史任务
export const deleteHistoricTask = (ids, params) => {
    return deleteRequest(`/active/actTask/deleteHistoric/${ids}`, params)
}



// 获取一级类别
export const initActCategory = (params) => {
    return getRequest('/active/actCategory/getByParentId/0', params)
}
// 加载类别子级数据
export const loadActCategory = (id, params) => {
    return getRequest(`/active/actCategory/getByParentId/${id}`, params)
}
// 添加类别
export const addActCategory = (params) => {
    return postRequest('/active/actCategory/add', params)
}
// 编辑类别
export const editActCategory = (params) => {
    return postRequest('/active/actCategory/edit', params)
}
// 删除类别
export const deleteActCategory = (ids, params) => {
    return deleteRequest(`/active/actCategory/delByIds/${ids}`, params)
}
// 搜索类别
export const searchActCategory = (params) => {
    return getRequest('/active/actCategory/search', params)
}



// 获取申请数据
export const getBusinessDataList = (params) => {
    return getRequest('/active/actBusiness/getByCondition', params)
}
// 提交请假申请
export const applyBusiness = (params) => {
    return postRequest('/active/actBusiness/apply', params)
}
// 撤回请假申请
export const cancelApply = (params) => {
    return postRequest('/active/actBusiness/cancel', params)
}
// 删除申请
export const deleteBusiness = (ids, params) => {
    return deleteRequest(`/active/actBusiness/delByIds/${ids}`, params)
}



// 获取单个请假数据
export const getLeaveData = (id, params) => {
    return getRequest(`/active/leave/get/${id}`, params)
}
// 新增请假数据
export const addLeave = (params) => {
    return postRequest('/active/leave/add', params)
}
// 修改请假数据
export const updateLeave = (params) => {
    return putRequest('/active/leave/update', params)
}


//添加合同签署信息
export const addSignInfo = (params) => {
    return postRequest('/active/sign/addSignInfo', params)
}





