<style lang="less">
	@import "../formModel.less";
</style>

<template>
    <div class="search">
        <Card>
            <Row type="flex" justify="space-between" class="code-row-bg">
                <Col :span="24">
                <Row>
                    <Form ref="searchForm" :model="searchForm" inline :label-width="120" class="search-form">
                        <Form-item label="关联合同名称">
                            <Input style="width: 150px;" type="text" v-model="searchForm.contractName" placeholder="请输入" clearable/>
                        </Form-item>
                        <Form-item label="案由">
                            <Input style="width: 150px;" type="text" v-model="searchForm.summary" placeholder="请输入" clearable/>
                        </Form-item>
						<Form-item label="处理方式">
							<Select v-model="searchForm.disputeModelId" style="width: 150px;">
								<Option  v-for="item in releaseArr" :value="item.id">{{item.title}}</Option>
							</Select>
						</Form-item>
                        <Form-item style="margin-left:-35px;" class="br">
                            <Button @click="handleSearch" type="primary" icon="ios-search">查询</Button>
                            <Button @click="handleReset">重置</Button>
                        </Form-item>
                    </Form>
                </Row>
                <Row class="operation">
                    <Button @click="add" type="primary" icon="md-add">添加争议信息</Button>
                    <Button @click="excelDown">excel导出</Button>
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
		<Modal title="添加争议信息" v-model="disputeVisible" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="disputeForm" :show-message="false" :model="disputeForm" :label-width="120">
					<div class="ul">
						<Form-item label="关联合同" class="lef asterisk">
							<Button :disabled="disable" style="display: block;width: 100%;" @click="relevance">{{disputeForm.contractId?disputeForm.contractName:"选择关联合同"}}</Button>
						</Form-item>
						<Form-item label="关联合同编号" class="lef">
							<Input type="text" v-model="disputeForm.contractNum" placeholder="请输入" :disabled="true" clearable/>
						</Form-item>
					</div>
					<div class="ul">
						<Form-item label="案由" class="lef asterisk">
							<Input :disabled="disable" type="text" v-model="disputeForm.summary" placeholder="请输入" clearable/>
						</Form-item>
						<Form-item label="争议处理方式" class="lef asterisk">
							<Select :disabled="disable" v-model="disputeForm.disputeModelId">
								<Option  v-for="item in releaseArr" :value="item.id">{{item.title}}</Option>
							</Select>
						</Form-item>
					</div>
					<div class="ul">
						<Form-item label="原告" class="lef asterisk">
							<Select :disabled="disable" v-model="disputeForm.plaintiff" @on-change="counterpartArrSelect(1)" ref="resetSelect" clearable>
								<Option  v-for="item in counterpartArr" :value="item.id">{{item.counterpartName}}</Option>
							</Select>
						</Form-item>
						<Form-item label="被告" class="lef asterisk">
							<Select :disabled="disable" v-model="disputeForm.defendant" @on-change="counterpartArrSelect(2)" ref="resetSelect2" clearable>
								<Option  v-for="item in counterpartArr" :value="item.id">{{item.counterpartName}}</Option>
							</Select>
						</Form-item>
					</div>
					<div class="ul">
						<Form-item label="立案时间" class="lef asterisk">
							<DatePicker
							        v-model="disputeForm.filingTime"
							        type="date"
							        format="yyyy-MM-dd"
							        clearable
									:editable="false"
									:disabled="disable"
									style="width: 100%;"
							        placeholder="选择开始时间"
							></DatePicker>
						</Form-item>
						<Form-item label="结案时间" class="lef asterisk">
							<DatePicker
									:disabled="disable"
							        v-model="disputeForm.closingTime"
							        type="date"
									:editable="false"
							        format="yyyy-MM-dd"
									@on-change="timeChange"
							        clearable
									style="width: 100%;"
							        placeholder="选择结束时间"
							></DatePicker>
						</Form-item>
					</div>
					<div class="ul">
						<Form-item label="争议处理结果" class="asterisk">
							<Input
								type="textarea"
								:disabled="disable"
								v-model="disputeForm.result"
								:maxlength="1000"
								:rows="2"
							/>
						</Form-item>
					</div>
					<div class="ul">
						<Form-item label="备注">
							<Input
								type="textarea"
								:disabled="disable"
								v-model="disputeForm.remark"
								:maxlength="1000"
								:rows="2"
							/>
						</Form-item>
					</div>
					<div class="ul">
						<Form-item label="相关附件">
							<Upload 
								action="/xboot/upload/file"
								ref="upload2"
								:disabled="disable"
								:headers="accessToken"
								:show-upload-list="false"
								:on-success="handleSuccess"
								:max-size="10240"
								:format="['doc','docx']"
								:on-exceeded-size="handleMaxSize"
								:on-format-error="handleFormatError"
								:before-upload="beforeUpload"
								multiple
								type="drag"
								v-show="!disable"
								class="upload"
								>
								<p id="contentname" class="upload">上传文件</p>
							</Upload>
							<p v-show="!disable" style="color: #d3d3d3;">支持扩展名：doc,.docx文件大小：<=10MB</p>
							<p v-show="disputeForm.fileUrl" @click="fileDowm(disputeForm.fileName,disputeForm.fileUrl)" style="color: #2B85E4;cursor: pointer;">{{disputeForm.fileName}}</p>
						</Form-item>
					</div>
				</Form>
			</Col>
			<div class="clear"></div>
			<div slot="footer">
				<Button type="text" @click="disputeVisible=false">取消</Button>
				<Button v-show="!disable" type="primary" @click="disputeSubmit">保存</Button>
			</div>
		</Modal>
		<Modal title="关联合同选择" v-model="modalVisible6" :mask-closable="false" :width="1000" footer-hide>
		    <Form>
		        <Form-item label="合同名称">
		            <Input type="text" v-model="signedForm.name" placeholder="请输入" clearable style="width: 300px"/>
		            <Button @click="signedSearch" type="primary" icon="ios-search" style="margin-left:35px;">查询</Button>
		        </Form-item>
		    </Form>
		    
		    <Row>
		        <Table :loading="loading1" border :columns="columns4" :data="signedData" sortable="custom" ref="table"></Table>
		    </Row>
		    <Row type="flex" justify="end" class="page">
		        <Page :current="signedForm.pageNum" :total="signedTotal" :page-size="signedForm.pageSize" @on-change="changeSignedPage" size="small" show-total show-elevator show-sizer></Page>
		    </Row>
		</Modal>
    </div>
