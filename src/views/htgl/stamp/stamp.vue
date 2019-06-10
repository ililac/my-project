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
							<Form-item label="合同名称">
								<Input type="text" v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px"/>
							</Form-item>
							<Form-item label="合同编号">
								<Input type="text" v-model="searchForm.number" placeholder="请输入" clearable style="width: 200px"/>
							</Form-item>
							<Form-item label="起草时间">
								<DatePicker
								  v-model="searchForm.startTime"
								  format="yyyy-MM-dd"
								  clearable
								  placeholder="选择起始时间"
								  :editable="false"
								></DatePicker>
								<DatePicker
								  v-model="searchForm.endTime"
								  format="yyyy-MM-dd"
								  @on-change="timeChange"
								  clearable
								  placeholder="选择起始时间"
								  :editable="false"
								></DatePicker>
							</Form-item>
							<Form-item style="margin-left:-35px;" class="br">
								<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
								<Button @click="handleReset" type="primary">重置</Button>
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
			<Modal title="合同用印" v-model="modalVisible" :mask-closable='false' :width="1000" class="formModel">
			  <Form ref="dictForm" :model="dictForm" :label-width="120">
				  <Col class="screen">
					<div class="ul">
						<FormItem label="合同名称" class="lef">
							<!-- <Input disabled="disabled" v-model="dictForm.name"/> -->
							<p>{{dictForm.name}}</p>
						</FormItem>
						<FormItem label="合同编号" class="lef">
							<!-- <Input v-model="dictForm.number" disabled="disabled"/> -->
							<p>{{dictForm.number}}</p>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="合同正文">
							<!-- <p>{{dictForm.contentname}}</p> -->
							<a :href="'/zhfw/contract/draft/download?fileName='+dictForm.contentname+'&url='+dictForm.contractUrl+'&access_token='+accessToken.accessToken">{{dictForm.contentname}}</a>
						</FormItem>
					</div>
					<div class="ul">
						<FormItem label="用印份数" class="lef">
							<p>{{dictForm.totalnum}}</p>
						</FormItem>
						<!-- <FormItem label="用章类型" class="lef">
							<p>{{dictForm.chapter==1?"校章":"合同章"}}</p>
						</FormItem> -->
					</div>
					<div class="ul">
						<FormItem label="备注">
							<Input
								type="textarea"
								v-model="dictForm.printRemark"
								:maxlength="1000"
								:rows="2"	
							/>
						</FormItem>
					</div>
				  </Col>
				  <div style="clear: both;"></div>
				</Form>
				<div style="clear:both"></div>
				<div slot="footer">
					<Button type="text" @click="modalVisible=false">取消</Button>
					<Button type="primary" @click="printSubmit">确认</Button>
				</div>
			</Modal>
		</Card>
	</div>
</template>

<script>
	import { myOpen } from "../myOpen";
    import {
		parintConfirm,
		signContractList,
        fromUp,
        wordEdit
    } from "@/api/index";
    export default {
        name: "stamp",
        data() {
            return {
                accessToken: {}, // 上传token鉴权
                selectCount:0,
                modalVisible: false,
				//搜索部分的列表字段
                dictForm: {},
				printData:{
					id:"",
					stateId:""
				},
                loading: false, // 表格加载状态
                data: [], //表单数据
                total: 0, // 表单数据总数
                columns: [
                    {
                        title: "序号",
                        type: "index",
                        width: 80,
                        align: "center"
                    },
                    {
                        title: "合同名称",
                        key: "name",
                        width: 280,
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
                                    "合同用印"
                                ),
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
					stateId:4,
                    pageSize:10,
					pageNo:1
                },
                form_up:{
                    updateBy:'',
                    createTime:'',
                    departmentTitle:'',
                    userId:''
                }
            };
        },
        methods: {
            init() {
                this.accessToken = {
                    accessToken: this.getStore("accessToken")
                };
                // 获取表单数据
                fromUp().then(res => {
                    this.form_up.updateBy = res.updateBy;
                    this.form_up.createTime = res.createTime;
                    this.form_up.departmentTitle = res.department;
                    this.form_up.userName = res.nickName;
                    this.form_up.userId = res.userId;
                });
                this.getDataList();
            },
			//搜索处时间校验
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
            edit(v) {
				this.modalVisible = true;
				this.dictForm = v;
				/* this.printData.id = v.id;
				this.printData.stateId = 6;
				var fname = encodeURIComponent(v.name);
				var fromUrl = encodeURIComponent(v.contractUrl);
				var others = v.chapter+';'+v.totalnum+';'+v.number
				var id = this.printData.id;
				var stateId = 6
				myOpen(wordEdit+'/contractPrint.html?fromUrl='+fromUrl+'&fname='+fname+'&others='+others+'&id='+id+'&stateId='+stateId+'&userId='+this.form_up.userId);
				var myVar = setInterval(function(){myTimer()},2000);
				// this.myVar();
				var searchForm = this.searchForm;
				var total = this.total;
				var that = this;
				function myTimer(){
					signContractList(searchForm).then(res => {
						if(total != res.total){
							clearInterval(myVar);
							that.getDataList();
						}
					});
				}
				setTimeout(function(){clearInterval(myVar)},600000); */
// 				setTimeout(function(){document.onclick = function(){
// 					clearInterval(myVar);
// 				};},1000)
				
            },
			//提交打印信息
			printSubmit(){
				parintConfirm({id:this.dictForm.id,stateId:6,printRemark:this.dictForm.printRemark,userid:this.form_up.userId}).then(res => {
					if(res.result == "success"){
						this.$Message.success("操作成功");
						this.modalVisible=false;
						this.getDataList();
					}
				})
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
                this.getDataList();
            },
            handleSearch() {
                this.searchForm.pageNo = 1;
                this.searchForm.pageSize = 10;
                this.getDataList();
            },
			handleReset(){
				this.searchForm = {
					name:"",
					number:"",
					startTime:"",
					endTime:"",
					stateId:4,
                    pageSize:10,
					pageNo:1
                }
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
        },
        mounted() {
            this.init();
        },
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name == "stamp"){
					this.init();
				}
			}
		}
    };
</script>