<style lang="less" scoped>
@import "../formModel.less";
.search select {
  display: inline-block;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}
</style>
<template>
  <div class="search">
    <Card>
      <Row type="flex" justify="space-between" class="code-row-bg search">
        <Col :span="24">
          <Row>
            <Form
              ref="searchForm"
              :model="searchForm"
              inline
              :label-width="120"
              class="search-form"
            >
              <Form-item label="合同名称">
                <Input
                  type="text"
                  v-model="searchForm.name"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="合同编号">
                <Input
                  type="text"
                  v-model="searchForm.number"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
              </Form-item>
              <Form-item label="合同类型">
                <contract-type
                  v-on:typeListen="typeChange"
                  :typeDate.sync="formData1"
                  :widthDate.sync="myStyle"
                ></contract-type>
              </Form-item>
              <Form-item label="相对方">
                <Select
                  v-model="searchForm.counterpartId"
                  filterable
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                >
                  <Option v-for="item in counterpartArr" :value="item.id">{{item.counterpartName}}</Option>
                </Select>
              </Form-item>
              <Form-item label="收付款方式">
                <Checkbox
                  :indeterminate="payIndeterminate"
                  :value="payCheckAll"
                  @click.prevent.native="payAllSelect"
                  style="float: left;"
                >全选</Checkbox>
                <CheckboxGroup
                  v-model="payStateList"
                  @on-change="payAllSelect2"
                  style="float: left;"
                >
                  <Checkbox :label="item.value" v-for="item in payCheckedList">
                    <span>{{item.title}}</span>
                  </Checkbox>
                </CheckboxGroup>
              </Form-item>
              <Form-item label="状态">
                <Checkbox
                  :indeterminate="indeterminate"
                  :value="checkAll"
                  @click.prevent.native="allSelect"
                  style="float: left;"
                >全选</Checkbox>
                <CheckboxGroup v-model="stateList" @on-change="allSelect2">
                  <Checkbox :label="item.value" v-for="item in checkedList">
                    <span>{{item.title}}</span>
                  </Checkbox>
                </CheckboxGroup>
              </Form-item>
              <Form-item label="起草人">
                <Input
                  type="text"
                  v-model="searchForm.draftsManName"
                  placeholder="请输入"
                  clearable
                  style="width: 200px"
                />
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
                <Button @click="handleReset" type="primary">重置</Button>
                <!-- <Button @click="handleExport">excel导出</Button> -->
              </Form-item>
            </Form>
          </Row>
          <Row style="padding-bottom: 20px;">
            <Button @click="handleExport">excel导出</Button>
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
              :current="searchForm.pageNum"
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
  </div>
</template>

