<style lang="less" scoped>
@import "../../htgl/detail/detail.less";
</style>
<template>
  <div class="detail">
    <Card>
      <Row type="flex" justify="space-between" class="code-row-bg search">
        <Col :span="24">
          <Row>
            <Col :span="18" class="screen">
              <Form ref="dictForm" :model="dictForm" :label-width="120">
                <div class="ul">
                  <FormItem label="合同来源" class="lef">
                    <p>{{dictForm.sourceName}}</p>
                  </FormItem>
                </div>
                <div class="ul">
                  <FormItem label="合同正文">
                    <p class="auditLef" v-show="fileDownUrl2">
                      <a v-bind:href="fileDownUrl2">{{dictForm.contentname}}</a>
                    </p>
                    <!-- <Button style="margin-left: 20px;" type="dashed" :loading="btnLoading6" @click="onlineEdit" icon="ios-create-outline" class="btnLi auditLef">
											<span v-if="!btnLoading6">在线编辑</span>
											<span v-else>打开中...</span>
										</Button> -->
										<Button style="margin-left: 20px;" type="dashed" :loading="btnLoading7" @click="brainpowerAudit" icon="ios-create-outline" class="btnLi auditLef">
											<span v-if="!btnLoading7">智能审核</span>
											<span v-else>打开中...</span>
										</Button>
										<Button style="margin-left: 20px;" type="dashed" :loading="btnLoading8" @click="fileCompare" icon="ios-create-outline">
											<span v-if="!btnLoading8">文本对比</span>
											<span v-else>打开中...</span>
										</Button>
									</FormItem>
								</div>
								<div class="ul">
									<FormItem label="合同名称" class="lef">
										<p>{{dictForm.name}}</p>
									</FormItem>
									<Form-item label="合同类型" class="lef">
										<p>{{dictForm.contractType}}</p>
									</Form-item>
								</div>
								<div class="ul" v-show="numberShow">
									<FormItem label="系统编号" class="lef">
										<p>{{dictForm.systemNumber}}</p>
									</FormItem>
									<FormItem label="合同编号" class="lef">
										<input v-show="numberShow2" type="text" v-model="dictForm.number" @blur.prevent ="numberInp(dictForm.number)"/>
										<p  v-show="!numberShow2">{{dictForm.number}}</p>
									</FormItem>
								</div>
								<div class="ul" v-for="(item,index) in dictForm.counterpartList" style="color: #515a6e;font-size: 14px;">
									<div class="lef">
										<label for="" style="text-align: right;width: 140px;display: inline-block;padding: 10px 12px 10px 0;">{{"相对方"+(index + 1)}}</label>
										<span>{{item.counterpartName}}</span>
									</div>
									<Form-item label="合同地位" class="lef">
										<span style="margin-right: 10px;">{{item.degree}}</span>
									</Form-item>
								</div>
								<div class="ul">
									<FormItem label="收付款方式" class="lef" prop="paytype">
										<p>{{istopayText}}</p>
									</FormItem>
									<FormItem label="合同额（万元）" class="lef">
										<p>{{dictForm.money}}</p>
									</FormItem>
								</div>
								<div class="ul">
									<FormItem label="开始日期" class="lef">
										<p>{{dictForm.starttime}}</p>
									</FormItem>
									<FormItem label="结束日期" class="lef">
										<p>{{dictForm.endtime}}</p>
									</FormItem>
								</div>
								<div class="ul">
									<!-- <FormItem label="用章类型" class="lef">
										<p>{{dictForm.chapter == 1?"校章":"合同章"}}</p>
									</FormItem> -->
									<FormItem label="合同份数" class="lef">
										<p>{{dictForm.totalnum}}</p>
									</FormItem>
										<FormItem label="关联主合同" class="lef">
										<p>{{dictForm.parentContractName}}</p>
									</FormItem>
								</div>
								<div class="ul txtar">
									<FormItem label="备注">
										<p>{{dictForm.description}}</p>
									</FormItem>
								</div>
								<div class="ul">
									<FormItem label="相关附件">
										<p v-for="item in dictForm.uploadList" class="auditLef" style="margin-right: 20px;"><a v-bind:href="item.fileDownUrl">{{item.name}}</a></p>
									</FormItem>
								</div>
								<div class="ul">
									<FormItem label="起草人" class="lef">
										<span>{{dictForm.draftsman}}</span>
									</FormItem>
									<FormItem label="起草时间" class="lef">
										<span>{{dictForm.draftstime}}</span>
									</FormItem>
								</div>
								<div class="ul">
									<FormItem label="起草机构" class="lef">
										<span>{{dictForm.draftsoutfit}}</span>
									</FormItem>
								</div>
							</Form>
						</Col>
						<Col :span="6" class="opinion">
							<div v-show="opinionShow">
								<p style="font-weight: 600;height: 60px;line-height: 60px;font-size: 12px;"><span style="color: red;">*</span>审批意见</p>
								<Input type="textarea" :maxlength="1000" :rows="5" style="width: 100%;" placeholder="请输入审批意见" v-model="opinion.comment" />
								<div style="clear: both;"></div>
									<p style="font-weight: 600;height: 60px;line-height: 60px;font-size: 12px;">相关附件</p>
								<Form>
									<FormItem>
										<Upload action="/zhfw/system/upload/file"
											:headers="accessToken"
											:on-success="handleSuccess"
											:on-error="handleError"
											:max-size="5120"
											:on-exceeded-size="handleMaxSize"
											:before-upload="beforeUpload"
											type="drag"
											:show-upload-list="false"
											ref="up"
										>
											<p id="fileName" class="upload">
                <Icon type="ios-cloud-upload-outline" size="20"/>
												点击上传</p>
										</Upload>
										<p style="color: #d3d3d3;">支持扩展名：doc,.docx文件大小：<=10MB</p>
										<p @click="fileDowm(opinion.fileName,opinion.fileAddress)" style="color: #2B85E4;cursor: pointer;">{{opinion.fileName}}</p>
									</FormItem>
								</Form>
								<div v-show="assigneeListShow">
									<p style="font-weight: 600;height: 60px;line-height: 60px;font-size: 12px;"><span style="color: red;">*</span>下一审批人</p>
									<Tag v-for="item in applyCount" closable @on-close="applyClose" :key="item.id">{{ item.nickName }}</Tag>
									<Button icon="ios-add" type="dashed" size="small" @click="applyAdd">选择审批人</Button>
								</div>
								<div class="ul" style="padding: 30px 0 10px;">
									<Button type="primary" @click="pass">通过</Button>
									<Button type="primary" @click="reject">返回修改</Button>
									<Button type="primary" @click="reject2">驳回</Button>
									<Button type="primary" @click="seeProcess">查看流程</Button>
								</div>
							</div>
							<p style="font-weight: 600;height: 30px;line-height: 30px;font-size: 12px;">历史审批意见</p>
							<div class="history" style="padding-bottom: 20px;">
								<div class="li" v-for="(item,i) in historyList" :key="i">
									<div class="icon"></div>
									<p class="tips"><span>{{item.name}}</span><span>{{item.assignee}}</span><span>{{item.createTime}}</span></p>
									<div class="cons" v-show="item.comment">审批意见:{{item.comment}}</div>
									<p v-show="item.fileName">相关附件: <span @click="fileDowm(item.fileName,item.fileAddress)" style="color: #1890FF;cursor: pointer;">{{item.fileName}}</span></p>
								</div>
							</div>
						</Col>
						<div style="clear: both;"></div>
					</Row>
					<div class="clear"></div>
					<row>
						<div style="padding-top: 30px;float: right;">
						    <Button type="primary" @click="close">关闭</Button>
						</div>
					</row>
				</Col>
			</Row>
		</Card>
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
		<Modal title="流程图" v-model="modalFlow" :mask-closable='false' :width="1000" class="modalFlow">
			<div class="pic">
				<img :src="imgUrl" alt="">
			</div>
			<div slot="footer">
				<Button type="primary" @click="modalFlow=false">关闭</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import  md5 from 'js-md5';
	import { myOpen } from "../../htgl/myOpen";
	import {
		fromUp ,
		getSystemId,
		detailList,
		personSelect,
		fileUpUrlAudit,
		contractNumber,
		wordEdit,
		applyBusiness,
		loadDepartment,
		contactNumberUpdate,
		examineShow,
		modelRelativeDetail,
		passExamine, //通过
		rejectExamine, //返回修改
		rejectExamine2, //驳回
		examinePerson, //被驳回的审批人
		historyExamine, //历史
		intelligentAudit,//智能审核地址
		flowExample //流程实例
	} from "@/api/index";
	import circleLoading from "../../my-components/circle-loading.vue";
	export default {
	    name: "contractApprove",
	    components: {
	        circleLoading
	    },
	    data() {
	        return {
				myOpenUrl:"",  //在线编辑打开地址
				numberShow:false,  //合同编号和系统编号是否显示
				numberShow2:true,  //合同编号是否可以编辑
				selectCount:0,   ///选中的审批人数量
				submitSubmitClick:true, // 审批人是否显示
				btnLoading4:false, //下一审批人中的提交按钮
				btnLoading6:false, //在线编辑按钮
				btnLoading7:false, //智能审核按钮
				btnLoading8:false, //文本对比按钮
				applyCount:[],   //审批人添加
	        	upId:'',
				istopayText:"",
				// auditUrl: "",
				modalFlow:false,
				imgUrl: "", //图片链接
				opinionShow: false,
				historyList: [],
				assigneeListShow: true, //审批人列表是否显示
				assigneeList: [], //审批人列表
	            accessToken: {}, // 上传token鉴权
				detailForm:{},
				type:"",
				backRoute:"",
				fildDownUrl:"",
				procDefId:"",
	            loading: false, // 表格加载状态
				modalVisible3:false, //审批人弹窗
                fileDownUrl:'',     //审批人附件
				DetailId: {
					id: 137
				},
				personData:[],          // 审批人数据
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
				fileDownUrl2:"",
				dictForm: {
					isuse: '',
					id: '',
					name: '',
					typeid: '',
					typeName: '',
				
					//合同正文
					ismoney: '',
					issecret: '',
					isbudget: '',
					isbid: '',
					starttime: '',
					number: '',
					contentnum: '',
					counterpartnum: '',
					totalnum: '',
					chapter: '1',
					description: '',
					//相关附件
					draftsman: '',
					draftsoutfit: '', //起草机构
					draftsoutfitid: '',
					//合同范本
					source: '1',
					sourceName: '',
					sourceArr: [],
					money: '',
					istopay: '',
					istime: '',
					isurgent: '',
					endtime: '',
					counterpartid: '',
				
					draftstime: '',
					phone: '',
					contractPlayList: [],
					uploadList:[]
				},
				form: {
				    procDefId: "",
					procInstId:"",
				    assignees: "",
				    priority: "",
				    id: "",
				    tableId: "",
				    title: ""
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
				opinion: {
					id: "",
					procInstId: "",
					assignees: "",
					priority: 0,
					comment: "",
					fileName:"",
					fileAddress:"",
					number:""
				},
				opinion2: {
					id: "",
					procInstId: "",
					comment: ""
				},
	            form_up:{
	                createTime:'',
	                department:'',
	                mobile:'',
	                userId:'',
	                userName:''
	            }
	        };
	    },
	    methods: {
			//审批人提交
			examineSubmit() {
				this.applyCount = this.selectList;
				this.btnLoading4 = true;
				this.submitSubmitClick = false;
				this.form.priority = 0;
				this.form.title = this.dictForm.name;
				this.modalVisible3 = false;
				this.submitSubmitClick = true;
				this.btnLoading4 = false;
			},
			//合同编号唯一性验证
			numberInp(v){
				if(v){
					contractNumber({number:v,id:this.dictForm.id}).then(res =>{
						if(res.data != "true"){
							this.$Message.error("合同编号重复");
						}
					})
				}
			},
			//在线编辑
			onlineEdit(){
				this.dictForm.generalNo = this.dictForm.generalNo?this.dictForm.generalNo:"";
				this.btnLoading6 = true;
				fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
					if(res.result == "success"){
						var fname = this.dictForm.contentname;
						var fromUrl = res.url;
						var fTag = res.url;
						this.dictForm.generalNo = res.generalNo;
						this.myOpenUrl = wordEdit+'/editURL.html?fromUrl='+fromUrl+"&fname="+fname+"&fileTag="+fTag+"&uName="+this.dictForm.draftsman+"&generalNo="+res.generalNo+"&tableId="+this.dictForm.id;
						myOpen(this.myOpenUrl);
					}else{
						this.message.error("打开出错");
						this.btnLoading6 = false;
					}
				})
			},
			//智能审核contracturl2
			brainpowerAudit(){
				this.btnLoading7 = true;
				fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
					if(res.result == "success"){
						window.open(intelligentAudit+"?id="+this.dictForm.typeid+"&url="+this.dictForm.contracturl);
					}else{
						this.message.error("打开出错");
						this.btnLoading7 = false;
					}
				})
				// window.open(this.auditUrl);
			},
			//文本对比
			fileCompare() {
				this.btnLoading8 = true;
				if(this.dictForm.contentname){
					fileUpUrlAudit({file:"",generalNo:this.dictForm.generalNo,url:this.dictForm.contracturl}).then(res => {
						if(res.result == "success"){
							window.open(wordEdit+"?generalNo="+res.generalNo);
						}
					})
				}else{
					 this.$Message.error("请先选择或者上传合同正文");
				}
				this.btnLoading8 = false;
				// window.location = "/compareText";
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
					// this.personData = res.result.userList;
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
					this.opinion.assignees = this.form.assignees;
				})
			},
			//申请人选择事件
			showSelect(e) {
			    this.selectList = e;
			    this.selectCount = e.length;
				this.form.assignees = [];
				for(var i = 0;i < e.length;i++){
					this.form.assignees.push(e[i].id);
				};
				this.opinion.assignees = this.form.assignees;
			},
			//下一审批人添加
			applyAdd(){
				this.modalVisible3 = true;
				this.personData = [];
				this.selectCount = 0;
				this.treeData=[
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
				]
			},
			//下一审批人删除
			applyClose(event, name){
				const index = this.applyCount.indexOf(name);
                this.applyCount.splice(index, 1);
			},
			//获取历史审批意见
			historyProcess(procInstId) {
				historyExamine(procInstId).then(res => {
					if (res.success) {
						this.historyList = res.result;
						this.processData = res.result[0];
						this.form.procDefId = res.result[0].procDefId;
						this.form.procInstId = res.result[0].procInstId;
						// if (this.dictForm.contracturl) {
						// 	this.auditUrl = "http://139.198.16.175:8073?id=" + this.dictForm.id + "&url=" + this.dictForm.contracturl
						// }
					}
				})
			},
			//上传文件成功
            handleSuccess(res, file){
				if(res.success){
					this.opinion.fileName = res.result.name;
					this.opinion.fileAddress = res.result.url;
					document.getElementById("fileName").innerHTML = "点击上传";
				}else{
					this.$Message.error("上传文件 " + file.name + " 失败");
					document.getElementById("fileName").innerHTML = "点击上传";
				}
			},
			//上传失败
            handleError(error, file){
				document.getElementById("fileName").innerHTML = "点击上传";
			},
			//大小超过限制
            handleMaxSize(file) {
                this.dictForm[this.upId] = "文件过大，请重新上传";
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
            beforeUpload(file){
				document.getElementById("fileName").innerHTML = "文件上传中...";
			},
            //文件下载
            fileDowm(name,url){
               window.open("/zhfw/contract/draft/download?fileName="+name+"&url="+url+"&access_token="+this.getStore("accessToken"));
            },
			//意见提交opinion
			pass() {
				if(!this.opinion.comment){
					this.$Message.error("审批意见必须填写");
					return;
				}
				if(this.dictForm.number){
					contractNumber({id:this.$route.query.tableId,number:this.dictForm.number}).then(res => {
						if (this.numberShow2) {
							if (res.data != "true") {
								this.$Message.error("合同编号重复");
								return
							}
						}
						this.opinion.number = this.dictForm.number;
						if(this.assigneeListShow){
							if(this.opinion.assignees){
								passExamine(this.opinion).then(res => {
									if (res.success) {
										this.$Message.success("操作成功");
										this.modalVisible = false;
										this.closeCurrentPage();
									}
								})
							}else{
								console.log(this.opinion.assignees);
								this.$Message.error("请选择下一审批人");
							}
						}else{
							passExamine(this.opinion).then(res => {
								if (res.success) {
									this.$Message.success("操作成功");
									this.modalVisible = false;
									this.closeCurrentPage();
								}
							})
						}
					})
				}else{
					if(this.assigneeListShow){
						if(this.opinion.assignees){
							passExamine(this.opinion).then(res => {
								if (res.success) {
									this.$Message.success("操作成功");
									this.modalVisible = false;
									this.closeCurrentPage();
								}
							})
						}else{
							console.log(this.opinion.assignees);
							this.$Message.error("请选择下一审批人");
						}
					}else{
						passExamine(this.opinion).then(res => {
							if (res.success) {
								this.$Message.success("操作成功");
								this.modalVisible = false;
								this.closeCurrentPage();
							}
						})
					}
				}
				
			},
			//返回修改
			reject() {
				if(!this.opinion.comment){
					this.$Message.error("审批意见必须填写");
					return;
				}
				this.opinion2.comment = this.opinion.comment;
				rejectExamine(this.opinion2).then(res => {
					if (res.success) {
						this.$Message.success("操作成功");
						this.modalVisible = false;
						this.closeCurrentPage();
					}
				})
			},
			//驳回
			reject2() {
				if(!this.opinion.comment){
					this.$Message.error("审批意见必须填写");
					return;
				}
				this.opinion2.comment = this.opinion.comment;
				rejectExamine2({taskId:this.opinion2.id,destTaskkey:"contractStart",comment:this.opinion.comment,tableId:this.$route.query.tableId}).then(res => {
					if (res.success) {
						this.$Message.success("操作成功");
						this.modalVisible = false;
						this.closeCurrentPage();
					}
				})
			},
			//查看流程
			seeProcess() {
				this.modalFlow = true;
				this.imgUrl = `${flowExample}${this.opinion2.procInstId}?accessToken=${this.getStore("accessToken")}`
			},
			//详情查询
			detailSearch(tableId) {
				this.DetailId.id = tableId
				detailList(this.DetailId).then(res => {
					if (res.result == "success") {
						this.dictForm = res.contract;
						this.dictForm.counterpartList = res.counterpartList;
						if (res.contract.istopay == 0) {
							this.istopayText = "付款";
						} else if (res.contract.istopay == 1) {
							this.istopayText = "收款";
						} else if (res.contract.istopay == 2) {
							this.istopayText = "不涉及";
						}
						if(res.contract.source == 1){
							this.dictForm.sourceName = "自行起草";
						}else{
							this.dictForm.sourceName = "标准文本";
						}
						this.dictForm.parentContractName = res.parentContractName;
						this.dictForm.contractType = res.contractType;
						this.fileDownUrl2 = '/zhfw/contract/draft/download?fileName='+this.dictForm.contentname+'&url='+this.dictForm.contracturl+'&access_token='+this.getStore("accessToken");
						this.dictForm.uploadList = [];
						if(res.contract.attachmentname){
							let arr = this.dictForm.attachmentname.split(',');
							let arr2 = this.dictForm.accessoryurl.split(',');
							for(let i = 0;i < arr.length;i++){
								let obj = {name:"",url:"",status: "finished",fileDownUrl:""};
								obj.name = arr[i];
								obj.url = arr2[i];
								obj.fileDownUrl = '/zhfw/contract/draft/download?fileName='+arr[i]+'&url='+arr2[i]+'&access_token='+this.getStore("accessToken");
								this.dictForm.uploadList.push(obj);
							}
						}
						this.dictForm.counterpartList = res.counterpartList;
					}
				});
			},
	        init() {
				this.opinion = {
					id: "",
					procInstId: "",
					assignees: "",
					priority: 0,
					fileName:"",
					fileAddress:"",
					comment: ""
				}
				this.opinion2 = {
					id: "",
					procInstId: "",
					comment: ""
				}
				let that = this;
				examinePerson({procInstId:this.$route.query.procInstId}).then(res => {
					if(res.success){
						if(res.result.length > 0){
							that.applyCount = [...res.result];
							this.form.assignees = [];
							for(var i = 0;i < that.applyCount.length;i++){
								this.form.assignees.push(that.applyCount[i].id);
							};
							this.opinion.assignees = this.form.assignees;
							console.log(this.opinion.assignees);
						}
					}
				})
				examineShow({procDefId:this.$route.query.procDefId,procInstId:this.$route.query.procInstId}).then(res => {
					if(res.result){
						this.assigneeListShow = true;
						if(this.$route.query.key == "zhiNengDepartment"){
							this.numberShow = true;
							this.numberShow2 = true;
						}else{
							this.numberShow = false;
							this.numberShow2 = false;
						}
					}else{
						this.assigneeListShow = false;
						if(this.$route.query.key == "zhiNengDepartment"){
							this.numberShow = true;
							this.numberShow2 = true;
						}else{
							this.numberShow = true;
							this.numberShow2 = false;
						}
					}
				})
				if(this.$route.query.key == "zhiNengDepartment"){
					getSystemId({id:this.$route.query.tableId}).then(res => {
						this.dictForm.systemNumber = res.result;
						this.detailSearch(this.$route.query.tableId);
					})
				}else{
					this.detailSearch(this.$route.query.tableId);
				}
				if(this.$route.query.id){
					this.accessToken = {
                        'access_token': this.getStore("accessToken"),
                        'Authorization': 'Bearer '+this.getStore("accessToken")
					};
					this.type = this.$route.query.type;
					if(this.$route.query.type == 2){
						this.opinionShow = false;
					}else{
						this.opinionShow = true;
					}
					this.applyCount = [];
					this.backRoute = this.$route.query.backRoute;
					this.procDefId = this.$route.query.id;
					this.opinion.id = this.$route.query.id;
					this.opinion.procInstId = this.$route.query.procInstId;
					this.opinion.priority = 0;
					this.opinion.tableId = this.$route.query.tableId;
					this.form.tableId = this.$route.query.tableId;
					this.opinion2.procInstId = this.$route.query.procInstId;
					this.opinion2.id = this.$route.query.id;
					this.historyProcess(this.$route.query.procInstId);
				}
	        },
			close(){
				this.closeCurrentPage();
			},
			closeCurrentPage() {
				this.$store.commit("removeTag", "contractApprove");
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
// 			beforeRouteUpdate(to, from, next) {
// 				const newId = to.query.tableId;
// 				const oldId = from.query.tableId;
// 				console.log(newId,oldId);
// 				if(to.name == "contractApprove"){
// 					this.init();
// 					if(this.$route.query.key == "zhiNengDepartment"){
// 						getSystemId({id:this.$route.query.tableId}).then(res => {
// 							this.dictForm.systemNumber = res.result
// 						})
// 						this.numberShow = true;
// 					}
// 				}
// 				this.init();
// 				next();
// 			}
			$route(to, from) {
				if(to.name == "contractApprove"){
					this.init();
				}
				// if(this.$route.query.key == "zhiNengDepartment"){
				// 	getSystemId({id:this.$route.query.tableId}).then(res => {
				// 		this.dictForm.systemNumber = res.result;
				// 		this.detailSearch(this.$route.query.tableId);
				// 	})
				// }
			}
		}
	};
</script>

