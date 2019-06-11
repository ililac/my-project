<template>
	<div>
		<Modal :title="modalTitle" v-model="modalVisible" :mask-closable='false' id="allWin"  :width="1000" class="formModel" @on-visible-change="modalVisiblechange">
			<Form ref="dictForm" :model="dictForm" :label-width="120" :rules="dictFormValidate">
				<div v-if="dictForm.modalSource == 1">
					<p style="font-size: 16px;">变更信息</p>
					<div class="ul">
						<FormItem label="变更原因" class="lef asterisk">
							<select v-model="dictForm.changeReason" style="float: left;width: 90%;">
								<option  v-for="item in reasonArr" :value="item.id">{{item.title}}</option>
							</select>
						</FormItem>
						<FormItem label="变更时间" class="data lef asterisk">
							<DatePicker
									v-model="dictForm.changeTime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择起始时间"
									style="width: 100%;"
									:editable="false"
							></DatePicker>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="变更内容" class="asterisk">
							<Input
								type="textarea"
								v-model="dictForm.changeContent"
								:maxlength="1000"
								:rows="2"
							/>
						</FormItem>
					</div>
					<p style="font-size: 16px;">基本信息</p>
					<div class="ul">
						<FormItem label="原合同名称" class="lef">
							<p>{{dictForm.name}}</p>
						</FormItem>
						<FormItem label="原合同编号" class="lef">
							<p>{{dictForm.number}}</p>
						</FormItem>
					</div>
				</div>
				<div class="ul">
					<FormItem label="文本来源" prop="name">
						<RadioGroup v-model="dictForm.source" @on-change="clean1">
							<Radio label="1">自行起草</Radio>
							<Radio label="2">标准文本</Radio>
						</RadioGroup>
						<!-- <label class="redis-celect" >
							<input type="radio" @click="clean1(1)" style="margin-right:0;cursor:pointer" v-model="dictForm.source" value="1"/> 自行起草</label>
						<label class="redis-celect" ><input type="radio" @click="clean1(2)" style="margin-right:0;cursor:pointer" v-model="dictForm.source" value="2"/> 标准文本 </label> -->
					</FormItem>
				</div>
				<div class="ul three">
					<FormItem label="合同正文"  v-if="sourceShow" class="lef" prop="contentname">
			            <span @click="draftBz" class="model-select" style="cursor:pointer">范本选择</span>
						<p v-show="fileDownUrl"><a v-bind:href="fileDownUrl">{{dictForm.contentname}}</a></p>
					</FormItem>
					<FormItem label="合同正文" v-else="sourceShow" class="lef" prop="contentname">
						<Upload action="/zhfw/contract/draft/uploadFileNew"
							:data='{"generalNo":dictForm.generalNo,"url":""}'
			                :headers="accessToken"
							:on-success="handleSuccess2"
							:on-error="handleError"
							:max-size="10240"
							:format="['doc','docx']"
							:on-exceeded-size="handleMaxSize"
							:on-format-error="handleFormatError"
							:before-upload="beforeUpload"
							type="drag"
							ref="up1">
							<p id="contentname" class="upload">点击上传</p>
						</Upload>
						<p style="color: #d3d3d3;">支持扩展名：doc,.docx文件大小：<=10MB</p>
						<p v-show="fileDownUrl" @click="fileDowm(dictForm.contentname,dictForm.contracturl)" style="color: #2B85E4;cursor: pointer;">{{dictForm.contentname}}</p>
					</FormItem>
					<FormItem class="lef">
						<!-- <Button type="dashed" :loading="btnLoading6" @click="onlineEdit" icon="ios-create-outline" class="btnLi">
							<span v-if="!btnLoading6">在线编辑</span>
							<span v-else>打开中...</span>
						</Button> -->
						<Button type="dashed" :loading="btnLoading7" @click="brainpowerAudit" icon="ios-create-outline" class="btnLi">
							<span v-if="!btnLoading7">智能审核</span>
							<span v-else>打开中...</span>
						</Button>
						<Button type="dashed" :loading="btnLoading8" @click="fileCompare" icon="ios-create-outline">
							<span v-if="!btnLoading8">文本对比</span>
							<span v-else>打开中...</span>
						</Button>
					</FormItem>
				</div>
				<div class="ul">
					<FormItem label="合同名称" prop="name" class="lef">
						<Input v-model="dictForm.name" :maxlength="50" @on-change="verifyInput(dictForm.name)"/>
					</FormItem>
					<Form-item label="合同类型" prop="name" class="lef">
						<contract-type style="width:365px" v-on:typeListen="typeChange" :typeDate.sync="formData1" :widthDate.sync="myStyle"></contract-type>
					</Form-item>
				</div>
				<div class="ul" v-for="(item,index) in relativeList">
					<div class="lef dome-relative-list">
						<label class="dome-relative-label">{{"相对方"+(index + 1)}}</label>
						<Select v-model="item.counterpartId" style="float: left;text-align: left; width: calc(90% - 108px);" @on-change="relativeNameChange(item.counterpartId)">
							<Option  v-for="item2 in counterpartArr" :value="item2.id">{{ item2.counterpartName }}</Option>
						</Select>
						<Icon type="md-add" size="30" color="#2d8cf0" style="float: left;width: calc(10% - 12px);cursor: pointer;" @click="unfoundCounterpart(index)"/>
					</div>
					<Form-item label="合同地位" class="lef">
						<select v-model="item.degreeId" style="float: left;width: 90%;">
							<option  v-for="item3 in degreeArr" :value="item3.id">{{item3.title}}</option>
						</select>
						<Icon v-show="!item.removeExit" type="md-add-circle" size="30" color="#2d8cf0" style="float: left;width: 10%;cursor: pointer;" @click="relativeNameAdd"/>
						<Icon v-show="item.removeExit" type="md-remove-circle" size="30" color="#2d8cf0" style="float: left;width: 10%;cursor: pointer;" @click="relativeNameremove(index)"/>
					</Form-item>
				</div>
				<div class="ul">
					<FormItem label="收付款方式" prop="name" class="lef">
						<select v-model="dictForm.istopay">
							<option  value="1" v-model="dictForm.istopay">收款</option>
							<option  value="0" v-model="dictForm.istopay">付款</option>
							<option  value="2" v-model="dictForm.istopay">不涉及</option>
						</select>
					</FormItem>
					<FormItem class="lef" v-show="dictForm.istopay != 2">
						<span style="position: absolute;left: -67px;top: 0;"><b style="color: #ed4014;font-size: 14px;line-height: 33px;">*</b>合同金额</span>
						<!-- <Input v-model="dictForm.money" v-on:input="nuMinput(dictForm.money)" style="width: calc(100% - 36px);"/> -->
						<InputNumber style="width: calc(100% - 36px);" :maxlength="10" :min="0" @on-change="nuMinput(dictForm.money)" v-model="dictForm.money"></InputNumber>
						<b style="position: absolute;right: -30px;top: 0;color: #ed4014; width: 66px;">（万元）</b>
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
								:editable="false"
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
								:editable="false"
						></DatePicker>
					</FormItem>
				</div>	
				<div class="ul">
					<!-- <FormItem label="用章类型" prop="name" class="lef">
						<RadioGroup v-model="dictForm.chapter">
							<Radio label="1">校章</Radio>
							<Radio label="2">合同章</Radio>
						</RadioGroup>
					</FormItem> -->
					<FormItem label="合同份数" prop="name" class="lef">
						<InputNumber style="width: 100%;" :maxlength="10" :min="1" @on-change="nuMinput2(dictForm.totalnum,3)" v-model="dictForm.totalnum"></InputNumber>
					</FormItem>
					<FormItem label="关联主合同" class="lef">
						<Button style="display: block;width: 100%;" @click="relevance">{{dictForm.parentContractName?dictForm.parentContractName:"选择主合同"}}</Button>
					</FormItem>
				</div>	
				<div class="ul">
					<FormItem label="是否公开招投标" class="lef">
						<RadioGroup v-model="dictForm.openBidding">
							<Radio label="0">是</Radio>
							<Radio label="1">否</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="是否政府采购" class="lef">
						<RadioGroup v-model="dictForm.governmentProcurement">
							<Radio label="0">是</Radio>
							<Radio label="1">否</Radio>
						</RadioGroup>
					</FormItem>
				</div>
				<div class="ul">
					<FormItem class="lef">
						<RadioGroup v-model="dictForm.majorContract">
							<Radio label="0">是</Radio>
							<Radio label="1">否</Radio>
						</RadioGroup>
						<div slot="label">
							<span><i style="color: red;margin-right: 5px;font-size: 14px;">*</i>是否重大合同</span>
							<Tooltip placement="bottom" max-width="300">
								<Icon type="ios-alert-outline" size="15" color="#2d8cf0"/>
								<div slot="content">
									<p>下列合同属于重大合同：</p>
									<p>（一）申请成立法人或其它社会组织的；</p>
									<p>（二）对外设立产学研合作机构或重大项目的；</p>
									<p>（三）开展对外合作办学重大项目的；</p>
									<p>（四）对外从事投融资、大额资金借贷等经营性活动的；</p>
									<p>（五）合同涉及“三重一大”事项的；</p>
									<p>（六）其他法律关系较为复杂、合同标的额较大或对学校利益有重大影响的合同。</p>
								</div>
							</Tooltip>
						</div>
					</FormItem>
				</div>
				<div class="ul">
					<FormItem label="备注">
						<Input
							type="textarea"
							v-model="dictForm.description"
							:maxlength="1000"
							:rows="2"
						/>
					</FormItem>
				</div>
				<Col :span="24">
					<FormItem label="相关附件">
						<Upload 
							action="/zhfw/system/upload/uploadFiles?tag=accessoryurl-attachmentname"
							ref="upload2"
							:headers="accessToken"
							:show-upload-list="false"
							:default-file-list="defaultList"
							:on-success="affixHandleSuccess"
							:max-size="10240"
							:on-exceeded-size="affixHandleMaxSize"
							:before-upload="affixhandleBeforeUpload"
							multiple
							type="drag"
							class="upload"
							>
							<p id="attachmentname" class="upload" @click="getUpId('attachmentname')">上传文件</p>
						</Upload>
						<p style="color: #d3d3d3;">支持文件大小：<=10MB</p>
						<div class="demo-upload-list" v-for="item in uploadList">
							<div class="demo-upload-list-cover">
								<template>
									<p class="affixList"><a v-bind:href="item.fileDownUrl">{{item.name}}</a></p>
									<Icon type="ios-close-circle" @click.native="handleRemove(item)"></Icon>
								</template>
							</div>
						</div>
					</FormItem>
				</Col>
				<div style="clear:both"></div>
			</Form>
			<div slot="footer">
			  <Button type="text" @click="handleCancel(1)">取消</Button>
			  <Button type="primary" :loading="btnLoading" @click="handelSubmitDict(1)">
			  	<span v-if="!btnLoading">提交</span>
			  	<span v-else>Loading...</span>
			  </Button>
			  <Button v-if="dictForm.modalSource != 1" type="primary" :loading="btnLoading2" @click="handelSubmitDict(2)">
			  	<span v-if="!btnLoading2">保存</span>
			  	<span v-else>Loading...</span>
			  </Button>
			</div>
		</Modal>
		<relative-edit :formData.sync="relativeDictForm" :visible.sync="relativeModalVisible" :sourceType.sync="source" v-on:relativelisten="childShow2"  v-on:listen="childShow"></relative-edit>
		<Modal title="组织机构选人" v-model="modalVisible3" :mask-closable="false" :width="700">
			<div class="clear">
				<Col :span="24">
					<Col :span="12">
						<div class="tree-bar">
							<Tree ref="tree" :data="treeData" :load-data="loadData" @on-select-change="selectTree"></Tree>
						</div>
					</Col>
					<Col :span="12">
						<Alert show-icon>
						    已选择 <span class="select-count">{{selectCount}}</span> 项
						</Alert>
						<Table :height="300" :loading="loading" border :columns="columns" :data="personData" ref="table1" @on-selection-change="showSelect"></Table>
					</Col>
				</Col>
			</div>
			<div style="clear: both;"></div>
			<div slot="footer">
			  <Button type="text" @click="modalVisible3=false">取消</Button>
			  <Button type="primary" :loading="btnLoading4" @click="examineSubmit">
			  	<span v-if="!btnLoading4">提交</span>
			  	<span v-else>Loading...</span>
			  </Button>
			</div>
		</Modal>
		<Modal title="范本选择" v-model="modalVisible5" :mask-closable="false" :width="1000" footer-hide>
		    <Form>
		        <Form-item label="范本名称">
		            <Input type="text" v-model="searchForm1.modelName" placeholder="请输入" clearable style="width: 300px"/>
		            <Button @click="handleSearch1(1)" type="primary" icon="ios-search" style="margin-left:35px;">查询</Button>
		        </Form-item>
		    </Form>
		    
		    <Row>
		        <Table :loading="loading1" border :columns="columns3" :data="data1" sortable="custom" @on-sort-change="changeSort1" @on-selection-change="showSelect1" ref="table"></Table>
		    </Row>
		    <Row type="flex" justify="end" class="page">
		        <Page :current="searchForm1.pageNumber" :total="total1" :page-size="searchForm1.pageSize" @on-change="changePage1" @on-page-size-change="changePageSize1" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
		    </Row>
		</Modal>
		<Modal title="主合同选择" v-model="modalVisible6" :mask-closable="false" :width="1000" footer-hide>
		    <Form>
		        <Form-item label="合同名称">
		            <Input type="text" v-model="signedForm.name" placeholder="请输入" clearable style="width: 300px"/>
		            <Button @click="signedSearch" type="primary" icon="ios-search" style="margin-left:35px;">查询</Button>
		        </Form-item>
		    </Form>
		    
		    <Row>
		        <Table :loading="loading1" border :columns="columns4" :data="signedData" sortable="custom" @on-sort-change="changeSort1" @on-selection-change="showSelect1" ref="table"></Table>
		    </Row>
		    <Row type="flex" justify="end" class="page">
		        <Page :current="signedForm.pageNum" :total="signedTotal" :page-size="signedForm.pageSize" @on-change="changeSignedPage" size="small" show-total show-elevator show-sizer></Page>
		    </Row>
		</Modal>
	</div>
