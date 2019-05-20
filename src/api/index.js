// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, putRequest, deleteRequest, importRequest, uploadFileRequest,getTextCompare } from '@/libs/axios';


// Vaptcha ID
export const vaptchaID = "5bb9a277fc650e00a4155567"
// 文件上传接口
export const uploadFile = "/xboot/upload/file"
// 验证码渲染图片接口
export const drawCodeImage = "/xboot/common/captcha/draw/"
// 获取菜单
export const getMenuList = "/xboot/permission/getMenuList"
// Websocket
export const ws = "/xboot/ws"
//文本编辑和对比
export const wordEdit = "http://139.198.16.175:8075/"
// export const wordEdit = "http://192.168.4.229:8019"
//验证数字
export const verificationNum = (params) =>{
	if(isNaN(params)){
		return "只能输入数字";
	}
	if(String(params).indexOf(".") > -1){
		if(params.toString().split(".")[1].length > 2){
			return "只能输入到小数点后两位";
		}
	}
}
//验证是否可以点击
export const clickValidation = (params) =>{
	
}
// 登陆
export const login = (params) => {
    return postRequest('/login', params)
}
// 获取用户登录信息
export const userInfo = (params) => {
    return getRequest('/user/info', params)
}
// 注册
export const regist = (params) => {
    return postRequest('/user/regist', params)
}
// 初始化验证码
export const initCaptcha = (params) => {
    return getRequest('/common/captcha/init', params)
}
// 发送短信验证码
export const sendSms = (mobile, params) => {
    return getRequest(`/common/captcha/sendSms/${mobile}`, params)
}
// 发送重置密码短信验证码
export const sendResetSms = (params) => {
    return postRequest('/common/captcha/sendResetSms', params)
}
// 通过手机重置密码
export const resetByMobile = (params) => {
    return postRequest('/user/resetByMobile', params)
}
// 发送重置密码邮件验证码
export const sendResetEmail = (params) => {
    return postRequest('/email/sendResetCode', params)
}
// 通过邮件重置密码
export const resetByEmail = (params) => {
    return postRequest('/email/resetByEmail', params)
}
// 短信验证码登录
export const smsLogin = (params) => {
    return postRequest('/user/smsLogin', params)
}
// IP天气信息
export const ipInfo = (params) => {
    return getRequest('/common/ip/info', params)
}
// 个人中心编辑
export const userInfoEdit = (params) => {
    return postRequest('/user/edit', params)
}
// 个人中心发送修改邮箱验证邮件
export const sendCodeEmail = (email, params) => {
    return getRequest(`/email/sendCode/${email}`, params)
}
// 个人中心发送修改邮箱验证邮件
export const editEmail = (params) => {
    return postRequest('/email/editEmail', params)
}
// 个人中心修改密码
export const changePass = (params) => {
    return postRequest('/user/modifyPass', params)
}
// 个人中心修改手机
export const changeMobile = (params) => {
    return postRequest('/user/changeMobile', params)
}
// 解锁
export const unlock = (params) => {
    return postRequest('/user/unlock', params)
}



// github登录
export const githubLogin = (params) => {
    return getRequest('/social/github/login', params)
}
// qq登录
export const qqLogin = (params) => {
    return getRequest('/social/qq/login', params)
}
// 微博登录
export const weiboLogin = (params) => {
    return getRequest('/social/weibo/login', params)
}
// 绑定账号
export const relate = (params) => {
    return postRequest('/social/relate', params)
}
// 获取JWT
export const getJWT = (params) => {
    return getRequest('/social/getJWT', params)
}



// 获取绑定账号信息
export const relatedInfo = (username, params) => {
    return getRequest(`/relate/getRelatedInfo/${username}`, params)
}
// 解绑账号
export const unRelate = (params) => {
    return postRequest('/relate/delByIds', params)
}
// 分页获取绑定账号信息
export const getRelatedListData = (params) => {
    return getRequest('/relate/findByCondition', params)
}



