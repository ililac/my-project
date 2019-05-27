<style lang="less">
	@import "./applyManage.less";
</style>

<template>
    <div class="search">
        <Card>
            <Row type="flex" justify="space-between" class="code-row-bg">
                <Col :span="24">
                <Row>
                    <Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
                        <Form-item label="合同名称">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入" clearable/>
                        </Form-item>
                        <Form-item label="开始时间">
                            <DatePicker
                                    v-model="searchForm.startTime"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    clearable
                                    placeholder="选择开始时间"
                            ></DatePicker>
                        </Form-item>
						<Form-item label="结束时间">
						    <DatePicker
						            v-model="searchForm.endTime"
						            type="date"
						            format="yyyy-MM-dd"
									@on-change="timeChange"
						            clearable
						            placeholder="选择结束时间"
						    ></DatePicker>
						</Form-item>
                        <Form-item style="margin-left:-35px;" class="br">
                            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                            <Button @click="handleReset" type="primary">重置</Button>
                        </Form-item>
                    </Form>
                </Row>
                <Row class="operation">
                    <Button @click="add" type="primary" icon="md-add">添加数据</Button>
                    <Button @click="getDataList" icon="md-refresh">刷新数据</Button>
                </Row>
                <!-- <Row>
                    <Alert show-icon>已选择
                        <span class="select-count">{{selectCount}}</span> 项
                    </Alert>
                </Row> -->
                <Row>
                    <Table
                            :loading="loading"
                            border
                            :columns="columns"
                            :data="data"
                            sortable="custom"
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
                </Col>
            </Row>
        </Card>
		<!-- <model-choose :formData33.sync="modalVisible" v-on:listenApply="modalVisibleState" :formData1.sync="dictForm" :relativeType.sync="counterpartArr"></model-choose> -->
		<model-choose :formData33.sync="modalVisible" :flag="true" v-on:listenApply="modalVisibleState" :formData1.sync="dictForm"></model-choose>
    </div>
</template>