</template>

<script>
    import {
		disputeList,
		signedContract,
		eachOther,
		getDictDataByType,
		disputeDelete,
		disputeSave
    } from "@/api/index";
    export default {
        name: "dispute",
        data() {
            return {
				source:0,
                accessToken: {}, // 上传token鉴权
                selectCount: 0,
                modalVisible: false,
				disable:false, //争议信息是否可编辑
                loading: false, // 表格加载状态
                data: [], //表单数据
                total: 0, // 表单数据总数
				counterpartArr:[],  //相对方列表
                columns: [
                    {
                        title: "序号",
                        type: "index",
                        align: "center"
                    },
                    {
                        title: "关联合同",
                        key: "contractName",
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
						      params.row.contractName
						    )
						  ]);
						}
                    },
					{
					    title: "关联合同编号",
					    key: "contractNum",
						align: "center"
					},
					{
					    title: "案由",
					    key: "summary",
					    align: "center"
					},
					{
					    title: "处理方式",
					    key: "disputeModelName",
						align: "center"
					},
					{
					    title: "立案时间",
					    key: "filingTime",
						align: "center"
					},
					{
					    title: "结案时间",
					    key: "closingTime",
						align: "center"
					},
					{
					    title: "操作",
					    key: "name",
						align: "center",
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
                    contractName: "",
                    summary: "",
                    disputeModelId: "",
                    pageNumber: 1, // 当前页数
                    pageSize: 10 // 页面大小
                },
				searchForm2:{
					contractName:"",
					summary:"",
					disputeModelId:""
				},
				disputeVisible:false, //添加争议信息模块
				disputeForm:{
					id:"",      //唯一标识
					createBy:"",      //创建者
					createTime:"",      //创建时间
					updateBy:"",      //更新者
					updateTime:"",      //更新时间
					delFlag:"",      //删除标志 默认0
					contractId:"",      //合同ID
					summary:"",      //案由
					disputeModelId:"",      //争议处理方式ID
					plaintiff:"",      //原告(相对方ID)
					defendant:"",      //被告（相对方ID）
					filingTime:"",      //立案时间
					closingTime:"",      //结案时间
					result:"",      //争议处理结果
					fileUrl:"",      //附件URL
					fileName:"",      //附件名称
					remark:"",      //备注
				},     //争议信息详情
				releaseArr:[],
				modalVisible6:false,   //关联的主合同
				signedForm:{
					pageNum:1,
					pageSize:10,
					name:"",
					stateIds:"7,8"
				},
				loading1:false,
				//主合同中的列表项
				columns4: [
				    // 表头
				    {
				        title: "序号",
				        type: "index",
				        width: 80,
				        align: "center"
				    },
				    {
				        title: "合同名称",
				        key: "name",
				        width: 240,
						align: "center"
				    },
				    {
				        title: "合同类型",
				        key: "contractType",
				        width: 200,
						align: "center"
				    },
				    {
				        title: "相对方",
				        key: "counterpartName",
						align: "center"
				    },
				    {
				        title: "备注",
				        key: "comment",
						align: "center"
				    },
				    {
				        title: "操作",
				        key: "action",
				        width: 80,
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
				                                this.chooseSigeed(params.row);
				                            }
				                        }
				                    },
				                    "选择"
				                ),
				                
				            ]);
				        }
				    }
				],
				signedData:[],    //关联的主合同的数据
				signedTotal:0,    //关联的主合同的总数
				// 验证信息
				relieveVerify:[
					{
						name:"关联合同",
						type:"contractId"
					},
					{
						name:"案由",
						type:"summary"
					},
					{
						name:"争议处理方式",
						type:"disputeModelId"
					},
					{
						name:"原告",
						type:"plaintiff"
					},
					{
						name:"被告",
						type:"defendant"
					},
					{
						name:"立案时间",
						type:"filingTime"
					},
					{
						name:"结案时间",
						type:"closingTime"
					},
					{
						name:"争议处理结果",
						type:"result"
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
				eachOther().then(res => {
					this.counterpartArr = res.result.content;
				});
				getDictDataByType("promisesType").then(res => {
				    if (res.success) {
				        this.releaseArr = res.result;
				    }
				});
            },
			//搜索出时间校验
			timeChange(){
				if(!this.disputeForm.filingTime){
					this.$Message.error("请先选择开始时间");
					this.disputeForm.closingTime = "";
					return;
				}
				if(this.disputeForm.filingTime >= this.disputeForm.closingTime){
					this.$Message.error("开始时间不能大于等于结束时间");
					this.disputeForm.closingTime = "";
				}
			},
            add() {
				this.disable = false;
				var disputeForm = this.disputeForm;
				for(let ind = 0;ind < disputeForm.length;ind++){
					disputeForm.ind = "";
				}
				this.disputeForm = {...disputeForm};
                this.disputeVisible = true;
            },
			see(v){
				this.disable = true;
				this.disputeForm = {...v};
				this.disputeVisible = true;
			},
			edit(v){
				this.disable = false;
				this.disputeForm = {...v};
				this.disputeVisible = true;
			},
			remove(v){
				this.$Modal.confirm({
				    title: "确认删除",
				    content: "您确认要删除 " + v.contractName + " ?",
				    onOk: () => {
				        // 删除
				        disputeDelete({ids:v.id}).then(res => {
				        	if(res.success){
				        		this.$Message.success("删除成功");
				        		this.getDataList();
				        	}
				        })
				    }
				});
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
				this.searchForm2 = {...this.searchForm}
                this.searchForm.pageNumber = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
			handleReset(){
				this.searchForm={
                    contractName: "",
                    summary: "",
                    disputeModelId: "",
                    pageNumber: 1,
                    pageSize: 10
                }
				this.getDataList();
			},
            getDataList() {
                this.loading = true;
                disputeList(this.searchForm).then(res => {
					this.loading = false;
					this.data = res.result.records;
					// this.total = res.data.total;
                });
            },
			//主合同数据
			signedList(){
				signedContract(this.signedForm).then(res => {
					if(res.success){
						this.signedData = res.result.signedContractVos;
						this.signedTotal = res.result.total;
					}
				})
			},
			//点击选择主合同
			relevance(){
				this.modalVisible6 = true;
				this.signedList();
			},
			//关联的主合同中的列表数据翻页事件
			changeSignedPage(v){
				this.signedForm.pageNum = v;
				this.signedList();
			},
			//主合同选择中的选择按钮
			chooseSigeed(v){
				this.disputeForm.contractId = v.contractId;
				this.disputeForm.contractName = v.name;
				this.disputeForm.contractNum = v.number;
				this.modalVisible6 = false;
			},
			//主合同搜索
			signedSearch(){
				this.signedList();
			},
			//合同争议信息验证
			relieveVerification(){
				let arr = this.disputeForm;
				for( let item of this.relieveVerify){
					if(!arr[item.type]){
						this.$Message.error(item.name+"没有填写");
						return true;
					}
				}
			},
			//验证原告被告
			counterpartArrSelect(type){
				if(this.disputeForm.plaintiff&&this.disputeForm.defendant){
					if(this.disputeForm.plaintiff == this.disputeForm.defendant){
						this.$Message.error("原告和被告不能选择同一个人");
						if(type == 1){
							this.$refs.resetSelect.clearSingleSelect();
						}else{
							this.$refs.resetSelect2.clearSingleSelect();
						}
					}
				}
			},
			//合同争议信息提交
			disputeSubmit(){
				if(this.relieveVerification()){
					return;
				}
				let disputeForm = {...this.disputeForm};
				if(typeof(disputeForm.filingTime)=="object"){
					let d = disputeForm.filingTime;
					var date = d.getFullYear() + "-" + 
							   (d.getMonth() + 1) + "-" +
							   d.getDate()
					disputeForm.filingTime = date;
				}
				if(typeof(disputeForm.closingTime)=="object"){
					let d = disputeForm.closingTime;
					var date = d.getFullYear() + "-" + 
							   (d.getMonth() + 1) + "-" +
							   d.getDate()
					disputeForm.closingTime = date;
				}
				disputeSave(disputeForm).then(res => {
					if(res.success){
						this.disputeVisible = false;
						this.getDataList();
					}
				})
			},
			handleSuccess(res, file) {
				if(res.message == "success"){
					this.disputeForm.fileUrl = res.result.url;
					this.disputeForm.fileName = res.result.name;
					console.log(this.disputeForm);
					document.getElementById("contentname").innerHTML = "点击上传";
				}else{
					this.$Message.error("上传文件 " + file.name + " 失败");
					document.getElementById("contentname").innerHTML = "点击上传";
				}
			},
			handleError(error, file) {
				this.$Message.error(error.toString());
				// this.dictForm[this.upId] = "上传失败，请重新上传";
				document.getElementById("contentname").innerHTML = "点击上传";
			},
			beforeUpload(file) {
				if (file.type.indexOf('word')>-1) {
				document.getElementById("contentname").innerHTML = "文件上传中...";
				}else{
				document.getElementById("contentname").innerHTML = "点击上传";
				this.$Message.error('请上传word文件！')
				}
			},
			handleMaxSize(file) {
				tdocument.getElementById("contentname").innerHTML = "文件过大，请重新上传";
				this.$Notice.warning({
					title: "文件大小过大",
					desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
				});
			},
			//合同正文中上传文件的格式错误
			handleFormatError(){
				this.$Notice.warning({
			        title: '格式错误',
			        desc: "所选文件‘ " + file.name + " ’格式错误"
			    });
			},
			fileDowm(name,url){
				window.open("/xboot/draft/download?fileName="+name+"&url="+url+"&accessToken="+this.getStore("accessToken"));
			},
			excelDown(){
				window.open('/xboot/contract/dispute/exportXls?accessToken='+this.getStore("accessToken")+"&contractName="+this.searchForm2.contractName+"&summary="+this.searchForm2.summary+"&disputeModelId="+this.searchForm2.disputeModelId);
			}
        },
        mounted() {
            this.init();
        }
    };
</script>