// 获取用户数据 多条件
export const getUserListData = (params) => {
    return getRequest('/user/getByCondition', params)
}
// 通过用户名搜索
export const searchUserByName = (username, params) => {
    return getRequest('/user/searchByName/'+username, params)
}
// 获取全部用户数据
export const getAllUserData = (params) => {
    return getRequest('/user/getAll', params)
}
// 添加用户
export const addUser = (params) => {
    return postRequest('/user/admin/add', params)
}
// 编辑用户
export const editUser = (params) => {
    return postRequest('/user/admin/edit', params)
}
// 启用用户
export const enableUser = (id, params) => {
    return postRequest(`/user/admin/enable/${id}`, params)
}
// 禁用用户
export const disableUser = (id, params) => {
    return postRequest(`/user/admin/disable/${id}`, params)
}
// 删除用户
export const deleteUser = (ids, params) => {
    return deleteRequest(`/user/delByIds/${ids}`, params)
}
// 导入用户
export const importUserData = (params) => {
    return importRequest('/user/importData', params)
}



// 获取一级部门
export const initDepartment = (params) => {
    return getRequest('/department/getByParentId/0', params)
}
// 加载部门子级数据
export const loadDepartment = (id, params) => {
    return getRequest(`/department/getByParentId/${id}`, params)
}
// 添加部门
export const addDepartment = (params) => {
    return postRequest('/department/add', params)
}
// 编辑部门
export const editDepartment = (params) => {
    return postRequest('/department/edit', params)
}
// 删除部门
export const deleteDepartment = (ids, params) => {
    return deleteRequest(`/department/delByIds/${ids}`, params)
}
// 搜索部门
export const searchDepartment = (params) => {
    return getRequest('/department/search', params)
}



// 获取全部角色数据
export const getAllRoleList = (params) => {
    return getRequest('/role/getAllList', params)
}
// 分页获取角色数据
export const getRoleList = (params) => {
    return getRequest('/role/getAllByPage', params)
}
// 添加角色
export const addRole = (params) => {
    return postRequest('/role/save', params)
}
// 编辑角色
export const editRole = (params) => {
    return postRequest('/role/edit', params)
}
// 设为或取消注册角色
export const setDefaultRole = (params) => {
    return postRequest('/role/setDefault', params)
}
// 分配角色权限
export const editRolePerm = (params) => {
    return postRequest('/role/editRolePerm', params)
}
// 分配角色数据权限
export const editRoleDep = (params) => {
    return postRequest('/role/editRoleDep', params)
}
// 删除角色
export const deleteRole = (ids, params) => {
    return deleteRequest(`/role/delAllByIds/${ids}`, params)
}


// 获取全部权限数据
export const getAllPermissionList = (params) => {
    return getRequest('/permission/getAllList', params)
}
// 添加权限
export const addPermission = (params) => {
    return postRequest('/permission/add', params)
}
// 编辑权限
export const editPermission = (params) => {
    return postRequest('/permission/edit', params)
}
// 删除权限
export const deletePermission = (ids, params) => {
    return deleteRequest(`/permission/delByIds/${ids}`, params)
}
// 搜索权限
export const searchPermission = (params) => {
    return getRequest('/permission/search', params)
}



