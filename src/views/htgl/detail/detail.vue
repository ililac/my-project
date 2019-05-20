<style lang="less">
	@import "./detail.less";
	.file-info {
  border-left: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
  margin-top: 20px;
  margin-left: 20px;
  width: 800px;
}
.file-info td {
  border-right: 1px solid #e8eaec;
  text-align: left;
  height: 48px;
  box-sizing: border-box;
  text-align: left;
  text-overflow: ellipsis;
  vertical-align: middle;
  border-bottom: 1px solid #e8eaec;
  padding-left: 50px;
}
.file-info td span.lf {
  color: #ed4014;
  margin-right: 5px;
}
</style>

<template>
	<div class="detail">
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg search">
				<Col :span="24">
					<Row>
							<Menu mode="horizontal" active-name="1" @on-select="navSelect">
								<MenuItem name="1">
									基本信息
								</MenuItem>
								<MenuItem name="2" v-show="detailForm.stateid > 1">
									审批信息
								</MenuItem>
								<MenuItem name="3" v-show="detailForm.stateid > 5">
									用印信息
								</MenuItem>
								<MenuItem name="4" v-show="detailForm.stateid > 6">
									签订信息
								</MenuItem>
								<MenuItem name="5" v-show="detailForm.stateid > 7">
									履行信息
								</MenuItem>
								<MenuItem name="6" v-show="detailForm.stateid > 8">
									异常信息
								</MenuItem>
								<MenuItem name="7" v-show="detailForm.stateid > 11">
									归档信息
								</MenuItem>
							</Menu>
							<div v-show="detailShow == 1">
								<Form :label-width="140">
									<div v-for="item in alterationFormList">
										<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">变更信息</p>
										<div class="ul">
											<FormItem label="变更原因" class="lef">
												<span>{{item.changeReason}}</span>
											</FormItem>
											<FormItem label="变更时间" class="lef">
												<span>{{item.changeTime}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="变更内容">
												<span>{{item.changeContent}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="操作人" class="lef">
												<span>{{item.createBy}}</span>
											</FormItem>
											<FormItem label="操作时间" class="lef">
												<span>{{item.createTime}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="操作机构">
												<span>{{item.createDepart}}</span>
											</FormItem>
										</div>
										<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">基本信息</p>
										<div class="ul">
											<FormItem label="原合同名称" class="lef">
												<span><a :href="'/xboot/draft/download?fileName='+item.originalContractName+'&url='+item.originalContractUrl+'&accessToken='+accessToken.accessToken">{{item.originalContractName}}</a></span>
											</FormItem>
											<FormItem label="新合同编号" class="lef">
												<span>{{item.changeContractSystenNum}}</span>
											</FormItem>
										</div>
									</div>
								</Form>
								<basic-form :formData.sync="detailForm" :fileDown.sync="fileDownUrl" :sourceType.sync="source"></basic-form>
								<div style="clear: both;">
									<div class="line"></div>
									<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">从合同列表</p>
									<Table border :columns="basic" :data="detailForm.childContractList" sortable="custom" ref="table"></Table>
								</div>
							</div>
							<div v-show="detailShow == 2">
								<Table border :columns="examine" :data="examineList" sortable="custom" ref="table"></Table>
							</div>
							<div v-show="detailShow == 3">
								<Form ref="printForm" :model="printForm" :label-width="140">
									<div class="ul">
										<FormItem label="用印份数" class="lef">
											<span>{{printForm.totalnum}}</span>
										</FormItem>
										<FormItem label="用章类型" class="lef">
											<span>{{printForm.chapter==1?"校章":"合同章"}}</span>
										</FormItem>
									</div>
									<div class="ul">
										<FormItem label="用印人" class="lef">
											<span>{{printForm.imprint}}</span>
										</FormItem>
										<FormItem label="用印时间" class="lef">
											<span>{{printForm.printTime}}</span>
										</FormItem>
									</div>
									<div class="ul">
										<FormItem label="所在机构" class="lef">
											<span>{{printForm.draftsoutfit}}</span>
										</FormItem>
									</div>
									<div class="ul">
										<FormItem label="备注">
											<span>{{printForm.printRemark}}</span>
										</FormItem>
									</div>
								</Form>
							</div>
							<div v-show="detailShow == 4">
								<Form ref="signForm" :model="signForm" :label-width="140">
									<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">我方签署情况</p>
									<div class="ul">
										<FormItem label="签约时间:" class="lef">
											<span>{{signForm.oursigntime}}</span>
										</FormItem>
										<FormItem label="签约金额（万元）:" class="lef">
											<span>{{signForm.oursignmoney}}</span>
										</FormItem>
										<FormItem label="签约人：" class="lef">
											<span>{{signForm.oursignman}}</span>
										</FormItem>
										<FormItem label="签约地点：" class="lef">
											<span>{{signForm.oursignlocal}}</span>
										</FormItem>
										<FormItem label="签约人职务：" class="lef">
											<span>{{signForm.oursignjob}}</span>
										</FormItem>
										<FormItem label="我方履行部门负责人：" class="lef">
											<span>{{signForm.ourfulfilman}}</span>
										</FormItem>
									</div>
									<div v-for="(item,index) in signForm.counterpartSignList">
										<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">相对方{{index+1}}签署情况</p>
										<div class="ul">
											<FormItem label="相对方名称：" class="lef">
												<span>{{item.counterpartName}}</span>
											</FormItem>
											<FormItem label="签约时间：" class="lef">
												<span>{{item.signTime}}</span>
											</FormItem>
											<FormItem label="签约人：" class="lef">
												<span>{{item.signPerson}}</span>
											</FormItem>
											<FormItem label="是否授权：" class="lef">
												<span>{{item.authorizeValue}}</span>
											</FormItem>
											<FormItem label="授权委托书：" class="lef">
												<p v-show="item.fileDownUrl2"><a v-bind:href="item.fileDownUrl2">{{item.authorizeFileName}}</a></p>
											</FormItem>
										</div>
									</div>
									<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">合同生效信息</p>
									<div class="ul">
										<FormItem label="合同生效日期：" class="lef">
											<span>{{signForm.contracteffectivetime}}</span>
										</FormItem>
										<FormItem label=" 合同正文（扫描件）" class="lef">
											<p><a v-show="signForm.contractContentUrl" :href="'/xboot/draft/download?fileName='+signForm.contractContentname+'&url='+signForm.contractContentUrl+'&accessToken='+accessToken.accessToken">{{signForm.contractContentname}}</a></p>
										</FormItem>
									</div>
								</Form>
							</div>
							<div v-show="detailShow == 5">
								<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">履行计划</p>
								<Table border :highlight-row="true" :columns="template" :data="templateList" sortable="custom" ref="table"></Table>
								<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">履行反馈</p>
								<Table border :columns="template2" :data="templateList2" sortable="custom" ref="table"></Table>
								<Row type="flex" justify="end" class="page">
									<Page :total="feedbackTotal" show-total :page-size="5" @on-change="pageChange"/>
								</Row>
							</div>
							<div v-show="detailShow == 6">
								<p style="color: #333;font-size: 16px;line-height: 50px;height: 50px;font-weight: 600;">{{detailForm.stateid==9?"变更信息":"解除信息"}}</p>
								<Form :label-width="140">
									<div v-if="detailForm.stateid==9" v-for="item in alterationFormList2">
										<div class="ul">
											<FormItem label="变更原因" class="lef">
												<span>{{item.changeReason}}</span>
											</FormItem>
											<FormItem label="变更时间" class="lef">
												<span>{{item.changeTime}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="变更内容">
												<span>{{item.changeContent}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="新合同名称" class="lef">
												<span><a :href="'/xboot/draft/download?fileName='+item.changeContractName+'&url='+item.changeContractUrl+'&accessToken='+accessToken.accessToken">{{item.changeContractName}}</a></span>
											</FormItem>
											<FormItem label="新合同编号" class="lef">
												<span>{{item.changeContractSystenNum}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="操作人" class="lef">
												<span>{{item.createBy}}</span>
											</FormItem>
											<FormItem label="操作时间" class="lef">
												<span>{{item.createTime}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="操作机构">
												<span>{{item.createDepart}}</span>
											</FormItem>
										</div>
									</div>
									<div v-else="detailForm.stateid == 9" v-for="item in unusualFormList">
										<div class="ul">
											<FormItem label="解除原因" class="lef">
												<span>{{item.releaseReason}}</span>
											</FormItem>
											<FormItem label="解除时间" class="lef">
												<span>{{item.releaseTime}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="备注">
												<span>{{item.releaseRemark}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="操作人" class="lef">
												<span>{{item.createBy}}</span>
											</FormItem>
											<FormItem label="操作时间" class="lef">
												<span>{{item.createTime}}</span>
											</FormItem>
										</div>
										<div class="ul">
											<FormItem label="操作机构">
												<span>{{item.createDepart}}</span>
											</FormItem>
										</div>
									</div>
								</Form>
							</div>
							<div>
								<!-- 归档信息 -->
								<table v-show="detailShow == 7" class="file-info">
								<tr>
								  <td>档案编号：{{fileData.number}}</td>
								  <td>
									<span class="lf">*</span>
									档案保管时间：{{fileData.keepTime}}
								  </td>
								</tr>
								<tr>
								  <td colspan="2">
									<span class="lf">*</span>
									档案保管人：{{fileData.archivist}}
								  </td>
								</tr>
								<tr>
								  <td colspan="2">
									<p style="float:left">
									  <span class="lf">*</span>归档材料清单：
									</p>
									<CheckboxGroup style="float:left" v-model="materialsBill">
									  <Checkbox label="合同正文"></Checkbox>
									  <Checkbox label="合同相关附件"></Checkbox>
									  <Checkbox label="我方授权委托书"></Checkbox>
									  <Checkbox label="对方授权委托书"></Checkbox>
										  <Checkbox label="其他"></Checkbox>
										</CheckboxGroup>
									  </td>
									</tr>
									<tr>
									  <td colspan="2">
										<p style="float:left">相关附件：</p>
										<div style="float:left" class="file-list">
										  <p  v-for="item in fileData.archiveUrls" :key="item.id"><a :href="'/xboot/draft/download?fileName='+item.attachmentName+'&url='+item.attachmentUrl+'&accessToken='+accessToken.accessToken">{{item.attachmentName}}</a></p>
										</div>
									  </td>
									</tr>
									<tr>
									  <td>操作人：{{fileData.createUserId}}</td>
									  <td>操作时间：{{fileData.createTime}}</td>
									</tr>
									<tr>
									  <td colspan="2">操作机构：{{fileData.createUserDep}}</td>
									</tr>
								</table>
							</div>
							
						</Form>
						<div style="clear:both"></div>
					</Row>
					<row>
						<div style="padding-top: 30px;float: right;">
						    <Button type="primary" @click="close">关闭</Button>
						</div>
					</row>
				</Col>
			</Row>
		</Card>
	</div>
</template>

<script>
	import {
	  exportResource
	} from "@/api/activiti";
    import {
		detailList,
		performDetail,
		feedbackDetail,
		feedbackDetailAll,
		examineDetail,
		signDetail,
		getArchiveById,
		relieveDetail,
		alterationBeforeDetail,
		alterationAfterDetail,
		stampDetail
    } from "@/api/index";
    import circleLoading from "../../my-components/circle-loading.vue";
	import basicForm from "./basic.vue";
    export default {
        name: "contractEdit",
        components: {
            circleLoading,
			basicForm
        },
        data() {
            return {
				source:1,
                accessToken: {}, // 上传token鉴权
				detailForm:{},
				printForm:{},
				signForm:{},
				unusualFormList:[],  //异常信息合同
				alterationFormList:[],  //变更后新合同变更信息
				alterationFormList2:[],  //变更前合同的变更信息
				type:"",
				backRoute:"",
				procDefId:"",
				fileDownUrl:"",
                loading: false, // 表格加载状态
                data: [], //表单数据
                total: 0, // 表单数据总数
				detailShow:1, //默认显示的详情
				basicList:[],
				examineList:[],
				performList:[],
				signList:[],
				templateList:[],
				templateList2:[],
				feedbackTotal:1,   //履行反馈的总是
				feedbackId: "",    //当前的反馈信息的id
				basic: [
				    // 表头
					{
					    title: "序号",
					    type: "index",
					    width: 80,
					    align: "center"
					},
				    {
				        title: "合同名称",
				        key: "contractName",
				        align: "center"
				    },
				    {
				        title: "相对方",
				        key: "counterpartName",
				        align: "center"
				    },
				    {
				        title: "合同类型",
				        key: "contractType",
				        align: "center"
				    },
					{
					    title: "合同编号",
					    key: "contractNum",
					    align: "center"
					}
				],
				examine: [
				    // 表头
					{
					    title: "序号",
					    type: "index",
					    width: 80,
					    align: "center"
					},
				    {
				        title: "任务名称",
				        key: "name",
				        align: "center"
				    },
				    {
				        title: "处理人",
				        key: "assignee",
				        align: "center"
				    },
				    {
				        title: "审批操作",
				        key: "deleteReason",
				        align: "center"
				    },
					{
					    title: "审批意见",
					    key: "comment",
					    align: "center"
					},
					{
					    title: "完成时间",
					    key: "endTime",
					    align: "center"
					},
				],
				template:[
					{
						title: "合同约定任务",
						key: "task",
						align: "center"
					},
					{
						title: "收付款方式",
						// key: "paytype",
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
						title: "应收付金额（万元）",
						key: "actualmoney",
						align: "center"
					},
					{
						title: "所占比例（%）",
						key: "proportion",
						align: "center"
					},
					{
						title: "已收付金额（万元）",
						key: "factmoney",
						align: "center"
					},
					{
						title: "履行内容",
						key: "content",
						align: "center"
					},
					{
						title: "操作",
						key: "name",
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
						            "查看反馈"
						        )
						    ]);
						}
					},
				],
				template2:[
					{
					    title: "序号",
					    type: "index",
					    width: 80,
					    align: "center"
					},
					{
						title: "实际付款金额",
						key: "factMoney",
						align: "center"
					},
					{
						title: "实际付款时间",
						key: "factpayTime",
						align: "center"
					},
					{
						title: "开票日期",
						key: "invoiceTime",
						align: "center"
					},
					{
						title: "履行内容",
						key: "remark",
						align: "center"
					}
				],
      			fileData: {},materialsBill:[]
            };
        },
        methods: {
			navSelect(v){
				this.detailShow = v;
			},
            init() {
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
				this.type = this.$route.query.type;
				this.backRoute = this.$route.query.backRoute;
				this.procDefId = this.$route.query.id;
				detailList({id:this.procDefId}).then(res=>{
					if(res.result == "success"){
						this.detailForm = res.contract;
						if(res.contract.istopay == 0){
							this.detailForm.istopayName = "付款";
						}else if(res.contract.istopay == 1){
							this.detailForm.istopayName = "收款";
						}else if(res.contract.istopay == 2){
							this.detailForm.istopayName = "不涉及";
						}
						if(res.contract.source == 1){
							this.detailForm.sourceName = "自行起草";
						}else{
							this.detailForm.sourceName = "标准文本";
						}
						this.detailForm.counterpartList = res.counterpartList;
						this.detailForm.contractType = res.contractType;
						this.fileDownUrl = '/xboot/draft/download?fileName='+this.detailForm.contentname+'&url='+this.detailForm.contracturl+'&accessToken='+this.getStore("accessToken");
						this.detailForm.uploadList = [];
						this.detailForm.parentContractName = res.parentContractName;
						if(res.contract.attachmentname){
							let obj = {name:"",url:"",status: "finished",fileDownUrl:""};
							let arr = this.detailForm.attachmentname.split(',');
							let arr2 = this.detailForm.accessoryurl.split(',');
							for(let i = 0;i < arr.length;i++){
								obj.name = arr[i];
								obj.url = arr2[i];
								obj.fileDownUrl = '/xboot/draft/download?fileName='+arr[i]+'&url='+arr2[i]+'&accessToken='+this.getStore("accessToken");
								this.detailForm.uploadList.push(obj);
							}
						}
					}
				});
				performDetail(this.procDefId).then(res => {
					if(res.success == "true"){
						this.templateList = res.playData;
					}
				});
				stampDetail(this.procDefId).then(res => {
					if(res.success == "true"){
						this.printForm = res.data;
					}
				});
				examineDetail(this.procDefId).then(res => {
					if(res.success == "true"){
						this.examineList = res.data;
						console.log(this.examineList);
					}
				});
				signDetail({contractId:this.procDefId,isuse:1}).then(res => {
					if(res.success == "true"){
						if(!res.sign.id){
							this.signForm = {};
							return;
						}
						this.signForm = res.sign;
						let counterpartSignList = res.counterpartSignList;
						for(var i = 0;i < counterpartSignList.length;i++){
							if(counterpartSignList[i].authorizeFileUrl){
								counterpartSignList[i].fileDownUrl2 = "/xboot/draft/download?fileName="+res.counterpartSignList[i].authorizeFileName+"&url="+res.counterpartSignList[i].authorizeFileUrl+'&accessToken='+this.getStore("accessToken");
							}else{
								counterpartSignList[i].fileDownUrl2 = "";
							}
							if(counterpartSignList[i].authorizeFlag == 1){
								counterpartSignList[i].authorizeValue = "是";
							}else{
								counterpartSignList[i].authorizeValue = "否";
							}
						}
						this.signForm.counterpartSignList = counterpartSignList;
					}
				});
				relieveDetail({contractId:this.procDefId}).then(res => {
					this.unusualFormList = res.result;
				});
				alterationBeforeDetail({originalContractId:this.procDefId}).then(res => {
					this.alterationFormList2 = res.result;
				})
				alterationAfterDetail({changeContractId:this.procDefId}).then(res => {
					this.alterationFormList = res.result;
				})
				getArchiveById(this.procDefId).then(res => {
					if (res.success) {
								if (res.result.materialsBill) {
								this.materialsBill = res.result.materialsBill.split(',')
								}
								this.fileData = res.result
					}
				  });
				//查看所有的反馈信息
				feedbackDetailAll(this.procDefId,{pageNumber:1,pageSize:10}).then(res => {
					if(res.success == "true"){
						this.templateList2 = res.infoData;
						this.feedbackTotal = res.total;
					}
				})
            },
			close(){
				this.closeCurrentPage();
			},
			closeCurrentPage() {
			  this.$store.commit("removeTag", "detail");
			  localStorage.pageOpenedList = JSON.stringify(
			    this.$store.state.app.pageOpenedList
			  );
			  this.$router.push({
			    name: this.backRoute
			  });
			},
			//templateList2
			pageChange(v){
				this.feedbackList(this.feedbackId,v);
			},
			see(v){
				this.feedbackId = v.id;
				this.feedbackList(this.feedbackId,1);
			},
			//查看反馈信息列表
			feedbackList(id,page){
				feedbackDetail(id).then(res => {
					if(res.success == "true"){
						this.templateList2 = res.infoData;
						this.feedbackTotal = res.total;
					}
				})
			}
        },
        mounted() {
            this.init();
        },
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name == "detail"){
					this.init();
				}
			}
		}
    };
</script>