<style lang="less">
	@import "./contractEdit.less";
</style>

<template>
	<div class="contractEdit">
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg search">
				<Col :span="24">
					<Row>
						<Form ref="dictForm" :model="dictForm" :label-width="120" :rules="dictFormValidate">
							<div class="ul">
								<FormItem label="文本来源" prop="name">
									<label class="redis-celect" ><input type="radio" @click="clean1" style="margin-right:0;cursor:pointer" name="chapter1" v-model="chapter1" value="5"/> 自行起草</label>
									<label class="redis-celect" ><input type="radio" @click="clean1" style="margin-right:0;cursor:pointer" name="chapter1" v-model="chapter1" value="4"/> 标准文本 </label>
								</FormItem>
							</div>
							<div class="ul three">
								<FormItem label="合同正文"  v-if="chapter1 == 4" class="lef" prop="contentname">
						            <span @click="draftBz" class="model-select" style="cursor:pointer">{{dictForm.contentname == "" ? "范本选择" : dictForm.contentname}}</span>
								</FormItem>
								<FormItem label="合同正文" v-else="chapter1 == 4" class="lef" prop="contentname">
									<Upload action="/zhfw/contract/draft/upload/file?tag=contracturl-contentname"
						                :headers="accessToken"
										:on-success="handleSuccess2"
										:on-error="handleError"
										:max-size="5120"
										:on-exceeded-size="handleMaxSize"
										:before-upload="beforeUpload"
										type="drag"
										ref="up1">
										<p id="contentname" class="upload" @click="getUpId('contentname')">{{dictForm.contentname == "" ? "点击上传文件" : dictForm.contentname}}</p>
									</Upload>
									<p v-show="fileDownUrl"><a v-bind:href="fileDownUrl">{{dictForm.contentname}}</a></p>
								</FormItem>
								<!-- <div class="auditLef"><a v-show="auditUrl" target="_blank" v-bind:href="auditUrl">智能审核</a></div> -->
								<!-- <div class="auditLef"><a target="_blank" v-bind:href="auditUrl">智能审核</a></div> -->
						        <!-- <div class="auditLef"><p @click="brainpowerAudit">在线编辑</p></div> -->
								<!-- <div class="auditLef"><p @click="brainpowerAudit">智能审核</p></div> -->
								<!-- <FormItem label="对比合同正文" class="lefThree">
									<Upload action="/xboot/draft/readCompareText"
										:headers="accessToken"
										:on-success="handleSuccess1"
										type="drag"
										class="file"
										ref="up1">
										<p>{{compareName?compareName:"点击上传文件"}}</p>
									</Upload>
								</FormItem> -->
								<!-- <p type="text" @click="fileCompare" class="auditLef">文本对比</p> -->
								<FormItem class="lef">
									<Button @click="onlineEdit" type="dashed" icon="ios-create-outline" class="btnLi">在线编辑</Button>
									<Button @click="brainpowerAudit" type="dashed" icon="ios-eye-outline" class="btnLi">智能审核</Button>
									<Button @click="fileCompare" type="dashed" icon="ios-bookmarks-outline">文本对比</Button>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="合同名称" prop="name" class="lef">
									<Input v-model="dictForm.name"/>
								</FormItem>
								<FormItem label="合同编号" class="lef">
									<input type="text" v-model="dictForm.number"  @blur.prevent ="numberInp(dictForm.number)"/>
								</FormItem>
							</div>
							<div class="ul">
								<Form-item label="相对方" prop="name" class="lef">
								    <select v-model="dictForm.counterpartid" @blur="unfoundCounterpart(dictForm.counterpartid)">
								        <option  v-for="item in counterpartArr" :value="item.counterpartId">{{item.counterpartName}}</option>
								    </select>
								</Form-item>
								<Form-item label="合同类型" prop="name" class="lef">
									<select id='sel' v-model="dictForm.typeid" @change="typeChange(dictForm.typeid)">
										<option  v-for="item in typeArr" :value="item.id" >{{item.title}}</option>
									</select>
								</Form-item>
							</div>
							<div class="ul">
								<FormItem label="收付款方式" prop="name" class="lef">
									<select id='sel' v-model="dictForm.istopay">
										<option  value="1" v-model="dictForm.istopay">收款</option>
										<option  value="0" v-model="dictForm.istopay">付款</option>
										<option  value="2" v-model="dictForm.istopay">不涉及</option>
									</select>
								</FormItem>
								<FormItem class="lef">
									<span style="position: absolute;left: -100px;top: 0;">合同金额<b style="color: #ed4014;">（万元）</b></span>
									<Input v-model="dictForm.money" v-on:input="nuMinput(dictForm.money)"/>
								</FormItem>
							</div>	
							<div class="ul">
								<FormItem label="开始日期" class="data lef">
									<DatePicker
											v-model="dictForm.starttime"
											type="date"
											format="yyyy-MM-dd"
											clearable
											placeholder="选择起始时间"
											style="width: 100%;"
									></DatePicker>
								</FormItem>
								<FormItem label="结束日期" class="data lef">
									<DatePicker
											v-model="dictForm.endtime"
											type="date"
											format="yyyy-MM-dd"
											clearable
											@on-change="timeChange"
											placeholder="选择起始时间"
											style="width: 100%;"
									></DatePicker>
								</FormItem>
							</div>	
							<div class="ul">
								<FormItem label="合同份数" prop="name" class="lef">
									<!-- <label for="">正文数</label><input v-on:input="nuMinput2(dictForm.contentnum,1)" class="number" type="number" v-model="dictForm.contentnum"/>
									<label for="">副本数</label><input v-on:input="nuMinput2(dictForm.counterpartnum,2)" class="number" type="number" v-model="dictForm.counterpartnum"/> -->
									<input v-on:input="nuMinput2(dictForm.totalnum,3)" class="number" type="number" v-model="dictForm.totalnum"/>
								</FormItem>
								<!-- <FormItem label="用章类型" prop="name" class="lef">
									<label for="chapter1">公司章<input id="chapter1" type="radio" name="chapter" v-model="dictForm.chapter" value="1"/></label>
									<label for="chapter2">合同章<input id="chapter2" type="radio" name="chapter" v-model="dictForm.chapter" value="2"/></label>
									<label for="chapter3">其他<input id="chapter3" type="radio" name="chapter" v-model="dictForm.chapter" value="3"/></label>
								</FormItem> -->
							</div>	
							<div class="ul">
								<FormItem label="描述">
									<Input
										type="textarea"
										v-model="dictForm.description"
										:rows="2"
									/>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="相关附件">
									<!-- <Upload action="/xboot/upload/file?tag=accessoryurl-attachmentname"
										:headers="accessToken"
										:on-success="handleSuccess"
										:on-error="handleError"
										:max-size="5120"
										:on-exceeded-size="handleMaxSize"
										:before-upload="beforeUpload"
										multiple
										type="drag"
										ref="up1">
										<p id="attachmentname" class="upload" @click="getUpId('attachmentname')">{{dictForm.attachmentname == "" ? "点击上传文件" : dictForm.attachmentname}}</p>
									</Upload> -->
									<Upload action="/zhfw/contract/draft/upload/file?tag=accessoryurl-attachmentname"
									    :headers="accessToken"
										:on-success="handleSuccess"
										:on-error="handleError"
										:max-size="5120"
										:on-exceeded-size="handleMaxSize"
										:before-upload="beforeUpload"
										type="drag"
										ref="up1">
										<p id="attachmentname" class="upload" @click="getUpId('attachmentname')">{{dictForm.attachmentname? dictForm.attachmentname:"点击上传文件"}}</p>
									</Upload>
									<!-- <p v-show="dictForm.attachmentname"><a v-bind:href="dictForm.accessoryurl">{{dictForm.attachmentname}}</a></p> -->
									<p v-show="fileDownUrl2"><a v-bind:href="fileDownUrl2">{{dictForm.attachmentname?dictForm.attachmentname:"上传文件"}}</a></p>
								</FormItem>
							</div>
							<Col :span="12">
								<FormItem label="起草人">
									<span>{{dictForm.draftsman}}</span>
								</FormItem>
							</Col>
							<Col :span="12" v-show="dictForm.draftstime">
								<FormItem label="起草时间" > 
								<span>{{dictForm.draftstime}}</span>
								</FormItem>
							</Col>
							<Col :span="12">
								<FormItem label="起草机构" >
									<span>{{dictForm.draftsoutfit}}</span>
								</FormItem>
							</Col>
						</Form>
						<div style="clear:both"></div>
					</Row>
					<row style="margin-bottom: 20px;">
						<span style="margin-right: 10px;">履行计划</span><Button @click="add2" type="primary" icon="md-add">添加</Button>
					</row>
					<Row>
						<Table border :columns="columns2" :data="dictForm.contractPlayList" sortable="custom" ref="table2"></Table>
					</Row>
					<row>
						<div style="padding-top: 30px;float: right;">
						    <!-- <Button type="text" @click="handleCancel">取消</Button> -->
						    <!-- <Button type="primary" @click="handelSubmitDict(1)" style="margin-right: 50px;">提交</Button> -->
						    <Button type="primary" @click="handelSubmitDict(2)">保存</Button>
						</div>
					</row>
				</Col>
			</Row>
			<Modal title="履行计划" v-model="modalVisible2" :mask-closable='false' :styles="{top: '30px'}" :width="1000" class="contractEdit">
				<Form ref="dictForm2" :model="dictForm2" inline :label-width="130" class="search-form" :rules="dictForm2Validate">
					<div class="ul">
						<FormItem  label="合同约定任务" class="row"  prop="task">
							<Input type="text" v-model="dictForm2.task" placeholder="请输入" clearable style="width=260px;"/>
						</FormItem >
					</div>
					<div class="ul">
						<FormItem label="收付款方式" class="lef" prop="paytype">
							<select id='sel' v-model="dictForm2.paytype">
								<option  value="1">收款</option>
								<option  value="0">付款</option>
								<option  value="2">不涉及</option>
							</select>
						</FormItem>
						<Form-item label="收付款金额（万元）" class="lef"  prop="factmoney">
							<Input type="text" v-model="dictForm2.factmoney" placeholder="请输入" v-on:input="nuMinput(dictForm2.factmoney)" clearable/>
						</Form-item>
					</div>
					<div class="ul" v-show="issatisfypay">
						<Form-item label="所占比例（%）" class="lef">
							<Input type="text" v-model="dictForm2.proportion" v-on:input="nuMinput(dictForm2.proportion,0,100)" placeholder="请输入" clearable/>
						</Form-item>
						<FormItem label="计划开始日期" class="lef data"  prop="startplaytime">
							<DatePicker
									v-model="dictForm2.startplaytime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择起始时间"
									style="width: 100%;"
							></DatePicker>
						</FormItem>
					</div>
					<div class="ul" v-show="issatisfypay">
						
						<FormItem label="计划结束日期" class="lef data"  prop="endplaytime">
							<DatePicker
									v-model="dictForm2.endplaytime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择起始时间"
									style="width: 100%;"
							></DatePicker>
						</FormItem>
					</div>
					<Col :span="24">
						<Form-item label="履行内容" class="txtar"  prop="content">
							<Input
								type="textarea"
								v-model="dictForm2.content"
								:rows="2"
								placeholder="请输入"
							/>
						</Form-item>
					</Col>
					<Col :span="24">
						<Form-item label="备注" class="txtar">
							<Input
								type="textarea"
								v-model="dictForm2.remark"
								:rows="2"
								placeholder="请输入"
							/>
						</Form-item>
					</Col>
				</Form>
				<div style="clear: both;"></div>
				<div slot="footer">
					<Button type="text" @click="modalVisible2=false">取消</Button>
					<Button type="primary"  @click="ListSubmitDict()">保存</Button>
				</div>
			</Modal>
			<Modal title="相对方管理" v-model="relativeModalVisible" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="contractEdit" footer-hide>
				<div style="clear:both"></div>
				<relative-edit :formData.sync="relativeDictForm"  :sourceType.sync="source" v-on:listen="childShow"></relative-edit>
			</Modal>
		</Card>
	</div>