// 获取全部字典
// export const getAllDictList = (params) => {
//     return getRequest('/dict/getAll', params)
// }
// 获取全部字典
export const getAllDictList = (params) => {
    return getRequest('/dict/getDictByParentId', params)
}
// 添加字典
export const addDict = (params) => {
    return postRequest('/dict/add', params)
}
// 编辑字典
export const editDict = (params) => {
    return postRequest('/dict/edit', params)
}
// 删除字典
export const deleteDict = (ids, params) => {
    return deleteRequest(`/dict/delByIds/${ids}`, params)
}
// 搜索字典
export const searchDict = (params) => {
    return getRequest('/dict/search', params)
}
// 获取全部字典数据
export const getAllDictDataList = (params) => {
    return getRequest('/dictData/getByCondition', params)
}
// 添加字典数据
export const addDictData = (params) => {
    return postRequest('/dictData/add', params)
}
// 编辑字典数据
export const editDictData = (params) => {
    return postRequest('/dictData/edit', params)
}
// 删除字典数据
export const deleteData = (ids, params) => {
    return deleteRequest(`/dictData/delByIds/${ids}`, params)
}
// 通过类型获取字典数据
export const getDictDataByType = (type, params) => {
    return getRequest(`/dictData/getByType/${type}`, params)
}



// 分页获取日志数据
export const getLogListData = (params) => {
    return getRequest('/log/getAllByPage', params)
}
// 删除日志
export const deleteLog = (ids, params) => {
    return deleteRequest(`/log/delByIds/${ids}`, params)
}
// 清空日志
export const deleteAllLog = (params) => {
    return deleteRequest('/log/delAll', params)
}



// 分页获取定时任务数据
export const getQuartzListData = (params) => {
    return getRequest('/quartzJob/getAllByPage', params)
}
// 添加定时任务
export const addQuartz = (params) => {
    return postRequest('/quartzJob/add', params)
}
// 编辑定时任务
export const editQuartz = (params) => {
    return postRequest('/quartzJob/edit', params)
}
// 暂停定时任务
export const pauseQuartz = (params) => {
    return postRequest('/quartzJob/pause', params)
}
// 恢复定时任务
export const resumeQuartz = (params) => {
    return postRequest('/quartzJob/resume', params)
}
// 删除定时任务
export const deleteQuartz = (ids, params) => {
    return deleteRequest(`/quartzJob/delByIds/${ids}`, params)
}



// 分页获取消息数据
export const getMessageData = (params) => {
    return getRequest('/message/getByCondition', params)
}
// 获取单个消息详情
export const getMessageDataById = (id, params) => {
    return getRequest(`/message/get/${id}`, params)
}
// 添加消息
export const addMessage = (params) => {
    return postRequest('/message/add', params)
}
// 编辑消息
export const editMessage = (params) => {
    return postRequest('/message/edit', params)
}
// 删除消息
export const deleteMessage = (ids, params) => {
    return deleteRequest(`/message/delByIds/${ids}`, params)
}
// 分页获取消息推送数据
export const getMessageSendData = (params) => {
    return getRequest('/messageSend/getByCondition', params)
}
// 编辑发送消息
export const editMessageSend = (params) => {
    return putRequest('/messageSend/update', params)
}
// 删除发送消息
export const deleteMessageSend = (ids, params) => {
    return deleteRequest(`/messageSend/delByIds/${ids}`, params)
}



// 分页获取文件数据
export const getFileListData = (params) => {
    return getRequest('/file/getByCondition', params)
}
// 复制文件
export const copyFile = (params) => {
    return postRequest('/file/copy', params)
}
// 重命名文件
export const renameFile = (params) => {
    return postRequest('/file/rename', params)
}
// 删除文件
export const deleteFile = (ids, params) => {
    return deleteRequest(`/file/delete/${ids}`, params)
}
// 下载文件
export const aliDownloadFile = (fKey, params) => {
    return getRequest(`/file/ali/download/${fKey}`, params)
}


