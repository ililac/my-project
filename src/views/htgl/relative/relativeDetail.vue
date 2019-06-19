<style lang="less" scoped>
	@import "../detail/detail.less";
</style>

<template>
	<div class="detail">
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg search">
				<Col :span="24">
					<Row>
						<Form ref="detailForm" :model="detailForm" :label-width="120">
							<div class="ul">
								<FormItem label="相对方类型:" class="lef" prop="counterpartName">
									<p>{{detailForm.counterpartNatureId}}</p> 
								</FormItem>
								<FormItem label="相对方编号:" class="lef" prop="counterpartName">
									<p>{{detailForm.counterpartNumber}}</p>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="相对方名称:" class="lef" prop="counterpartName">
									<p>{{detailForm.counterpartName}}</p>
								</FormItem>
								<FormItem label="企业类型:" class="lef"  v-show="detailForm.counterpartNatureId=='企业'" prop="enterpriseId">
									<p>{{detailForm.enterpriseName}}</p>
								</FormItem>
								<FormItem label="身份证号:" v-show="detailForm.counterpartNatureId=='自然人'" class="lef code">
								<p>{{detailForm.creditCode}}</p>
         					 		</FormItem>
							</div>
							<div class="ul">
								<FormItem label="联系地址:" v-show="detailForm.counterpartNatureId=='自然人'" class="lef">
								<p>{{detailForm.officeAddress}}</p>
         						 </FormItem>
								<FormItem label="统一社会信用代码:" v-show="detailForm.counterpartNatureId=='企业'" class="lef">
									<p>{{detailForm.creditCode}}</p>
								</FormItem>
								<FormItem label="资质证书:">
									<p>{{detailForm.qualificationInfoName}}</p>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="成立时间:" class="lef"  v-show="detailForm.counterpartNatureId=='企业'" prop="estiblishTime">
									<p>{{detailForm.registerDate}}</p>
								</FormItem>
								<FormItem label="注册资本:" class="lef"  v-show="detailForm.counterpartNatureId=='企业'" prop="regCapital">
									<p>{{detailForm.registerCapital}}</p>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="法定代表人:"  v-show="detailForm.counterpartNatureId!=='自然人'" class="lef">
									<p>{{detailForm.legalPersonName}}</p>
								</FormItem>
								<FormItem label="办公地址:"  v-show="detailForm.counterpartNatureId!=='自然人'" class="lef">
									<p>{{detailForm.officeAddress}}</p>
								</FormItem>
								
							</div>
							<div class="ul">
								<FormItem label="开户行:" class="lef">
									<p>{{detailForm.bankAccount}}</p>
								</FormItem>
								<FormItem label="银行账号:" class="lef">
									<p>{{detailForm.bankAccount}}</p>
								</FormItem>
							</div>
							<div class="ul txtar">
								<FormItem label="经营范围:"  v-if="detailForm.counterpartNatureId=='企业'">
									<p>{{detailForm.comment}}</p>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="创建人" class="lef" >
									<p>{{detailForm.updateBy}}</p>
								</FormItem>
								<FormItem label="创建时间" class="lef" v-show="detailForm.createTime">
									<p>{{detailForm.createTime}}</p>
								</FormItem>
								<FormItem label="创建机构" class="lef">
									<p>{{detailForm.departmentTitle}}</p>
								</FormItem>
							</div>	
							<div class="ul" style="margin-bottom: 20px;">
								<!-- <span style="margin-right: 10px;">股东信息</span> -->
								<Menu mode="horizontal" active-name="1" @on-select="navSelect">
									<MenuItem name="1">
										联系人信息
									</MenuItem>
									<MenuItem name="2">
										股东信息
									</MenuItem>
									<!-- <MenuItem name="3">
										行政处罚
									</MenuItem>
									<MenuItem name="4">
										开庭公告
									</MenuItem> -->
									<MenuItem name="5">
										案件信息
									</MenuItem>
								</Menu>
							</div>
							<div class="clear" v-show="detailList == 1">
								<Table border :columns="link" :data="detailForm.linkMans" sortable="custom" ref="table"></Table>
								<Row type="flex" justify="end" class="page">
									<Page :total="detailForm.linkTotal" show-total  :page-size="10" @on-change="pageChange"/>
								</Row>
							</div>
							<div class="clear" v-show="detailList == 2">
								<Table border :columns="stockholders" :data="detailForm.stockholdersList" sortable="custom2" ref="table2"></Table>
								<Row type="flex" justify="end" class="page">
									<Page :total="detailForm.stockholdersTotal" show-total  :page-size="10" @on-change="pageChange"/>
								</Row>
							</div>
							<div class="clear" v-show="detailList == 3">
								<Table border :columns="administrative" :data="detailForm.punishmentInfos" sortable="custom3" ref="table3"></Table>
								<Row type="flex" justify="end" class="page">
									<Page :total="detailForm.administrativeTotal" show-total :page-size="10" @on-change="pageChange"/>
								</Row>
							</div>
							<div class="clear" v-show="detailList == 4">
								<Table border :columns="notice" :data="detailForm.ktannouncements" sortable="custom4" ref="table4"></Table>
								<Row type="flex" justify="end" class="page">
									<Page :total="detailForm.noticeTotal" show-total :page-size="10" @on-change="pageChange"/>
								</Row>
							</div>
							<div class="clear" v-show="detailList == 5">
								<Table border :columns="promises" :data="promisesDate" sortable="custom5" ref="table5"></Table>
								<Row type="flex" justify="end" class="page">
									<Page :total="promisesTotal" show-total :page-size="10" @on-change="pageChange"/>
								</Row>
							</div>
						    <div style="clear: both;"></div>
						</Form>
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
    	fromUp ,
		caseDetail,
		modelRelativeDetail
    } from "@/api/index";
    import circleLoading from "../../my-components/circle-loading.vue";
    export default {
        name: "relativeDetail",
        components: {
            circleLoading
        },
        data() {
            return {
            	upId:'',
                accessToken: {}, // 上传token鉴权
				detailForm:{},
				type:"",
				backRoute:"",
				fildDownUrl:"",
				detailList:1, //默认展示联系人
				procDefId:"",
                loading: false, // 表格加载状态
                form_up:{
                    createTime:'',
                    department:'',
                    mobile:'',
                    userId:'',
                    userName:''
                },
				linkList:[], //联系人数据
				stockholdersList:[], //股东信息数据
				administrativeList:[], //行政处罚数据
				noticeList:[], //开庭公告数据
				//联系人
				link: [
				    // 表头
				    {
				        title: "联系人姓名",
				        key: "name",
				        align: "center"
				    },
				    {
				        title: "部门及职位",
				        key: "department",
				        align: "center"
				    },
				    {
				        title: "联系电话",
				        key: "phone",
				        align: "center"
				    }
				],
				//股东信息
				stockholders: [
				    // 表头
				    {
				        title: "股东",
				        key: "name",
				        align: "center"
				    },
				    {
				        title: "出资比例",
				        key: "ratio",
				        align: "center"
				    },
				    {
				        title: "认缴出资额",
				        key: "amomon",
				        align: "center"
				    },
				    {
				        title: "认缴出资日期",
				        key: "time",
				        width: 230,
				        align: "center"
				    }
				],
				//行政处罚
				administrative: [
				    // 表头
				    {
				        title: "决定日期",
				        key: "decisionDate",
				        align: "center"
				    },
				    {
				        title: "决定书文号",
				        key: "punishNumber",
				        align: "center"
				    },
				    {
				        title: "处罚类型",
				        key: "counterpartId",
				        align: "center"
				    },
					{
					    title: "处罚内容",
					    key: "content",
					    align: "center"
					},
					{
					    title: "决定机关",
					    key: "departmentName",
					    align: "center"
					},
				],
				//开庭公告
				notice: [
				    // 表头
				    {
				        title: "开庭日期",
				        key: "startDate",
				        align: "center"
				    },
				    {
				        title: "案由",
				        key: "caseReason",
				        align: "center"
				    },
				    {
				        title: "案号",
				        key: "caseNo",
				        align: "center"
				    },
					{
					    title: "原告/上诉人",
					    key: "plaintiff",
					    align: "center"
					},
					{
					    title: "被告/被上诉人",
					    key: "defendant",
					    align: "center"
					},
				],
				//失信信息
				promises:[
					{
					    title: "序号",
					    type: "index",
						width: 60,
					    align: "center"
					},
					{
					    title: "案件名称",
					    key: "Title",
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
						      params.row.Title
						    )
						  ]);
						}
					},
					{
					    title: "案号",
					    key: "CaseFlag",
					    align: "center"
					},
					{
					    title: "审理程序",
					    key: "TrialStep",
						width: 100,
					    align: "center"
					},
					{
					    title: "审结日期",
					    key: "LastInstanceDate",
						width: 120,
					    align: "center"
					}
				],
				promisesDate:[],  //案件信息
				promisesTotal:0,   //案件信息总数
				caseForm:{
					pageNumber:1,
					pageSize:10,
					organizationParty:""
				},
            };
        },
        methods: {
        	getUpId(id){
				this.upId = id
        	},
			navSelect(v){
				this.detailList = v;
				if(v == 5){
					if(this.detailForm.counterpartName){
						this.caseForm.organizationParty = this.detailForm.counterpartName;
						caseDetail(this.caseForm).then(res => {
							if(res.success == "true"){
								this.promisesDate = res.data;
								this.promisesTotal = parseInt(res.count);
							}
						});
					}
				}
			},
			//页码改变
			pageChange(v){
				if(this.detailList == 5){
					if(this.detailForm.counterpartName){
						this.caseForm.pageNumber = v;
						this.caseForm.organizationParty = this.detailForm.counterpartName;
						caseDetail(this.caseForm).then(res => {
							if(res.success == "true"){
								this.promisesDate = res.data;
								this.promisesTotal = parseInt(res.count);
							}
						});
					}
				}
			},
            init() {
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
				if(this.$route.query.id){
					// 获取表单数据
					fromUp().then(res => {
					        this.form_up.createTime = res.createTime;
					        this.form_up.department = res.department;
					        this.form_up.mobile = res.mobile;
					        this.form_up.userId = res.userId;
					        this.form_up.userName = res.nickName;
					});
					this.type = this.$route.query.type;
					this.backRoute = this.$route.query.backRoute;
					this.procDefId = this.$route.query.id;
					if(this.procDefId){
						modelRelativeDetail({id:this.procDefId,type:this.type}).then(res=>{
							if(res.success){
								this.detailForm = res.result.counterpartDetail;
								this.detailForm.punishmentInfos = res.result.punishmentInfos.punishmentInfos;
								this.detailForm.administrativeTotal = res.result.punishmentInfos.total;
								this.detailForm.linkMans = res.result.linkMans.linkMans;
								this.detailForm.linkTotal = res.result.linkMans.total;
								this.detailForm.ktannouncements = res.result.ktannouncements.ktannouncements;
								this.detailForm.noticeTotal = res.result.ktannouncements.total;
								this.detailForm.stockholdersList = res.result.stockholdersList.stockholdersList;
								this.detailForm.stockholdersTotal = res.result.stockholdersList.total;
							}
						});
					}else{
						this.editClick = false;
					}
				}
            },
			close(){
				this.closeCurrentPage();
			},
			closeCurrentPage() {
			  this.$store.commit("removeTag", "relativeDetail");
			  localStorage.pageOpenedList = JSON.stringify(
			    this.$store.state.app.pageOpenedList
			  );
			  this.$router.push({
			    name: this.backRoute
			  });
			}
        },
        mounted() {
            this.init();
        },
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name == "relativeDetail"){
					this.init();
				}
			}
		}
    };
</script>