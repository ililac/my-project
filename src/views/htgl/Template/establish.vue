<style lang="less" scoped>
@import "../formModel.less";
</style>
<template>
  <div class="formModel">
    <Card>
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col :span="24">
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
              <Form-item label="名称">
                <Input
                  type="text"
                  v-model="searchForm.modelName"
                  placeholder="请输入"
                  clearable
                />
              </Form-item>
              <Form-item label="类型">
                <!-- <select
                  id="sel"
                  v-model="searchForm.contractTypeId"
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                >
                  <option v-for="item in contract_type" :value="item.id">{{item.title}}</option>
                </select> -->
								<contract-type v-on:typeListen="typeChange" :widthDate.sync="myStyle" :typeDate.sync="formData1"></contract-type>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="add" type="primary" icon="md-add">添加数据</Button>
            <Button @click="addExternal" v-hasRole="'ROLE_ADMIN'" type="primary" icon="md-add">从外部范本库添加</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="getDataList" icon="md-refresh">刷新数据</Button>
          </Row>
          <Row>
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
              <!-- <a class="select-clear" @click="clearSelectAll">清空</a> -->
            </Alert>
          </Row>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              sortable="custom"
              @on-sort-change="changeSort"
              @on-selection-change="showSelect"
              ref="table"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.pageNumber"
              :total="total"
              :page-size="searchForm.pageSize"
              @on-change="changePage"
              @on-page-size-change="changePageSize"
              :page-size-opts="[10,20,50]"
              size="small"
              show-total
              show-elevator
              show-sizer
            ></Page>
          </Row>
        </Col>
      </Row>
    </Card>
    <Modal
      title="合同范本"
      class="formModel"
      v-model="modalVisible"
      :mask-closable="false"
      :width="800"
      :styles="{top: '30px'}"
      footer-hide
    >
      <contract-model :formData.sync="dictForm" v-on:listen="childShow"></contract-model>
      <div style="clear: both;"></div>
    </Modal>
    <Modal
      title="北大法宝合同范本库"
      class="formModel"
      v-model="externalModalVisible"
      :mask-closable="false"
      :width="1000"
      :styles="{top: '30px'}"
      footer-hide
    >
      <Row>
        <Form
          ref="searchExForm"
          :model="searchExForm"
          inline
          :label-width="70"
          class="search-form"
          @submit.native.prevent
        >
          <Form-item label="合同类别" prop="contractTypeId">
            <Select
              v-model="searchExForm.contractTypeId"
              placeholder="请选择"
              clearable
              style="width: 260px"
            >
              <Option
                v-for="item in contractTypeData"
                :value="item.id"
                :key="item.id"
              >{{item.value}}</Option>
            </Select>
          </Form-item>
          <Form-item label="发布部门" prop="departmentTitle">
            <Select
              v-model="searchExForm.departmentTitle"
              placeholder="请选择"
              clearable
              style="width: 260px"
            >
              <Option
                v-for="item in departmentTitleData"
                :value="item.id"
                :key="item.id"
              >{{item.value}}</Option>
            </Select>
          </Form-item>
          <Form-item label="行业类别" prop="industryType">
            <Select
              v-model="searchExForm.industryType"
              placeholder="请选择"
              clearable
              style="width: 260px"
            >
              <Option
                v-for="item in industryTypeData"
                :value="item.id"
                :key="item.id"
              >{{item.value}}</Option>
            </Select>
          </Form-item>
          <Form-item label="发布年份" prop="publicYear">
            <DatePicker :editable="false" v-model="searchExForm.publicYear" type="year" placeholder="请选择" style="width: 260px" @on-change="HandleDate"></DatePicker>
          </Form-item>
          <Form-item style="margin-top:-30px;" class="br">
            <Button @click="handleSearchEx" type="primary">搜&nbsp;索</Button>
            <Button @click="handleResetEx">重&nbsp;置</Button>
          </Form-item>
        </Form>
      </Row>
      <Row>
        <Table :loading="loading" border :columns="columnsEx" :data="dataEx" ref="table"></Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        总共 {{totalEx}} 个项目
        <Page
          :current="searchExForm.pageNumber"
          :total="totalEx"
          :page-size="searchExForm.pageSize"
          @on-change="changePageEx"
          style="margin-left:10px;"
        ></Page>
      </Row>
    </Modal>
    <Modal
      title="查看合同范本"
      v-model="recodeVisible"
      :mask-closable="false"
      :width="960"
      :styles="{top: '60px'}"
      footer-hide
    >
      <Form ref="detailForm" :model="recodeData" :label-width="120">
        <Row>
          <Col :span="14">
            <FormItem label="范本名称：">
              <p>{{recodeData.modelName}}</p>
            </FormItem>
          </Col>
          <Col :span="10">
            <Form-item label="合同类型：">
              <p>{{recodeData.contractTypeName}}</p>
            </Form-item>
          </Col>
        </Row>
        <Row>
          <Col :span="14">
            <FormItem label="发布时间：" v-show="recodeData.publishTime">
              <span>{{recodeData.publishTime}}</span>
            </FormItem>
          </Col>
          <Col :span="10">
            <FormItem label="发布机构：" v-show="recodeData.departmentTitle">
              <span>{{recodeData.departmentTitle}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="范本内容：">
              <div class="record-content">
                <div v-html="recodeData.FullText"></div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <div style="padding-top: 10px;float: right;">
          <Button type="primary" @click="close">关闭</Button>
        </div>
      </Row>
    </Modal>
  </div>
</template>

<script>
import contractModel from "./model.vue";
import  contractType from "../../activiti/business/contractType.vue";
import {
  myDelete,
  formSeve,
  getDictDataByType,
  contractModelquery,
  filesDown,
  fromUp,
  getSingleRecord,
  queryModelOnLine,
  queryContractType,
  queryDepartmentTitle,
  queryIndustryType,
  saveModelByIdOnLine
} from "@/api/index";
export default {
  name: "establish",
  components: {
    contractModel,
		contractType
  },
  data() {
    return {
      upId: "",
      accessToken: {}, // 上传token鉴权
			myStyle:{display:'flex',width:'200px'}, //合同类型宽度
      searchExForm: {
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        // type: 3,
        order: "desc",
        sort: "",
        contractTypeId: "",
        departmentTitle: "",
        industryType: "",
        publicYear: ""
      },
			formData1:{
				contractType:"",
				typeid:""
			},
      totalEx: 0,
      contractTypeData: [],
      departmentTitleData: [],
      industryTypeData: [],
      columnsEx: [
        {
          title: "范本名称",
          key: "modelName",
          width: 251,
          align: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {
                    color: "#2d8cf0"
                  },
                  on: {
                    click: () => {
                      this.getRecodeDetail(params.row.id);
                    }
                  }
                },
                params.row.modelName
              )
            ]);
          }
        },
        {
          title: "合同分类",
          key: "contractTypeName",
          width: 160,
          align: "left"
        },
        { title: "发布日期", key: "publishTime", width: 160, align: "left" },
        {
          title: "发布部门",
          key: "departmentTitle",
          width: 160,
          align: "left"
        },
        {
          title: "操作",
          key: "action",
          width: 235,
          align: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {
                    color: "#2d8cf0"
                  },
                  on: {
                    click: () => {
                      this.saveModelByIdOnLine(params.row.id);
                    }
                  }
                },
                "添加为内部范本"
              )
            ]);
          }
        }
      ],
      dataEx: [],
      dictFormValidate: {
        // 表单验证规则
        modelName: [{ required: true, message: "不能为空", trigger: "blur" }],
        messages: [{ required: true, message: "必须选择", trigger: "blur" }],
        file: [{ required: true, message: "此文件必须上传", trigger: "blur" }]
      },
      enable: false,
      btnLoading: false,
      btnLoading2: false,
      recodeVisible: false,
      recodeData: {},
      selectCount: 0,
      contract_type: [],
      modalVisible: false,
      externalModalVisible: false,
      fildDownUrl: "",
      dictForm: {
        id: "",
        modelName: "",
        comment: "",
        contractTypeId: "",
        contractTypeName: "",
        sortOrder: 0,
        modelAddress: "",
        fileName: "",
        updateBy: "",
        createTime: "",
        status: -1,
        departmentTitle: "",
      },
      loading: false, // 表格加载状态
      data: [], //表单数据
      total: 0, // 表单数据总数
      columns: [
        // 表头
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          width: 80,
          type: "index",
          align: "center"
        },
        {
          title: "范本名称",
          key: "modelName",
          width:220,
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
                params.row.modelName
              )
            ]);
          }
        },
        {
          title: "合同类型",
          key: "contractTypeName",
          width: 220,
          align: "left"
        },
        {
          title: "使用次数",
          key: "usedCount",
          width: 120,
          align: "center"
        },
         {
          title: "范本编号",
          key: "templateNumber",
          width: 160,
          align: "center"
        },
         {
          title: "范本类型",
          width: 120,
          key: "type",
          align: "center",
          render:(h,params) => {
            if (params.row.type==='0') {
              return h("div", 
               '内部范本'
           );
            }else{
            return h("div", 
               '外部范本'
           );
          }
          }
        },
        {
          title: "状态",
          // key: "status",
          width: 120,
          align: "center",
          render: (h, params) => {
            let text = "",
              color = "default";
            if (params.row.status == -1) {
              text = "未发布";
            } else if (params.row.status == 0) {
              text = "已发布";
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
          title: "发布人",
          width: 120,
          key: "createBy",
          align: "center"
        },
        {
          title: "发布时间",
          width: 120,
          key: "publishTime",
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
      searchForm: {
        // 搜索框对应data对象
        modelName: "",
        // lvzhuType:0,        //判断是否是范本查询列表
        contractTypeId: "",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        order: "desc" // 默认排序方式
      },
      form_up: {
        updateBy: "",
        createTime: "",
        departmentTitle: ""
      }
    };
  },
  methods: {
    close() {
      this.recodeVisible = false;
    },
    getRecodeDetail(id) {
      getSingleRecord({ id: id }).then(res => {
        if (res.success) {
          this.recodeVisible = true;
          this.recodeData = res.data[0];
        }
      });
    },
    childShow(data) {
      this.modalVisible = false;
      if (data.show) {
        this.getDataList();
      }
    },
    handleReset() {
      this.searchForm = {
        modelName: "",
        contractTypeId: "",
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        order: "desc" // 默认排序方式
      };
			this.formData1={
				contractType:"",
				typeid:""
			};
			this.getDataList();
    },
    getUpId(id) {
      this.upId = id;
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString());
      document.getElementById(this.upId).innerHTML = "上传失败，请重新上传";
    },
    beforeUpload() {
      document.getElementById(this.upId).innerHTML = "文件上传中...";
      return true;
    },
    handleMaxSize(file) {
      document.getElementById(this.upId).innerHTML = "文件过大，请重新上传";
      this.$Notice.warning({
        title: "文件大小过大",
        desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
      });
    },
    handleSuccess(res, file) {
      if (res.message == "success") {
        document.getElementById(
          this.upId
        ).parentNode.nextElementSibling.innerHTML = "";
        document.getElementById(this.upId).innerHTML = res.result.name;
        this.dictForm[res.result.tag.split("-")[0]] = res.result.url;
        this.dictForm[res.result.tag.split("-")[1]] = res.result.name;
        this.$Message.success("上传文件 " + file.name + " 成功");
      } else {
        this.$Message.error("上传文件 " + file.name + "失败");
      }
    },
		//搜索处的类型选择
		typeChange(v){
			this.searchForm.contractTypeId= v.id
		},
    handleSearchEx() {
      this.searchExForm.pageNumber = 1;
      this.searchExForm.pageSize = 10;
      this.getExDataList();
    },
    handleResetEx() {
      this.$refs.searchExForm.resetFields();
      this.searchExForm.pageNumber = 1;
      this.searchExForm.pageSize = 10;
      this.getExDataList();
    },
    changePageEx(v) {
      this.searchExForm.pageNumber = v;
      this.getExDataList();
    },
    getExDataList() {
      queryModelOnLine(this.searchExForm).then(res => {
        if (res.success) {
          this.dataEx = res.data;
          this.totalEx = parseInt(res.recordCount);
        }
      });
    },
    HandleDate(data) {
      this.searchExForm.publicYear = data;
    },
    saveModelByIdOnLine(id) {
      saveModelByIdOnLine({ gid: id }).then(res => {
        if (res.success==='true') {
          this.externalModalVisible = false;
          this.getDataList();
        }else{
            this.$Message.warning(res.message)
        }
      });
    },
    init() {
      this.accessToken = {
        accessToken: this.getStore("accessToken")
      };
      // 获取表单数据
      fromUp().then(res => {
        this.form_up.updateBy = res.nickName;
        this.form_up.createTime = "";
        this.form_up.departmentTitle = res.department;
      });
      getDictDataByType("contract_type").then(res => {
        if (res.success) {
          this.contract_type = res.result;
        }
      });
      this.getDataList();
      this.getExDataList();
      queryContractType().then(res => {
        if (res.success) {
          this.contractTypeData = res.data;
        }
      });
      queryDepartmentTitle().then(res => {
        if (res.success) {
          this.departmentTitleData = res.data;
        }
      });
      queryIndustryType().then(res => {
        if (res.success) {
          this.industryTypeData = res.data;
        }
      });
    },
    clearSelectAll() {
      // this.$refs.table.selectAll(false);
    },
    remove(v) {
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除 " + v.modelName + " ?",
        onOk: () => {
          // 删除
          myDelete({ id: v.id }).then(res => {
            if (res.success) {
              this.$Message.success("操作成功");
              this.getDataList();
            }
          });
        }
      });
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
          myDelete({ modelId: ids }).then(res => {
						if(res.success){
							this.$Message.success("操作成功");
							this.clearSelectAll();
							this.getDataList();
						}
          });
        }
      });
    },
    add() {
      // this.$refs.dictForm.resetFields();
      this.enable = false;
      this.dictForm = {
        id: "",
        modelName: "",
        contractTypeId: "",
        contractTypeName: "",
        sortOrder: 0,
        modelAddress: "",
        fileName: "",
        createBy: this.form_up.updateBy,
        createTime: this.form_up.createTime,
        departmentTitle: this.form_up.departmentTitle,
				usedCount:0
      };
      this.modalVisible = true;
      // console.log(this.dictForm);
      document.getElementById("upload").innerHTML = "点击上传";
      // 				this.$nextTick(() => {
      // 					 this.$refs.dictForm.resetFields();
      // 				 });
    },
    addExternal() {
      this.externalModalVisible = true;
    },
    edit(v) {
      this.modalVisible = true;
      this.enable = false;
      this.dictForm = v;
      document.getElementById("upload").innerHTML = v.fileName;
      // 				if(v.modelAddress){
      // 					this.fildDownUrl = "/zhfw/contract/contractModel/download?id="+v.id+"&accessToken="+this.getStore("accessToken");
      // 				}
      // 				this.$refs.dictForm.resetFields();
    },
    see(v) {
      let query = { type: 1, id: v.id, backRoute: this.$route.name };
      this.$router.push({
        name: "establishDetail",
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
    getDataList() {
      this.loading = true;
      contractModelquery(this.searchForm).then(res => {
        this.loading = false;
        if (res.success === true) {
          this.data = res.result.data;
          this.total = res.result.totalSize;
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>