// 检查oss配置
export const checkOssSet = (params) => {
    return getRequest('/setting/oss/check', params)
}
// 获取oss配置
export const getOssSet = (serviceName, params) => {
    return getRequest(`/setting/oss/${serviceName}`, params)
}
// 编辑oss配置
export const editOssSet = (params) => {
    return postRequest('/setting/oss/set', params)
}
// 获取sms配置
export const getSmsSet = (serviceName, params) => {
    return getRequest(`/setting/sms/${serviceName}`, params)
}
// 获取sms模板code
export const getSmsTemplateCode = (type, params) => {
    return getRequest(`/setting/sms/templateCode/${type}`, params)
}
// 编辑sms配置
export const editSmsSet = (params) => {
    return postRequest('/setting/sms/set', params)
}
// 获取email配置
export const getEmailSet = (serviceName, params) => {
    return getRequest('/setting/email', params)
}
// 编辑email配置
export const editEmailSet = (params) => {
    return postRequest('/setting/email/set', params)
}
// 获取vaptcha配置
export const getVaptchaSet = (params) => {
    return getRequest('/setting/vaptcha', params)
}
// 编辑vaptcha配置
export const editVaptchaSet = (params) => {
    return postRequest('/setting/vaptcha/set', params)
}
// 获取vaptcha配置
export const getOtherSet = (params) => {
    return getRequest('/setting/other', params)
}
// 编辑other配置
export const editOtherSet = (params) => {
    return postRequest('/setting/other/set', params)
}
// 查看私密配置
export const seeSecretSet = (settingName, params) => {
    return getRequest(`/setting/seeSecret/${settingName}`, params)
}

export const contractModelquery = (params) => {
    return postRequest('/contractModel/query', params)
}
export const fromUp = (params) => {
    return postRequest('/u/info', params)
}
export const formSeve = (params) => {
    return postRequest('/contractModel/save', params)
}

export const myDelete = (params) => {
    return postRequest('/contractModel/del', params)
}

export const findContractByParam = (params) => {
    return postRequest('/draft/findContractByParam', params)
}
//合同范本中的添加新数据
export const addhtong = (params) => {
    return postRequest('/draft/add', params)
}
//合同范本中的编辑中的添加
export const draftAddhtong = (params) => {
    return postRequest('/draft/editContractById', params)
}
export const eachOther = (params) => {
    return postRequest('/counterpart/query', params)
}
//相对方的列表查询
export const contractRelativequery = (params) => {
    return postRequest('/counterpart/query', params)
}
//相对方数据提交
export const relativeFromSave = (params) => {
    return postRequest('/counterpart/save', params)
}
//相对方数据删除
export const relativeDelete = (params) => {
    // return deleteRequest(`/counterpart/del/${ids}`, params)
    return postRequest('/counterpart/del', params)
}
//相对方拉黑
export const relativeLock = (params) => {
    return postRequest('/counterpart/changeStatus', params)
}
//相对方对方中的同步
export const relativeFindCompany = (params) => {
    return postRequest('/counterpart/findCompany', params)
}
//合同签署列表查询
export const signContractList = (params) => {
    return postRequest('/fulfil/queryContractList', params)
}
//合同签署中的签署
export const signAture = (params) => {
    return postRequest('/sign/addSignInfo', params)
}
//合同签署中的作废
export const signCancel = (params) => {
    return postRequest('/sign/addCancel', params)
}
//合同签署中的作废中的更新
export const signCancelUpdate = (params) => {
    return postRequest('/sign/updateCancel', params)
}
//合同用印里的打印
export const cantactPrint = (params) => {
    return postRequest('/fulfil/updateContract', params)
}
//合同审批中的列表接口
export const findContractList = (params) => {
    return getRequest('/actTask/todoList', params)
}
//获取审批人列表
export const examineManList = (id,params) => {
    return getRequest(`/actProcess/getFirstNode/${id}`, params)
}
//合同起草
export const draftMyDelete = (params) => {
    return postRequest('/draft/deleteContractById', params)
}
//合同审批中的合同详情查询
export const detailList = (params) => {
    return postRequest('/draft/findContractDetailById', params)
}
//待办
export const awaitDo = (params) => {
    return getRequest('/index/todoList', params)
}
//已办
export const alreadyDo = (params) => {
    return getRequest('/index/doneList', params)
}
//合同数量统计
export const contractNumberStatistics = (params) => {
    return getRequest('/index/contract/statis', params)
}
//获取合同审批中的下一审批人的数据
export const nextExamine = (id,params) => {
    return getRequest(`/actProcess/getNextNode/${id}`, params)
}
//合同审批通过
export const passExamine = (params) => {
    return postRequest('/actTask/pass', params)
}
//合同审批驳回
export const rejectExamine = (params) => {
    return postRequest('/actTask/back', params)
}
//合同审批历史
export const historyExamine = (id,params) => {
    return getRequest(`/actTask/historicFlow/${id}`, params)
}
//合同审批历史
// export const flowExample = (id,params) => {
//     return getRequest(`/actProcess/getHighlightImg/${id}`, params)
// }
export const flowExample = "/xboot/actProcess/getHighlightImg/"
//合同履行计划详情
export const performPlanDel = (params) => {
    return postRequest('/seal/querySeal', params)
}
//合同履行计划确认
export const performPlanConfirm = (params) => {
    return postRequest('/fulfil/updateContract', params)
}
//合同履行终止或者结束
export const performPlanFinish = (params) => {
    return postRequest('/seal/addPlayStateInfo', params)
}
//合同履行中的新建履行计划
export const performNewBuild = (params) => {
    return postRequest('/seal/addSeal', params)
}
//合同履行中的更新履行计划
export const performPlanUpdate = (params) => {
    return postRequest('/seal/updateSeal', params)
}
//提交反馈内容
export const feedbackConfirm = (params) => {
	return postRequest('/seal/addPlayMonryInfo',params)
}
//合同查询中的所有合同查询
export const contractSearch = (params) => {
	return postRequest('/query/findContractByParams',params)
}
//审批人提交接口
export const applyBusiness = (params) => {
	return postRequest('/approve/apply',params)
}
//文件下载
export const filesDown = (params) => {
	return getRequest('/draft/download',params)
}
//合同正文处下载

