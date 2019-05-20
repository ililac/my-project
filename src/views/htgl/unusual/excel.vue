<style lang="less">
@import "./excel.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
			<Row>
				<Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
					<Form-item label="名称">
						<Input type="text" v-model="searchForm.name" placeholder="请输入" clearable style="width: 200px"/>
					</Form-item>
					<Form-item label="编号">
						<Input type="text" v-model="searchForm.number" placeholder="请输入" clearable style="width: 200px"/>
					</Form-item>
					<Form-item style="margin-left:-35px;" class="br">
						<Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
					</Form-item>
				</Form>
			</Row>
          <Row class="operation">
            <Button @click="exportSelectData" icon="md-cloud-upload">导出所选数据</Button>
            <Button @click="exportAll" icon="ios-cloud-upload">导出全部数据</Button>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNo" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 自定义导出数据 -->
    <Modal
      v-model="exportModalVisible"
      :title="exportTitle"
      :loading="loadingExport"
      @on-ok="exportCustomData">
      <Form ref="exportForm" :label-width="85">
        <FormItem label="导出文件名">
          <Input v-model="filename"/>
        </FormItem>
        <FormItem label="自定义导出列">
          <CheckboxGroup v-model="chooseColumns">
            <Checkbox v-for="(item, i) in exportColumns" :label="item.title" :key="i" :value="item.checked" :disabled="item.disabled"></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
	import {
		signContractList,
		detailList
	} from "@/api/index";
