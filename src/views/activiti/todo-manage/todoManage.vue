<style lang="less" scoped>
	@import "./todoManage.less";
</style>

<template>
	<div class="search">
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg">

				<Col :span="24">
				<Row>
					<Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
						<Form-item label="合同名称">
							<Input type="text" v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px" />
						</Form-item>
						<!-- <FormItem label="审批情况">
							<RadioGroup v-model="searchForm.name">
								<Radio label="1">审批</Radio>
								<Radio label="0">未审批</Radio>
							</RadioGroup>
						</FormItem> -->
						<Form-item style="margin-left:-35px;" class="br">
							<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
						</Form-item>
					</Form>
				</Row>
				<Row>
					<Table :loading="loading" border :columns="columns" :data="data" sortable="custom" ref="table"></Table>
				</Row>
				<Row type="flex" justify="end" class="page">
					<Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage"
					 @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator
					 show-sizer></Page>
				</Row>
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
		// fromUp,
		// getDictDataByType,
		// eachOther,
		// detailList,
		findContractList
	} from "@/api/index";
	import circleLoading from "../../my-components/circle-loading.vue";
	export default {
		name: "todomanage",
		components: {
			circleLoading
		},
		data() {
			return {
				loading: false, // 表格加载状态
				data: [], //表单数据
				total: 0, // 表单数据总数
				columns: [{
						title: "序号",
						type: "index",
						align: "center",
						width:60
					},
					{
						title: "合同名称",
						width:250,
						key: "contractName",
						align: "left"
					},
					{
						title: "所属流程",
						key: "processName",
						align:"center"
					},
					{
						title: "流程发起人",
						key: "applyer",
						align: "center"
					},
					{
						title: "创建时间",
						key: "createTime",
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
								h(
									"Button", {
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
									"审批"
								)
							]);
						}
					}
				],
				searchForm: {
					// 搜索框对应data对象
					name: "",
					pageNumber: 1,
					pageSize: 10
				},
			};
		},
		methods: {
			init() {
// 				this.accessToken = {
// 					accessToken: this.getStore("accessToken")
// 				};
// 				// 获取表单数据
// 				fromUp().then(res => {
// 					this.form_up.createTime = res.createTime;
// 					this.form_up.department = res.department;
// 					this.form_up.mobile = res.mobile;
// 					this.form_up.userId = res.userId;
// 					this.form_up.userName = res.userName;
// 				});
// 				eachOther().then(res => {
// 					if(res.success){
// 						this.counterpartArr = res.result.content
// 					}
// 				});
// 				getDictDataByType("contract_type").then(res => {
// 					if (res.success) {
// 						this.typeArr = res.result;
// 					}
// 				});
				this.getDataList();
			},
			edit(v) {
				let query = { type: 1, id: v.id, backRoute: this.$route.name,procInstId:v.procInstId ,tableId:v.tableId,procDefId:v.procDefId,key:v.key};
							this.$router.push({
							name: "contractApprove",
							query: query
						});
			},
			changePage(v) {
				this.searchForm.pageNumber = v;
				this.getDataList();
				// this.clearSelectAll();
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
			getDataList() {
				this.loading = true;
				findContractList(this.searchForm).then(res => {
					this.loading = false;
					this.data = res.result.content;
					this.total = res.result.totalElements;
				});
			},
		},
		mounted() {
			this.init();
		},
		watch: {
		  // 监听路由变化
			$route(to, from) {
				if(to.name == "todomanage"){
					this.init();
				}
			}
		}
	};
</script>
