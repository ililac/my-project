 <style lang="less">
@import "../../activiti/business/applyManage.less";
@import "../formModel.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="120" class="search-form">
              <Form-item label="标题" prop="title">
                <Input
                  type="text"
                  v-model="searchForm.title"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <!-- <Form-item label="结果" prop="status">
                <Select
                  v-model="searchForm.status"
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                >
                  <Option value="0">草稿</Option>
                  <Option value="0">处理中</Option>
                  <Option value="1">已结束</Option>
                </Select>
              </Form-item> -->
              <!-- <span v-if="drop"> -->
                <Form-item label="结果" prop="result">
                  <Select
                    v-model="searchForm.result"
                    placeholder="请选择"
                    clearable
                    style="width: 200px"
                  >
                    <Option value="0">未提交</Option>
                    <Option value="1">处理中</Option>
                    <Option value="2">通过</Option>
                    <Option value="3">驳回</Option>
                  </Select>
                </Form-item>
                <Form-item label="提交申请时间">
                  <DatePicker
                    v-model="selectDate"
                    type="daterange"
                    format="yyyy-MM-dd"
                    clearable
                    @on-change="selectDateRange"
                    placeholder="选择时间"
                    style="width: 200px"
										:editable="false"
                  ></DatePicker>
                </Form-item>
              <!-- </span> -->
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
                <!-- <a class="drop-down" @click="dropDown">
                  {{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a> -->
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <!-- <Button @click="add" type="primary" icon="md-add">新增申请</Button> -->
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="getDataList" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
            </Alert>
          </Row>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              sortable="custom"
              @on-selection-change="showSelect"
              ref="table"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Card>
      </Col>
    </Row>
		<model-choose :sourceType2.sync="showType" :formData33.sync="modalVisible" v-on:listenApply="modalVisibleState" :formData1.sync="dictForm" :relativeType.sync="counterpartArr"></model-choose>
    <Modal title="组织机构选人" v-model="applyModalVisible" :mask-closable="false" :width="700">
			<div class="clear">
				<Col :span="24">
					<Col :span="12">
						<div class="tree-bar">
							<Tree ref="tree" :data="treeData" :load-data="loadData" @on-select-change="selectTree"></Tree>
						</div>
					</Col>
					<Col :span="12">
						<Alert show-icon>
						    已选择 <span class="select-count">{{selectCount2}}</span> 项
						</Alert>
						<Table :height="300" :loading="loading" border :columns="columns1" :data="personData" ref="table1" @on-selection-change="showSelect2"></Table>
					</Col>
				</Col>
			</div>
			<div style="clear: both;"></div>
      <div slot="footer">
        <Button type="text" @click="handelCancel">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmit">提交</Button>
      </div>
    </Modal>

    <Modal
      title="确认撤回"
      v-model="modalCancelVisible"
      :mask-closable="false"
      :width="500"
    >
      <Form ref="delForm" v-model="cancelForm" :label-width="70">
        <FormItem label="撤回原因" prop="reason">
          <Input type="textarea" :maxlength="1000" v-model="cancelForm.reason" :rows="4"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalCancelVisible=false">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="handelSubmitCancel">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getProcessDataList,
  getFirstNode,
  getBusinessDataList,
  deleteBusiness,
  cancelApply
} from "@/api/activiti";
import { 
	getDictDataByType,
	detailList,
	applyBusiness,
	personSelect,
	loadDepartment,
	passExamine,
	eachOther
	// getDictDataByType
} from "@/api/index";
import circleLoading from "../../my-components/circle-loading.vue";
import  modelChoose from "../../activiti/business/modelChoose.vue";
export default {
  name: "my-apply",
  components: {
    circleLoading,
		modelChoose
  },
  data() {
    return {
			selectCount2:0,   ///选中的审批人数量
			selectList2:[],   ///选中的审批人列表
			submitSubmitClick:true, // 审批人是否显示
			btnLoading4:false, //下一审批人中的提交按钮
			applyCount:[],   //审批人添加
			examineResult:4, //列表中的result值为4 的时候等于4否则为3
			form: {
			    procDefId: "",
					procInstId:"",
			    assignees: [],
			    priority: "",
			    id: "",
			    tableId: "",
			    title: "",
					procDefId: "",
					priority: "0"
			},
			dictForm: {
			    isuse: "",
			    id: "",
			    name: "",
			    typeid: "",
			    typeName: "",
			    // typeArr:'',
			    //合同正文
			    ismoney: "",
			    issecret: "",
			    isbudget: "",
			    isbid: "",
			    starttime: "",
			    number: "",
			    contentnum: 0,
			    counterpartnum: 0,
			    totalnum: "",
			    chapter: "",
			    description: "",
			    //相关附件
			    draftsman: "",
			    draftsoutfit: "", //起草机构
			    draftsoutfitid: "",
			    //合同范本
			    source: "",
			    sourceName: "",
			    sourceArr: [],
			    money: "",
			    istopay: "",
			    istime: "",
			    isurgent: "",
			    endtime: "",
			    counterpartid: "",
			    // counterpartArr:[],
			    draftstime: "",
			    phone: "",
				contentname:"",
			    contractPlayList: []
			},
			personData:[],          // 审批人数据
			treeData:[
			    {
			        createBy: "admin",
					createTime: "2019-01-08",
					delFlag: 0,
					haveChild: false,
					id: "94930003292065792",
					isParent: true,
					parentId: "0",
					parentTitle: "一级部门",
					sortOrder: 4,
					status: 0,
					title: "北京大学",
					updateBy: "admin",
					updateTime: "2019-03-07",
					users: null,
					loading: false,
			        children: []
			    }
			],
      loading: true, // 表单加载状态
      operationLoading: false, // 操作加载状态
      processModalVisible: false,
			counterpartArr:[],     //相对方列表
			typeArr:[],            //合同类型
			modaldetail:false,
      searchProcessForm: {
        showLatest: true,
        name: "",
        status: "1", // 激活状态
        pageNumber: 1, // 当前页数
        pageSize: 1000, // 页面大小
        sort: "createTime", // 默认排序字段
        order: "desc" // 默认排序方式
      },
      cancelForm: {
        reason: ""
      },
			detailForm:{},
      modalCancelVisible: false,
      processLoading: false,
      processData: [],
      showType: "myApply",
      selectCount: 0, // 多选计数
      selectList: [], // 多选数据
      drop: false, // 搜索展开标识
      dropDownContent: "展开", // 搜索展开标识文字
      dropDownIcon: "ios-arrow-down", //搜索展开图标
      searchForm: {
        // 搜索框对应data对象
        title: "",
        status: "",
        result: "",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        startDate: "",
        endDate: ""
      },
      userLoading: false,
			applyModalVisible:false,
      modalVisible: false, // 添加或编辑显示
      selectDate: null,
//       form: {
//         procDefId: "",
//         assignee: "",
//         priority: "0"
//       },
      formValidate: {
        // 表单验证规则priority
        procDefId: [{ required: true, message: "不能为空", trigger: "blur" }],
        assignee: [{ required: true, message: "不能为空", trigger: "blur" }]
        // priority: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      submitLoading: false, // 添加或编辑提交状态
			columns1: [
				// 表头
				{
				    type: "selection",
				    align: "center",
					width:134
				},
				{
				    title: "姓名",
				    key: "nickName",
					align:"center"
				}
			],
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "合同名称",
          key: "title",
          sortable: true,
					render: (h, params) => {
					  return h("div", [
					    h(
					      "a",
					      {
					        on: {
					          click: () => {
					            this.detail(params.row);
					          }
					        }
					      },
					      params.row.title
					    )
					  ]);
					}
        },
        {
          title: "所属流程",
          key: "processName",
          tooltip: true
        },
        {
          title: "当前审批环节",
          key: "currTaskName",
          width: 150,
          tooltip: true
        },
        {
          title: "结果",
          key: "result",
          align: "center",
          width: 120,
          sortable: true,
          render: (h, params) => {
            let text = "未知",
              color = "";
            if (params.row.result == 0) {
              text = "未提交";
              color = "default";
            } else if (params.row.result == 1) {
              text = "处理中";
              color = "orange";
            } else if (params.row.result == 2) {
              text = "已通过";
              color = "green";
            } else if (params.row.result == 3) {
              text = "返回修改";
              color = "red";
            }else if (params.row.result == 4) {
              text = "已驳回";
              color = "red";
            } 
            return h("div", [
              h(
                "Tag",
                {
                  props: {
                    color: color
                  }
                },
                text
              )
            ]);
          }
        },
        {
          title: "提交申请时间",
          key: "applyTime",
          width: 180,
          sortable: true
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          width: 265,
          fixed: "right",
          render: (h, params) => {
            let re = "";
            if (params.row.status == 0) {
              re = [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.apply(params.row);
                      }
                    }
                  },
                  "提交申请"
                ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.remove(params.row);
                      }
                    }
                  },
                  "删除"
                )
              ];
            } else if (params.row.status == 1) {
							if(params.row.procDefId.indexOf("contract_approve") > -1 && params.row.currTaskName == "院系负责人审批"){
								re = [
								  h(
								    "Button",
								    {
								      props: {
								        size: "small",
								        type: "warning",
								        icon: "ios-redo"
								      },
								      style: {
								        marginRight: "5px"
								      },
								      on: {
								        click: () => {
								          this.cancel(params.row);
								        }
								      }
								    },
								    "撤回申请"
								  ),
								  h(
								    "Button",
								    {
								      props: {
								        size: "small",
								        type: "info"
								      },
								      style: {
								        marginRight: "5px"
								      },
								      on: {
								        click: () => {
								          this.history(params.row);
								        }
								      }
								    },
								    "查看进度"
								  )
								];
							}else if(params.row.procDefId.indexOf("contract_approve_zhiNeng") > -1 && params.row.currTaskName == "职能部门审批人审批"){
								re = [
								  h(
								    "Button",
								    {
								      props: {
								        size: "small",
								        type: "warning",
								        icon: "ios-redo"
								      },
								      style: {
								        marginRight: "5px"
								      },
								      on: {
								        click: () => {
								          this.cancel(params.row);
								        }
								      }
								    },
								    "撤回申请"
								  ),
								  h(
								    "Button",
								    {
								      props: {
								        size: "small",
								        type: "info"
								      },
								      style: {
								        marginRight: "5px"
								      },
								      on: {
								        click: () => {
								          this.history(params.row);
								        }
								      }
								    },
								    "查看进度"
								  )
								];
							}else if(params.row.result == 4){
								re = [
									h(
									  "Button",
									  {
									    props: {
									      type: "primary",
									      size: "small"
									    },
									    style: {
									      marginRight: "5px"
									    },
									    on: {
									      click: () => {
									        this.apply(params.row,4);
									      }
									    }
									  },
									  "提交申请"
									),
								  h(
								    "Button",
								    {
								      props: {
								        size: "small"
								      },
								      style: {
								        marginRight: "5px"
								      },
								      on: {
								        click: () => {
								          this.edit(params.row);
								        }
								      }
								    },
								    "编辑"
								  )
								];
							} else{
								re = [
								  h(
								    "Button",
								    {
								      props: {
								        size: "small",
								        type: "info"
								      },
								      style: {
								        marginRight: "5px"
								      },
								      on: {
								        click: () => {
								          this.history(params.row);
								        }
								      }
								    },
								    "查看进度"
								  )
								];
							}
            } else if (params.row.status == 2 && params.row.result == 3) {
              re = [
                // h(
                //   "Button",
                //   {
                //     props: {
                //       type: "primary",
                //       size: "small"
                //     },
                //     style: {
                //       marginRight: "5px"
                //     },
                //     on: {
                //       click: () => {
                //         this.apply(params.row);
                //       }
                //     }
                //   },
                //   "重新申请"
                // ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: "info"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.history(params.row);
                      }
                    }
                  },
                  "审批历史"
                )
              ];
            } else {
              re = [h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: "primary"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.export(params.row);
                      }
                    }
                  },
                  "下载审批单"
                ),
                h(
                  "Button",
                  {
                    props: {
                      size: "small",
                      type: "info"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.history(params.row);
                      }
                    }
                  },
                  "审批历史"
                )
              ];
            }

            return h("div", re);
          }
        }
      ],
			columns2: [
			    // 表头
			    {
			        title: "序号",
			        type: "index",
			        width: 60,
			        align: "center"
			    },
				{
			        title: "合同约定任务",
			        key: "task",
			        width: 110,
											align: "center"
			    },{
			        title: "是否满足付款条件",
			        key: "issatisfypay",
			        width: 140,
											align: "center"
			    },{
			        title: "收支类型",
			        key: "paytype",
			        width: 90,
											align: "center"
			    },{
			        title: "收付金额",
			        key: "factmoney",
			        width: 90,
											align: "center"
			    },
			    {
			        title: "所占比例",
			        key: "proportion",
			        width: 90,
											align: "center"
			    },
				{
			        title: "计划开始时间",
			        key: "startplaytime",
			        width: 110,
											align: "center"
			    },{
			        title: "计划结束时间",
			        key: "endplaytime",
			        width: 110,
											align: "center"
			    },{
			        title: "履行内容",
			        key: "proportion",
			        width: 90,
											align: "center"
			    },{
			        title: "备注",
			        key: "remark",
			        width: 75,
											align: "center"
			    }
			],
      data: [], // 表单数据
      total: 0, // 表单数据总数
      assigneeList: [],
      dictPriority: []
    };
  },
  methods: {
		//编辑页面的弹框事件
		modalVisibleState(data){
			this.modalVisible = data;
			this.getDataList();
		},
		//申请人中的树状结构数据加载
		loadData(item, callback) {
		  loadDepartment(item.id).then(res => {
		    if (res.success === true) {
		      res.result.forEach(function(e) {
		        if (e.isParent) {
		          e.loading = false;
		          e.children = [];
		        }
		      });
		      callback(res.result);
		    }
		  });
		},
		//申请人中的树状结构中的节点选中事件personData
		selectTree(v){
			console.log(this.form);
			personSelect({procDefId:this.form.procDefId,departmentId:v[0].id,procInstId:this.form.procInstId}).then(res => {
				// this.personData = res.result.userList
				let personData = res.result.userList;
				for(let i = 0;i < personData.length;i++){
				    personData[i]._checked = true;
				}
				this.personData = [...personData];
				this.selectCount2 = this.personData.length;
				this.form.assignees = [];
				for(var i = 0;i < this.personData.length;i++){
				    this.form.assignees.push(this.personData[i].id);
				};
			})
		},
		//申请人选择事件
		showSelect2(e) {
		    this.selectList = e;
		    this.selectCount2 = e.length;
				this.form.assignees = [];
			for(var i = 0;i < e.length;i++){
				this.form.assignees.push(e[i].id);
			};
			console.log(this.form);
		},
    init() {
      this.getDataList();
      this.getProcessList();
      this.getDictDataType();
			eachOther().then(res => {
			    this.counterpartArr = res.result.content
			});
    },
    getDictDataType() {
      getDictDataByType("priority").then(res => {
        if (res.success) {
          this.dictPriority = res.result;
        }
      });
    },
    getProcessList() {
      this.processLoading = true;
      getProcessDataList(this.searchProcessForm).then(res => {
        this.processLoading = false;
        if (res.success) {
          this.processData = res.result.content;
        }
      });
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "ios-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "ios-arrow-up";
      }
      this.drop = !this.drop;
    },
    handleResetProcess() {
      this.$refs.searchProcessForm.resetFields();
      // 重新加载数据
      this.getProcessList();
    },
    changePage(v) {
      this.searchForm.pageNumber = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
				console.log(this.searchForm);
      }
    },
    getDataList() {
      this.loading = true;
      // 避免后台默认值
      if (!this.searchForm.status) {
        this.searchForm.status = "";
      }
      if (!this.searchForm.result) {
        this.searchForm.result = "";
      }
      getBusinessDataList(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.content;
          this.total = res.result.totalElements;
        }
      });
    },
    handleSearch() {
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNumber = 1;
      this.searchForm.pageSize = 10;
      this.selectDate = null;
      this.searchForm.startDate = "";
      this.searchForm.endDate = "";
      // 重新加载数据
      this.getDataList();
    },
    handelCancel() {
      this.applyModalVisible = false;
    },
    handelSubmit() {
			this.submitLoading = true;
			if(this.examineResult == 4){
				console.log(this.form);
				passExamine({id:this.form.taskId,procInstId:this.form.procInstId,assignees:this.form.assignees}).then(res => {
					this.submitLoading = false;
					if (res.success){
						this.getDataList();
						this.applyModalVisible = false;
					}
				})
			}else{
				applyBusiness(this.form).then(res => {
				  this.submitLoading = false;
				  if (res.success === true) {
				    this.$Message.success("操作成功");
				    this.getDataList();
				    this.applyModalVisible = false;
				  }
				});
			}
    },
    add() {
        this.chooseProcess(this.processData[0]);
      // this.processModalVisible = true;
    },
    chooseProcess(v) {
      if (!v.routeName) {
        this.$Message.error("该流程信息未完善，暂时无法申请");
        return;
      }
      this.processModalVisible = false;
      let query = { type: 0, backRoute: this.$route.name, procDefId: v.id };
      this.$router.push({
        name: v.routeName,
        query: query
      });
    },
    edit(v) {
			detailList({id:v.tableId}).then(res=>{
				if(res.result == "success"){
					this.dictForm = res.contract;
					this.dictForm.businessId = v.id;
					this.dictForm.counterpartList = res.counterpartList;
					this.dictForm.parentContractName = res.parentContractName;
					if(this.dictForm.counterpartList.length > 0){
						for (let value of this.dictForm.counterpartList){
							value.removeExit = true;
						}
						this.dictForm.counterpartList[0].removeExit = false;
					}else{
						this.dictForm.counterpartList = [
							{
								contractId:"",
								counterpartId:"",
								degreeId:"",
								id:"",
								removeExit:false
							}
						]
					}
					this.dictForm.delCounterpartIds = [];
					this.dictForm.counterpartList[0]
					this.dictForm.contractType = res.contractType;
					this.modalVisible = true;
					this.dictForm.uploadList = [];
					if(this.dictForm.attachmentname){
						let arr = this.dictForm.attachmentname.split(',');
						let arr2 = this.dictForm.accessoryurl.split(',');
						if(arr.length > 0){
							for(let i = 0;i < arr.length;i++){
								var obj = {name:"",url:"",fileDownUrl:""};
								obj.name = arr[i];
								obj.url = arr2[i];
								obj.fileDownUrl = '/zhfw/contract/draft/download?fileName='+arr[i]+'&url='+arr2[i]+'&access_token='+this.getStore("accessToken");
								this.dictForm.uploadList.push(obj);
							}
						}
					}
				}
			});
    },
    detail(v) {
      let query = { type: 2, id: v.tableId, backRoute: this.$route.name,status:v.status};
      this.$router.push({
        name: "detail",
        query: query
      });
    },
    apply(v,result) {
			if(result == 4){
				this.examineResult = 4;
			}else{
				this.examineResult = 3;
			}
      this.form.id = v.id;
      this.form.tableId = v.tableId;
      this.form.procDefId = v.procDefId;
      this.form.taskId = v.taskId;
			
			if(v.status == 0){
				this.form.procInstId = "";
			}else{
				this.form.procInstId = v.procInstId;
			}
      if(v.result == 3){
      	this.form.procInstId = "";
      }
      this.form.title = v.title;
      // 加载审批人
      this.userLoading = true;
      getFirstNode(v.procDefId).then(res => {
        this.userLoading = false;
        if (res.success) {
          this.assigneeList = res.result.users;
        }
      });
      this.applyModalVisible = true;
			this.personData = [];
			this.selectCount2 = 0;
			this.treeData=[
			    {
			        createBy: "admin",
					createTime: "2019-01-08",
					delFlag: 0,
					haveChild: false,
					id: "94930003292065792",
					isParent: true,
					parentId: "0",
					parentTitle: "一级部门",
					sortOrder: 4,
					status: 0,
					title: "北京大学",
					updateBy: "admin",
					updateTime: "2019-03-07",
					users: null,
					loading: false,
			        children: []
			    }
			]
    },
    cancel(v) {
      this.cancelForm.id = v.id;
      this.cancelForm.procInstId = v.procInstId;
      this.modalCancelVisible = true;
    },
    handelSubmitCancel() {
      this.submitLoading = true;
      cancelApply(this.cancelForm).then(res => {
        this.submitLoading = false;
        if (res.success === true) {
          this.$Message.success("操作成功");
          this.getDataList();
          this.modalCancelVisible = false;
        }
      });
    },
    history(v) {
      if (!v.procInstId) {
        this.$Message.error("流程实例ID不存在");
        return;
      }
      let query = { id: v.procInstId, backRoute: this.$route.name ,tableId:v.tableId,status:v.status};
      this.$router.push({
        name: "historic_detail",
        query: query
      });
    },
    export(v){
      window.open(
        "/zhfw/active/actTask/downloadApprovalForm?" +
          "tableId=" +
          v.tableId +
          "&procInstId=" +
          v.procInstId +
          "&access_token=" +
          this.getStore("accessToken")
      );
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        // 记得确认修改此处
        content: "您确认要删除 " + v.title + " ?",
        onOk: () => {
          // 删除
          this.operationLoading = true;
          deleteBusiness(v.id).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.getDataList();
            }
          });
        }
      });
    },
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    delAll() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function(e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          // 批量删除
          this.operationLoading = true;
          deleteBusiness(ids).then(res => {
            this.operationLoading = false;
            if (res.success === true) {
              this.$Message.success("操作成功");
              this.clearSelectAll();
              this.getDataList();
            }
          });
        }
      });
    }
  },
  mounted() {
    this.init();
		getDictDataByType("contract_type").then(res => {
		    if (res.success) {
		        this.typeArr = res.result;
		    }
		});
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      if (to.name == "my-apply") {
        this.getDataList();
      }
    }
  }
};
</script>