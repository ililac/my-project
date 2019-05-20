<style lang="less">
	@import "../formModel.less";
</style>

<template>
	<div class="formModel">
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg">
				<Col :span="24">
					<Row>
						<Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
							<Form-item label="名称">
								<Input type="text" v-model="searchForm.counterpartName" placeholder="请输入" clearable style="width: 200px"/>
							</Form-item>
							<Form-item label="机构类型">
								<Select v-model="searchForm.counterpartTypeId" placeholder="请选择" style="width:200px">
									<Option v-for="item in relative_type" :value="item.id">{{ item.title }}</Option>
								</Select>
							</Form-item>
							<Form-item label="状态">
								<Checkbox v-model="unlockState.unlock" value="1">有效</Checkbox>
								<Checkbox v-model="unlockState.lock" value="2">无效</Checkbox>
								<!-- <label>
						             有效
									<input type="checkbox" value="1" checked v-model="unlockState.unlock"/>
								</label>
								<label>
									无效
									<input type="checkbox" value="2" v-model="unlockState.lock"/>
								</label> -->
							</Form-item>
							<Form-item style="margin-left:-35px;" class="br">
								<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
								<Button @click="handleReset" >重置</Button>
							</Form-item>
						</Form>
					</Row>
					<Row class="operation">
						<Button @click="add" type="primary" icon="md-add">添加数据</Button>
						<Button @click="delAll" icon="md-trash">批量删除</Button>
						<Button @click="getDataList" icon="md-refresh">刷新数据</Button>
					</Row>
					<Row>
						<Alert show-icon>
							已选择 <span class="select-count">{{selectCount}}</span> 项
							<!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
						</Alert>
					</Row>
					<Row>
						<Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
					</Row>
					<Row type="flex" justify="end" class="page">
						<Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
					</Row>
				</Col>
			</Row>
		</Card>
		<relative-edit :formData.sync="dictForm" :sourceType.sync="source" :visible.sync="modalVisible" v-on:relativelisten="childShow2"  v-on:listen="childShow"></relative-edit>
		<!-- <Modal title="相对方管理" v-model="modalVisible" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel" footer-hide>
			<div style="clear:both"></div>
			<relative-edit :formData.sync="dictForm" :sourceType.sync="source" v-on:listen="childShow"></relative-edit>
		</Modal> -->
	</div>
</template>