<script>
	import  modelChoose from "./modelChoose.vue";
    import  {getProcessDataList } from "@/api/activiti";
    import {
        fromUp,
        myDelete,
        draftMyDelete,
		applyBusiness,
        eachOther,
        findContractByParam,
		lvxingDeleta,
		getDictDataByType,
        examineManList,
		contractModelquery,
        wordEdit,
		detailList,
        chooseFile
    } from "@/api/index";
    export default {
        name: "applyManage",
        components: {
			modelChoose
        },
        data() {
            return {
				source:0,
                accessToken: {}, // 上传token鉴权
                // counterpartArr: [], //相对方数据列表
                processData: {},
                searchProcessForm: {
                    showLatest: true,
                    name: "",
                    status: "1", // 激活状态
                    pageNumber: 1, // 当前页数
                    pageSize: 1000, // 页面大小
                    sort: "createTime", // 默认排序字段
                    order: "desc" // 默认排序方式
                },
                assigneeList: [],
                selectCount: 0,
                modalVisible: false,
                dictForm: {},
                form: {
                    procDefId: "",
                    assignee: "",
                    priority: "",
                    id: "",
                    tableId: "",
                    title: ""
                },
                loading: false, // 表格加载状态
                data: [], //表单数据
                total: 0, // 表单数据总数
                columns: [
                    {
                        title: "序号",
                        type: "index",
                        align: "center"
                    },
                    {
                        title: "合同名称",
                        key: "name",
						align: "center"
                    },
					{
					    title: "收付款方式",
					    // key: "paytype",
						align: "center",
						render: (h, params) => {
						  let text = "",
						    color = "default";
						  if (params.row.istopay==1) {
						    text = "收款";
						  } else if(params.row.istopay==0){
						    text = "付款";
						  }else if(params.row.istopay==2){
						    text = "不涉及";
						  }
						  return h("div", [
						    h(
						      "div",
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
                        title: "合同金额（万元）",
                        key: "money",
						align: "center"
                    },
                    {
                        title: "合同类型",
                        key: "contractType",
                        align: "center"
                    },
                    {
                        title: "起草人",
                        key: "draftsman",
                        align: "center"
                    },
                    {
                        title: "起草时间",
                        key: "draftstime",
                        align: "center"
                    },
                    {
                        title: "操作",
                        key: "action",
                        width: 160,
                        align: "center",
                        fixed: "right",
                        render: (h, params) => {
                            return h("div", [
                                h("Button",{
                                        props: {
                                            type: "primary",
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
                                h("Button",{
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
                            ]);
                        }
                    }
                ],
                searchForm: {
                    // 搜索框对应data对象
                    name: "",
                    number: "",
					startTime:"",
					endTime:"",
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    order: "asc" // 默认排序方式
                },
                form_up: {
                    createTime: "",
                    department: "",
                    mobile: "",
                    userId: "",
                    userName: "",
                    uName: ""
                }
            };
        },
        methods: {
			modalVisibleState(data){
				this.modalVisible = data;
				this.getDataList();
			},
			//搜索出时间校验
			timeChange(){
				if(!this.searchForm.startTime){
					this.$Message.error("请先选择开始时间");
					this.searchForm.endTime = "";
					return;
				}
				if(this.searchForm.startTime >= this.searchForm.endTime){
					this.$Message.error("开始时间不能大于等于结束时间");
					this.searchForm.endTime = "";
				}
			},
            //模板选择
            getProcessList() {
                getProcessDataList(this.searchProcessForm).then(res => {
                    if (res.message=="success") {
						let arr = res.result.content;
						for(var i = 0;i<arr.length;i++){
							if(arr[i].processKey == "contract_approve"){
								this.processData = arr[i];
								this.form.procDefId = this.processData.id;
								this.getDictDataType();
								break;
							}
						}
                    }
                });
            },
            getDictDataType() {
                examineManList(this.processData.id).then(res => {
                    this.assigneeList = res.result.users;
                });
            },
            init() {
                this.getProcessList();
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
                // 获取表单数据
                fromUp().then(res => {
                    this.form_up.createTime = res.createTime;
                    this.form_up.department = res.department;
                    this.form_up.mobile = res.mobile;
                    this.form_up.userId = res.userId;
                    this.form_up.userName = res.nickName;
                    this.form_up.uName = res.userName;
                });
     //            eachOther().then(res => {
					// if(res.success){
					// 	this.counterpartArr = res.result.content;
					// }
     //            });
                this.getDataList();
            },
            remove(v) {
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除 " + v.name + " ?",
                    onOk: () => {
                        // 删除
                        draftMyDelete({ id: v.id }).then(res => {
                            this.$Message.success("操作成功");
                            this.getDataList();
                        });
                    }
                });
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
                        draftMyDelete({ modelId: ids }).then(res => {
                            this.$Message.success("操作成功");
                            this.getDataList();
                        });
                    }
                });
            },
            add() {
                this.dictForm = {
                    isuse: "",
                    id: "",
                    name: "",
                    typeid: "",
                    typeName: "",
                    contentname: "",
                    contracturl: "",
                    ismoney: "1",
                    issecret: "1",
                    isbudget: "1",
                    isbid: "1",
                    starttime: "",
                    number: "",
                    contentnum: 0,
                    counterpartnum: 0,
                    totalnum: "",
                    chapter: "1",
                    description: "",
                    attachmentname: "",
                    accessoryurl: "",
                    draftsman: this.form_up.userName,
                    draftsoutfit: this.form_up.department, //起草机构
                    draftsoutfitid: "",
                    //合同范本
                    source: "",
                    sourceArr: [],
                    money: "",
                    istopay: "1",
                    istime: "1",
                    isurgent: "1",
                    endtime: "",
                    counterpartid: "",
                    draftstime: "",
                    phone: this.form_up.mobile,
                    counterpartList: [
						{
							contractId:"",
							counterpartId:"",
							degreeId:"",
							id:"",
							removeExit:false
						}
					],
					parentId:"",
					uploadList:[]
                };
                this.modalVisible = true;
            },
            edit(v) {
				detailList({id:v.id}).then(res => {
					if(res.result == "success"){
						this.dictForm = res.contract;
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
									obj.fileDownUrl = '/zhfw/contract/draft/download?fileName='+arr[i]+'&url='+arr2[i]+'&accessToken='+this.getStore("accessToken");
									this.dictForm.uploadList.push(obj);
								}
							}
						}
					}
				})
            },
            changePage(v) {
                this.searchForm.pageNumber = v;
                this.getDataList();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getDataList();
            },
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
			handleReset(){
				this.searchForm={
                    name: "",
                    number: "",
                    time: "",
                    pageNumber: 1, 
                    pageSize: 10, 
                    order: "asc"
                }
				this.getDataList();
			},
            getDataList() {
                this.loading = true;
                findContractByParam(this.searchForm).then(res => {
					this.loading = false;
					this.data = res.data.queryContractBeanList;
					this.total = res.data.total;
                });
            }
        },
        mounted() {
            this.init();
        }
    };
</script>