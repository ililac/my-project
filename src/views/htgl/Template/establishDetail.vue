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
						  <Col :span="24">
							<div class="ul">
								<FormItem label="范本名称：" class="lef">
					<span style="position: absolute;left: -84px;color: red;top: 3px;font-size: 20px;">*</span>
									<p>{{detailForm.modelName}}</p>
								</FormItem>
								<FormItem label="范本编号：" class="lef">
									<p>{{detailForm.templateNumber}}</p>
								</FormItem>
								
							</div>
							<div class="ul">
								<FormItem label="范本类型：" class="lef">
					<span style="position: absolute;left: -84px;color: red;top: 3px;font-size: 20px;">*</span>
									<p>{{detailForm.type==='0'?'内部范本':'外部范本'}}</p>
								</FormItem>
								<Form-item label="合同类型：" class="lef">
									<p>{{detailForm.contractTypeName}}</p>
								</Form-item>
							</div>
							<div class="ul">
								<FormItem label="范本文件：" class="lef">
					<span style="position: absolute;left: -84px;color: red;top: 3px;font-size: 20px;">*</span>
									<a v-bind:href="fildDownUrl">{{detailForm.fileName}}</a>
								</FormItem>
								<FormItem label="使用次数：" class="lef">
								    <span>{{detailForm.usedCount}}</span>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="备注：">
									<p>{{detailForm.comment}}</p>
								</FormItem>
							</div>
							<div class="ul">
								<FormItem label="发布人：" class="lef">
								    <span>{{detailForm.createBy}}</span>
								</FormItem>
								<FormItem label="发布时间：" class="lef" v-show="detailForm.createTime">
								    <span>{{detailForm.createTime}}</span>
								</FormItem>
								<FormItem label="发布机构：" v-show="detailForm.departmentTitle" class="lef">
								    <span>{{detailForm.departmentTitle}}</span>
								</FormItem>
							</div>
						  </Col>
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
		modelRelativeDetail
    } from "@/api/index";
    import circleLoading from "../../my-components/circle-loading.vue";
    export default {
        name: "establishDetail",
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
				procDefId:"",
                loading: false, // 表格加载状态
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
        	getUpId(id){
				this.upId = id
        	},
            init() {
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
				// this.loading = true;
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
							console.log(res);
							if(res.success){
								this.detailForm = res.result;
								if(res.result.fileName){
									this.fildDownUrl = "/zhfw/contract/contractModel/download?id="+res.result.id+"&access_token="+this.getStore("accessToken");
								}
							}
						});
					}else{
						this.editClick = false;
					}
				}
            },
			close(){
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
				if(to.name == "establishDetail"){
					this.init();
				}
			}
		}
    };
</script>