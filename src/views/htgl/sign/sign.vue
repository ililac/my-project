<style lang="less" scoped>
	@import "../formModel.less";
	.upLoad{
		background: #fff;
		border: 1px dashed #dcdee2;
		border-radius: 4px;
		text-align: center;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		line-height: 24px;
		transition: border-color .2s ease;
	}
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
							<Form-item label="起草时间">
								<DatePicker
								  v-model="searchForm.startTime"
								  format="yyyy-MM-dd"
							  :editable="false"
								  clearable
								  placeholder="选择起始时间"
								></DatePicker>
								<DatePicker
								  v-model="searchForm.endTime"
								  format="yyyy-MM-dd"
								  clearable
								  @on-change="timeChange"
							  :editable="false"
								  placeholder="选择起始时间"
								></DatePicker>
							</Form-item>
							<Form-item style="margin-left:-35px;" class="br">
								<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
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
		<Modal title="作废" v-model="modalVisible" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="cancellationForm" :model="cancellationForm" :label-width="120" :rules="dictFormValidate">
					<div class="ul">
						<Form-item label="合同名称" class="lef">
							<p>{{cancellationForm.contractName}}</p>
						</Form-item>
						<FormItem label="合同编号" class="lef">
							<p>{{cancellationForm.contractNo}}</p>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="承办人" class="lef">
							<p>{{cancellationForm.creatman}}</p>
						</FormItem>
						<FormItem label="承办部门" class="lef">
							<p>{{form_up.department}}</p>
						</FormItem>
					</div>
					<div class="ul txtar">
						<FormItem label="作废原因" prop="reason">
							<Input
								type="textarea"
								:maxlength="1000"
								v-model="cancellationForm.reason"
								:rows="2"
								placeholder="请输入"
							/>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="作废依据" class="lef">
							<Upload action="/zhfw/system/upload/file"
									:headers="accessToken"
									:on-success="handleSuccess"
									:on-error="handleError"
									:max-size="5120"
									:on-exceeded-size="handleMaxSize"
									:before-upload="beforeUpload"
									ref="up"
							>
								<div>
									<p id="dependName" style="cursor: pointer;" @click="getUpId('dependName')">{{cancellationForm.dependName?cancellationForm.dependName:"上传文件"}}</p>
								</div>
							</Upload>
						</FormItem>
						<FormItem label="作废发起人" class="lef">
							<p>{{cancellationForm.username}}</p>
						</FormItem>
					</div>
					
				</Form>
			</Col>
			<div style="clear:both"></div>
			<div slot="footer">
				<Button :loading="btnLoading" type="primary"  @click="handelSubmitDict">
					<span v-if="!btnLoading">提交</span>
					<span v-else>Loading...</span>
				</Button>
				<Button :loading="btnLoading2" type="primary"  @click="handelSubmitSave">
					<span v-if="!btnLoading2">保存</span>
					<span v-else>Loading...</span>
				</Button>
				<Button type="text" @click="modalVisible=false">取消</Button>
			</div>
		</Modal>
		<Modal title="签署信息登记" v-model="modalSign" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="signForm" :model="signForm" :label-width="140" :rules="dictFormValidate2">
					<p class="title">我方签署情况</p>
					<div class="ul">
						<FormItem label="签约时间" class="lef data" prop="type" :show-message="false">
							<DatePicker
							  v-model="signForm.oursigntime"
							  format="yyyy-MM-dd"
							  clearable
							  :editable="false"
							  placeholder="选择起始时间"
							  style="width: 100%;"
							></DatePicker>
						</FormItem>
						<FormItem label="签约金额（万元）" class="lef">
							<p style="width: 300px;height: 30px;line-height: 30px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{signForm.oursignmoney}}</p>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="签约人" class="lef" prop="oursignman">
							<input type="text" v-model="signForm.oursignman">
						</FormItem>
						<FormItem label="签约地点" class="lef">
							<input type="text" v-model="signForm.oursignlocal">
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="签约人职务" class="lef">
							<input type="text" v-model="signForm.oursignjob">
						</FormItem>
						<FormItem label="我方履行部门负责人" class="lef">
							<input type="text" v-model="signForm.ourfulfilman">
						</FormItem>
					</div>
					<div v-for="(item,index) in counterpartSignList">
						<p class="title">相对方{{index + 1}}签署情况</p>
						<div class="ul">
							<Form-item label="相对方名称" class="lef" prop="counterpartname">
								<input type="text" v-model="item.counterpartName" disabled>
							</Form-item>
							<FormItem label="签约时间" class="lef data" prop="type" :show-message="false">
								<DatePicker
								  v-model="item.signTime"
								  format="yyyy-MM-dd"
								  clearable
							  :editable="false"
								  placeholder="选择起始时间"
								  style="width: 100%;"
								></DatePicker>
							</FormItem>
						</div>
						<div class="ul">
							<FormItem label="签约人" class="lef" prop="counterpartman">
								<input type="text" v-model="item.signPerson">
							</FormItem>
							<FormItem label="是否授权" class="lef">
								<label>是<input @click="isauthorizeClick(1,index)" type="radio" value="1" v-model="item.authorizeFlag"></label>
								<label>否<input @click="isauthorizeClick(0,index)" type="radio" value="0" v-model="item.authorizeFlag"></label>
							</FormItem>
						</div>
						<div class="ul" v-show="item.authorizeFlag != 1">
							<FormItem label="授权委托书">
								<Upload action="/zhfw/system/upload/file"
									:headers="accessToken"
									:on-success="handleSuccess2"
									:on-error="handleError"
									:max-size="10240"
									:format="['pdf']"
									:on-format-error="handleFormatError"
									:on-exceeded-size="handleMaxSize"
									:show-upload-list="false"
									:before-upload="beforeUpload"
									ref="up2"
									:data="{tag:index}"
									type="drag">
									<div>
										<p :class="['upload','entrust'+index]"  @click="getUpClass('entrust'+index)">点击上传</p>
									</div>
								</Upload>
								<p style="color: #d3d3d3;">支持格式为pdf、大小为10MB</p>
								<p v-show="item.fileDownUrl2"><a v-bind:href="item.fileDownUrl2">{{item.authorizeFileName}}</a></p>
							</FormItem>
						</div>
						<div class="ul" v-show="item.authorizeFlag == 1">
							<FormItem label="授权委托书" prop="title">
								<Upload action="/zhfw/system/upload/file"
									:headers="accessToken"
									:on-success="handleSuccess2"
									:on-error="handleError"
									:max-size="10240"
									:show-upload-list="false"
									:format="['pdf']"
									:on-format-error="handleFormatError"
									:on-exceeded-size="handleMaxSize"
									:before-upload="beforeUpload"
									:data="{tag:index}"
									ref="up2"
									type="drag"
								>
									<div>
										<p :class="['upload','entrust'+index]"  @click="getUpClass('entrust'+index)">点击上传</p>
									</div>
								</Upload>
								<p style="color: #d3d3d3;">支持格式为pdf、大小为10MB</p>
								<p v-show="item.fileDownUrl2"><a v-bind:href="item.fileDownUrl2">{{item.authorizeFileName}}</a></p>
							</FormItem>
						</div>
					</div>
					<p class="title">合同生效信息</p>
					<div class="ul">
						<Form-item label="合同生效时间" class="lef data" prop="type">
							<DatePicker
							  v-model="signForm.contracteffectivetime"
							  format="yyyy-MM-dd"
							  clearable
							  :editable="false"
							  placeholder="选择起始时间"
							  style="width:100%"
							></DatePicker>
						</Form-item>
						<FormItem label="合同正文（扫描件）" class="lef" prop="title2">
							<Upload action="/zhfw/contract/draft/upload/file?tag=contracturl-contentname"
							    :headers="accessToken"
							    :on-success="handleSuccess3"
							    :on-error="handleError"
							    :max-size="10240"
							    :on-exceeded-size="handleMaxSize"
							    :before-upload="beforeUpload"
							    :format="['pdf']"
							    :on-format-error="handleFormatError"
								:show-upload-list="false"
								type="drag"
								ref="up">
								<p id="contractContentname" class="upload" @click="getUpId('contractContentname')">点击上传</p>
							</Upload>
							<p style="color: #d3d3d3;">支持格式为pdf、大小为10MB</p>
							<p v-show="signForm.fileDownUrl"><a v-bind:href="signForm.fileDownUrl">{{signForm.contractContentname}}</a></p>
						</FormItem>
					</div>
				</Form>
			</Col>
			<div style="clear:both"></div>
			<div slot="footer">
				<Button :loading="btnLoading3" type="primary"  @click="handelSaveRelative(1)">
					<span v-if="!btnLoading3">提交</span>
					<span v-else>Loading...</span>
				</Button>
				<Button :loading="btnLoading4" type="primary"  @click="handelSaveRelative(2)">
					<span v-if="!btnLoading4">保存</span>
					<span v-else>Loading...</span>
				</Button>
				<Button type="text" @click="modalSign=false">取消</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
    import {
		signContractList,
		signAture,
		signCancel,
		signCancelUpdate,
        fromUp,
		eachOther,
		getDictDataByType,
		signDetail
    } from "@/api/index";
    import circleLoading from "../../my-components/circle-loading.vue";
    export default {
        name: "sign",
        components: {
            circleLoading
        },
        data() {
            return {
                accessToken: {}, // 上传token鉴权
				btnLoading: false, //作废中的提交
				btnLoading2: false, //作废中的保存
				btnLoading3: false, //签署中的提交
				btnLoading4: false, //签署中的保存
                dictFormValidate2: {
                    // 表单验证规则
                    oursigntimes: [{ required: true, message: "不能为空", trigger: "blur" }],
                    oursignmoney: [{ required: true, message: "不能为空", trigger: "blur" }],
                    oursignman: [{ required: true, message: "不能为空", trigger: "blur" }],
                    counterpartname: [{ required: true, message: "不能为空", trigger: "blur" }],
                    counterparttime: [{ required: true, message: "不能为空", trigger: "blur" }],
                    counterpartman: [{ required: true, message: "不能为空", trigger: "blur" }],
                    contracteffectivetime: [{ required: true, message: "不能为空", trigger: "blur" }],
                    title: [{ required: true, message: "不能为空", trigger: "blur" }],
                    title1: [{ required: true, message: "不能为空", trigger: "blur" }],
                    title2: [{ required: true, message: "不能为空", trigger: "blur" }],
                    type: [{ required: true}]
                },
				dictFormValidate: {
				    // 表单验证规则
				    title: [{ required: true, message: "不能为空", trigger: "blur" }],
				    reason: [{ required: true, message: "不能为空", trigger: "change" }],
				    type: [{ required: true, message: "不能为空", trigger: "blur" }]
				},
                selectCount:0,
				isauthorize:false,//是否点击授权
				removeUpdate:0, //是否更新
                relative_type:[],
				main_type:[],
				ownership_type:[],
                modalVisible: false,
                modalLook: false,
                modalSign: false,
				counterpartArr:[],     //相对方列表
				typeArr:[],            //合同类型
				lockDate:{
					counterpartId:"",
					blackFlag:''
				},
				findCompanyDate:{
					company:""
				},
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
				//作废部分的列表字段
				cancellationForm: {
				    contractName:"",
					contractNo:"",
					creatman:"",
					dependUrl:"",
					username:"",
					time:"",
					dependName:"",
					userId:"",
					isuse:"",
					reason:"",
					contractId:""
				},
				//签署部分的列表字段
				signForm: {
				    oursigntime:"",//我方签约时间
					oursignlocal:"",//我方签约地点
					oursignman:"",//签约人
					oursignmoney:"",//签约金额
					oursignjob:"",//签约人职务
					ourfulfilman:"",//我方履行部门负责人
					counterpartname:"",//相对方名称
					counterparttime:"",//签约时间
					counterpartman:"",//签约人
					isauthorize:"",//是否授权
					authorizeUrl:"",//授权委托书地址
					contracteffectivetime:"",//合同生效时间
					contractContentUrl:"",//合同正文地址
					contractId:"",//合同 id
					authorizeName:"",//授权委托书名字
					contractContentname:"",//合同正文名字
					isuse:"",//0 保存   1提交	
					type:""
				},
				counterpartSignList:[],
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
                        width: 80,
                        align: "center"
                    },
                    {
                        title: "合同名称",
                        key: "name",
                        width: 250,
						align: "left",
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
						align: "center"
                    },
                    {
                        title: "合同金额",
                        key: "money",
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
					    title: "合同状态",
					    key: "state",
						align: "center"
					},
                    {
                        title: "操作",
                        key: "action",
                        width: 200,
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
                                                this.edit(params.row);
                                            }
                                        }
                                    },
                                    "签署信息登记"
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
                                    "作废"
                                )
                            ]);
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
				        title: "收付款方式",
				        // key: "paytype",
				        width: 100,
						align: "center",
						render: (h, params) => {
						  let text = "",
						    color = "default";
						  if (params.row.paytype==1) {
						    text = "收款";
						  } else if(params.row.paytype==0){
						    text = "付款";
						  }else if(params.row.paytype==2){
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
				time:{
					endTime:"",
					startTime:""
				},
				//搜索部分数据
                searchForm: {
					name:"",
					number:"",
					startTime:"",
					endTime:"",
					stateId:6,
                    pageSize:10,
					pageNo:1
                },
                form_up:{
                    updateBy:'',
                    createTime:'',
                    department:'',
                    userId:''
                },
				upId:""    ,//被点击的上传文件id
				upName:""  //被点击的授权委托书的上传
            };
        },
        methods: {
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
			//点击上传的事件
			getUpId(id) {
			    this.upId = id;
			},
			//点击授权委托书的上传
			getUpClass(className){
				this.upName = className;
				document.querySelector("."+this.upName).innerHTML = "文件上传中...";
			},
            handleError(error, file, fileList) {
				if(this.upName){
					document.querySelector("."+this.upName).innerHTML = "点击上传";
				}
                this.$Message.error(error.toString());
            },
            beforeUpload() {
				// document.getElementById(this.upId).innerHTML="文件上传中...";
                return true;
            },
			see(v){
				let query = { type: 1, id: v.id, backRoute: this.$route.name };
				this.$router.push({
				    name: "detail",
				    query: query
				}); 
			},
			isauthorizeClick(v,order){
				if(v == 1){
					this.isauthorize = true;
					
				}else{
					// this.signForm.authorizeUrl = "";
					// this.signForm.authorizeName = "";
					this.isauthorize = false;
				}
				document.querySelector("."+'entrust'+order).innerHTML = "点击上传";
				this.counterpartSignList[order].authorizeFileName = "";
				this.counterpartSignList[order].authorizeFileUrl = "";
			},
			selectDateRange(v) {
			    if (v) {
					this.searchForm.startDate = v[0];
					this.searchForm.endDate = v[1];
			    }
			},
            handleMaxSize(file) {
				// document.getElementById(this.upId).innerHTML="点击上传";
				if(this.upName){
					document.querySelector("."+this.upName).innerHTML = "点击上传";
				}
                this.$Notice.warning({
                    title: "文件大小过大",
                    desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 10M."
                });
            },
			//合同正文中上传文件的格式错误
			handleFormatError(file){
				// document.getElementById(this.upId).innerHTML="点击上传";
				if(this.upName){
					document.querySelector("."+this.upName).innerHTML = "点击上传";
				}
				this.$Notice.warning({
                    title: '格式错误',
                    desc: '所选文件‘' + file.name + ' ’只能是pdf格式'
                });
			},
			//作废中的文件上传
            handleSuccess(res, file) {
				// document.getElementById(this.upId).innerHTML="点击上传";
                if (res.message === "success") {
                    this.$Message.success("上传文件 " + file.name + " 成功");
					this.cancellationForm.dependUrl = res.result.url;
					this.cancellationForm.dependName = res.result.name;
                } else {
                    this.$Message.error(res.message);
                }
            },
			//签署中的授权委托书
			handleSuccess2(res, file) {
			    if (res.message == "success") {
					this.counterpartSignList[res.result.tag].authorizeFileName = res.result.name;
					this.counterpartSignList[res.result.tag].authorizeFileUrl = res.result.url;
					document.querySelector("."+this.upName).innerHTML = "点击上传";
			        this.$Message.success("上传文件 " + file.name + " 成功");
					this.counterpartSignList[res.result.tag].fileDownUrl2 = "/zhfw/contract/draft/download?fileName="+res.result.name+"&url="+res.result.url+'&access_token='+this.getStore("accessToken");
					var arr = this.counterpartSignList;
					this.counterpartSignList = [];
					for(var i = 0;i < arr.length;i++){
						this.counterpartSignList.push(arr[i]);
					}
				} else {
			        this.$Message.error(res.message);
			    }
			},
			//签署中的合同正文
			handleSuccess3(res, file) {
				// document.getElementById(this.upId).innerHTML="点击上传";
			    if (res.message === "success") {
			        this.$Message.success("上传文件 " + file.name + " 成功");
					this.signForm.contractContentUrl = res.result.url;
					this.signForm.contractContentname = res.result.name;
					this.signForm.fileDownUrl = "/zhfw/contract/draft/download?fileName="+res.result.name+"&url="+res.result.url+'&access_token='+this.getStore("accessToken");
			    } else {
			        this.$Message.error(res.message);
			    }
			},
            init() {
                this.accessToken = {
					'access_token': this.getStore("accessToken"),
					'Authorization': 'Bearer '+this.getStore("accessToken")
                };
                // 获取表单数据
                fromUp().then(res => {
                    this.form_up.updateBy = res.updateBy;
                    this.form_up.createTime = res.createTime;
                    this.form_up.department = res.department;
                    this.form_up.userName = res.nickName;
                    this.form_up.userId = res.userId;
                });
				eachOther().then(res => {
				    this.counterpartArr = res.result.content
				});
				getDictDataByType("contract_type").then(res => {
				    if (res.success) {
				        this.typeArr = res.result;
				    }
				});
                this.getDataList();
            },
            remove(v) {
				if(v.cancel){
					this.removeUpdate = 1;
					this.cancellationForm= {
					    contractName:v.cancel.contractName,
						contractNo:v.cancel.contractNo,
						creatman:v.cancel.creatman,
						dependUrl:v.cancel.dependUrl,
						username:this.form_up.userName,
						dependName:v.cancel.dependName,
						userId:this.form_up.userId,
						reason:v.cancel.reason,
						contractId:v.id
					}
				}else{
					this.removeUpdate = 0;
					this.cancellationForm= {
					    contractName:v.name,
						contractNo:v.number,
						creatman:v.draftsman,
						dependUrl:"",
						username:this.form_up.userName,
						dependName:"",
						reason:v.reason,
						userId:this.form_up.userId,
						contractId:v.id
					}
				}
				this.$refs.cancellationForm.resetFields();
				this.modalVisible = true;
				this.btnLoading = false;
				this.btnLoading2 = false;
            },
            edit(v) {
                this.modalSign = true;
				this.signForm.contractId=v.id;
				this.$refs.signForm.resetFields();
				this.btnLoading3 = false;
				this.btnLoading4 = false;
				signDetail({contractId:v.id,isuse:0}).then(res =>{
					if(res.success == "true"){
						this.signForm = res.sign;
						this.signForm.contractId = v.id;
						this.signForm.oursignmoney = v.money;
						if(v.sign){
							this.signForm.type = 1;
						}else{
							this.signForm.type = 0;
						}
						this.counterpartSignList = res.counterpartSignList;
						for(var i = 0;i < res.counterpartSignList.length;i++){
							if(res.counterpartSignList[i].authorizeFileUrl){
								this.counterpartSignList[i].fileDownUrl2 = "/zhfw/contract/draft/download?fileName="+res.counterpartSignList[i].authorizeFileName+"&url="+res.counterpartSignList[i].authorizeFileUrl+'&access_token='+this.getStore("accessToken");
							}else{
								this.counterpartSignList[i].fileDownUrl2 = "";
							}
						}
						this.signForm.fileDownUrl = "/zhfw/contract/draft/download?fileName="+res.sign.contractContentname+"&url="+res.sign.contractContentUrl+'&access_token='+this.getStore("accessToken");
					}
				})
            },
			//作废中的提交
            handelSubmitDict(){
				if(this.cancellationForm.reason){
					this.cancellationForm.isuse = 1;
					this.btnLoading = true;
					if(this.removeUpdate == 0){
						signCancel(this.cancellationForm).then(res => {
						    this.modalVisible = false
							this.getDataList();
							this.btnLoading = false;
						});
					}else{
						signCancelUpdate(this.cancellationForm).then(res => {
						    this.modalVisible = false
							this.getDataList();
							this.btnLoading = false;
						});
					}
				}else{
					this.$Message.error("作废原因没有填写");
				}
            },
			//作废中的保存
			handelSubmitSave(){
				if(this.cancellationForm.reason){
					this.cancellationForm.isuse = 0;
					this.btnLoading = true;
					if(this.removeUpdate == 0){
						signCancel(this.cancellationForm).then(res => {
						    this.modalVisible = false
							this.getDataList();
							this.btnLoading = false;
						});
					}else{
						signCancelUpdate(this.cancellationForm).then(res => {
						    this.modalVisible = false
							this.getDataList();
							this.btnLoading = false;
						});
					}
				}else{
					this.$Message.error("作废原因没有填写");
				}
			},
			//签署中的提交
			handelSaveRelative(click){
				if(!this.signForm.oursigntime){
					this.$Message.error("我方签约时间没有填写");
					return;
				}
				if(!this.signForm.oursignman){
					this.$Message.error("签约人没有填写");
					return;
				}
				for(var value of this.counterpartSignList){
					if(!value.counterpartName){
						this.$Message.error("相对方名称没有填写");
						return;
					}
					if(!value.signTime){
						this.$Message.error("对方签约时间没有填写");
						return;
					}
					if(!value.signPerson){
						this.$Message.error("对方签约人没有填写");
						return;
					}
					if(value.authorizeFlag == 1){
						if(!value.authorizeFileUrl){
							this.$Message.error("授权委托书没有上传");
							return;
						}
					}
				}
				if(!this.signForm.contracteffectivetime){
					this.$Message.error("合同生效时间没有填写");
					return;
				}
				if(!this.signForm.contractContentname){
					this.$Message.error("合同正文没有上传");
					return;
				}
				
				let signForm = this.signForm;
				Object.keys(signForm).forEach(function(key){
					if(signForm[key] === null){
						signForm[key] = "";
					}
				});
				signForm.counterpartSignList = [...this.counterpartSignList];
				for(var i = 0;i<signForm.counterpartSignList.length;i++){
					Object.keys(signForm.counterpartSignList[i]).forEach(function(key){
						if(signForm.counterpartSignList[i][key] === null){
							signForm.counterpartSignList[i][key] = "";
						}
					});
				}
				for(var i = 0;i < this.counterpartSignList.length;i++){
					if(typeof(this.counterpartSignList[i].signTime)=="object"){
						let d = this.counterpartSignList[i].signTime;
						var date = d.getFullYear() + "-" + 
								   d.getMonth() + 1 + "-" +
								   d.getDate()
						signForm.counterpartSignList[i].signTime = date;
					}
				}
				signForm.counterpartSignList = JSON.stringify(signForm.counterpartSignList);
				if(!this.counterpartSignList.id){
					this.counterpartSignList.id = "";
				}
				if(click == 2){
					this.btnLoading4 = true;
					signForm.isuse = 0;
					signAture(signForm).then(res => {
					    this.modalSign = false
						this.getDataList();
						this.btnLoading4 = false;
					});
				}else if(click == 1){
					debugger
					this.btnLoading3 = true;
        			delete signForm.id;
        			delete signForm.tenantId;
					signForm.isuse = 1;
					signForm.contractid = this.signForm.contractId;
					signAture(signForm).then(res => {
						this.modalSign = false
						this.getDataList();
						this.btnLoading3 = false;
					});
				}
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
                this.getDataList();
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
            }
        },
        mounted() {
            this.init();
        },
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name == "sign"){
					this.init();
				}
			}
		}
    };
</script>