//履行计划中的删除
export const lvxingDeleta = (params) =>{
	return postRequest("/draft/deleteContractPlayById",params)
}
//上传文件的地址校验
export const compareTextUrl = (params) => {
    return getTextCompare('/',params)
}

export const fileCompares = () => {
    return getRequest('/draft/compare')
}

export const chooseFile = (params) => {
    return getRequest('/draft/setRedisFile',params)
}
//合同范本和相对方中的详情
export const modelRelativeDetail = (params) =>{
	return postRequest('/contractModel/queryModelOrRelativeById',params)
}
//合同编号验证
export const contractNumber = (params) => {
	return getRequest('/draft/checkContractNumber',params)
}
//合同地址验证
// export const fileUpUrlAudit = (params) => {
// 	return getRequest('/draft/checkFileEmpty',params)
// }
export const fileUpUrlAudit = (params) => {
	return getRequest('/draft/uploadFileNew',params)
}
//申请人表单数据
export const personSelect = (params) => {
	return postRequest('/department/searchUser',params)
}

//相对方重复验证
export const animateWidths = (params) => {
	return postRequest('/counterpart/checkIsExist',params)
}
//合同类型查询
export const contractType = (params) => {
	return postRequest('/dictData/queryByDictId',params)
}
//合同类型快速搜索
export const contractTypeRapid = (params) => {
	return postRequest('/dictData/searchTypeByContract',params)
}

