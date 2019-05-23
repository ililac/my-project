<style lang="less" scoped>
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
							<Form-item label="起草时间">
								<DatePicker
								  v-model="searchForm.startTime"
								  format="yyyy-MM-dd"
								  clearable
								  placeholder="选择时间"
								  :editable="false"
								></DatePicker>
								<DatePicker
								  v-model="searchForm.endTime"
								  format="yyyy-MM-dd"
								  clearable
								  @on-change="timeChange"
								  placeholder="选择时间"
								  :editable="false"
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
		<Modal title="履行计划" v-model="modalVisible" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="cancellationForm" :model="cancellationForm" :label-width="120">
					<div class="ul">
						<Form-item label="合同名称" class="lef">
							<p>{{cancellationForm.name}}</p>
						</Form-item>
						<FormItem label="合同编号" class="lef">
							<p>{{cancellationForm.number}}</p>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="承办人" class="lef">
							<p>{{cancellationForm.userName}}</p>
						</FormItem>
						<FormItem label="承办部门" class="lef">
							<p>{{cancellationForm.department}}</p>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="合同金额" class="lef">
							<p>{{cancellationForm.money}}</p>
						</FormItem>
						<FormItem label="合同期限" class="lef">
							<p>{{cancellationForm.time}}</p>
						</FormItem>
					</div>
				</Form>
			</Col>
			<div style="clear:both"></div>
			<div v-show="type==1">
				<Row class="operation">
				    <Button @click="planAdd" type="primary" icon="md-add">添加数据</Button>
				</Row>
				<Row>
					<Table :loading="loading" border :columns="columns2" :data="data2" sortable="custom2" ref="table"></Table>
				</Row>
			</div>
			<div v-show="type==2">
				<Col :span="24">
					<Form ref="finishForm" :model="finishForm" :label-width="120" :rules="dictFormValidate3">
						<p class="clear tips">履行终止</p>
						<div class="ul">
							<Form-item label="终止日期" :error="errorMsg" class="asterisk">
								<DatePicker
									v-model="finishForm.time"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择时间"
									style="width: 275px"
									:editable="false"
								></DatePicker>
							</Form-item>
						</div>
						<div class="ul">
							<FormItem label="终止说明" prop="explain">
								<Input
									type="textarea"
									v-model="finishForm.explain"
									:rows="5"
									placeholder="请输入详细情况"
								/>
							</FormItem>
						</div>
						<div class="ul">
							<FormItem label="备注">
								<Input
									type="textarea"
									v-model="finishForm.remark"
									:rows="5"
									placeholder="请输入详细情况"
								/>
							</FormItem>
						</div>
						<div class="ul">
							<FormItem label="终止依据" class="qualificationInfoName lef">
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
										<p class="title">上传附件</p>
									</div>
								</Upload>
							</FormItem>
						</div>
					</Form>
				</Col>
			</div>
			<div v-show="type==3">
				<Col :span="24">
					<Form ref="finishForm" :model="finishForm" :label-width="120" :rules="dictFormValidate4">
						<p class="clear tips">履行结束</p>
						<div class="ul">
							<Form-item label="结束日期" prop="time">
								<DatePicker
										v-model="finishForm.time"
										type="date"
										format="yyyy-MM-dd"
										clearable
										placeholder="选择时间"
										style="width: 275px"
										:editable="false"
								></DatePicker>
							</Form-item>
						</div>
						<div class="ul">
							<FormItem label="结束说明" prop="explain">
								<Input
										type="textarea"
										v-model="finishForm.explain"
										:rows="5"
										placeholder="请输入详细情况"
								/>
							</FormItem>
						</div>
						<div class="ul">
							<FormItem label="备注">
								<Input
										type="textarea"
										v-model="finishForm.remark"
										:rows="5"
										placeholder="请输入详细情况"
								/>
							</FormItem>
						</div>
					</Form>
				</Col>
			</div>
			<div v-show="type==4">
				<Row>
					<Table :loading="loading" border :columns="columns3" :data="data3" sortable="custom3" ref="table"></Table>
				</Row>
			</div>
			<!-- <Row type="flex" justify="end" class="page">
				<Page :current="searchForm.pageNo" :total="total2" :page-size="searchForm.pageSize2" @on-change="changePage2" @on-page-size-change="changePageSize2" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
			</Row> -->
			<div style="clear:both"></div>
			<div slot="footer">
				<!-- <Button type="primary"  @click="planConfirm">确定</Button> -->
				<Button :loading="btnLoading" type="primary"  @click="planConfirm">
					<span v-if="!btnLoading">确定</span>
					<span v-else>Loading...</span>
				</Button>
				<Button type="text" @click="modalVisible=false">取消</Button>
			</div>
		</Modal>
		<Modal title="履行计划" v-model="newPlanModel" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="newPlanModelForm" :model="newPlanModelForm" :label-width="150" :rules="dictFormValidate1">
					<div class="ul">
						<Form-item label="合同约定任务" prop="task">
							<input type="text" v-model="newPlanModelForm.task" />
						</Form-item>
					</div>
					<div class="ul">
						<FormItem label="收付款方式" class="lef" prop="paytype">
							<select id='sel' v-model="newPlanModelForm.paytype">
								<option  value="1">收款</option>
								<option  value="0">付款</option>
								<option  value="2">不涉及</option>
							</select>
						</FormItem>
						<Form-item label="收付款相对方" class="lef" prop="counterpartId">
							<!-- <input type="text" v-model="newPlanModelForm.counterpartId" /> -->
							<Select v-model="newPlanModelForm.counterpartId">
								<Option v-for="item in newPlanRelativeList" :value="item.id">{{ item.value }}</Option>
							</Select>
						</Form-item>
					</div>
					<div class="ul">
						<FormItem label="收付款金额(万元)" class="lef" prop="factmoney">
							<!-- <InputNumber style="width: 100%;" v-model="newPlanModelForm.factmoney"></InputNumber> -->
							<input type="text" v-model="newPlanModelForm.factmoney" v-on:input="nuMinput(newPlanModelForm.factmoney)" @blur="moneyVerify(data2,newPlanModelForm.factmoney,'超过了合同金额',2)"/>
						</FormItem>
						<FormItem label="所占比例(%)" class="lef" prop="proportion">
							<input type="text" v-model="newPlanModelForm.proportion" v-on:input="nuMinput(newPlanModelForm.proportion,100)"/>
						</FormItem>
						
					</div>
					<div class="ul">
						<FormItem label="计划开始日期" class="lef data" prop="startplaytime">
							<DatePicker
									v-model="newPlanModelForm.startplaytime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择时间"
									style="width: 100%"
									:editable="false"
							></DatePicker>
						</FormItem>
						<FormItem label="计划结束日期" class="lef data" prop="endplaytime">
							<DatePicker
									v-model="newPlanModelForm.endplaytime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择时间"
									style="width: 100%"
									:editable="false"
							></DatePicker>
						</FormItem>
					</div>
					<div class="ul txtar">
						<FormItem label="履行内容" prop="content">
							<Input
									type="textarea"
									v-model="newPlanModelForm.content"
									:rows="5"
									placeholder="请输入详细情况"
							/>
						</FormItem>
					</div>
					<div class="ul txtar">
						<FormItem label="备注">
							<Input
									type="textarea"
									v-model="newPlanModelForm.remark"
									:rows="5"
									placeholder="请输入详细情况"
							/>
						</FormItem>
					</div>
				</Form>
			</Col>
			<div class="clear"></div>
			<div slot="footer">
				<Button :loading="btnLoading2" type="primary"  @click="newPlanConfirm">
					<span v-if="!btnLoading2">保存</span>
					<span v-else>Loading...</span>
				</Button>
				<Button type="text" @click="newPlanModel=false">取消</Button>
			</div>
		</Modal>
		<Modal title="反馈" v-model="feedbackModel" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<Form ref="feedbackModelForm" :show-message="false" :model="feedbackModelForm" :label-width="170" :rules="dictFormValidate2">
					<div class="ul">
						<Form-item label="实际付款金额（万元）" class="lef" prop="factMoney">
							<input type="text" v-model="feedbackModelForm.factMoney"  v-on:input="nuMinput(feedbackModelForm.factMoney)" @blur="moneyVerify(data4,feedbackModelForm.factMoney,'反馈中总的开票金额超过了合同金额',2)"/>
						</Form-item>
						<Form-item label="履行计划是否完成" class="lef" prop="isDone">
							<!-- <input type="text" v-model="feedbackModelForm.factMoney"  v-on:input="nuMinput(feedbackModelForm.factMoney)"/> -->
							<label for="">是<input type="radio" v-model="feedbackModelForm.isDone" value="1"></label>
							<label for="">否<input type="radio" v-model="feedbackModelForm.isDone" value="0"></label>
						</Form-item>
					</div>
					<div class="ul">
						<FormItem label="实际付款时间" class="lef data" prop="factpayTime">
							<DatePicker
									v-model="feedbackModelForm.factpayTime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择时间"
									style="width: 100%"
									:editable="false"
							></DatePicker>
						</FormItem>
						<FormItem label="开票时间" class="lef data" prop="invoiceTime">
							<DatePicker
									v-model="feedbackModelForm.invoiceTime"
									type="date"
									format="yyyy-MM-dd"
									clearable
									placeholder="选择起始时间"
									style="width: 100%"
									:editable="false"
							></DatePicker>
						</FormItem>
						
					</div>
					<div class="ul">
						<FormItem label="开票金额(万元)" class="lef" prop="invoiceMoney">
							<input type="text" v-model="feedbackModelForm.invoiceMoney" v-on:input="nuMinput(feedbackModelForm.invoiceMoney)"/>
						</FormItem>
						<FormItem label="发票编码" class="lef">
							<input type="text" v-model="feedbackModelForm.invoiceNumber"/>
						</FormItem>
						
					</div>
					<div class="ul txtar">
						<FormItem label="履行内容">
							<Input
									type="textarea"
									v-model="feedbackModelForm.remark"
									:rows="5"
									placeholder="请输入详细情况"
							/>
						</FormItem>
					</div>
				</Form>
			</Col>
			<div class="clear"></div>
			<div slot="footer">
				<!-- <Button type="primary"  @click="newFeedbackConfirm">保存</Button> -->
				<Button :loading="btnLoading3" type="primary"  @click="newFeedbackConfirm">
					<span v-if="!btnLoading3">保存</span>
					<span v-else>Loading...</span>
				</Button>
				<Button type="text" @click="feedbackModel=false">取消</Button>
			</div>
		</Modal>
		<Modal title="查看反馈" v-model="feedbackModelSee" :mask-closable='false' :width="1000" :styles="{top: '30px'}" class="formModel">
			<Col :span="24">
				<div v-show="type==4">
					<Row>
						<Table :loading="loading" border :columns="columns4" :data="data4" sortable="custom4" ref="table"></Table>
					</Row>
				</div>
			</Col>
			<div class="clear"></div>
			<div slot="footer">
				<Button type="text" @click="feedbackModelSee=false">取消</Button>
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
		performPlanDel,
		performPlanConfirm,
		performPlanFinish,
		performNewBuild,
		detailList,
		performPlanUpdate,
		feedbackConfirm,
		payRelativeList,
        fromUp
    } from "@/api/index";
    import circleLoading from "../../my-components/circle-loading.vue";
    export default {
        name: "perform",
        components: {
            circleLoading
        },
        data() {
            return {
				type:1,      //显示的哪个模块
                accessToken: {}, // 上传token鉴权
                errorMsg:"",
				btnLoading:false, //确认履行计划中确定按钮
				btnLoading2:false, //新建履行计划中保存按钮
				btnLoading3:false, //反馈中保存按钮
				newPlanRelativeList:[], //收付款相对方列表
				dictFormValidate1: {
				    // 表单验证规则
				    task: [{ required: true, message: "不能为空", trigger: "blur" }],
				    counterpartId: [{ required: true, message: "不能为空", trigger: "blur" }],
				    paytype: [{ required: true, message: "不能为空", trigger: "blur" }],
				    factmoney: [{ required: true, message: "不能为空", trigger: "blur" }],
				    proportion: [{ required: true, message: "不能为空", trigger: "blur" }],
				    startplaytime: [{ required: true}],
				    endplaytime: [{ required: true}],
				    content: [{ required: true, message: "不能为空", trigger: "blur" }]
				},
				dictFormValidate2: {
				    // 表单验证规则
				    factMoney: [{ required: true, message: "不能为空", trigger: "blur" }],
				    factpayTime: [{ required: true}],
				    invoiceTime: [{ required: true}],
				    invoiceMoney: [{ required: true, message: "不能为空", trigger: "blur" }],
				    isDone: [{ required: true, message: "不能为空", trigger: "blur" }]
				},
				dictFormValidate3: {
				    // 表单验证规则
				    time: [{ required: true}],
				    explain: [{ required: true, message: "不能为空", trigger: "blur" }]
				},
				dictFormValidate4: {
				    // 表单验证规则
				     time: [{ required: true}],
				    explain: [{ required: true, message: "不能为空", trigger: "blur" }]
				},
				newPlan:1,         //是否点击了新建履行计划中的添加数据
                selectCount:0,
				removeUpdate:0, //是否更新
                relative_type:[],
				main_type:[],
				ownership_type:[],
                modalVisible: false,
				newPlanModel:false,          //新建履行计划模块
                modalSign: false,
				feedbackModel:false,
				feedbackModelSee:false,        //查看反馈
				lockDate:{
					counterpartId:"",
					blackFlag:''
				},
				findCompanyDate:{
					company:""
				},
				feedbackModelForm:{
					id:"",
					factMoney:"",
					factpayTime:"",
					invoiceTime:"",
					invoiceMoney:"",
					invoiceNumber:"",
					remark:"",
					contractPlayId:"",
					isDone:0
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
				    name:"",
					number:"",
					userName:"",
					department:"",
					money:"",
					time:""
				},
				finishForm:{
					id:"",
					time:"",             
					explain:"",         
					remark:"",      
					Url:"",           
					UrlName:"",     
					contractId:"",      
				},
				//新建履行计划表格数据
				newPlanModelForm:{
					id:"",
					task:"",            
					issatisfypay:0,  
					paytype:0,  
					factmoney:"",      
					proportion:"",     
					startplaytime:"",   
					endplaytime:"",
					content:"",   
					remark:"",       
					contractId:"",       
					isuse:""
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
                loading: false, // 表格加载状态
                data: [], //表单数据
                data2: [], //确认中的表单数据
                data3: [], //反馈中的表单数据
                data4: [], //反馈内容列表中的数据
                total: 0, // 表单数据总数
                total2: 0, // 确认中的表单数据总数
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
                        width: 100,
                        align: "center"
                    },
                    {
                        title: "合同名称",
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
						    if(params.row.stateId==7){
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
								                    this.confirm(params.row);
								                }
								            }
								        },
								        "添加履行计划"
								    )
								])
							}else{
								return h("div", [
								    // h(
								    //     "Button",
								    //     {
								    //         props: {
								    //             type: "primary",
								    //             size: "small"
								    //         },
								    //         style: {
								    //             marginRight: "5px"
								    //         },
								    //         on: {
								    //             click: () => {
								    //                 this.termination(params.row);
								    //             }
								    //         }
								    //     },
								    //     "终止"
								    // ),
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
									                this.finish(params.row);
									            }
									        }
									    },
									    "履行结束"
									),
								    h(
								        "Button",
								        {
								            props: {
								                type: "primary",
								                size: "small"
								            },
								            on: {
								                click: () => {
								                    this.feedback(params.row);
								                }
								            }
								        },
								        "履行反馈"
								    )
								]);
							}
						}
                    }
                ],
				columns2:[
					{
					    title: "序号",
					    type: "index",
					    width: 100,
					    align: "center"
					},
					{
					    title: "合同约定任务",
					    key: "task",
					    width: 150,
						align: "center"
					},
// 					{
// 					    title: "是否满足收付款条件",
// 					    key: "issatisfypay",
// 					    width: 150,
// 						align: "center"
// 					},
					{
					    title: "收付款方式",
					    // key: "paytype",
					    width: 180,
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
					    title: "收付款相对方",
					    key: "counterpartValue",
					    width: 180,
						align: "center"
					},
					{
					    title: "收付款金额(万元)",
					    key: "factmoney",
					    width: 180,
						align: "center"
					},
					{
					    title: "所占比例",
					    key: "proportion",
					    width: 100,
						align: "center"
					},
					{
					    title: "计划开始日期",
					    key: "startplaytime",
					    width: 180,
						align: "center"
					},
					{
					    title: "计划结束日期",
					    key: "endplaytime",
					    width: 180,
						align: "center"
					},
					{
					    title: "履行内容",
					    key: "content",
					    width: 180,
						align: "center"
					},
					{
					    title: "备注",
					    key: "remark",
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
						    ]);
						}
					}
				],
				columns3:[
					{
					    title: "序号",
					    type: "index",
					    width: 100,
					    align: "center"
					},
					{
					    title: "合同约定任务",
					    key: "task",
					    width: 150,
						align: "center"
					},
// 					{
// 					    title: "是否满足收付款条件",
// 					    key: "issatisfypay",
// 					    width: 150,
// 						align: "center"
// 					},
					{
					    title: "收付款方式",
					    // key: "paytype",
					    width: 180,
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
					    title: "收付款相对方",
					    key: "counterpartValue",
					    width: 180,
						align: "center"
					},
					{
					    title: "收付款金额(万元)",
					    key: "factmoney",
					    width: 160,
						align: "center"
					},
					{
					    title: "所占比例",
					    key: "proportion",
					    width: 100,
						align: "center"
					},
					{
					    title: "计划开始日期",
					    key: "startplaytime",
					    width: 180,
						align: "center"
					},
					{
					    title: "计划结束日期",
					    key: "endplaytime",
					    width: 180,
						align: "center"
					},
					{
					    title: "履行内容",
					    key: "content",
					    width: 180,
						align: "center"
					},
					{
					    title: "备注",
					    key: "remark",
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
							if(params.row.isDone==1){
								return h("div", [
									h(
									    "Button",
									    {
									        props: {
									            type: "primary",
									            size: "small"
									        },
									        on: {
									            click: () => {
									                this.feedbackSee(params.row);
									            }
									        }
									    },
									    "查看"
									)
								]);
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
								                    this.feedbackAdd(params.row);
								                }
								            }
								        },
								        "反馈"
								    ),
									h(
									    "Button",
									    {
									        props: {
									            type: "primary",
									            size: "small"
									        },
									        on: {
									            click: () => {
									                this.feedbackSee(params.row);
									            }
									        }
									    },
									    "查看"
									)
								]);
							}
						    
						}
					}
				],
				columns4:[
					{
					    title: "序号",
					    type: "index",
					    width: 100,
					    align: "center"
					},
					{
					    title: "实际付款金额",
					    key: "factMoney",
					    width: 150,
						align: "center"
					},
					{
					    title: "实际付款时间",
					    key: "factpayTime",
					    width: 150,
						align: "center"
					},
					{
					    title: "开票时间",
					    key: "invoiceTime",
					    width: 180,
						align: "center"
					},
					{
					    title: "开票金额(万元)",
					    key: "invoiceMoney",
					    width: 100,
						align: "center"
					},
					{
					    title: "发票编码",
					    key: "invoiceNumber",
					    width: 100,
						align: "center"
					},
					{
					    title: "备注",
					    key: "remark",
					    width: 180,
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
					stateId:[7,8],
                    pageSize:10,
					pageNo:1
                },
                form_up:{
                    updateBy:'',
                    createTime:'',
                    department:'',
                    userId:''
                },
				residueMoney1:0,   //剩余应付款金额
				residueMoney2:0    //剩余已收款金额
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
			nuMinput(v,max){
				if(isNaN(v)){
					this.$Message.error("只能输入数字");
					return;
				}
				if(max){
					if(v > max){
						this.$Message.error("只能输入小于"+max+"的数");
						return;
					}
				}
				if(String(v).indexOf(".") > -1){
					if(v.toString().split(".")[1].length > 2){
						this.$Message.error("只能输入到小数点后两位");
					}
				}
			},
            handleError(error, file, fileList) {
                this.$Message.error(error.toString());
            },
            beforeUpload() {
                // if (!this.$route.meta.permTypes.includes("upload")) {
                //     this.$Message.error("此处您没有上传权限(为演示功能，该按钮未配置隐藏)");
                //     return false;
                // }
                return true;
            },
			selectDateRange(v) {
			  if (v) {
				this.searchForm.startDate = v[0];
				this.searchForm.endDate = v[1];
			  }
			},
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: "文件大小过大",
                    desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
                });
            },
			//新建履行计划中的确定
			newPlanConfirm(){
				this.newPlanModelForm.factmoney = this.numberReplase(this.newPlanModelForm.factmoney);
				this.newPlanModelForm.proportion = this.numberReplase(this.newPlanModelForm.proportion);
				if(!this.newPlanModelForm.task){
					this.$Message.error("合同约定任务");
					return;
				}
				if(!this.newPlanModelForm.factmoney){
					this.$Message.error("收付款金额(万元)");
					return;
				}
				if(!this.newPlanModelForm.counterpartId){
					this.$Message.error("相对方没有填写");
					return;
				}
				if(this.moneyVerify(this.data2,this.newPlanModelForm.factmoney,'收付款金额超过了合同金额',2)){
					return;
				}
				if(!this.newPlanModelForm.proportion){
					this.$Message.error("所占比例");
					return;
				}
				if(!this.newPlanModelForm.startplaytime){
					this.$Message.error("计划开始日期没有填写");
					return;
				}
				if(!this.newPlanModelForm.endplaytime){
					this.$Message.error("计划结束日期没有填写");
					return;
				}
				if(!this.newPlanModelForm.content){
					this.$Message.error("履行内容没有填写");
					return;
				}
				// this.newPlanModelForm.contractId = this.cancellationForm.contractId;
				this.newPlanModelForm.isuse = 2;
				this.btnLoading2 = true;
				if(!this.newPlanModelForm.id){
					performNewBuild(this.newPlanModelForm).then(res =>{
						if(res.result == "success"){
							this.newPlanModel = false;
							performPlanDel({contractId:this.newPlanModelForm.contractId}).then(res => {
								this.data2 = res.data;
							});
						}
						this.btnLoading2 = false;
					})
				}else{
					if(this.newPlanModelForm.contractPlayMoneyInfos.length == 0){
						delete this.newPlanModelForm.contractPlayMoneyInfos;
					}
					performPlanUpdate(this.newPlanModelForm).then(res =>{
						if(res.result == "success"){
							this.newPlanModel = false;
							performPlanDel({contractId:this.newPlanModelForm.contractId}).then(res => {
								this.data2 = res.data;
							});
						}
						this.btnLoading2 = false;
					})
				}
			},
			//确定履行计划
			planConfirm(){
				if(this.type == 1){
					this.btnLoading = true;
					performPlanConfirm({
						id:this.cancellationForm.id,
						stateId:8
					}).then(res => {
						if(res.result == "success"){
							this.modalVisible = false;
							this.getDataList();
						}
						this.btnLoading = false;
					})
				}else if(this.type == 2){
					if(!this.finishForm.time){
						this.$Message.error("终止日期没有填写");
						return;
					}
					if(!this.finishForm.explain){
						this.$Message.error("终止说明没有填写");
						return;
					}
					this.finishForm.type = 10;
					this.btnLoading = true;
					performPlanFinish(this.finishForm).then(res=>{
						console.log(res);
						this.getDataList();
						this.btnLoading = false;
					})
					
				}else if(this.type == 3){
					if(!this.finishForm.time){
						this.$Message.error("结束日期没有填写");
						return;
					}
					if(!this.finishForm.explain){
						this.$Message.error("结束说明没有填写");
						return;
					}
					this.finishForm.type = 11;
					this.btnLoading = true;
					performPlanFinish(this.finishForm).then(res=>{
						this.getDataList();
						this.btnLoading = false;
					})
				}
				this.modalVisible = false;
			},
            handleSuccess(res, file) {
                if (res.message === "success") {
                    this.$Message.success("上传文件 " + file.name + " 成功");
					this.finishForm.Url = res.result.url;
					this.finishForm.UrlName = res.result.name;
                } else {
                    this.$Message.error("上传失败");
                }
            },
            init() {
                this.accessToken = {
					access_token: this.getStore("accessToken"),
					Authorization: 'Bearer '+ this.getStore("accessToken")
				};
				// 获取表单数据
                fromUp().then(res => {
                    this.form_up.updateBy = res.updateBy;
                    this.form_up.createTime = res.createTime;
                    this.form_up.department = res.department;
                    this.form_up.userName = res.nickName;
                    this.form_up.userId = res.userId;
                });
                this.getDataList();
            },
			//履行计划确认中的履行计划添加this.cancellationForm
			planAdd(){
				if(this.moneyVerify(this.data2,this.cancellationForm.money,"履行计划的收付款金额总数必须小于等于合同金额",1)){
					return
				};
				detailList({id:this.cancellationForm.id}).then(res => {
					this.newPlanModelForm = {
						id:"",
						task:"",            
						issatisfypay:0,  
						paytype:res.contract.istopay,  
						factmoney:res.contract.money,      
						proportion:"",     
						startplaytime:res.contract.starttime,   
						endplaytime:res.contract.endtime,
						content:"",   
						remark:"",       
						contractId:this.cancellationForm.id,       
						isuse:""
					}
					this.residueMoney1 = 0;
					this.newPlanModel = true;
					this.newPlan = 2;
				})
				payRelativeList({contractId:this.cancellationForm.id}).then(res => {
					if(res.result == "success"){
						this.newPlanRelativeList = res.data;
					}
				})
			},
			//金额验证
			moneyVerify(array,money,tip,type){
				let sum = 0;
				array.forEach(ele => {
					sum += Number(ele.factmoney);
				});
				if(type == 1){
					console.log(sum,money);
					if(sum >= money){
						this.$Message.error(tip);
						return true;
					}else{
						return false;
					}
				}else if(type == 2){
					console.log(Number(sum),Number(this.residueMoney1),Number(money));
					if(Number(sum) - Number(this.residueMoney1) + Number(money) > Number(this.cancellationForm.money)){
						this.$Message.error(tip);
						return true;
					}else{
						return false;
					}
				}
			},
			//转换数字
			numberReplase(num){
				if(num){
					if(isNaN(num)){
						this.$Message.error("数值项只能输入数值");
						return
					}
					if(String(num).indexOf(".") > -1){
						if(num.toString().split(".")[1].length > 2){
							this.$Message.error("数值项只能输入到小数点后两位");
							return;
						}
					}
					if(String(num).indexOf(".") == -1){
						num = num+""+ ".00";
					}else if(String(num).indexOf(".") > -1){
						if(num.toString().split(".")[1].length == 1){
							num = num+"" + "0";
						}
					}
					return num;
				}
			},
			//重新编辑履行计划
			edit(v){
				Object.keys(v).forEach(function(key){
					if(v[key] === null){
						v[key] = "";
					}
				});
				this.residueMoney1 = v.factmoney;
				this.newPlanModelForm = v;
				this.newPlanModel = true;
				this.newPlan == 1;
			},
			//反馈中的反馈意见
			feedbackAdd(v){
				this.residueMoney1 = 0;
				this.data4 = v.contractPlayMoneyInfos;
				this.data4.forEach(ele => {
					ele.factmoney = ele.factMoney;
				});
				console.log(this.data4);
				if(this.moneyVerify(this.data4,v.factmoney,"反馈总金额不能大于合同金额",1)){
					return
				};
				this.feedbackModel = true;
				this.$refs["feedbackModelForm"].resetFields();
				this.feedbackModelForm = {
					id:v.id,
					factMoney:"",
					factpayTime:"",
					invoiceTime:"",
					invoiceMoney:"",
					invoiceNumber:"",
					remark:"",
					contractPlayId:v.id,
					isDone:0
				}
			},
			//查看反馈信息
			feedbackSee(v){
				this.feedbackModelSee = true;
				this.data4 = v.contractPlayMoneyInfos
			},
            remove(v) {
				this.$Modal.confirm({
				    title: "确认删除",
				    content: "您确认要删除 " + v.task + " ?",
				    onOk: () => {
				        // 删除
				        performPlanUpdate({ id: v.id,isuse:3 }).then(res => {
				            this.$Message.success("操作成功");
				            performPlanDel({contractId:this.newPlanModelForm.contractId}).then(res => {
				            	this.data2 = res.data;
				            });
							this.getDataList();
				        });
				    }
				});
            },
			//确认履行
            confirm(v) {
				this.type = 1;
				this.modalVisible = true;
				this.cancellationForm = v;
				this.cancellationForm.department = this.form_up.department;
				this.cancellationForm.userName = this.form_up.userName;
				if(v.starttime){
					this.cancellationForm.time = v.starttime+"至"+v.endtime;
				}
				performPlanDel({contractId:v.id}).then(res => {
					this.data2 = res.data;
				});
				payRelativeList({contractId:this.cancellationForm.id}).then(res => {
					if(res.result == "success"){
						this.newPlanRelativeList = res.data;
					}
				})
            },
			//履行计划终止finishForm
			termination(v){
				this.$nextTick(() => {
					 this.$refs["finishForm"].resetFields(); 
				 });
				this.modalVisible = true;
				this.type = 2;
				
				this.cancellationForm = {
					name:v.name,
					time:"",
					number:v.number,
					money:v.money,
					department:this.form_up.department,
					userName: this.form_up.userName,
					contractId:v.id
				}
				this.finishForm={
					id:"",
					time:"",             
					explain:"",         
					remark:"",      
					Url:"",           
					UrlName:"",     
					contractId:v.id,      
				}
				if(v.starttime){
					this.cancellationForm.time = v.starttime+"至"+v.endtime;
				}
			},
			finish(v){
				this.modalVisible = true;
				this.type = 3;
				this.cancellationForm = {
					name:v.name,
					time:"",
					number:v.number,
					money:v.money,
					department:this.form_up.department,
					userName: this.form_up.userName,
					contractId:v.id
				}
				this.finishForm={
					id:"",
					time:"",             
					explain:"",         
					remark:"",      
					Url:"",           
					UrlName:"",     
					contractId:v.id,      
				}
				if(v.starttime){
					this.cancellationForm.time = v.starttime+"至"+v.endtime;
				}
			},
			feedback(v){
				this.modalVisible = true;
				this.type = 4;
				this.cancellationForm = {
					name:v.name,
					time:"",
					number:v.number,
					money:v.money,
					department:this.form_up.department,
					userName: this.form_up.userName,
					contractId:v.id
				}
				if(v.starttime){
					this.cancellationForm.time = v.starttime+"至"+v.endtime;
				}
				performPlanDel({contractId:v.id}).then(res => {
					this.data3 = res.data;
					console.log(res);
				});
			},
			//新建履行计划反馈中的提交
			newFeedbackConfirm(){
				if(!this.feedbackModelForm.factMoney){
					this.$Message.error("实际收付款金额没有选择");
					return;
				}
				if(isNaN(this.feedbackModelForm.invoiceMoney)){
					this.$Message.error("实际收付款金额必须为数值");
					return;
				}
				if(!this.feedbackModelForm.factpayTime){
					this.$Message.error("实际付款时间没有选择");
					return;
				}
				if(!this.feedbackModelForm.invoiceTime){
					this.$Message.error("开票时间没有选择");
					return;
				}
				if(!this.feedbackModelForm.invoiceMoney){
					this.$Message.error("开票金额没有选择");
					return;
				}
				if(this.feedbackModelForm.isDone==2){
					this.$Message.error("履行计划是否完成没有选择");
					return;
				}
				this.btnLoading3 = true;
				feedbackConfirm(this.feedbackModelForm).then(res =>{
					if(res.result == "success"){
						this.feedbackModel = false;
						performPlanDel({contractId:this.cancellationForm.contractId}).then(res => {
							this.data3 = res.data;
						});
					}
					this.btnLoading3 = false;
				})
			},
			//作废中的提交signCancelUpdate
            handelSubmitDict(){
				this.cancellationForm.isuse = 1;
				console.log(this.removeUpdate)
				if(this.removeUpdate == 0){
					signCancel(this.cancellationForm).then(res => {
					    this.modalVisible = false
						this.getDataList();
					});
				}else{
					signCancelUpdate(this.cancellationForm).then(res => {
					    this.modalVisible = false
						this.getDataList();
					});
				}
				
                
				console.log(this.cancellationForm);
            },
			//作废中的保存
			handelSubmitSave(){
				this.cancellationForm.isuse = 0;
				if(this.removeUpdate == 0){
					signCancel(this.cancellationForm).then(res => {
					    this.modalVisible = false
						this.getDataList();
					});
				}else{
					signCancelUpdate(this.cancellationForm).then(res => {
					    this.modalVisible = false
						this.getDataList();
					});
				}
				console.log(this.cancellationForm);
			},
			//签署中的提交
			handelSubmitRelative(){
				this.signForm.isuse = 1;
			    signAture(this.signForm).then(res => {
			        this.modalSign = false
					this.getDataList();
			    });
				console.log(this.signForm);
			},
			//签署中的保存
			handelSaveRelative(){
				this.signForm.isuse = 0;
				signAture(this.signForm).then(res => {
				    this.modalSign = false
					this.getDataList();
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
			changeSort2(e) {
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
			showSelect2(e) {
			    this.selectList = e;
			    this.selectCount = e.length;
			},
            changePage(v) {
                this.searchForm.pageNo = v;
                this.getUserList();
                this.clearSelectAll();
            },
			changePage2(v) {
			    this.searchForm.pageNo = v;
			    this.getUserList();
			    this.clearSelectAll();
			},
            changePageSize(v) {
                this.searchForm.pageSize = v;
                this.getUserList();
            },
			changePageSize2(v) {
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
            },
			//查看详情
			see(v){
				let query = { type: 1, id: v.id, backRoute: this.$route.name };
				this.$router.push({
				    name: "detail",
				    query: query
				}); 
			},
        },
        mounted() {
            this.init();
        },
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name == "perform"){
					this.init();
				}
			}
		}
    };
</script>