<script>
import {
  contractSearch,
  detailList,
  getDictDataByType,
  eachOther,
  fromUp
} from "@/api/index";
import circleLoading from "../../my-components/circle-loading.vue";
import contractType from "../../activiti/business/contractType.vue";
export default {
  name: "search",
  components: {
    circleLoading,
    contractType
  },
  data() {
    return {
      accessToken: {}, // 上传token鉴权
      selectCount: 0,
      loading: false, // 表格加载状态
      data: [], //表单数据
      total: 0, // 表单数据总数
      counterpartArr: [], //相对方列表
      typeArr: [], //合同类型
      myStyle: { display: "flex", width: "214px" }, //合同类型宽度
      formData1: {
        contractType: "",
        typeid: ""
      },
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
          key: "name",
          align: "left"
        },
        {
          title: "合同编号",
          key: "number",
          width: 100,
          align: "center"
        },
        {
          title: "合同金额",
          key: "money",
          width: 110,
          align: "center"
        },
        {
          title: "相对方",
          key: "counterpartname",
          width: 220,
          align: "left"
        },
        {
          title: "收付款方式",
          key: "istopayState",
          width: 120,
          align: "center"
        },
        {
          title: "合同状态",
          key: "state",
          width: 150,
          align: "center"
        },
        {
          title: "起草人",
          key: "draftsman",
          width: 110,
          align: "center"
        },
        {
          title: "起草时间",
          key: "draftstime",
          width: 110,
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
                      this.look(params.row);
                    }
                  }
                },
                "查看"
              )
            ]);
          }
        }
      ],
      columns2: [
        // 表头
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "合同约定任务",
          key: "task",
          width: 110,
          align: "center"
        },
        {
          title: "收付款类型",
          // key: "paytype",
          width: 120,
          align: "center",
          render: (h, params) => {
            let text = "",
              color = "default";
            if (params.row.paytype == 1) {
              text = "收款";
            } else if (params.row.paytype == 0) {
              text = "付款";
            } else if (params.row.paytype == 2) {
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
          title: "收付金额",
          key: "factmoney",
          width: 90,
          align: "center"
        },
        {
          title: "所占比例",
          key: "proportion",
          width: 90,
          align: "center"
        },
        {
          title: "计划开始时间",
          key: "startplaytime",
          width: 110,
          align: "center"
        },
        {
          title: "计划结束时间",
          key: "endplaytime",
          width: 110,
          align: "center"
        },
        {
          title: "履行内容",
          key: "proportion",
          width: 90,
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          width: 75,
          align: "center"
        }
      ],
      //搜索部分数据
      searchForm: {
        name: "",
        number: "",
        typeId: "", //合同类型id
        isTopay: "",
        startTime: "",
        endTime: "",
        counterpartId: "",
        draftsManName: "",
        pageSize: 10,
        pageNum: 1
      },
      indeterminate: false,
      checkAll: false,
      stateList: [],
      checkedList: [],
      payIndeterminate: false,
      payCheckAll: false,
      payStateList: [],
      payCheckedList: [
        {
          value: "1",
          title: "收款"
        },
        {
          value: "0",
          title: "付款"
        },
        {
          value: "2",
          title: "不涉及"
        }
      ],
      form_up: {
        updateBy: "",
        createTime: "",
        departmentTitle: "",
        userId: ""
      }
    };
  },
  methods: {
    //搜索出时间校验
    timeChange() {
      if (!this.searchForm.startTime) {
        this.$Message.error("请先选择开始时间");
        this.searchForm.endTime = "";
        return;
      }
      if (this.searchForm.startTime >= this.searchForm.endTime) {
        this.$Message.error("开始时间不能大于等于结束时间");
        this.searchForm.endTime = "";
      }
    },
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
      eachOther().then(res => {
        this.counterpartArr = res.result.content;
      });
      getDictDataByType("stateType").then(res => {
        if (res.success) {
          this.checkedList = res.result;
        }
      });
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
    showSelect(e) {
      this.selectList = e;
      this.selectCount = e.length;
    },
    changePage(v) {
      this.searchForm.pageNum = v;
      this.getDataList();
    },
    changePageSize(v) {
      this.searchForm.pageSize = v;
      this.getDataList();
    },
    handleSearch() {
      this.isSearch = true;
      this.searchForm.pageNum = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    handleReset() {
      this.indeterminate = false;
      this.payIndeterminate = false;
      this.checkAll = false;
      this.payCheckAll = false;
      this.stateList = [];
      this.payStateList = [];
      this.searchForm = {
        name: "",
        number: "",
        typeId: "",
        isTopay: "",
        startTime: "",
        endTime: "",
        draftsManName: "",
        pageSize: 10,
        pageNum: 1
      };
      this.formData1 = {
        contractType: "",
        typeid: ""
      };
      this.getDataList();
    },
    //表格导出
    handleExport() {
      if (this.searchForm.startTime !== "") {
        this.searchForm.startTime = this._fmtDate(
          "yyyy-MM-dd",
          this.searchForm.startTime
        );
      }
      if (this.searchForm.endTime !== "") {
        this.searchForm.endTime = this._fmtDate(
          "yyyy-MM-dd",
          this.searchForm.endTime
        );
      }
      // this.searchForm.stateIds = this.stateList;
      if (!this.isSearch) {
        this.searchForm = {
          name: "",
          number: "",
          typeId: "", //合同类型id
          isTopay: "",
          startTime: "",
          endTime: "",
          draftsManName: "",
          stateIds: "",
          counterpartId: ""
        };
      }
      window.open(
        "/zhfw/contract/query/exportXls?pageSize=10&pageNum=1&stateIds=" +
          this.searchForm.stateIds +
          "&name=" +
          this.searchForm.name +
          "&number=" +
          this.searchForm.number +
          "&typeId=" +
          this.searchForm.typeId +
          "&isTopay=" +
          this.searchForm.isTopay +
          "&startTime=" +
          this.searchForm.startTime +
          "&endTime=" +
          this.searchForm.endTime +
          "&counterpartId=" +
          this.searchForm.counterpartId +
          "&draftsManName=" +
          this.searchForm.draftsManName +
          "&access_token=" +
          this.accessToken.accessToken
      );
    },
    allSelect() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.stateList = [];
        for (let item of this.checkedList) {
          this.stateList.push(item.value);
        }
      } else {
        this.stateList = [];
      }
    },
    allSelect2(data) {
      // this.searchFormCheckedList.stateIds1 = false;
      if (data.length === this.checkedList.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    payAllSelect() {
      if (this.payIndeterminate) {
        this.payCheckAll = false;
      } else {
        this.payCheckAll = !this.payCheckAll;
      }
      this.payIndeterminate = false;
      if (this.payCheckAll) {
        this.payStateList = [];
        for (let item of this.payCheckedList) {
          this.payStateList.push(item.value);
        }
      } else {
        this.payStateList = [];
      }
    },
    payAllSelect2(data) {
      // this.searchFormCheckedList.stateIds1 = false;
      if (data.length === this.payCheckedList.length) {
        this.payIndeterminate = false;
        this.payCheckAll = true;
      } else if (data.length > 0) {
        this.payIndeterminate = true;
        this.payCheckAll = false;
      } else {
        this.payIndeterminate = false;
        this.payCheckAll = false;
      }
    },
    //合同类型中的
    typeChange(v) {
      this.searchForm.typeId = v.id;
      this.searchForm.contractType = v.typeName;
    },
    look(v) {
      let query = { type: 1, id: v.id, backRoute: this.$route.name };
      this.$router.push({
        name: "detail",
        query: query
      });
    },
    _fmtDate(fmt, date) {
      var date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    },
    getDataList() {
      this.loading = true;
      this.data = [];
      this.searchForm.stateIds = this.stateList;
      this.searchForm.isTopay = this.payStateList;
      if (this.searchForm.startTime !== "") {
        this.searchForm.startTime = this._fmtDate(
          "yyyy-MM-dd",
          this.searchForm.startTime
        );
      }
      if (this.searchForm.endTime !== "") {
        this.searchForm.endTime = this._fmtDate(
          "yyyy-MM-dd",
          this.searchForm.endTime
        );
      }
      contractSearch(this.searchForm).then(res => {
        this.loading = false;
        this.total = res.data.total;
        let arr = res.data.data;
        for (var item in arr) {
          if (arr[item].istopay == 1) {
            arr[item].istopayState = "收款";
          } else if (arr[item].istopay == 0) {
            arr[item].istopayState = "付款";
          } else if (arr[item].istopay == 2) {
            arr[item].istopayState = "不涉及";
          }
        }
        this.data = arr;
      });
    }
  },
  mounted() {
    this.init();
    getDictDataByType("contract_type").then(res => {
      if (res.success) {
        this.typeArr = res.result;
      }
    });
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      if (to.name == "htcx") {
        this.init();
      }
    }
  }
};
</script>