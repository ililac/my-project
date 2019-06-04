<style lang="less" scoped>
@import "../formModel.less";
.demo-upload-list {
  display: inline-block;
  text-align: center;
  border-radius: 4px;
  background-color: #e3e3e3;
  position: relative;
  margin-right: 15px;
  margin-bottom: 10px;
}
.demo-upload-list .affixList {
  padding: 0 10px;
}
.demo-upload-list-cover i {
  position: absolute;
  right: -10px;
  top: -10px;
  font-size: 20px;
  cursor: pointer;
}
.dome-relative-list {
  float: left;
  text-align: right;
  width: 120px;
  display: inline-block;
}
.dome-relative-label {
  float: left;
  width: 120px;
  text-align: right;
  display: inline-block;
  padding: 10px 12px 10px 0;
}
.dome-relative-label:before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}
.dome-relative-label:before,
.list-icon:before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 12px;
  color: #ed4014;
}
.list-icon {
  width: 10px;
  height: 10px;
  position: absolute;
  left: -93px;
  top: 0;
}
@deep: ~">>>";
@{deep} .ivu-table-row {
  cursor: pointer;
}
</style>
<template>
  <div class="search">
    <Card>
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col :span="24">
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="60" class="search-form">
              <Form-item label="名称" prop="name">
                <Input
                  type="text"
                  v-model="searchForm.name"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="类型" prop="typeId">
                <Select v-model="searchForm.typeId" style="width:200px">
                  <Option
                    v-for="item in typeArr"
                    :value="item.id"
                    :key="item.title"
                  >{{ item.title }}</Option>
                </Select>
              </Form-item>
              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
                <Button @click="handleReset">重置</Button>
              </Form-item>
            </Form>
          </Row>
          <Row>
            <Table
              :loading="loading"
              border
              :columns="columns"
              :data="data"
              sortable="custom"
              @on-sort-change="changeSort"
              ref="table"
            ></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page
              :current="searchForm.pageNo"
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
      title="合同归档"
      v-model="modalVisible"
      :mask-closable="false"
      :width="1000"
      :styles="{top: '30px'}"
      @on-cancel="handleModelClose"
      class="formModel"
    >
      <Form ref="dictForm" :model="dictForm" :label-width="120" :rules="dictFormValidate">
        <div class="ul">
          <FormItem label="档案编号" prop="number" class="lef">
            <Input v-model="dictForm.number" style="width:320px"/>
          </FormItem>
          <Form-item label="档案保管时间" prop="keepTime" class="lef">
            <DatePicker
              type="date"
              format="yyyy-MM-dd"
              v-model="dictForm.keepTime"
              placeholder="选择时间"
              style="width:320px"
            ></DatePicker>
          </Form-item>
        </div>
        <div class="ul">
          <FormItem label="档案保管人" prop="archivist">
            <Input
              v-model="dictForm.archivist"
              placeholder="请选择"
              @on-focus="handleArchivist"
              style="width: 320px"
            >
              <Button slot="append" icon="ios-arrow-down" @click="handleArchivist"></Button>
            </Input>
          </FormItem>
        </div>
        <Form-item label="归档材料清单" prop="isTopayList" class="lef" style="width:900px">
          <span class="list-icon"></span>
          <CheckboxGroup v-model="isTopayList">
            <Checkbox label="合同正文"></Checkbox>
            <Checkbox label="合同相关附件"></Checkbox>
            <Checkbox label="我方授权委托书"></Checkbox>
            <Checkbox label="对方授权委托书"></Checkbox>
            <Checkbox label="其他"></Checkbox>
          </CheckboxGroup>
        </Form-item>
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
              style="width:810px"
            >
              <p id="attachmentname" class="upload" @click="getUpId('attachmentname')">
                <Icon type="ios-cloud-upload-outline" size="20">上传文件</Icon>
              </p>
            </Upload>
            <p style="color: #d3d3d3;">支持文件大小：<=10MB</p>
            <div class="demo-upload-list" v-for="item in uploadList">
              <div class="demo-upload-list-cover">
                <template>
                  <p class="affixList">
                    <a v-bind:href="item.fileDownUrl">{{item.name}}</a>
                  </p>
                  <Icon type="ios-close-circle" @click.native="handleRemove(item)"></Icon>
                </template>
              </div>
            </div>
          </FormItem>
        </Col>
        <div class="ul">
          <FormItem label="备注" prop="remark" style="width:930px">
            <Input type="textarea" v-model="dictForm.remark" :rows="3"/>
          </FormItem>
        </div>
      </Form>
      <div style="clear:both"></div>
      <div slot="footer">
        <Button type="text" @click="handleModelClose">取消</Button>
        <Button :loading="btnLoading" type="primary" @click="planConfirm('dictForm')">
          <span v-if="!btnLoading">提交</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
    </Modal>
    <Modal
      title="组织机构选人"
      v-model="applyModalVisible"
      class="model-apply"
      :mask-closable="false"
      :width="700"
    >
      <div class="clear">
        <Col :span="24">
          <Col :span="12">
            <div class="tree-bar">
              <Tree
                ref="tree"
                :data="treeData"
                :load-data="loadData"
                @on-select-change="selectTree"
              ></Tree>
            </div>
          </Col>
          <Col :span="12">
            <Alert show-icon>
              已选择
              <span class="select-count">{{selectCount}}</span> 项
            </Alert>
            <Table
              :height="300"
              :loading="loading"
              highlight-row
              border
              :columns="columns1"
              :data="personData"
              ref="table1"
              @on-current-change="showSelect2"
            ></Table>
          </Col>
        </Col>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <Button type="text" @click="handelCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {
  getContractByPage,
  getDictDataByType,
  archive,
  loadDepartment,
  searchAchiveUser,
  getArchiveNumber,
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
      accessToken: {}, // 上传token鉴权
      errorMsg: "",
      btnLoading: false, //确认履行计划中确定按钮
      btnLoading2: false, //新建履行计划中保存按钮
      btnLoading3: false, //反馈中保存按钮
      submitLoading: false, // 添加或编辑提交状态
      applyModalVisible: false,
      treeData: [
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
      columns1: [
        // // 表头
        // {
        //     type: "selection",
        //     align: "center",
        // 	width:134
        // },
        {
          title: "姓名",
          key: "nickName",
          align: "center"
        }
      ],
      personData: [], // 审批人数据
      selectCount: 0, ///选中的审批人数量
      newPlanRelativeList: [], //收付款相对方列表
      dictFormValidate: {
        // 表单验证规则
        archivist: [{ required: true, message: "不能为空" }],
        keepTime: [{ required: true, message: "不能为空" }]
        // materialsBill: [{ required: true, message: "不能为空" }],
        // isTopayList: [
        //   {
        //     required: true,
        //     type: "array",
        //     min: 1,
        //     message: "至少选择一项",
        //     trigger: "change"
        //   }
        // ]
      },
      newPlan: 1, //是否点击了新建履行计划中的添加数据
      relative_type: [],
      main_type: [],
      ownership_type: [],
      modalVisible: false,
      newPlanModel: false, //新建履行计划模块
      modalSign: false,
      feedbackModel: false,
      feedbackModelSee: false, //查看反馈
      lockDate: {
        counterpartId: "",
        blackFlag: ""
      },
      findCompanyDate: {
        company: ""
      },
      feedbackModelForm: {
        id: "",
        factMoney: "",
        factpayTime: "",
        invoiceTime: "",
        invoiceMoney: "",
        invoiceNumber: "",
        remark: "",
        contractPlayId: "",
        isDone: 0
      },
      //搜索部分的列表字段
      dictForm: {
        contactId: "",
        number: "",
        keepTime: "",
        archivist: "",
        materialsBill: "",
        // isTopayList: [],
        remark: "",
        attachmentList: []
      },
      //作废部分的列表字段
      cancellationForm: {
        name: "",
        number: "",
        userName: "",
        department: "",
        money: "",
        time: ""
      },
      finishForm: {
        id: "",
        time: "",
        explain: "",
        remark: "",
        Url: "",
        UrlName: "",
        contractId: ""
      },
      //新建履行计划表格数据
      newPlanModelForm: {
        id: "",
        task: "",
        issatisfypay: 0,
        paytype: 0,
        factmoney: "",
        proportion: "",
        startplaytime: "",
        endplaytime: "",
        content: "",
        remark: "",
        contractId: "",
        isuse: ""
      },
      loading: false, // 表格加载状态
      data: [], //表单数据
      typeArr: [],
      archivistArr: [],
      total: 0, // 表单数据总数
      columns: [
        // 表头
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "合同名称",
          width: 280,
          key: "name",
          align: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.detail(params.row);
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
          title: "合同类型",
          key: "type",
          align: "center"
        },
        {
          title: "合同金额",
          key: "money",
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
                      this.confirm(params.row);
                    }
                  }
                },
                "合同归档"
              )
            ]);
          }
        }
      ],
      time: {
        endTime: "",
        startTime: ""
      },
      //搜索部分数据
      searchForm: {
        name: "",
        typeId: "",
        type: "",
        pageSize: 10,
        pageNo: 1
      },
      form_up: {
        updateBy: "",
        createTime: "",
        department: "",
        userId: ""
      },
      form: {
        procDefId: "",
        procInstId: "",
        assignees: [],
        priority: "",
        id: "",
        tableId: "",
        title: "",
        priority: "0"
      },
      isTopayList: [],
      defaultList: [],
      uploadList: [],
      upId: ""
    };
  },
  methods: {
    //确定履行计划
    planConfirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.dictForm.materialsBill = this.isTopayList.join(",");
          this.dictForm.keepTime = this._fmtDate("yyyy-MM-dd hh:mm:ss",this.dictForm.keepTime);
          let uploadList = this.uploadList.map((item, index) => {
            return {
              fileName: item.name,
              fileUrl: item.url
            };
          });
          this.dictForm.attachmentList = JSON.stringify(uploadList);
          if (this.isTopayList.length == 0) {
            this.$Message.error("归档材料清单没有选择");
            return;
          }
          archive(this.dictForm).then(res => {
            this.modalVisible = false;
            if (res.success) {
              this.$Message.success("归档成功");
              this.getDataList();
            }
          });
        }
      });
    },
    handleModelClose() {
      this.modalVisible = false;
      this.$refs.dictForm.resetFields();
      this.uploadList = [];
      this.$refs.upload2.fileList = []
      this.isTopayList = [];
    },
    init() {
      this.accessToken = {
        'access_token': this.getStore("accessToken"),
        'Authorization': 'Bearer '+this.getStore("accessToken")
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
      this.getDictDataByType();
    },
    //重新编辑履行计划
    edit(v) {
      Object.keys(v).forEach(function(key) {
        if (v[key] === null) {
          v[key] = "";
        }
      });
      this.residueMoney1 = v.factmoney;
      this.newPlanModelForm = v;
      this.newPlanModel = true;
      this.newPlan == 1;
    },
    //合同归档
    confirm(v) {
      this.modalVisible = true;
      this.dictForm.contactId = v.id;
      getArchiveNumber().then(res => {
        if (res.success) {
          this.dictForm.number = res.result;
        }
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
    changePage(v) {
      this.searchForm.pageNo = v;
      this.getUserList();
      this.clearSelectAll();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getUserList();
    }, //以下是附件上传的事件
    handleRemove(file) {
      const fileList = this.$refs.upload2.fileList;
      this.$refs.upload2.fileList.splice(fileList.indexOf(file), 1);
    },
    affixHandleSuccess(res, file) {
      if (!res.success) {
        this.$Message.error("上传失败");
        return;
      } else {
        file.url = res.result[0].url;
        file.name = res.result[0].name;
        file.fileDownUrl =
          "/zhfw/contract/draft/download?fileName=" +
          res.result[0].name +
          "&url=" +
          res.result[0].url +
          "&access_token=" +
          this.getStore("accessToken");
        this.uploadList = this.$refs.upload2.fileList;
      }
      document.getElementById("attachmentname").innerHTML = "点击上传";
    },
    affixHandleMaxSize(file) {
      this.$Notice.warning({
        title: "文件太大",
        desc: "文件  " + file.name + " 超过了10MB"
      });
      document.getElementById("attachmentname").innerHTML = "点击上传";
    },
    affixhandleBeforeUpload() {
      document.getElementById("attachmentname").innerHTML = "文件上传中...";
    },
    getUpId(id) {
      this.upId = id;
    },
    //以上是附件上传的事件
    handleSearch() {
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      // 重新加载数据
      this.getDataList();
    },
    handleExport() {},
    detail(v) {
      let query = { type: 2, id: v.id, backRoute: this.$route.name };
      this.$router.push({
        name: "detail",
        query: query
      });
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
    selectTree(v) {
      if (v.length > 0) {
        searchAchiveUser({
          departmentId: v[0].id
        }).then(res => {
          if (res.success) {
            this.personData = res.result.userList;
          }
        });
      }
    },
    //申请人选择事件
    showSelect2(e) {
      this.selectList = e;
      this.selectCount = 1;
      this.applyModalVisible = false;
      this.dictForm.archivist = e.nickName;
    },
    handleArchivist() {
      this.applyModalVisible = true;
    },
    handelCancel() {
      this.applyModalVisible = false;
    },
    getDataList() {
      this.loading = true;
      this.data = [];
      this.total = 0;
      getContractByPage(this.searchForm).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result.records;
          this.total = res.result.total;
        }
      });
    },
    getDictDataByType() {
      getDictDataByType("contract_type").then(res => {
        if (res.success) {
          this.typeArr = res.result;
        }
      });
    },
    _fmtDate(fmt,date) {
      var date = new Date(date)
       var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
    }
  },
  mounted() {
    this.init();
  }
  // watch: {
  //   // 监听路由变化
  //   $route(to, from) {
  //     if (to.name == "perform") {
  //       this.init();
  //     }
  //   }
  // }
};
</script>