</template>

<script>
	import {getProcessDataList } from "@/api/activiti";
	import relativeEdit from "../relative/relativeEdit.vue";
	    import {
	        fromUp,
	        addhtong,
	        getDictDataByType,
	        myDelete,
	        draftMyDelete,
			applyBusiness,
	        eachOther,
			wordEdit,
	        findContractByParam,
	        draftAddhtong,
			filesDown,
			detailList,
			lvxingDeleta,
			fileUpUrlAudit,
	        examineManList
	    } from "@/api/index";
	    import circleLoading from "../../my-components/circle-loading.vue";
	    export default {
	        name: "contractEdit",
	        components: {
	            circleLoading,
				relativeEdit
	        },
	        data() {
	            return {
					relativeModalVisible:false,
					source:0,
	                upId: "",
					md5File:'',
					oldNum:0,
					type:"",
					chapter1:5,
					backRoute:"",
					procDefId:"",
					issatisfypay:true,      //是否满足收付款条件没有被点击
	                accessToken: {}, // 上传token鉴权
					attachmentname:false,
					contentname:false,
					fileDownUrl:"",
					fileDownUrl2:"",
					auditUrl: "",
					edit2Click: false,
					edit2ClickNum: false,
	                dictFormValidate: {
	                    // 表单验证规则
	                    name: [{ required: true, message: "不能为空", trigger: "change" }],
	                    type: [{ required: true, message: "不能为空", trigger: "blur" }]
	                },
					dictForm2Validate: {
					    // 表单验证规则
					    task: [{ required: true, message: "不能为空", trigger: "blur" }],
					    ismoney: [{ required: true, message: "不能为空", trigger: "blur" }],
					    paytype: [{ required: true, message: "不能为空", trigger: "blur" }],
					    paytype: [{ required: true, message: "不能为空", trigger: "blur" }],
					    paytype: [{ required: true, message: "不能为空", trigger: "blur" }],
					    factmoney: [{ required: true, message: "不能为空", trigger: "blur" }],
					    startplaytime: [{ required: true}],
					    endplaytime: [{ required: true}],
					    content: [{ required: true, message: "不能为空", trigger: "blur" }]
					},
	                counterpartArr: [], //相对方数据列表
	                typeArr: [], //合同类型数据列表
	                showType: "thumb",
	                processData: [],
	                searchProcessForm: {
	                    showLatest: true,
	                    name: "",
	                    status: "1", // 激活状态
	                    pageNumber: 1, // 当前页数
	                    pageSize: 1000, // 页面大小
	                    sort: "createTime", // 默认排序字段
	                    order: "desc" // 默认排序方式
	                },
	                arr: [], //履行计划数组
	                processModalVisible: false,
	                assigneeList: [],
	                editClick: false, //是否点击了编辑按钮
	                dictPriority: [],
	                selectCount: 0,
	                contract_type: [],
	                modalVisible: false,
	                modalVisible2: false,
	                modalVisible3: false,
	                modalVisible44: false,
	                dictForm3: {
	                    contractName: "",
	                    counterpart: "",
	                    contractMoney: "",
	                    signDate: "",
	                    startDate:"",
	                    endDate:""
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
					contractPlayList2:[],    //履行计划临时存储
	                dictForm2: {
						content: "",
						contractid: "",
						contractmoney: "",
						endplaytime: "",
						factmoney: "",
						id: "",
						issatisfypay: "",
						isuse: "",
						paytype: "",
						proportion: "",
						remark: "",
						sealinfourl: "",
						startplaytime: "",
						task: ""
	                },
	                form: {
	                    procDefId: "contract_approve:2:22504",
	                    assignee: "",
	                    priority: "",
	                    id: "",
	                    tableId: "",
	                    title: ""
	                },
	                time1: {
	                    year: "",
	                    month: "",
	                    day: "",
	                    times: ""
	                },
	                time2: {
	                    year: "",
	                    month: "",
	                    day: "",
	                    times: ""
	                },
	                loading: false, // 表格加载状态
	                data: [], //表单数据
	                total: 0, // 表单数据总数
	                columns: [
	                    {
	                        title: "序号",
	                        type: "index",
	                        width: 120,
	                        align: "center"
	                    },
	                    {
	                        title: "合同名称",
	                        key: "name",
	                        width: 100,
							align: "center"
	                    },
	                    {
	                        title: "合同编号",
	                        key: "number",
	                        width: 100,
	                        align: "center"
	                    },
	                    {
	                        title: "合同金额（万元）",
	                        key: "money",
	                        width: 140
	                    },
	                    {
	                        title: "合同类型",
	                        key: "contractType",
	                        width: 180
	                    },
	                    {
	                        title: "起草人",
	                        key: "draftsman",
	                        width: 160
	                    },
	                    {
	                        title: "起草时间",
	                        key: "draftstime",
	                        width: 160
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
	
	                columns2: [
	                    // 表头
	
	                    {
	                        title: "序号",
	                        type: "index",
	                        width: 80,
	                        align: "center"
	                    },
	                    {
	                        title: "合同约定任务",
	                        key: "task",
	                        width: 160,
	                        align: "center"
	                    },
	                    {
	                        title: "收付款类型",
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
	                    },
	                    {
	                        title: "收付金额",
	                        key: "factmoney",
	                        width: 100,
	                        align: "center"
	                    },
	                    {
	                        title: "所占比例（%）",
	                        key: "proportion",
	                        width: 130,
	                        align: "center"
	                    },
	                    {
	                        title: "计划开始日期",
	                        key: "startplaytime",
	                        width: 160,
	                        align: "center"
	                    },
	                    {
	                        title: "计划结束日期",
	                        key: "endplaytime",
	                        width: 160,
	                        align: "center"
	                    },
	                    {
	                        title: "履行内容",
	                        key: "content",
	                        width: 100,
	                        align: "center"
	                    },
	                    {
	                        title: "备注",
	                        key: "remark",
	                        width: 80,
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
	                                        on: {
	                                            click: () => {
	                                                this.edit2(params.row);
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
									                this.remove2(params.row);
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
	                    time: "",
	                    pageNumber: 1, // 当前页数
	                    pageSize: 10, // 页面大小
	                    order: "asc" // 默认排序方式
	                },
	                form_up: {
	                    createTime: "",
	                    department: "",
	                    mobile: "",
	                    userId: "",
	                    userName: ""
	                },
					//相对方form
					relativeDictForm: {
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
					    estiblishTime : '',
					    regCapital : ''
					},
	            };
	        },
	        methods: {
				childShow(data){
					console.log(data);
					this.relativeModalVisible = false;
					if(data.show){
						this.getDataList();
					}
					if(data.data){
						this.dictForm.counterpartid = data.data.counterpartId;
						this.retResRelative.name = data.data.counterpartName;
						eachOther().then(res => {
						    this.counterpartArr = res.result.content;
						});
					}
				},
				unfoundCounterpart(counterpartId){
					this.relativeModalVisible = true;
					console.log(counterpartId)
				    if (counterpartId == ''){
				        this.relativeModalVisible = true;
						this.source = 2;
				    }
				},
				handleSuccess2(res, file) {
					document.getElementById("contentname").parentNode.nextElementSibling.innerHTML = "";
					document.getElementById("attachmentname").parentNode.nextElementSibling.innerHTML = "";
					if(res.message == "success"){
						this.dictForm[this.upId] = res.result.name;
						this.dictForm[res.result.tag.split("-")[0]] = res.result.url;
						this.dictForm[res.result.tag.split("-")[1]] = res.result.name;
						this.attachmentname = true;
						this.contracturl2 = res.result.url;
						if(this.dictForm.typeid){
							this.auditUrl = "http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl
						}
					}else{
						this.$Message.error("上传文件 " + file.name + " 失败");
					}
					if(res.message == "success"){
						this.dictForm.contentname = res.result.name;
						var fname = encodeURIComponent(res.result.name);
						this.$Message.success("上传文件 " + res.result.name + " 成功");
						var fTag = res.result.url;
						var fileTag = this.md5File(fTag.substring(fTag.lastIndexOf("/")+1,fTag.lastIndexOf(".")));//此处需要进行MD5加密
						// chooseFile({ fileUrl: res.result.url }).then(res => {});
						//在线编辑后，最终保存的文本地址
						var finalFileUrl = fTag.substring(0,fTag.lastIndexOf("/")+1) + fileTag + fTag.substring(fTag.lastIndexOf("."));
						this.dictForm.contracturl = finalFileUrl;
						var fromUrl = encodeURIComponent(res.result.url);
						var fromUrl2 = encodeURIComponent(finalFileUrl);
						this.myOpenUrl = wordEdit+'/editURL.html?fromUrl='+fromUrl+"&fname="+fname+"&fileTag="+fileTag+"&uName="+this.form_up.uName;
						this.myOpenUrl2 = wordEdit+'/editURL.html?fromUrl='+fromUrl2+"&fname="+fname+"&fileTag="+fileTag+"&uName="+this.form_up.uName;
					}
				},
				 onlineEdit(){
					fileUpUrlAudit({fileUrl:this.dictForm.contracturl}).then(res => {
						if(res == 200){
							this.myOpen(this.myOpenUrl2);
						}else{
							this.myOpen(this.myOpenUrl);
						}
					})
					
				},
				brainpowerAudit(){
					if(this.dictForm.contracturl){
						fileUpUrlAudit({fileUrl:this.dictForm.contracturl}).then(res => {
							if(res == 200){
								if(this.dictForm.typeid){
									window.open("http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl);
								}else{
									this.$Message.error("请先选择合同类型");
								}
							}else{
				                if(this.dictForm.typeid){
									window.open("http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.contracturl2);
								}else{
									this.$Message.error("请先选择合同类型");
								}
							}
						})
					}else{
						this.$Message.error("请先选择或者上传合同正文");
					}
				},
				fileCompare() {
				    window.open(wordEdit);
				    // window.location = "/compareText";
				},
				timeChange(){
					if(this.dictForm.starttime >= this.dictForm.endtime){
						this.$Message.error("开始时间不能大于等于结束时间");
						this.dictForm.endtime = "";
					}
				},
				timeChange2(){
					if(this.dictForm2.startplaytime >= this.dictForm2.endplaytime){
						this.$Message.error("计划开始日期不能大于等于计划结束日期");
						this.dictForm2.endplaytime = "";
					}
				},
				//范本选择弹出框
				draftBz() {
				    this.modalVisible5 = true;
				    this.getDataList1();
				},
				clean1() {
				    this.dictForm.contentname = "";
				    this.dictForm.contracturl = "";
					this.dictForm.name = "";
				},
				nuMinput(v){
					if(isNaN(v)){
						this.$Message.error("只能输入数字");
						return;
					}
					if(String(v).indexOf(".") > -1){
						if(v.toString().split(".")[1].length > 2){
							this.$Message.error("只能输入到小数点后两位");
						}
					}
					if(max){
						if(v > max){
							this.$Message.error("只能输入小于"+max+"数字");
						}else if(v < min){
							this.$Message.error("只能输入大于"+max+"数字");
						}
					}
				},
				//正整数输入判断
				nuMinput2(v,type){
					if(isNaN(v)){
						this.$Message.error("只能输入数字");
						if(type == 1){
							this.dictForm.contentnum = 0;
						}else if(type == 2){
							this.dictForm.counterpartnum = 0;
						}else if(type == 3){
							this.dictForm.totalnum = 0;
						}
						return;
					}
					if(v <= 0){
						this.$Message.error("只能输入正整数");
						if(type == 1){
							this.dictForm.contentnum = 0;
						}else if(type == 2){
							this.dictForm.counterpartnum = 0;
						}else if(type == 3){
							this.dictForm.totalnum = 0;
						}
						return;
					}
				},
	            getUpId(id) {
	                this.upId = id;
	            },
	            handleError(error, file, fileList) {
	                this.$Message.error(error.toString());
	                this.dictForm[this.upId] = "上传失败，请重新上传";
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
	            }, //模板选择
	            getProcessList() {
	                this.loading = true;
	                getProcessDataList(this.searchProcessForm).then(res => {
	                    this.loading = false;
	                    if (res.success) {
	                        this.processData = res.result.content;
	                    }
	                });
	            },
	            handleResetProcess() {
	                this.$refs.searchProcessForm.resetFields();
	                // 重新加载数据
	                this.getProcessList();
	            },
	            beforeUpload() {
	                // if (!this.$route.meta.permTypes.includes("upload")) {
	                //     this.$Message.error("此处您没有上传权限(为演示功能，该按钮未配置隐藏)");
	                //     return false;
	                // }
	                // document.getElementById(this.upId).innerHTML = '文件上传中...'
	                this.dictForm[this.upId] = "文件上传中...";
	                return true;
	            },
	            handleMaxSize(file) {
	                this.dictForm[this.upId] = "文件过大，请重新上传";
	                this.$Notice.warning({
	                    title: "文件大小过大",
	                    desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
	                });
	            },
				typeChange(v){
					if(v&&this.dictForm.contracturl){
						this.auditUrl = "http://139.198.16.175:8073?id="+v+"&url="+this.dictForm.contracturl
					}
				},
	            handleSuccess(res, file) {
					console.log(res);
					document.getElementById("contentname").parentNode.nextElementSibling.innerHTML = "";
					document.getElementById("attachmentname").parentNode.nextElementSibling.innerHTML = "";
					if(res.message == "success"){
						this.dictForm[this.upId] = res.result.name;
						this.dictForm[res.result.tag.split("-")[0]] = res.result.url;
						this.dictForm[res.result.tag.split("-")[1]] = res.result.name;
						this.attachmentname = true;
						this.$Message.success("上传文件 " + file.name + " 成功");
						if(this.dictForm.typeid&&this.dictForm.contracturl){
							this.auditUrl = "http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl
						}
					}else{
						this.$Message.error("上传文件 " + file.name + " 失败");
					}
	            },
	            handleSuccess3(res) {
					if(res.message == "success"){
						document.getElementById("upload").parentNode.nextElementSibling.innerHTML = res.data.fileName;
						if(res.contractInfoVo){
							this.dictForm3 = res.contractInfoVo.data
						}
						this.dictForm3.url = res.data.path
						this.$Message.success("上传文件 " + res.contractInfoVo.data.contractName + " 成功");
					}else{
						document.getElementById("upload").parentNode.nextElementSibling.innerHTML = "";
						this.$Message.error("上传文件失败");
					}
	            },
	            getDictDataType() {
	                examineManList("contract_approve:2:22504").then(res => {
	                    this.assigneeList = res.result.users;
	                    console.log(res);
	                });
	            },
	            //审批人提交
	            examineSubmit() {
	                // console.log(this.$router);
	                this.form.priority = 0;
	                this.form.procDefId = "contract_approve:2:22504";
	                this.form.title = this.dictForm.name;
					console.log(this.form);
	                applyBusiness(this.form).then(res => {
	                    this.loading = false;
	                    if (res.success === true) {
	                        this.$Message.success("操作成功");
	                        this.getDataList();
	                        this.modalVisible3 = false;
	                    }
	                });
	            },
				//issatisfypay
				issatisfypayClick(v){
					if(v == 1){
						this.issatisfypay = true;
					}else{
						this.issatisfypay = false;
						this.dictForm2.paytype = 2;
						console.log(this.dictForm2.paytype);
					}
				},
	            init() {
	                this.getProcessList();
	                this.accessToken = {
	                    access_token: this.getStore("accessToken"),
	                    Authorization: 'Bearer '+this.getStore("accessToken")
	                };
	                this.getDictDataType();
	                // 获取表单数据
	                fromUp().then(res => {
	                    this.form_up.createTime = res.createTime;
	                    this.form_up.department = res.department;
	                    this.form_up.mobile = res.mobile;
	                    this.form_up.userId = res.userId;
	                    this.form_up.userName = res.nickName;
	                });
	                eachOther().then(res => {
	                    this.counterpartArr = res.result.content;
	                });
	                getDictDataByType("contract_type").then(res => {
	                    if (res.success) {
	                        this.typeArr = res.result;
	                    }
	                });
	                this.getDataList();
					this.type = this.$route.query.type;
					this.backRoute = this.$route.query.backRoute;
					this.procDefId = this.$route.query.id;
					if(this.procDefId){
						detailList({id:this.procDefId}).then(res=>{
							if(res.result == "success"){
								this.dictForm = res.data.contract;
								this.dictForm.contractPlayList = res.data.contractPlayList;
								// this.dictForm.contractPlayList = [{"number":11}];
								this.editClick = true;
								if(res.data.contract.contentname){
									this.fileDownUrl = "/xboot/draft/download?id="+res.data.contract.id+"&tag=1&accessToken="+this.getStore("accessToken");
								}else{
									this.fileDownUrl = "";
								}
								if(res.data.contract.attachmentname){
									this.fileDownUrl2 = "/xboot/draft/download?id="+res.data.contract.id+"&tag=2&accessToken="+this.getStore("accessToken");
								}else{
									this.fileDownUrl2 = "";
								}
								if(res.data.contract.typeid&&this.dictForm.contracturl){
									this.auditUrl = "http://139.198.16.175:8073?id="+res.data.contract.typeid+"&url="+this.dictForm.contracturl
								}
							}
						});
					}else{
						this.editClick = false;
					}
	            },
	            clearSelectAll() {
	                // this.$refs.table.selectAll(false);
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
	            remove2(v) {
	                this.$Modal.confirm({
	                    title: "确认删除",
	                    content: "您确认要删除 " + v.task + " ?",
	                    onOk: () => {
	                        // 删除
							console.log(v);
							if(v.id){
								lvxingDeleta({id:v.id}).then(res=>{
									if(res.result == "success"){
										this.dictForm.contractPlayList = res.data;
									}
								})
							}else{
								this.dictForm.contractPlayList.splice(v._index,1);
							}
	                    }
	                });
	            },
				edit2(v){
					console.log(v);
					this.edit2Click = true;
					this.edit2ClickNum = v._index;
					// this.dictForm2 = v;
					this.modalVisible2 = true;
					this.dictForm2={
						content:v.content,
						contractid: "",
						contractmoney: "",
						endplaytime:v.endplaytime,
						factmoney:v.factmoney,
						id: "",
						issatisfypay:v.issatisfypay,
						isuse: "",
						paytype:v.paytype,
						proportion:v.proportion,
						remark:v.remark,
						sealinfourl: "",
						startplaytime:v.startplaytime,
						task:v.task,
						_index:v._index
					}
					this.modalVisible2 = true;
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
	                            this.clearSelectAll();
	                            this.getDataList();
	                        });
	                    }
	                });
	            },
	            addSign() {
	                this.editClick = false;
	                this.modalVisible44 = true;
	                this.dictForm3 = {
	                    contractName: "",
	                    counterpart: "",
	                    contractMoney: "",
	                    signDate: ""
	                };
					this.$nextTick(() => {
						 this.$refs["dictForm3"].resetFields();       // this.$refs.adduserform.resetFields();
					 });
	            },
	            Isure() {
	                this.add();
					this.modalVisible44 = false;
	            },
	            add() {
	                // this.processModalVisible = true;
	                this.editClick = false;
	                // var selArr = this.dictForm.typeArr;
	                // var selArr2 = this.dictForm.counterpartArr;
	
	                this.dictForm = {
	                    isuse: "",
	                    id: "",
	                    name: this.dictForm3.contractName,
	                    typeid: "",
	                    typeName: "",
	                    // typeArr:selArr,
	                    contentname: this.dictForm3.contractName,
	                    contracturl: "",
	                    ismoney: "1",
	                    issecret: "1",
	                    isbudget: "1",
	                    isbid: "1",
	                    starttime: this.dictForm3.startDate,
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
	                    money: this.dictForm3.contractMoney,
	                    istopay: "1",
	                    istime: "1",
	                    isurgent: "1",
	                    endtime: this.dictForm3.endDate,
	                    counterpartid: "",
	                    // counterpartArr:selArr2,
	                    draftstime: "",
	                    phone: this.form_up.mobile,
	                    contractPlayList: []
	                };
	                this.modalVisible = true;
					this.$nextTick(() => {
						 this.$refs["dictForm"].resetFields();
					 });
	            },
	            add2(){
					
	            	this.dictForm2 = {
						content:"",
						contractid: "",
						contractmoney: "",
						endplaytime:"",
						factmoney:"",
						id: "",
						issatisfypay:1,
						isuse: "",
						paytype:1,
						proportion:"",
						remark:"",
						sealinfourl: "",
						startplaytime:"",
						task:"",
						_index:"",
	            	}
					this.edit2Click = false;
					this.modalVisible2 = true;
					this.$nextTick(() => {
						 this.$refs.dictForm2.resetFields();
					 });
	            },
	            edit(v) {
					if(v.contentname){
						this.fileDownUrl = "/xboot/draft/download?id="+v.id+"&tag=1&accessToken="+this.getStore("accessToken");
					}else{
						this.fileDownUrl = "";
					}
					if(v.attachmentname){
						this.fileDownUrl2 = "/xboot/draft/download?id="+v.id+"&tag=2&accessToken="+this.getStore("accessToken");
					}else{
						this.fileDownUrl2 = "";
					}
	                this.editClick = true;
	                this.modalVisible = true;
	                this.dictForm = {
	                    draftsmanid: v.draftsmanid ? v.draftsmanid : "",
	                    isuse: v.isuse ? v.isuse : "",
	                    id: v.id ? v.id : "",
	                    name: v.name ? v.name : "",
	                    typeid: v.typeid ? v.typeid : "",
	                    typeName: v.typeName ? v.typeName : "",
	                    // typeArr:v.typeArr?v.typeArr:"",
	                    contentname: v.contentname,
	                    contracturl: v.contracturl,
	                    ismoney: v.ismoney,
	                    issecret: v.issecret,
	                    isbudget: v.isbudget,
	                    isbid: v.isbid,
	                    starttime: v.starttime,
	                    number: v.number,
	                    contentnum: 0,
	                    counterpartnum: 0,
	                    totalnum: v.totalnum,
	                    chapter: v.chapter,
	                    description: v.description,
	                    attachmentname: v.attachmentname,
	                    accessoryurl: v.accessoryurl,
	                    draftsman: v.draftsman,
	                    draftsoutfit: v.draftsoutfit, //起草机构
	                    draftsoutfitid: v.draftsoutfitid,
	                    //合同范本
	                    source: v.source,
	                    sourceArr: v.sourceArr,
	                    money: v.money,
	                    istopay: v.istopay,
	                    istime: v.istime,
	                    isurgent: v.isurgent,
	                    endtime: v.endtime,
	                    counterpartid: v.counterpartid,
	                    // counterpartArr:v.counterpartArr,
	                    draftstime: v.draftstime,
	                    phone: v.phone,
	                    contractPlayList: v.contractPlayList
	                };
					if(this.dictForm.contracturl){
						this.auditUrl = "http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl
					}
	            },
	            findOp(arr, key) {
	                for (var i = 0; i < arr.length; i++) {
	                    if (arr[i].value == key) {
	                        obj[i].selected = true;
	                        break;
	                    }
	                }
	            },
				handleCancel(){
					this.modalVisible = false;
				},
	            handelSubmitDict(i) {
					if(!this.dictForm.name){
						this.$Message.error("合同名称没有填写");
						return
					}
					if(!this.dictForm.counterpartid){
						this.$Message.error("相对方没有填写");
						return
					}
					if(!this.dictForm.typeid){
						this.$Message.error("合同类型没有填写");
						return
					}
	// 				if(!this.dictForm.istopay){
	// 					this.$Message.error("收付款方式没有填写");
	// 					return
	// 				}
// 					if(this.dictForm.contentnum == ""){
// 						this.$Message.error("正文数没有填写");
// 						return
// 					}
// 					if(this.dictForm.contentnum<0){
// 						this.$Message.error("正文数填写有误");
// 						return
// 					}
// 					if(this.dictForm.counterpartnum == ""){
// 						this.$Message.error("副本数没有填写");
// 						return
// 					}
// 					if(this.dictForm.counterpartnum<0){
// 						this.$Message.error("副本数填写有误");
// 						return
// 					}
					if(this.dictForm.totalnum == ""){
						this.$Message.error("合同份数没有填写");
						return
					}
					if(this.dictForm.totalnum<0){
						this.$Message.error("合同份数填写有误");
						return
					}
					if(!this.dictForm.contracturl){
						this.$Message.error("合同正文没有填写");
						return
					}
					if(this.dictForm.money){
						if(isNaN(this.dictForm.money)){
							this.$Message.error("合同金额只能输入数值");
							return
						}
						if(String(this.dictForm.money).indexOf(".") > -1){
							if(this.dictForm.money.toString().split(".")[1].length > 2){
								this.$Message.error("合同金额只能输入到小数点后两位");
								return;
							}
						}
						if(String(this.dictForm.money).indexOf(".") == -1){
							this.dictForm.money = this.dictForm.money+""+ ".00";
						}else if(String(this.dictForm.money).indexOf(".") > -1){
							if(this.dictForm.money.toString().split(".")[1].length == 1){
								this.dictForm.money = this.dictForm.money+"" + "0";
							}
						}
					}
					this.dictForm.tag = i;
					if(this.dictForm.contractPlayList.length>0){
						this.arr = this.dictForm.contractPlayList;
						this.dictForm.contractPlayList = JSON.stringify(this.arr);
					}
					if(!this.dictForm.starttime){
						this.dictForm.starttime = ""
					}
					if(!this.dictForm.starttime){
						this.dictForm.endtime = ""
					}
					if(this.editClick){
						if(i == 2){
							draftAddhtong(this.dictForm).then(res => {
								this.modalVisible = false
								// this.getDataList();
								this.$router.push({
								  name: "my-apply"
								});
							});
						}else{
							draftAddhtong(this.dictForm).then(res => {
								// this.getDataList();
								this.form.id = "";
								// this.form.tableId = res.data.actBuisness.tableId;
								this.form.tableId = res.data.contract.id;
								if(res.result=="success"){
									this.modalVisible = false
									this.modalVisible3 = true;
									this.dictForm.id = res.data.id;
									this.$router.push({
									  name: "my-apply"
									});
								}
							});
						}
					}else{
						if(i ==2){
							addhtong(this.dictForm).then(res => {
								if(res.result=="success"){
									this.modalVisible = false;
									// this.getDataList();
									this.$router.push({
									  name: "my-apply"
									});
								}
							});
						}else{
							addhtong(this.dictForm).then(res => {
								// this.getDataList();
								this.form.id = "";
								// this.form.tableId = res.data.actBuisness.tableId;
								this.form.tableId = res.data.contract.id;
								if(res.result=="success"){
									this.modalVisible = false
									this.modalVisible3 = true;
									this.dictForm.id = res.data.id;
									this.$router.push({
									  name: "my-apply"
									});
								}
							});
						}
						
					}
	            },
	            ListSubmitDict() {
					if(!this.dictForm2.task){
						this.$Message.error("合同约定任务没有填写");
						return
					}
					if(!this.dictForm2.paytype){
						this.$Message.error("收付款方式没有填写");
						return
					}
					if(this.issatisfypay){
						if(!this.dictForm2.factmoney){
							this.$Message.error("收付款金额没有填写");
							return
						}
						if(!this.dictForm2.startplaytime){
							this.$Message.error("计划开始日期没有填写");
							return
						}
						if(!this.dictForm2.endplaytime){
							this.$Message.error("计划结束日期没有填写");
							return
						}
					}
					if(!this.dictForm2.content){
						this.$Message.error("履行内容没有填写");
						return
					}
					if(isNaN(this.dictForm2.factmoney)){
						this.$Message.error("收付款金额只能填写数值");
						return;
					}
					if(String(this.dictForm2.factmoney).indexOf(".") > -1){
						if(this.dictForm2.factmoney.toString().split(".")[1].length > 2){
							this.$Message.error("收付款金额只能填写数值只能输入到小数点后两位");
						}
					}
					if(isNaN(this.dictForm2.proportion)){
						this.$Message.error("所占比例只能填写数值");
						return;
					}
					if(String(this.dictForm2.proportion).indexOf(".") > -1){
						if(this.dictForm2.proportion.toString().split(".")[1].length > 2){
							this.$Message.error("所占比例只能输入到小数点后两位");
						}
					}
					if(typeof(this.dictForm2.endplaytime)== "object"){
						var y = this.dictForm2.endplaytime.getFullYear();
						var m = this.dictForm2.endplaytime.getMonth() + 1;
						m = m < 10 ? '0' + m : m;
						var d = this.dictForm2.endplaytime.getDate();
						d = d < 10 ? ('0' + d) : d;
						this.dictForm2.endplaytime = y + '-' + m + '-' + d;
					}
					if(typeof(this.dictForm2.startplaytime)== "object"){
						var y = this.dictForm2.startplaytime.getFullYear();
						var m = this.dictForm2.startplaytime.getMonth() + 1;
						m = m < 10 ? '0' + m : m;
						var d = this.dictForm2.startplaytime.getDate();
						d = d < 10 ? ('0' + d) : d;
						this.dictForm2.startplaytime = y + '-' + m + '-' + d;
					}
					console.log(this.dictForm2)
					if(this.edit2Click){
						this.dictForm.contractPlayList.splice(this.edit2ClickNum,1);
						var arr = [];
						for (var i= 0; i<this.dictForm.contractPlayList.length+1; i++) {
							arr.push(this.dictForm2)
						}
						this.dictForm.contractPlayList = arr
						// this.dictForm.contractPlayList.unshift(this.dictForm2);
					}else{
						// this.dictForm.contractPlayList.unshift(this.dictForm2)
						
						if(this.dictForm.contractPlayList.length == 0){
							var arr = [];
							arr.push(this.dictForm2);
							this.dictForm.contractPlayList = arr;
						}else{
							var arr = [];
							this.dictForm.contractPlayList.push(this.dictForm2);
							for (var i= 0; i<this.dictForm.contractPlayList.length; i++) {
								arr.push(this.dictForm.contractPlayList[i]);
							}
							this.dictForm.contractPlayList = arr
						}
					}
					this.modalVisible2 = false
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
	            },
	            openNewin() {
	                if (this.dictForm.contracturl == "") {
	                    this.$Message.warning("您还未上传合正文");
	                    return;
	                }
	                if (this.dictForm.typeid == "") {
	                    this.$Message.warning("您还未上选择合同类型");
	                    return;
	                }
	                window.open(
	                    "http://139.198.16.175:8073?url=" +
	                    encodeURIComponent(this.dictForm.contracturl) +
	                    "&id=" +
	                    this.dictForm.typeid +
	                    "",
	                    "_blank"
	                );
	            },
				fileDown(tag){
					filesDown({id:this.dictForm.id,tag:1}).then(res=>{
						console.log(res);
					})
				}
	        },
	        mounted() {
	            this.init();
				"use strict";
				var varNtkoGUID = Math.random().toString(36);
				var userAgent = navigator.userAgent, 
				    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
				    rFirefox = /(firefox)\/([\w.]+)/,
				    rOpera = /(opera).+version\/([\w.]+)/, 
				    rChrome = /(chrome)\/([\w.]+)/,
				    rSafari = /version\/([\w.]+).*(safari)/;
				var browser;
				var version;
				var ua = userAgent.toLowerCase();
				
				function uaMatch(ua) {
				    var match = rMsie.exec(ua);
				    if (match != null) {
				        return {browser: "IE", version: match[2] || "0"}
				    }
				    var match = rFirefox.exec(ua);
				    if (match != null) {
				        return {browser: match[1] || "", version: match[2] || "0"}
				    }
				    var match = rOpera.exec(ua);
				    if (match != null) {
				        return {browser: match[1] || "", version: match[2] || "0"}
				    }
				    var match = rChrome.exec(ua);
				    if (match != null) {
				        return {browser: match[1] || "", version: match[2] || "0"}
				    }
				    var match = rSafari.exec(ua);
				    if (match != null) {
				        return {browser: match[2] || "", version: match[1] || "0"}
				    }
				    if (match != null) {
				        return {browser: "", version: "0"}
				    }
				}
				
				var browserMatch = uaMatch(userAgent.toLowerCase());
				if (browserMatch.browser) {
				    browser = browserMatch.browser;
				    version = browserMatch.version;
				}
				
				function ntkoClose(strURL) {
				    var testurl = window.location.search;
				    if ((null === strURL) || ("" === strURL)) {
				        alert(" The Param strURL of openWindow() is NULL or empty. ");
				        return
				    }
				    var strLowser = strURL.toLowerCase();
				    if ("file://" === strLowser.substr(0, 7)) {
				    } else {
				        if ("/" != strURL.charAt(0)) {
				            if (("http://" === strLowser.substr(0, 7)) || ("https://" === strLowser.substr(0, 8))) {
				            } else {
				                if (strURL.indexOf("../") == -1) {
				                    var pathName = window.location.href;
				                    var varLength = pathName.lastIndexOf("/");
				                    strURL = pathName.substr(0, varLength + 1) + strURL
				                } else {
				                    var pathName = window.location.href;
				                    var varLength = pathName.lastIndexOf("/");
				                    var strURLLength = strURL.split("/");
				                    var ntkostrURL = "";
				                    var ntkolengthi = 0;
				                    for (var i = 0; i < strURLLength.length; i++) {
				                        if (strURLLength[i] == "..") {
				                        } else {
				                            if (pathName.indexOf(strURLLength[i]) == -1) {
				                                ntkostrURL = ntkostrURL + "/" + strURLLength[i]
				                            }
				                        }
				                    }
				                    strURL = pathName.substr(0, varLength) + ntkostrURL
				                }
				            }
				        } else {
				            var pathName = window.location.href;
				            var varLength = pathName.lastIndexOf("/");
				            strURL = pathName.substr(0, varLength + 1) + strURL
				        }
				    }
				    if (strURL.indexOf(testurl) == -1) {
				        strURL += testurl
				    }
				    var jsonValue = '{"Close":1,"GUID":"';
				    jsonValue += varNtkoGUID;
				    jsonValue += '","URLMD5":"';
				    jsonValue += b64_md5(strURL);
				    jsonValue += '"}';
				    if (browser == "IE") {
				        window.close()
				    }
				    if (browser == "firefox") {
				        if (version >= "50") {
				            window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
				        } else {
				            window.close()
				        }
				    }
				    if (browser == "chrome") {
				        if (version >= "45") {
				            window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
				        } else {
				            window.close()
				        }
				    }
				}
				
				this.myOpen = function openWindow(strURL, strProductCaption, strProductKey, strNoExpireKey, strOptions) {
				    var testurl = window.location.search;
				    if ((null === strURL) || ("" === strURL)) {
				        alert(" The Param strURL of openWindow() is NULL or empty. ");
				        return
				    }
				    var strLowser = strURL.toLowerCase();
				    if ("file://" === strLowser.substr(0, 7)) {
				    } else {
				        if ("/" != strURL.charAt(0)) {
				            if (("http://" === strLowser.substr(0, 7)) || ("https://" === strLowser.substr(0, 8))) {
				            } else {
				                if (strURL.indexOf("../") == -1) {
				                    var pathName = window.location.href;
				                    var varLength = pathName.lastIndexOf("/");
				                    strURL = pathName.substr(0, varLength + 1) + strURL
				                } else {
				                    var pathName = window.location.href;
				                    var varLength = pathName.lastIndexOf("/");
				                    var strURLLength = strURL.split("/");
				                    var ntkostrURL = "";
				                    var ntkolengthi = 0;
				                    for (var i = 0; i < strURLLength.length; i++) {
				                        if (strURLLength[i] == "..") {
				                        } else {
				                            if (pathName.indexOf(strURLLength[i]) == -1) {
				                                ntkostrURL = ntkostrURL + "/" + strURLLength[i]
				                            }
				                        }
				                    }
				                    strURL = pathName.substr(0, varLength) + ntkostrURL
				                }
				            }
				        } else {
				            var pathName = window.location.href;
				            var varLength = pathName.lastIndexOf("/");
				            strURL = pathName.substr(0, varLength + 1) + strURL
				        }
				    }
				    if (strURL.indexOf(testurl) == -1) {
				        strURL += testurl
				    }
				    var pathName = window.location.href;
				    var jsonValue = '{"OpenWindow":1,"URL":"';
				    jsonValue += strURL;
				    jsonValue += '","GUID":"';
				    jsonValue += varNtkoGUID;
				    jsonValue += '","URLMD5":"';
				    jsonValue += b64_md5(strURL);
				    jsonValue += '","SessionURL":"';
				    jsonValue += pathName;
				    jsonValue += '"';
				    if ((typeof strProductCaption != "undefined") && ((null != strProductCaption) && ("" != strProductCaption))) {
				        jsonValue += ',"ProductCaption":"';
				        jsonValue += strProductCaption;
				        jsonValue += '"'
				    }
				    if ((typeof strProductKey != "undefined") && ((null != strProductKey) && ("" != strProductKey))) {
				        jsonValue += ',"ProductKey":"';
				        jsonValue += strProductKey;
				        jsonValue += '"'
				    }
				    if ((typeof strNoExpireKey != "undefined") && ((null != strNoExpireKey) && ("" != strNoExpireKey))) {
				        jsonValue += ',"NoExpireKey":"';
				        jsonValue += strNoExpireKey;
				        jsonValue += '"'
				    }
				    if (typeof strOptions != "undefined" && ((null != strOptions) && ("" != strOptions))) {
				        jsonValue += ',"Options":"';
				        jsonValue += strOptions;
				        jsonValue += '"'
				    }
				    jsonValue += "}";
				    if (window != window.parent) {
				        window.parent.location.reload(true)
				    }
				    if (browser == "IE") {
				        window.open(strURL, "", "height=880, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes")
				    }
				    if (browser == "firefox") {
				        if (version >= "50") {
				            window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
				        } else {
				            window.open(strURL, "", "height=880, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes")
				        }
				    }
				    // console.log(strURL);
				    if (browser == "chrome") {
				        if (version >= "45") {
				            window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
				        } else {
				            window.open(strURL, "", "height=880, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no,fullscreen=yes")
				        }
				    }
				}
				
				
				var hexcase = 0;
				var b64pad = "";
				var chrsz = 8;
				
				function hex_md5(s) {
				    return binl2hex(core_md5(str2binl(s), s.length * chrsz))
				}
				
				function b64_md5(s) {
				    return binl2b64(core_md5(str2binl(s), s.length * chrsz))
				}
				
				function str_md5(s) {
				    return binl2str(core_md5(str2binl(s), s.length * chrsz))
				}
				
				function hex_hmac_md5(key, data) {
				    return binl2hex(core_hmac_md5(key, data))
				}
				
				function b64_hmac_md5(key, data) {
				    return binl2b64(core_hmac_md5(key, data))
				}
				
				function str_hmac_md5(key, data) {
				    return binl2str(core_hmac_md5(key, data))
				}
				
				function md5_vm_test() {
				    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72"
				}
				
				function core_md5(x, len) {
				    x[len >> 5] |= 128 << ((len) % 32);
				    x[(((len + 64) >>> 9) << 4) + 14] = len;
				    var a = 1732584193;
				    var b = -271733879;
				    var c = -1732584194;
				    var d = 271733878;
				    for (var i = 0; i < x.length; i += 16) {
				        var olda = a;
				        var oldb = b;
				        var oldc = c;
				        var oldd = d;
				        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
				        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
				        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
				        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
				        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
				        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
				        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
				        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
				        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
				        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
				        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
				        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
				        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
				        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
				        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
				        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
				        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
				        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
				        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
				        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
				        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
				        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
				        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
				        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
				        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
				        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
				        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
				        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
				        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
				        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
				        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
				        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
				        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
				        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
				        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
				        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
				        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
				        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
				        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
				        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
				        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
				        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
				        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
				        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
				        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
				        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
				        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
				        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
				        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
				        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
				        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
				        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
				        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
				        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
				        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
				        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
				        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
				        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
				        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
				        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
				        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
				        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
				        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
				        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
				        a = safe_add(a, olda);
				        b = safe_add(b, oldb);
				        c = safe_add(c, oldc);
				        d = safe_add(d, oldd)
				    }
				    return Array(a, b, c, d)
				}
				
				function md5_cmn(q, a, b, x, s, t) {
				    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
				}
				
				function md5_ff(a, b, c, d, x, s, t) {
				    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
				}
				
				function md5_gg(a, b, c, d, x, s, t) {
				    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
				}
				
				function md5_hh(a, b, c, d, x, s, t) {
				    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
				}
				
				function md5_ii(a, b, c, d, x, s, t) {
				    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
				}
				
				function core_hmac_md5(key, data) {
				    var bkey = str2binl(key);
				    if (bkey.length > 16) {
				        bkey = core_md5(bkey, key.length * chrsz)
				    }
				    var ipad = Array(16), opad = Array(16);
				    for (var i = 0;
				         i < 16; i++) {
				        ipad[i] = bkey[i] ^ 909522486;
				        opad[i] = bkey[i] ^ 1549556828
				    }
				    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
				    return core_md5(opad.concat(hash), 512 + 128)
				}
				
				function safe_add(x, y) {
				    var lsw = (x & 65535) + (y & 65535);
				    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
				    return (msw << 16) | (lsw & 65535)
				}
				
				function bit_rol(num, cnt) {
				    return (num << cnt) | (num >>> (32 - cnt))
				}
				
				function str2binl(str) {
				    var bin = Array();
				    var mask = (1 << chrsz) - 1;
				    for (var i = 0; i < str.length * chrsz; i += chrsz) {
				        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
				    }
				    return bin
				}
				
				function binl2str(bin) {
				    var str = "";
				    var mask = (1 << chrsz) - 1;
				    for (var i = 0; i < bin.length * 32; i += chrsz) {
				        str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
				    }
				    return str
				}
				
				function binl2hex(binarray) {
				    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
				    var str = "";
				    for (var i = 0; i < binarray.length * 4; i++) {
				        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 15)
				    }
				    return str
				}
				
				function binl2b64(binarray) {
				    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				    var str = "";
				    for (var i = 0; i < binarray.length * 4; i += 3) {
				        var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 255);
				        for (var j = 0; j < 4; j++) {
				            if (i * 8 + j * 6 > binarray.length * 32) {
				                str += b64pad
				            } else {
				                str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
				            }
				        }
				    }
				    return str
				}
				
				this.md5File = function md5(md5str) { 
				    var createMD5String = function(string) { 
				        var x = Array() 
				        var k, AA, BB, CC, DD, a, b, c, d 
				        var S11 = 7, S12 = 12, S13 = 17, S14 = 22 
				        var S21 = 5, S22 = 9, S23 = 14, S24 = 20 
				        var S31 = 4, S32 = 11, S33 = 16, S34 = 23 
				        var S41 = 6, S42 = 10, S43 = 15, S44 = 21 
				        string = uTF8Encode(string) 
				        x = convertToWordArray(string) 
				        a = 0x67452301 
				        b = 0xEFCDAB89 
				        c = 0x98BADCFE 
				        d = 0x10325476 
				        for (k = 0; k < x.length; k += 16) { 
				            AA = a 
				            BB = b 
				            CC = c 
				            DD = d 
				            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478) 
				            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756) 
				            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB) 
				            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE) 
				            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF) 
				            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A) 
				            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613) 
				            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501) 
				            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8) 
				            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF) 
				            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1) 
				            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE) 
				            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122) 
				            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193) 
				            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E) 
				            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821) 
				            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562) 
				            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340) 
				            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51) 
				            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA) 
				            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D) 
				            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453) 
				            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681) 
				            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8) 
				            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6) 
				            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6) 
				            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87) 
				            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED) 
				            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905) 
				            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8) 
				            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9) 
				            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A) 
				            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942) 
				            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681) 
				            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122) 
				            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C) 
				            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44) 
				            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9) 
				            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60) 
				            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70) 
				            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6) 
				            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA) 
				            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085) 
				            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05) 
				            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039) 
				            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5) 
				            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8) 
				            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665) 
				            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244) 
				            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97) 
				            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7) 
				            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039) 
				            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3) 
				            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92) 
				            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D) 
				            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1) 
				            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F) 
				            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0) 
				            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314) 
				            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1) 
				            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82) 
				            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235) 
				            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB) 
				            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391) 
				            a = addUnsigned(a, AA) 
				            b = addUnsigned(b, BB) 
				            c = addUnsigned(c, CC) 
				            d = addUnsigned(d, DD) 
				        } 
				        var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d) 
				        return tempValue.toLowerCase() 
				    } 
				    var rotateLeft = function(lValue, iShiftBits) { 
				        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)) 
				    } 
				    var addUnsigned = function(lX, lY) { 
				        var lX4, lY4, lX8, lY8, lResult 
				        lX8 = (lX & 0x80000000) 
				        lY8 = (lY & 0x80000000) 
				        lX4 = (lX & 0x40000000) 
				        lY4 = (lY & 0x40000000) 
				        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF) 
				        if (lX4 & lY4) 
				        return (lResult ^ 0x80000000 ^ lX8 ^ lY8) 
				        if (lX4 | lY4) { 
				            if (lResult & 0x40000000) 
				                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
				            else 
				                return (lResult ^ 0x40000000 ^ lX8 ^ lY8) 
				            } 
				        else { 
				            return (lResult ^ lX8 ^ lY8) } 
				        } 
				        var F = function(x, y, z) { return (x & y) | ((~x) & z) } 
				        var G = function(x, y, z) { return (x & z) | (y & (~z)) } 
				        var H = function(x, y, z) { return (x ^ y ^ z) } 
				        var I = function(x, y, z) { return (y ^ (x | (~z))) } 
				        var FF = function(a, b, c, d, x, s, ac) { 
				            a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac)) 
				            return addUnsigned(rotateLeft(a, s), b) 
				        } 
				        var GG = function(a, b, c, d, x, s, ac) { 
				            a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac)) 
				            return addUnsigned(rotateLeft(a, s), b) 
				        } 
				        var HH = function(a, b, c, d, x, s, ac) { 
				            a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac)) 
				            return addUnsigned(rotateLeft(a, s), b) 
				        } 
				        var II = function(a, b, c, d, x, s, ac) { 
				            a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac)) 
				            return addUnsigned(rotateLeft(a, s), b) 
				        } 
				        var convertToWordArray = function(string) { 
				            var lWordCount 
				            var lMessageLength = string.length 
				            var lNumberOfWordsTempOne = lMessageLength + 8 
				            var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64 
				            var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16 
				            var lWordArray = Array(lNumberOfWords - 1) 
				            var lBytePosition = 0 
				            var lByteCount = 0 
				            while (lByteCount < lMessageLength) { 
				                lWordCount = (lByteCount - (lByteCount % 4)) / 4 
				                lBytePosition = (lByteCount % 4) * 8 
				                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition)) 
				                lByteCount++ 
				            } 
				            lWordCount = (lByteCount - (lByteCount % 4)) / 4 
				            lBytePosition = (lByteCount % 4) * 8 
				            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition) 
				            lWordArray[lNumberOfWords - 2] = lMessageLength << 3 
				            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29 
				            return lWordArray
				        } 
				        var wordToHex = function(lValue) { 
				            var WordToHexValue = '', WordToHexValueTemp = '', lByte, lCount 
				            for (lCount = 0; lCount <= 3; lCount++) { 
				                lByte = (lValue >>> (lCount * 8)) & 255 
				                WordToHexValueTemp = '0' + lByte.toString(16) 
				                WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2) 
				            } return WordToHexValue 
				        } 
				        var uTF8Encode = function(string) { 
				            string = string.toString().replace(/\x0d\x0a/g, '\x0a') 
				            var output = '' 
				            for (var n = 0; n < string.length; n++) { 
				                var c = string.charCodeAt(n) 
				                if (c < 128) { 
				                    output += String.fromCharCode(c) 
				                } else if ((c > 127) && (c < 2048)) { 
				                    output += String.fromCharCode((c >> 6) | 192) 
				                    output += String.fromCharCode((c & 63) | 128) 
				                } else { 
				                    output += String.fromCharCode((c >> 12) | 224) 
				                    output += String.fromCharCode(((c >> 6) & 63) | 128) 
				                    output += String.fromCharCode((c & 63) | 128) 
				                } 
				            } 
				            return output 
				        } 
				    return createMD5String(md5str) 
				}
	        }
	    };
</script>