// 模版导入文件表数据
import { userColumns, userData } from "../common/importTemplate";
// excel转换工具类
import excel from "@/libs/excel";
export default {
  name: "excel",
  data() {
    return {
		loading: true, // 表单加载状态
		loadingExport: true, // 导出加载状态
		exportModalVisible: false, // 自定义导出显示
		selectCount: 0, // 多选计数
		selectList: [], // 多选数据
		searchForm: {
			name:"",
			number:"",
			startTime:"",
			endTime:"",
			stateId:[7,8],
			pageSize:10,
			pageNo:1
			// pageNumber: 1,
			// pageSize: 10,
			// sort: "createTime",
			// order: "desc"
		},
	  columns: [
	      //表头
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
	          key: "name",
	          width: 150,
	  		align: "center"
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
	  		                        this.termination(params.row);
	  		                    }
	  		                }
	  		            },
	  		            "合同变更"
	  		        ),
	  		    	h(
	  		    	    "Button",
	  		    	    {
	  		    	        props: {
	  		    	            type: "error",
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
	  		    	    "合同解除"
	  		    	)
	  		    ]);
	  		}
	      }
	  ],
      // columns: [
      //   // 表头
      //   {
      //     type: "selection",
      //     width: 60,
      //     align: "center"
      //   },
      //   {
      //     type: "index",
      //     width: 60,
      //     align: "center"
      //   },
      //   {
      //     title: "名称",
      //     key: "name",
      //     sortable: true
      //   },
      //   {
      //     title: "手机",
      //     key: "mobile",
      //     sortable: true
      //   },
      //   {
      //     title: "创建时间",
      //     key: "createTime",
      //     sortable: true,
      //     sortType: "desc"
      //   },
      //   {
      //     title: "更新时间",
      //     key: "updateTime",
      //     sortable: true
      //   },
      //   {
      //     title: "操作",
      //     key: "action",
      //     align: "center",
      //     render: (h, params) => {
      //       return h("div", [
      //         h(
      //           "Button",
      //           {
      //             props: {
      //               type: "primary",
      //               size: "small",
      //               icon: "ios-create-outline"
      //             },
      //             style: {
      //               marginRight: "5px"
      //             },
      //             on: {
      //               click: () => {
      //                 this.$Message.info("点击了编辑");
      //               }
      //             }
      //           },
      //           "编辑"
      //         ),
      //         h(
      //           "Button",
      //           {
      //             props: {
      //               type: "error",
      //               size: "small",
      //               icon: "md-trash"
      //             },
      //             on: {
      //               click: () => {
      //                 this.$Message.info("点击了删除");
      //               }
      //             }
      //           },
      //           "删除"
      //         )
      //       ]);
      //     }
      //   }
      // ],
      exportColumns: [
        // 导出列
			{
		      title: "合同名称",
		      key: "name",
		      sortable: true,
		  },
		  {
		      title: "合同编号",
		      key: "number",
		      sortable: true
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
		      sortable: true
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
		   sortable: true
		}
        // {
        //   title: "名称",
        //   key: "name",
        //   sortable: true
        // },
        // {
        //   title: "手机",
        //   key: "mobile",
        //   sortable: true
        // },
        // {
        //   title: "创建时间",
        //   key: "createTime",
        //   sortable: true,
        //   sortType: "desc"
        // },
        // {
        //   title: "更新时间",
        //   key: "updateTime",
        //   sortable: true
        // }
      ],
      chooseColumns: [],
      filename: "数据",
      exportTitle: "确认导出",
      exportType: "",
      tempColumns: userColumns,
      tempData: userData,
      data: [],
      exportData: [],
      total: 0
    };
  },
  methods: {
    init() {
		this.accessToken = {
		    accessToken: this.getStore("accessToken")
		};
      this.getDataList();
      // 初始化导出列数据
      let array = [];
      this.exportColumns.forEach(e => {
        // 指定列限制权限
        if (
          !this.getStore("roles").includes("ROLE_ADMIN") &&
          e.key === "mobile"
        ) {
          e.title = "[无权导出] " + e.title;
          e.disabled = true;
        } else {
          e.disabled = false;
        }
        array.push(e.title);
      });
      this.chooseColumns = array;
    },
    changePage(v) {
      this.searchForm.pageNo = v;
      this.getDataList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    selectDateRange(v) {
      if (v) {
        this.searchForm.startDate = v[0];
        this.searchForm.endDate = v[1];
      }
    },
    getDataList() {
      this.loading = true;
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        sort: this.sortColumn,
        order: this.sortType
      };
      // 请求后端获取表单数据 请自行修改接口
      // this.getRequest("请求路径", params).then(res => {
      //   this.loading = false;
      //   if (res.success === true) {
      //     this.data = res.result.content;
      //     this.total = res.result.totalElements;
      //   }
      // });
      // 以下为模拟数据
      this.data = [
        {
          id: "1",
          name: "X-BOOT",
          mobile: "12345678901",
          createTime: "2018-08-08 00:08:00",
          updateTime: "2018-08-08 00:08:00"
        },
        {
          id: "2",
          name: "Exrick",
          mobile: "12345678901",
          createTime: "2018-08-08 00:08:00",
          updateTime: "2018-08-08 00:08:00"
        }
      ];
      this.total = this.data.length;
      this.loading = false;
    },
    handleSearch() {
		this.searchForm.pageNo = 1;
		this.searchForm.pageSize = 10;
		console.log(this.searchForm);
		this.getDataList();
      // this.searchForm.pageNumber = 1;
      // this.searchForm.pageSize = 10;
      // this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      // 重新加载数据
      this.getDataList();
    },
    changeSort(e) {
      this.searchForm.sort = e.key;
      this.searchForm.order = e.order;
      if (e.order === "normal") {
        this.searchForm.order = "";
      }
      this.getDataList();
    },
    exportSelectData() {
      if (this.selectCount <= 0) {
        this.$Message.warning("您还未选择要导出的数据");
        return;
      }
      this.exportType = "part";
      this.exportModalVisible = true;
      this.exportTitle = "确认导出 " + this.selectCount + " 条数据";
    },
    exportAll() {
      this.exportType = "all";
      this.exportModalVisible = true;
      this.exportTitle = "确认导出全部 " + this.total + " 条数据";
      // 请求后端获取全部数据 请自行修改接口
      // this.getRequest("请求路径", params).then(res => {
      //   if (res.success) {
      //     this.exportData = res.result;
      //   }
      // });
      // 以下为模拟数据
      this.exportData = [
        {
          id: "1",
          name: "X-BOOT",
          mobile: "12345678901",
          createTime: "2018-08-08 00:08:00",
          updateTime: "2018-08-08 00:08:00"
        },
        {
          id: "2",
          name: "Exrick",
          mobile: "12345678901",
          createTime: "2018-08-08 00:08:00",
          updateTime: "2018-08-08 00:08:00"
        }
      ];
    },
    exportCustomData() {
      if (this.filename == "") {
        this.filename = "用户数据";
      }
      // 判断勾选导出列
      let array = [];
      this.exportColumns.forEach(e => {
        this.chooseColumns.forEach(c => {
          if (e.title === c && !e.disabled) {
            array.push(e);
          }
        });
      });
      this.exportColumns = array;
      this.exportModalVisible = false;
      let title = [];
      let key = [];
      this.exportColumns.forEach(e => {
        title.push(e.title);
        key.push(e.key);
      });
      const params = {
        title: title,
        key: key,
        data: this.exportData,
        autoWidth: true,
        filename: this.filename
      };
      excel.export_array_to_excel(params);
    },
    showSelect(e) {
      this.exportData = e;
      this.selectList = e;
      this.selectCount = e.length;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
	//表格列表
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
  }
};
</script>