//合同起草中部门获取
export const departmentGet = (params) => {
	return getRequest('/draft/checkUser/functionalDepartment',params)
}
//生成系统id
export const getSystemId = (params) => {
	return postRequest('/draft/generateSysNum',params)
}
//合同编号更新
export const contactNumberUpdate = (params) => {
	return getRequest('/draft/updateNumber',params)
}
//审批人是否显示
export const examineShow = (params) => {
	return getRequest('/department/chooseUser/show',params)
}
//相对方中的模糊查询
export const relativeName = (params) => {
	return getRequest('/counterpart/findCompany/search/word',params)
}
//获取相对方编号
export const relativeNumber = (params) => {
	return getRequest('/counterpart/generateCounterpartNum',params)
}
//查询已签署的合同
export const signedContract = (params) => {
	return getRequest('/draft/searchSignedContract',params)
}
//详情中查询审批历史
export const examineDetail = (ids, params) => {
    return getRequest(`/query/getSingleContractHistoryById/${ids}`, params)
}
//详情中查询用印信息
export const stampDetail = (ids, params) => {
    return getRequest(`/query/getPrintInformationById/${ids}`, params)
}
//详情中查询履行计划
export const performDetail = (ids, params) => {
    return getRequest(`/query/getFulfillmentById/${ids}`, params)
}
//详情中查询履行中所有的反馈
export const feedbackDetailAll = (ids, params) => {
    return getRequest(`/query/getFulfillFeedbackByContractId/${ids}`, params)
}
//详情中查询履行计划下的反馈
export const feedbackDetail = (ids, params) => {
    return getRequest(`/query/getFulfillFeedbackById/${ids}`, params)
}
//查询北大法宝合同类别列表
export const queryContractType = (params) => {
  return getRequest('/contractModel/queryContractType',params)
}
//查询北大法宝合同发布部门
export const queryDepartmentTitle = (params) => {
  return getRequest('/contractModel/queryDepartmentTitle',params)
}
//查询北大法宝合同行业类别
export const queryIndustryType = (params) => {
  return getRequest('/contractModel/queryIndustryType',params)
}
//获取北大法宝范本库列表
export const queryModelOnLine = (params) => {
  return getRequest('/contractModel/queryModelOnLine',params)
}
//查看合同范本详情
export const getSingleRecord = (params) => {
  return getRequest('/contractModel/getSingleRecord',params)
}
//选择一个在线范本会增加到本地范本库接口
export const saveModelByIdOnLine = (params) => {
  return getRequest('/contractModel/saveModelByIdOnLine',params)
}
//折线图数据
export const echartsData = (params) => {
	return getRequest('/query/getContractAmount',params)
}
//查询签订信息的详情
export const signDetail = (params) => {
	return getRequest('/query/getContractSignInfoByContractId',params)
}
//收付款相对方列表查询
export const payRelativeList = (params) => {
	return getRequest('/counterpart/getCounterpartByCounterId',params)
}
//合同起草中查看范本列表
export const draftModelList = (params) => {
	return postRequest('/contractModel/query/release',params)
}
//合同用印中的用印确认
export const parintConfirm = (params) => {
	return postRequest('/fulfil/updateTcon',params)
}
// 合同归档
// 根据条件分页查询合同列表
export const getContractByPage = (params) => {
	return getRequest('/archive/getContractByPage',params)
}
// 添加归档信息
export const archive = (params) => {
	return postRequest('/archive',params)
}
// 根据Id查询归档信息
export const getArchiveById = (id,params) => {
	return getRequest(`/archive/getArchiveById/${id}`,params)
}
//合同统计(院系负责人)
export const statisticsDepartment = (params) => {
	return getRequest('/statistics/StatisticsContract',params)
}
//合同统计(法律办、合同管理员)
export const getSignedInfo = (params) => {
    return getRequest('/statistics/all/getSignedInfo',params)
}
//合同解除接口
export const relieveContract = (params) => {
	return getRequest('/contract/release/save',params)
}
//解除信息
export const relieveDetail = (params) => {
	return getRequest('/contract/release/findReleaseByContractId',params)
}
//被变更的合同的变更信息
export const alterationBeforeDetail = (params) => {
	return getRequest('/contract/change/queryByOriginalContractId',params)
}
//变更后的合同的变更信息
export const alterationAfterDetail = (params) => {
	return getRequest('/contract/change/queryByChangeContractId',params)
}
//变更后的合同的变更信息
// export const excelDownload = (params) => {
// 	return getRequest('/query/exportXls',params)
// }