<script>
    import {
		relativeDelete,
		relativeFromSave,
        getDictDataByType,
		contractRelativequery,
		relativeLock,
		modelRelativeDetail,
		relativeFindCompany,
		relativeNumber,
        fromUp
    } from "@/api/index";
    import circleLoading from "../../my-components/circle-loading.vue";
    import relativeEdit from "./relativeEdit.vue";
    export default {
        name: "relative",
        components: {
            circleLoading,
			relativeEdit
        },
        data() {
            return {
				source:0,//添加相对方的来源
                accessToken: {}, // 上传token鉴权
				unlockState:{
					unlock:"",
					lock:""
				},
                selectCount:0,
                relative_type:[],
				ownership_type:[],
                modalVisible: false,
				lockDate:{
					counterpartId:"",
					blackFlag:''
				},
                dictForm: {
                    counterpartTypeId:"",
					counterpartName:"",
					creditCode:"",
					isSpecificSubject:0,
					subjectTypeId:"",
					companyControls:0,
					isUnincorporate:0,
					enterpriseId:"",
					isListed:0,
					isInland:1,
					controlPerson:"",
					phone:"",
					facsimile:"",
					isLicense:0,
					systemOutside:0,
					linkman:"",
					bankAccount:"",
					qualificationInfoAddr:"",
					qualificationInfoName:"",
					unincorpCertifiAddr:"",
					unincorpCertifiName:"",
					comment:"",
					createTime:"",
					createBy:"",
                    registerDate : '',
                    registerCapital : ''
                },
                loading: false, // 表格加载状态
                data: [], //表单数据
                total: 0, // 表单数据总数
                columns: [
                    {
                        type: "selection",
                        width: 60,
                        align: "center"
                    },
                    {
                        title: "序号",
                        type: "index",
                        align: "center"
                    },
                    {
                        title: "相对方名称",
                        key: "counterpartName",
						align: "center",
						render: (h, params) => {
						  return h("div", [
						    h(
						      "a",
						      {
						        on: {
						          click: () => {
						            this.see(params.row);
						          }
						        }
						      },
						      params.row.counterpartName
						    )
						  ]);
						}
                    },
                    {
                        title: "机构类型",
                        key: "counterpartTypeName",
						align: "center"
                    },
                    {
                        title: "联系人",
                        key: "linkman",
						align: "center"
                    },
                    {
                        title: "创建人",
                        key: "createBy",
						align: "center"
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
						align: "center"
                    },
					{
					    title: "状态",
					    key: "text",
						align: "center",
						render: (h, params) => {
						    if(params.row.blackFlag==0){
								return h("div", [
									"有效"
								])
							}else{
								return h("div", [
									"无效"
								]);
							}
						}
					},
                    {
                        title: "操作",
                        key: "action",
                        width: 180,
                        align: "center",
                        fixed: "right",
                        render: (h, params) => {
                            if(params.row.blackFlag==0){
								return h("div", [
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
									            type: "primary",
									            size: "small"
									        },
									        style: {
									            marginRight: "5px"
									        },
									        on: {
									            click: () => {
									                this.lock(params.row);
									            }
									        }
									    },
									    "拉黑"
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
								])
							}else{
								return h("div", [
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
									            type: "primary",
									            size: "small"
									        },
									        style: {
									            marginRight: "5px"
									        },
									        on: {
									            click: () => {
									                this.unlock(params.row);
									            }
									        }
									    },
									    "解锁"
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
								]);
							}
                        }
                    }
                ],
                searchForm: {
					blackFlag:"",
                    counterpartName:"",
					counterpartTypeId:""
                },
                stockholdersList : []
            };
        },
        methods: {
			//判断是否刷新数据
			childShow(data){
				if(data.show){
					this.getDataList();
				}
			},
			//判断显示状态
			childShow2(data){
				this.modalVisible = data;
			},
			selectDateRange(v) {
			  if (v) {
				this.searchForm.startDate = v[0];
				this.searchForm.endDate = v[1];
			  }
			},
            init() {
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
				//机构类型
                getDictDataByType("counterpart").then(res => {
                    if (res.success) {
                        this.relative_type = res.result;
                    }
                });
                this.getDataList();
            },
            clearSelectAll() {
                // this.$refs.table.selectAll(false);
            },
            remove(v) {
                this.$Modal.confirm({
                    title: "确认删除",
                    content: "您确认要删除 " + v.counterpartName + " ?",
                    onOk: () => {
                        // 删除
                        relativeDelete({counterpartId:v.counterpartId}).then(res => {
                            if (res === true) {
                                this.$Message.success("操作成功");
                                this.getDataList();
                            }
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
                            ids += e.counterpartId + ",";
                        });
                        ids = ids.substring(0, ids.length - 1);
                        // 批量删除

                        relativeDelete({counterpartId:ids}).then(res => {

                            if (res === true) {
                                this.$Message.success("操作成功");
                                this.clearSelectAll();
                                this.getDataList();
                            }
                        });
                    }
                });
            },
            add() {
				relativeNumber().then(res => {
					if(res.success){
						this.dictForm = {
						    counterpartTypeId:"",
						    counterpartName:"",
						    creditCode:"",
						    isSpecificSubject:0,
						    subjectTypeId:"",
						    companyControls:0,
						    isUnincorporate:0,
						    enterpriseId:"",
						    isListed:0,
						    isInland:1,
						    controlPerson:"",
						    phone:"",
						    facsimile:"",
						    isLicense:0,
						    systemOutside:0,
						    linkman:"",
						    bankAccount:"",
						    qualificationInfoAddr:"",
						    qualificationInfoName:"",
						    unincorpCertifiAddr:"",
						    unincorpCertifiName:"",
						    comment:"",
						    createTime:"",
							createBy:"",
							registerDate:"",
							registerCapital:"",
							flag:"",
							counterpartNumber:res.result,
							stockholdersList:[],
							linkMans:[],
							punishmentInfos:[],
							ktannouncements:[],
							uploadList:[],
							officeAddress:"",
							legalPersonName:"",
							openBank:"",
							disable:false
						},
						this.source = 1;
						this.modalVisible = true;
					}
				})
            },
			lock(v){
				this.$Modal.confirm({
				    title: "确认拉黑 ",
				    content: "您确认要拉黑 " + v.counterpartName + " ?",
				    onOk: () => {
						this.lockDate.blackFlag = -1;
						this.lockDate.counterpartId = v.counterpartId;
				        // 删除
						relativeLock(this.lockDate).then(res => {
								this.loading = false;
								this.getDataList()
						});
				    }
				});
			},
			unlock(v){
				this.$Modal.confirm({
				    title: "确认解锁 ",
				    content: "您确认要解锁" + v.counterpartName + " ?",
				    onOk: () => {
						this.lockDate.blackFlag = 0;
						this.lockDate.counterpartId = v.counterpartId;
						relativeLock(this.lockDate).then(res => {
						    this.loading = false;
							this.getDataList()
						});
				    }
				});	
			},
            edit(v) {
				modelRelativeDetail({id:v.id,type:2}).then(res=>{
					if(res.success){
						var result = res.result.counterpartDetail;
						Object.keys(result).forEach(function(key){
							if(result[key] === null){
								result[key] = "";
							}
						});
						this.dictForm = result;
						this.dictForm.punishmentInfos = res.result.punishmentInfos.punishmentInfos;
						this.dictForm.administrativeTotal = res.result.punishmentInfos.total;
						this.dictForm.linkMans = res.result.linkMans.linkMans;
						this.dictForm.linkTotal = res.result.linkMans.total;
						this.dictForm.ktannouncements = res.result.ktannouncements.ktannouncements;
						this.dictForm.noticeTotal = res.result.ktannouncements.total;
						this.dictForm.stockholdersList = res.result.stockholdersList.stockholdersList;
						this.dictForm.stockholdersTotal = res.result.stockholdersList.total;
						this.dictForm.flag = "bj";
						this.dictForm.disable = true;
						this.dictForm.uploadList = [];
						if(this.dictForm.qualificationInfoName){
							let arr = this.dictForm.qualificationInfoName.split(',');
							let arr2 = this.dictForm.qualificationInfoAddr.split(',');
							if(arr.length > 0){
								for(let i = 0;i < arr.length;i++){
									var obj = {name:"",url:"",fileDownUrl:""};
									obj.name = arr[i];
									obj.url = arr2[i];
									obj.fileDownUrl = '/xboot/draft/download?fileName='+arr[i]+'&url='+arr2[i]+'&accessToken='+this.getStore("accessToken");
									this.dictForm.uploadList.push(obj);
								}
							}
						}
						this.source = 1;
						this.modalVisible = true;
					}
				});
            },
			see(v){
				let query = { type: 2, id: v.id, backRoute: this.$route.name };
				this.$router.push({
				  name: "relativeDetail",
				  query: query
				});
			},
            changeSort(e) {
                this.searchForm.sort = e.key;
                this.searchForm.order = e.order;
                if (e.order === "normal") {
                    this.searchForm.order = "";
                }
                this.getDataList();
            },
            showSelect(e) {
                this.selectList = e;
                this.selectCount = e.length;
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
            handleSearch() {
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
				if(this.unlockState.lock&!this.unlockState.unlock){
					this.searchForm.blackFlag = -1;
				}else if(!this.unlockState.lock&this.unlockState.unlock){
					this.searchForm.blackFlag = 0;
				}else{
					this.searchForm.blackFlag = "";
				}
                this.getDataList();
            },
			handleReset(){
				this.searchForm = {
					blackFlag:"",
                    counterpartName:"",
					counterpartTypeId:""
                }
				this.unlockState={
					unlock:"",
					lock:""
				},
				 this.getDataList();
			},
            getDataList() {
                this.loading = true;
				this.data = [];
				this.total = 0;
                contractRelativequery(this.searchForm).then(res => {
                    this.loading = false;
                    if (res.success === true) {
                        this.data = res.result.content;
                        this.total = res.result.totalElements;
                    }
                });
            },
        },
        mounted() {
            this.init();
        }
    };
</script>