</template>

<script>
	import { myOpen } from "../../htgl/myOpen";
	import  md5 from 'js-md5';
	import  contractType from "./contractType.vue";
	import  relativeEdit from "../../htgl/relative/relativeEdit.vue";
    import  {getProcessDataList } from "@/api/activiti";
    import {
		addhtong,
		draftAddhtong,
		fileUpUrlAudit,
		relativeFindCompany,
        fromUp,
		departmentGet,
		personSelect,
		applyBusiness,
        eachOther,
		loadDepartment,
		getDictDataByType,
//        examineManList,
        wordEdit,
		relativeNumber,
		signedContract,
		draftModelList,
		intelligentAudit,
		verifyText,
        chooseFile
    } from "@/api/index";
    export default {
        name: "applyManage",
        components: {
			relativeEdit,
			contractType
        },
		props:{
			formData33:Boolean,
			formData1:Object,
			modolSource:Number
		},
        data() {
            return {
				sourceShow:true,
				modalTitle:'',
				myStyle:{display:'flex',width:'365px'}, //合同类型宽度
				defaultList:[],
				uploadList:[],
				file:[],
				source:0,
                myOpenUrl:'',//打开编辑器的url
                myOpenUrl2:'',//打开编辑器的url
                upId: "",
				oldNum:0,
				selectCount:0, //已选择的数量
				issatisfypay:true,      //是否满足收付款条件没有被点击
                accessToken: {}, // 上传token鉴权
				attachmentname:false,
				contentname:false,
				fileDownUrl:"",
				// auditUrl: "",
				compareName:"",
				selectDate: null,
				edit2Click: false,
				edit2ClickNum: false,
				modalVisible5:false, //范本选择弹框
				modalVisible6:false, //关联主合同弹框
                relativeModalVisible: false, //相对方弹框
                enable:false,          //相对方是否可选
                ownership_type: [], //相对方
                relative_type: [], //相对方
				signedData:[],    //关联的主合同的数据
				signedTotal:0,    //关联的主合同的总数
				// linkContractName:this.formData1.parentContractName,             // 关联主合同
				retResRelative: {
                    id: '',
					name : '',
				},
				relativeList:[
					{
						contractId:"",
						counterpartId:"",
						degreeId:"",
						id:"",
						removeExit:false
					}
				],      //相对方列表
				contracturl2:"",      //合同正文的原始url
				dictFormValidate: {
					// 表单验证规则
					name: [{ required: true, message: "不能为空", trigger: "change" }],
					contentname: [{ required: true, message: "不能为空", trigger: "change" }],
					type: [{ required: true, message: "不能为空", trigger: "blur" }]
				},
                counterpartArr: [], //相对方数据列表
                degreeArr: [], //合同地位列表
                typeArr: [], //合同类型数据列表
				reasonArr:[], //变更原因
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
                arr: [], //履行计划数组
                processModalVisible: false,
//                assigneeList: [],
                editClick: false, //是否点击了编辑按钮
                dictPriority: [],
                selectCount: 0,
                contract_type: [],
                modalVisible: this.formData33,
                modalVisible2: false,
                modalVisible3: false,
                modalVisible44: false,
				searchForm1: {      //范本选择弹出框
                    modelName: "",
                    contractTypeId: "",
                    pageNumber: 1, // 当前页数
                    pageSize: 10, // 页面大小
                    order: "desc" // 默认排序方式
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
                    regCapital : '',
					flag:""
                },
                findCompanyDate:{
                    company:""
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
                    totalnum: 0,
                    chapter: "1",
                    description: "",
                    //相关附件
                    draftsman: "",
                    draftsoutfit: "", //起草机构
                    draftsoutfitid: "",
                    //合同范本
                    source: "1",
                    sourceName: "",
                    sourceArr: [],
                    money: 0,
                    istopay: 0,
                    istime: "",
                    isurgent: "",
                    endtime: "",
                    counterpartid: "",
                    // counterpartArr:[],
                    draftstime: "",
                    phone: "",
					contentname:"",
                    contractPlayList: [],
					generalNo:""
                },
				contractPlayList2:[],    //履行计划临时存储
                form: {
                    procDefId: "",
					procInstId:"",
                    assignees: "",
                    priority: "",
                    id: "",
                    tableId: "",
                    title: ""
                },
                loading: false, // 表格加载状态
				btnLoading:false, //合同起草中的提交按钮
				btnLoading2:false, //合同起草中的保存按钮
				btnLoading3:false, //履行计划中的保存按钮
				btnLoading4:false, //下一审批人中的提交按钮
				btnLoading5:false, //添加向对方中的保存
				btnLoading6:false, //在线编辑
				btnLoading7:false, //智能审核
				btnLoading8:false, //文本对比
                data: [], //表单数据
                total: 0, // 表单数据总数
				loading1: false,
                data1: [],
                total1: 0,
				columns: [
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
				//范本中的选择
				columns3: [
                    // 表头
                    {
                        title: "序号",
                        type: "index",
                        width: 80,
                        align: "center"
                    },
                    {
                        title: "范本名称",
                        key: "modelName",
                        width: 240,
						align: "center"
                    },
                    {
                        title: "合同类型",
                        key: "contractTypeName",
                        width: 200,
						align: "center"
                    },
                    {
                        title: "使用次数",
                        key: "usedCount",
                        width: 100,
						align: "center"
                    },
                    {
                        title: "发布人",
                        key: "createBy",
                        width: 100,
						align: "center"
                    },
                    {
                        title: "发布时间",
                        key: "publishTime",
                        width: 160,
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
                                                this.chooseThis(params.row);
                                            }
                                        }
                                    },
                                    "选择"
                                ),
                                
                            ]);
                        }
                    }
                ],
				//主合同中的列表项
				columns4: [
				    // 表头
				    {
				        title: "序号",
				        type: "index",
				        width: 60,
				        align: "center"
				    },
				    {
				        title: "合同名称",
				        key: "name",
				        width: 250,
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
						align: "center",
				        width: 100
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
                form_up: {
                    createTime: "",
                    department: "",
                    mobile: "",
                    userId: "",
                    userName: "",
                    uName: ""
                },
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
				http:"http://localhost:9999",
				personData:[],
				signedForm:{
					pageNum:1,
					pageSize:10,
					stateIds:"7,8,11,12",
					name:""
				}
            };
        },
        methods: {
			verifyInput(value){
				if(verifyText(value,1)){
					this.$Message.error("不能输入特殊字符");
					return;
				}
			},
			//申请人选择事件
			showSelect(e) {
			    this.selectList = e;
			    this.selectCount = e.length;
				this.form.assignees = [];
				for(var i = 0;i < e.length;i++){
					this.form.assignees.push(e[i].id);
				};
			},
			childShow(data){
				if(data.data){
					eachOther().then(res => {
						this.counterpartArr = res.result.content;
						let arr = this.relativeList;
					arr[data.order].counterpartId = data.data.result.id;
					this.relativeList = [...arr];
					this.dictForm.counterpartList = [...this.relativeList];
					});
				}
			},
		    childShow2(data){
		    	this.relativeModalVisible = data;
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
				personSelect({procDefId:this.form.procDefId,departmentId:v[0].id,procInstId:this.form.procInstId}).then(res => {
					let personData = res.result.userList;
					for(let i = 0;i < personData.length;i++){
                        personData[i]._checked = true;
					}
				    this.personData = [...personData];
                    this.selectList = this.personData;
                    this.selectCount = this.personData.length;
                    this.form.assignees = [];
                    for(var i = 0;i < this.personData.length;i++){
                        this.form.assignees.push(this.personData[i].id);
                    };
				})
			},
			clean1(index) {
				if(index == 1){
					this.sourceShow = true;
				}else{
					this.sourceShow = false;
				}
				this.dictForm.contentname = "";
					this.dictForm.contracturl = "";
					this.dictForm.name = "";
			},
			// accessoryurl-attachmentname
			handleSuccess(res, file) {
				if(res.message == "success"){
					this.dictForm[this.upId] = res.result[0].name;
// 					this.dictForm[res.result[0].tag.split("-")[1]] = res.result[0].name;
					this.attachmentname = true;
					this.$Message.success("上传文件 " + file.name + " 成功");
					// if(this.dictForm.typeid){
					// 	this.auditUrl = "http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl
					// }
				}else{
					this.$Message.error("上传文件 " + file.name + " 失败");
				}
			},
			handleSuccess2(res, file) {
				if(res.result == "success"){
					
					this.dictForm.contracturl = res.url;
					this.dictForm.name = res.fileName.substring(0,res.fileName.lastIndexOf("."));
					this.dictForm.contentname = res.fileName;
					this.attachmentname = true;
					this.contracturl2 = res.url;
					// if(this.dictForm.typeid){
					// 	this.auditUrl = "http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl
					// }
					this.fileDownUrl = '/zhfw/contract/draft/download?fileName='+res.result.name+'&url='+res.result.url+'&access_token='+this.getStore("accessToken");
					this.dictForm.generalNo = res.generalNo;
					document.getElementById("contentname").innerHTML = "点击上传";
					console.log(this.dictForm);
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
				// this.$Message.error('请上传word文件！')
				}
			},
			//合同附件的多文件上传
			affixBeforeUpload(file){
				this.dictForm[this.upId] = "文件上传中...";
				this.dictForm.accessoryurl = "";
				this.dictForm.attachmentname = "";
				this.file = [];
				return true;
			},
			//多文件上传的方法
			
			handleMaxSize(file) {
				this.dictForm[this.upId] = "文件过大，请重新上传";
				this.$Notice.warning({
					title: "文件大小过大",
					desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
				});
			},
			//合同正文中上传文件的格式错误
			handleFormatError(file){
				this.$Notice.warning({
                    title: '格式错误',
                    desc: "所选文件‘ " + file.name + " ’格式错误"
                });
			},
			typeChange(v){
				this.dictForm.typeid = v.id;
				this.dictForm.contractType = v.typeName;
				// if(v.id&&this.dictForm.contracturl){
				// 	this.auditUrl = "http://139.198.16.175:8073?id="+v.id+"&url="+this.dictForm.contracturl
				// }
			},
			handelSubmitDict(i) {
				if(!this.dictForm.name){
					this.$Message.error("合同名称没有填写");
					return
				}
				if(!this.dictForm.typeid){
					this.$Message.error("合同类型没有填写");
					return
				}
				
				if(!this.dictForm.contentname){
					this.$Message.error("合同正文没有填写");
					return
				}
				if(this.dictForm.istopay == 1||this.dictForm.istopay == 0){
					if(!this.dictForm.money){
						this.$Message.error("合同金额为必填项");
						return
					}
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
					if(String(this.dictForm.money).length - 1 == String(this.dictForm.money).indexOf(".")){
						this.dictForm.money = this.dictForm.money+""+ "00";
					}
					if(String(this.dictForm.money).indexOf(".") == -1){
						this.dictForm.money = this.dictForm.money+""+ ".00";
					}else if(String(this.dictForm.money).indexOf(".") > -1){
						if(this.dictForm.money.toString().split(".")[1].length == 1){
							this.dictForm.money = this.dictForm.money+"" + "0";
						}
					}
				}
				for (let value of this.relativeList){
					if(!value.counterpartId){
						this.$Message.error("相对方没有填写");
						return
					}
					value.contractId = this.dictForm.id;
					delete value.removeExit;
					delete value.counterpartName;
					delete value.degree;
				}
				if(this.dictForm.totalnum == ""){
					this.$Message.error("合同份数没有填写");
					return
				}
				if(this.dictForm.totalnum<0){
					this.$Message.error("合同份数不能填负数");
					return
				}
				this.dictForm.tag = i;
				if(!this.dictForm.starttime){
					this.dictForm.starttime = ""
				}
				if(!this.dictForm.starttime){
					this.dictForm.endtime = ""
				}
				if(i == 1){
					this.btnLoading = true;
				}else if(i ==2){
					this.btnLoading2 = true;
				}
				this.dictForm.accessoryurl = [];
				this.dictForm.attachmentname = [];
				const arr =this.uploadList
				for(let j = 0;j < arr.length;j++){
					this.dictForm.accessoryurl.push(arr[j].url);
					this.dictForm.attachmentname.push(arr[j].name);
				}
				fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
					if(res.result == "success"){
						let dictForm = {...this.dictForm};
						dictForm.counterpartList = [...this.relativeList];
						dictForm.counterpartList = JSON.stringify(dictForm.counterpartList);
						dictForm.contracturl = res.url;
						dictForm.generalNo = res.generalNo;
						if(!dictForm.parentId){
							dictForm.parentId = "";
						}
						if(this.dictForm.modalSource == 1){
							if(this.dictForm.id){
								if(!dictForm.changeReason){
									this.$Message.error("变更原因没有填写");
									this.btnLoading = false;
									return
								}
								if(!dictForm.changeTime){
									this.$Message.error("变更时间没有填写");
									this.btnLoading = false;
									return
								}
								if(!dictForm.changeContent){
									this.$Message.error("变更内容没有填写");
									this.btnLoading = false;
									return
								}
								if(typeof(dictForm.changeTime)=="object"){
									let d = dictForm.changeTime;
									var date = d.getFullYear() + "-" + 
											   (d.getMonth() + 1) + "-" +
											   d.getDate()
									dictForm.changeTime = date;
								}
								addhtong(dictForm).then(res => {
									this.form.id = "";
									this.form.tableId = res.data.contract.id;
									this.modalVisible3 = true;
									this.getProcessList();
									if(res.result=="success"){
										this.handleCancel(3,{"dictFormId":res.data.id});
									}
									this.btnLoading = false;
								});
								return;
							}
						}
						if(this.dictForm.id){
							if(i == 2){
								draftAddhtong(dictForm).then(res => {
									this.btnLoading2 = false;
									this.handleCancel(2);
								});
							}else{
								draftAddhtong(dictForm).then(res => {
									this.form.id = "";
									if(this.dictForm.businessId){
										this.form.businessId = this.dictForm.businessId;
									}
									this.form.tableId = res.data.contract.id;
									this.modalVisible3 = true;
									this.getProcessList();
									if(res.result=="success"){
										this.handleCancel(3,{"dictFormId":res.data.contract.id});
									}
									this.btnLoading = false;
								});
							}
						}else{
							delete dictForm.delCounterpartIds;
							if(i ==2){
								addhtong(dictForm).then(res => {
									if(res.result=="success"){
										this.handleCancel(2);
									}
									this.btnLoading2 = false;
								});
							}else{
								addhtong(dictForm).then(res => {
									this.form.id = "";
									this.form.tableId = res.data.contract.id;
									this.modalVisible3 = true;
									this.getProcessList();
									if(res.result=="success"){
										this.handleCancel(3,{"dictFormId":res.data.id});
									}
									this.btnLoading = false;
								});
							}
							
						}
					}
				})
			},
			nuMinput2(v,type){
				if(isNaN(v)){
					this.$Message.error("只能输入数字");
					if(type == 1){
						this.dictForm.contentnum = 0;
					}else if(type == 2){
						this.dictForm.counterpartnum = 0;
					}else if(type == 3){
						this.dictForm.totalnum = 1;
						// this.dictForm.totalnum = v.replace(/\b(0+)/gi,"");
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
						this.dictForm.totalnum = 1;
						// this.dictForm.totalnum = v.replace(/\b(0+)/gi,"");
					}
					return;
				}
			},
			//在线编辑
			onlineEdit(){
				console.log(this.dictForm);
				this.btnLoading6 = true;
				// myOpen(this.myOpenUrl);
				if(this.dictForm.contracturl){
					fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
						if(res.result == "success"){
							var fname = this.dictForm.contentname;
							var fTag = res.url;
							this.dictForm.generalNo = res.generalNo;
							var fileTag = md5(fTag.substring(fTag.lastIndexOf("/")+1,fTag.lastIndexOf(".")));//此处需要进行MD5加密
							var finalFileUrl = fTag.substring(0,fTag.lastIndexOf("/")+1) + fileTag + fTag.substring(fTag.lastIndexOf("."));
							this.dictForm.contracturl = res.url;
							var fromUrl = res.url;
							this.myOpenUrl = wordEdit+'/editURL.html?fromUrl='+fromUrl+"&fname="+fname+"&fileTag="+fileTag+"&uName="+this.form_up.uName+"&generalNo="+res.generalNo+"&tableId="+this.dictForm.id;
							myOpen(this.myOpenUrl);
						}
						this.btnLoading6 = false;
					})
				}else{
					this.$Message.error("请先选择或者上传合同正文");
					this.btnLoading6 = false;
				}
			},
			//智能审核contracturl2
			brainpowerAudit(){
				this.btnLoading7 = true;
				if(this.dictForm.contracturl){
					fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
						this.btnLoading7 = false;
						if(res.result == "success"){
							if(this.dictForm.typeid){
								window.open(intelligentAudit+"?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl);
							}else{
								this.$Message.error("请先选择合同类型");
							}
						}
					})
				}else{
					this.$Message.error("请先选择或者上传合同正文");
					this.btnLoading7 = false;
				}
			},
			fileCompare() {
				this.btnLoading8 = true;
				if(this.dictForm.contentname){
					fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
						if(res.result == "success"){
							window.open(wordEdit+"?generalNo="+res.generalNo);
						}
						this.btnLoading8 = false;
					})
				}else{
					 this.$Message.error("请先选择或者上传合同正文");
					 this.btnLoading8 = false;
				}
				
				// window.location = "/compareText";
			},
			applyShow(res){
				this.modalVisible = false
				if(res.type == 2){
					this.getDataList1();
				}else if(res.type == 3){
					this.modalVisible3 = true;
					this.dictForm.id = res.data.dictFormId;
					this.form.tableId = res.data.dictFormId;
				}
			},
			modalVisiblechange(v){
				this.$emit("listenApply",v);
			},
			timeChange(){
				if(!this.dictForm.starttime){
					this.$Message.error("请先选择开始时间");
					this.dictForm.endtime = "";
					return;
				}
				if(this.dictForm.starttime >= this.dictForm.endtime){
					this.$Message.error("开始时间不能大于等于结束时间");
					this.dictForm.endtime = "";
				}
				// if(this.dictForm.starttime >= this.dictForm.endtime){
				// 	this.$Message.error("开始时间不能大于等于结束时间");
				// 	this.dictForm.endtime = "";
				// }
			},
			//范本选择弹出框
			draftBz() {
                this.modalVisible5 = true;
                this.getDataList1();
            },
			selectDateRange(v) {
			  if (v) {
			    this.searchForm.startTime = v[0];
			    this.searchForm.endTime = v[1];
			  }
			},
			nuMinput(v,min,max){
				if(isNaN(v)){
					this.$Message.error("只能输入数字");
					return;
				}
				// this.dictForm2.factmoney = v.replace(/\b(0+)/gi,"");
				if(parseInt(v)<0){
					this.$Message.error("只能输入正数");	
				}
				if(String(v).indexOf(".") > -1){
					if(v.toString().split(".")[1].length > 2){
						this.$Message.error("只能输入到小数点后两位");
					}
				}
				if(String(v).length > 1){
					if(String(v).indexOf("0") == 0 && (String(v).indexOf(".") != 1)){
						this.$Message.error("数字前面不能加零");
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
            getUpId(id) {
                this.upId = id;
            },
            //模板选择
            getProcessList() {
				departmentGet().then(res => {
					let message = res.message;
					let that = this;
					getProcessDataList(this.searchProcessForm).then(res => {
					    if (res.message=="success") {
							let arr = res.result.content;
							if(message == "true"){
								for(let i = 0;i<arr.length;i++){
									if(arr[i].processKey == "contract_approve_zhiNeng"){
										that.processData = arr[i];
										break;
									}
								}
							}else{
								for(let i = 0;i<arr.length;i++){
									if(arr[i].processKey == "contract_approve"){
										that.processData = arr[i];
										break;
									}
								}
							}
							that.form.procDefId = this.processData.id;
							that.form.procInstId = "";
//							that.getDictDataType();
					    }
					});
				})
            },
//            getDictDataType() {
//                examineManList(this.processData.id).then(res => {
//                    this.assigneeList = res.result.users;
//                });
//            },
            //审批人提交
            examineSubmit() {
				this.btnLoading4 = true;
				this.form.priority = 0;
				this.form.procDefId = this.processData.id;
				this.form.title = this.dictForm.name;
				applyBusiness(this.form).then(res => {
				    this.loading = false;
				    if (res.success === true) {
				        this.$Message.success("操作成功");
				        this.modalVisible3 = false;
						this.modalVisiblechange();
				    }
					this.btnLoading4 = false;
				});
            },
            init() {
                this.accessToken = {
					'access_token': this.getStore("accessToken"),
					'Authorization': 'Bearer '+this.getStore("accessToken")
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
                //企业所有制形式ownership_type
                getDictDataByType("company_syzxs").then(res => {
                    if (res.success) {
                        this.ownership_type = res.result;
                    }
                });
                getDictDataByType("contract_type").then(res => {
                    if (res.success) {
                        this.typeArr = res.result;
                    }
                });
				//获取合同地位列表
				getDictDataByType("degreeType").then(res => {
				    if (res.success) {
				        this.degreeArr = res.result;
				    }
				});
				//获取变更原因数据列表
				getDictDataByType("changeReason").then(res => {
				    if (res.success) {
				        this.reasonArr = res.result;
				    }
				});
            },
			//文件下载
			fileDowm(name,url){
				fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:url}).then(res => {
					if(res.result == "success"){
						window.open("/zhfw/contract/draft/download?fileName="+name+"&url="+res.url+"&access_token="+this.getStore("accessToken"));
					}
				})
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
			chooseThis(v) {
                this.selectForm = v;
				this.dictForm.generalNo = "";
                this.dictForm.name = v.fileName.substring(0,v.fileName.lastIndexOf("."));;
                var fname = v.fileName;
                var fromUrl = v.modelAddress;
                this.dictForm.contentname = v.fileName;
                this.dictForm.contractModelId = v.id;
				this.contracturl2 = v.modelAddress;
                var fTag = v.modelAddress;
                var fileTag = md5(fTag.substring(fTag.lastIndexOf("/")+1,fTag.lastIndexOf(".")));//此处需要进行MD5加密
                // var fileTag = md5(fTag.substring(fTag.lastIndexOf("/")+1,fTag.lastIndexOf(".")));//此处需要进行MD5加密generalNo
                chooseFile({ fileUrl: v.modelAddress }).then(res => {});

                //在线编辑后，最终保存的文本地址
                var finalFileUrl = fTag.substring(0,fTag.lastIndexOf("/")+1) + fileTag + fTag.substring(fTag.lastIndexOf("."));
				var fromUrl2 = encodeURIComponent(finalFileUrl);
                this.dictForm.contracturl = v.modelAddress;
//                 this.myOpenUrl = wordEdit+'/editURL.html?fromUrl='+fromUrl+"&fname="+fname+"&fileTag="+fileTag+"&uName="+this.form_up.uName+"&generalNo=2555";
//                 this.myOpenUrl2 = wordEdit+'/editURL.html?fromUrl='+fromUrl2+"&fname="+fname+"&fileTag="+fileTag+"&uName="+this.form_up.uName;
                this.fileDownUrl = '/zhfw/contract/draft/download?fileName='+v.fileName+'&url='+v.modelAddress+'&access_token='+this.getStore("accessToken");
				this.modalVisible5 = false;
            },
            changeSort1(e) {
                this.searchForm1.sort = e.key;
                this.searchForm1.order = e.order;
                if (e.order === "normal") {
                    this.searchForm1.order = "";
                }
            },
            showSelect1(e) {
                this.selectList = e;
                this.selectCount = e.length;
            },
            changePage1(v) {
                this.searchForm1.pageNumber = v;
                this.getDataList1();
            },
			//关联的主合同中的列表数据翻页事件
			changeSignedPage(v){
				this.signedForm.pageNum = v;
				this.signedList();
			},
            changePageSize1(v) {
                this.searchForm1.pageSize = v;
                this.getDataList1();
            },
            handleSearch1(type) {
                this.searchForm1.pageNumber = 1;
                this.searchForm1.pageSize = 10;
                this.getDataList1();
            },
            getDataList1() {
                this.loading1 = true;
                draftModelList(this.searchForm1).then(res => {
                    this.loading1 = false;
                    if (res.success === true) {
                        this.data1 = res.result.data;
                        this.total1 = res.result.totalSize;
                    }
                });
            },
            unfoundCounterpart(index){
				relativeNumber().then(res => {
					if(res.success){
						this.relativeDictForm = {
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
							disabled:false,
							_index:index
						}
						this.relativeModalVisible = true;
						this.source = 2;
					}
				})
            },
			//以下是附件上传的事件
			handleRemove (file) {
                const fileList = this.$refs.upload2.fileList;
                this.$refs.upload2.fileList.splice(fileList.indexOf(file), 1);
            },
            affixHandleSuccess (res, file) {
				if(this.uploadList.length >= 10){
					this.$Message.error("最多只能上传10个附件");
					document.getElementById("attachmentname").innerHTML = "点击上传";
					return;
				}
				if(!res.success){
					this.$Message.error("上传失败");
					document.getElementById("attachmentname").innerHTML = "点击上传";
					return;
				}
                file.url = res.result[0].url;
                file.name = res.result[0].name;
                file.fileDownUrl = '/zhfw/contract/draft/download?fileName='+res.result[0].name+'&url='+res.result[0].url+'&access_token='+this.getStore("accessToken");
				this.uploadList = this.$refs.upload2.fileList;
				document.getElementById("attachmentname").innerHTML = "点击上传";
            },
            affixHandleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件太大',
                    desc: '文件  ' + file.name + ' 超过了10MB'
                });
				document.getElementById("attachmentname").innerHTML = "点击上传";
            },
            affixhandleBeforeUpload () {
				if(this.uploadList.length >= 10){
					this.$Message.error("最多只能上传10个附件");
					document.getElementById("attachmentname").innerHTML = "点击上传";
					return false;
				}
				document.getElementById("attachmentname").innerHTML = "文件上传中...";
				
            },
			//以上是附件上传的事件
			//相对方重复验证
			relativeNameChange(v){
				console.log(this.relativeList);
				if(this.relativeList.length == 1){
					return;
				}
				var num = 0;
				for (let value of this.relativeList) {
					if(value.counterpartId == v){
						num++;
					}
				}
				if(num > 1){
					this.$Message.error("不能添加重复的相对方");
					return
				}
			},
			//增加相对方
			relativeNameAdd(){
				let obj = {
					contractId:this.dictForm.id,
					counterpartId:"",
					degreeId:"",
					id:"",
					removeExit:true
				}
				this.relativeList.push(obj);
			},
			//删除相对方
			relativeNameremove(v){
				if(this.relativeList[v].id){
					this.dictForm.delCounterpartIds.push(this.relativeList[v].id);
				}
				this.relativeList.splice(v,1);
			},
			//点击选择主合同
			relevance(){
				this.modalVisible6 = true;
				this.signedList();
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
			//主合同选择中的选择按钮
			chooseSigeed(v){
				this.dictForm.parentId = v.contractId;
				this.dictForm.parentContractName = v.name;
				// this.linkContractName = v.name;
				this.modalVisible6 = false;
			},
			signedSearch(){
				this.signedList();
			}
        },
        mounted() {
            this.init();
        },
		watch:{
			formData33: {
		　　 	handler(newValue, oldValue) {
					this.modalVisible = newValue;
					if(newValue){
						//合同类型
						this.btnLoading = false;
						this.btnLoading2 = false;
						this.btnLoading3 = false;
						this.btnLoading4 = false;
						this.btnLoading5 = false;
						this.btnLoading6 = false;
						this.btnLoading7 = false;
						this.btnLoading8 = false;
						getDictDataByType("counterpart").then(res => {
						    if (res.success) {
						        this.relative_type = res.result;
						    }
						});
						eachOther().then(res => {
							this.counterpartArr = res.result.content;
						});

						
					}
		　　　　	},
		　　　　	deep: true
		　　 },
			formData1: {
		　　 	handler(newValue, oldValue) {
					if(newValue){
						this.dictForm = newValue;
					}else{
						this.dictForm = oldValue;
					}
					if(this.dictForm.id){
						this.editClick = true;
					}else{
						this.editClick = false;
					}
					if(this.dictForm.contentname){
						this.fileDownUrl = '/zhfw/contract/draft/download?fileName='+this.dictForm.contentname+'&url='+this.dictForm.contracturl+'&access_token='+this.getStore("accessToken");
					}else{
						this.fileDownUrl = "";
					}
					if(this.dictForm.attachmentname){
						this.fileDownUrl2 = "/zhfw/contract/draft/download?id="+this.dictForm.id+"&tag=2&access_token="+this.getStore("accessToken");
					}else{
						this.fileDownUrl2 = "";
					}
					// if(newValue.contracturl){
					// 	this.auditUrl = "http://139.198.16.175:8073?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl
					// }
					this.uploadList = this.dictForm.uploadList;
					this.$refs.upload2.fileList = this.dictForm.uploadList;
					this.dictForm.generalNo = this.dictForm.generalNo?this.dictForm.generalNo:"";
					this.relativeList = this.dictForm.counterpartList;
					if(this.dictForm.modalSource == 1){
						this.modalTitle = "合同变更";
					}else{
						this.modalTitle = "合同起草";
					}
					if(this.dictForm.source == 1){
						this.sourceShow = true;
					}else{
						this.sourceShow = false;
					}
					console.log(this.dictForm)
		　　　　	},
		　　　　	deep: true
		　　}
		},
    };
