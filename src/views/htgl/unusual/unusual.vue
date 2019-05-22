<style lang="less">
	@import "../formModel.less";
</style>
<template>
	<div class="search">
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg">
				<Col :span="24">
					<Row>
						<Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
							<Form-item label="名称">
								<Input type="text" v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px"/>
							</Form-item>
							<Form-item label="编号">
								<Input type="text" v-model="searchForm.number" placeholder="请输入" clearable style="width: 200px"/>
							</Form-item>
							<Form-item style="margin-left:-35px;" class="br">
								<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
								<!-- <Button @click="handleExport">excel导出</Button> -->
							</Form-item>
						</Form>
					</Row>
					<Row>
						<Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
					</Row>
					<Row type="flex" justify="end" class="page">
						<Page :current="searchForm.pageNo" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
					</Row>
				</Col>
			</Row>
		</Card>
		<model-choose :formData33.sync="modalVisible" v-on:listenApply="modalVisibleState" :formData1.sync="dictForm"></model-choose>
		<Modal title="合同解除" v-model="relieveVisible" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="relieveForm" :show-message="false" :model="relieveForm" :label-width="120">
					<p style="font-size: 16px;">解除信息</p>
					<div class="ul">
						<Form-item label="解除原因" class="lef asterisk">
							<Select v-model="relieveForm.releaseReason" style="float: left;width: 90%;">
								<Option  v-for="item in relieveArr" :value="item.id">{{item.title}}</Option>
							</Select>
						</Form-item>
						<Form-item label="解除时间" class="lef asterisk">
							<DatePicker
									v-model="relieveForm.releaseTime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择解除时间"
									style="width: 100%;"
									:editable="false"
							></DatePicker>
						</Form-item>
					</div>
					<div class="ul">
						<FormItem label="备注">
							<Input
								type="textarea"
								v-model="relieveForm.releaseRemark"
								:rows="2"
							/>
						</FormItem>
					</div>
					<p style="font-size: 16px;">基本信息</p>
					<basic-form :formData.sync="dictForm" :fileDown.sync="fileDownUrl" :sourceType.sync="source"></basic-form>
				</Form>
			</Col>
			<div class="clear"></div>
			<div slot="footer">
				<Button type="text" @click="relieveVisible=false">取消</Button>
				<Button type="primary" @click="relieveSubmit">提交</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
    import {
		signContractList,
		getDictDataByType,
		detailList,
		relieveContract
    } from "@/api/index";
	import  modelChoose from "../../activiti/business/modelChoose.vue";
	import basicForm from "../detail/basic.vue";
    export default {
        name: "unusual",
		components: {
			modelChoose,
			basicForm
		},
        data() {
            return {
                accessToken: {}, // 上传token鉴权
                selectCount:0,
				relieveArr:[],  //解除原因
				//搜索部分的列表字段
                dictForm: {
                    id:"",
					name:"",
					number:"",
					money:"",
					draftsman:"",
					draftstime:"",
					state:"",
					total:""
                },
                loading: false, // 表格加载状态
                data: [], //表单数据
                total: 0, // 表单数据总数
                columns: [
                    // 表头
                    // {
                    //     type: "selection",
                    //     width: 60,
                    //     align: "center"
                    // },
                    {
                        title: "序号",
                        type: "index",
                        width: 100,
                        align: "center"
                    },
                    {
                        title: "合同名称",
                        key: "name",
                        width: 150,
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
						      params.row.name
						    )
						  ]);
						}
                    },
                    {
                        title: "合同编号",
                        key: "number",
                        width: 150,
						align: "center"
                    },
                    {
                        title: "合同金额",
                        key: "money",
                        width: 180,
						align: "center"
                    },
                    {
                        title: "起草人",
                        key: "draftsman",
                        width: 100,
						align: "center"
                    },
					{
					    title: "起草时间",
					    key: "draftstime",
					    width: 100,
						align: "center"
					},
					{
					    title: "合同状态",
					    key: "state",
					    width: 180,
						align: "center"
					},
                    {
                        title: "操作",
                        key: "action",
                        width: 180,
                        align: "center",
                        fixed: "right",
						render: (h, params) => {
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
						                        this.termination(params.row);
						                    }
						                }
						            },
						            "合同变更"
						        ),
						    	h(
						    	    "Button",
						    	    {
						    	        props: {
						    	            type: "error",
						    	            size: "small"
						    	        },
						    	        style: {
						    	            marginRight: "5px"
						    	        },
						    	        on: {
						    	            click: () => {
						    	                this.finish(params.row);
						    	            }
						    	        }
						    	    },
						    	    "合同解除"
						    	)
						    ]);
						}
                    }
                ],
				//搜索部分数据
                searchForm: {
					name:"",
					number:"",
					startTime:"",
					endTime:"",
					stateId:[7,8],
                    pageSize:10,
					pageNo:1
                },
				//弹窗模块
				modalVisible:false,
				//合同解除的弹窗
				relieveVisible:false,
				relieveForm:{
					contractId:"",
					releaseReason:"",
					releaseTime:"",
					releaseRemark:""
				},
				source:2,  //基本信息来源
				fileDownUrl:'',
				relieveVerify:[
					{
						name:"解除原因",
						type:"releaseReason"
					},
					{
						name:"解除时间",
						type:"releaseTime"
					}
				]
            };
        },
        methods: {
            init() {
				
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
                this.getDataList();
            },
			//查看详情
			see(v){
				let query = { type: 1, id: v.id, backRoute: this.$route.name };
				this.$router.push({
				    name: "detail",
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
                this.searchForm.pageNo = v;
                this.getUserList();
                this.clearSelectAll();
            },
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getUserList();
            },
            handleSearch() {
                this.searchForm.pageNo = 1;
                this.searchForm.pageSize = 10;
				console.log(this.searchForm);
                this.getDataList();
            },
			//表格导出
			handleExport(){
				
			},
            getDataList() {
                this.loading = true;
				this.data = [];
				this.total = 0;
                signContractList(this.searchForm).then(res => {
                    this.loading = false;
					this.data = res.listContracts;
					this.total = res.total;
                });
            },
			//合同变更
			termination(v){
				this.getDetail(v);
				this.modalVisible = true;
			},
			//合同解除
			finish(v){
				this.getDetail(v);
				this.relieveVisible = true;
				//获取解除原因数据列表
				getDictDataByType("relieveReason").then(res => {
				    if (res.success) {
				        this.relieveArr = res.result;
				    }
				});
			},
			modalVisibleState(data){
				this.modalVisible = data;
				if(!data){
					this.getDataList();
				}
			},
			getDetail(v){
				detailList({id:v.id}).then(res => {
					if(res.result == "success"){
						this.dictForm = res.contract;
						if(res.contract.istopay == 0){
							this.dictForm.istopayName = "付款";
						}else if(res.contract.istopay == 1){
							this.dictForm.istopayName = "收款";
						}else if(res.contract.istopay == 2){
							this.dictForm.istopayName = "不涉及";
						}
						if(res.contract.source == 1){
							this.dictForm.sourceName = "自行起草";
						}else{
							this.dictForm.sourceName = "标准文本";
						}
						this.dictForm.counterpartList = res.counterpartList;
						this.dictForm.parentContractName = res.parentContractName;
						this.dictForm.modalSource = 1;
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
						this.fileDownUrl = '/zhfw/contract/draft/download?fileName='+this.dictForm.contentname+'&url='+this.dictForm.contracturl+'&accessToken='+this.getStore("accessToken");
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
			//合同解除的信息验证
			relieveVerification(){
				let arr = this.relieveForm;
				for( let item of this.relieveVerify){
					if(!arr[item.type]){
						this.$Message.error(item.name+"没有填写");
						return true;
					}
				}
			},
			//合同解除提交
			relieveSubmit(){
				if(this.relieveVerification()){
					return;
				}
				let relieveForm = {...this.relieveForm};
				if(typeof(relieveForm.releaseTime)=="object"){
					let d = relieveForm.releaseTime;
					var date = d.getFullYear() + "-" + 
							   (d.getMonth() + 1) + "-" +
							   d.getDate()
					relieveForm.releaseTime = date;
				}
				relieveForm.contractId = this.dictForm.id;
				relieveContract(relieveForm).then(res => {
					if(res.success){
						this.$Message.success(res.message);
						this.relieveVisible = false;
						this.getDataList();
					}
				})
			},
        },
        mounted() {
            this.init();
        },
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name === "unusual"){
					this.init();
				}
			}
		}
    };
</script>