</script>

<style scoped>
	.tree-bar {
	    max-height: 500px;
	    overflow: auto;
	    margin-top: 5px;
	}
	
	.tree-bar::-webkit-scrollbar {
	    width: 6px;
	    height: 6px;
	}
	
	.tree-bar::-webkit-scrollbar-thumb {
	    border-radius: 4px;
	    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
	    background: #e4e4e4;
	}
	
	.demo-upload-list{
        display: inline-block;
        text-align: center;
        border-radius: 4px;
		background-color: #e3e3e3;
        position: relative;
        margin-right: 15px;
		margin-bottom: 10px;
    }
	.demo-upload-list .affixList{
		padding: 0 10px;
	}
    .demo-upload-list-cover i{
		position: absolute;
		right: -10px;
		top: -10px;
		font-size: 20px;
		cursor: pointer;
    }
	.dome-relative-list{
		float: left;
		text-align: right;
		width: 120px;
		display: inline-block;
	}
	.dome-relative-label{
		float: left;
		width: 120px;
		text-align: right;
		display: inline-block;
		padding: 10px 12px 10px 0;
	}
	.dome-relative-label:before{
		content: '*';
		display: inline-block;
		margin-right: 4px;
		line-height: 1;
		font-family: SimSun;
		font-size: 12px;
		color: #ed4014;
	}
</style>
