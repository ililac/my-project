<style lang="less">
@import "./historicDetail.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card style="margin-bottom:10px;">
          <p slot="title" style="height:32px;">
            <span>审批历史 <Button type="primary" style="float:right" v-show="isShow" @click="handleExport">下载审批单</Button></span>
          </p>
          <Row style="position:relative">
            <Table :loading="loading" border :columns="columns" :data="data" ref="table"></Table>
            <Spin size="large" fix v-if="loading"></Spin>
          </Row>
        </Card>
        <Card>
          <p slot="title">
            <span>实时流程图</span>
          </p>
          <Row style="position:relative">
            <img :src="imgUrl">
            <Spin size="large" fix v-if="loadingImg"></Spin>
          </Row>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { getHighlightImg, historicFlow } from "@/api/activiti";
import util from "@/libs/util";
export default {
  name: "historic_detail",
  data() {
    return {
      type: 0,
      isShow:false,
      loading: false, // 表单加载状态
      loadingImg: false,
      columns: [
        // 表头
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "任务名称",
          key: "name",
          sortable: true
        },
        {
          title: "处理人",
          key: "assignee",
          align: "center",
          sortable: true
        },
        {
          title: "审批操作",
          key: "deleteReason",
          align: "center",
          sortable: true
        },
        {
          title: "审批意见",
          key: "comment",
          align: "center",
          sortable: true
        },
//        {
//          title: "耗时",
//          key: "duration",
//          align: "center",
//          sortable: true,
//          render: (h, params) => {
//            return h("div", util.millsToTime(params.row.duration));
//          }
//        },
        {
            title: "相关附件",
            key: "fileName",
            align: "center",
						render: (h, params) => {
						  return h("div", [
						    h(
						      "a",
						      {
						        on: {
						          click: () => {
						            this.fileDown(params.row);
						          }
						        }
						      },
						      params.row.fileName
						    )
						  ]);
						}
        },
        {
          title: "完成时间",
          key: "endTime",
          width: 150,
          sortable: true
        },
        {
          title: "状态",
          align: "center",
          render: (h, params) => {
            let text = "",
              color = "";
            if (params.row.endTime) {
              color = "blue";
              text = "已办理";
            } else {
              color = "default";
              text = "待处理";
            }
            return h("div", [
              h(
                "Tag",
                {
                  props: {
                    color: color
                  }
                },
                text
              )
            ]);
          }
        }
      ],
      data: [],
      id: "",
      imgUrl: "",
      backRoute: ""
    };
  },
  methods: {
    handleExport(){
      window.open(
        "/zhfw/active/actTask/downloadApprovalForm?" +
          "tableId=" +
          this.$route.query.tableId +
          "&procInstId=" +
          this.$route.query.id +
          "&access_token=" +
         this.getStore("accessToken")
      );
    },
    init() {
      this.type = this.$route.query.type;
      this.backRoute = this.$route.query.backRoute;
      this.id = this.$route.query.id;
      this.imgUrl =
        getHighlightImg +
        this.id +
        "?access_token=" +
        this.getStore("accessToken") +
        "&time=" +
        new Date();
      this.getDataList();
      if (this.$route.query.status=='2') {
      this.isShow = true
    }
    },
    getDataList() {
      this.loading = true;
      historicFlow(this.id).then(res => {
        this.loading = false;
        if (res.success) {
          this.data = res.result;
        }
      });
    },
    // 关闭当前页面
    closeCurrentPage() {
      this.$store.commit("removeTag", "historic_detail");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      this.$router.push({
        name: this.backRoute
      });
    },
		//相关附件下载
		fileDown(v){
			window.open("/zhfw/contract/draft/download?fileName="+v.fileName+"&url="+v.fileAddress+"&access_token="+this.getStore("accessToken"));
		}
  },
  mounted() {
    this.init();
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      if (to.name == "historic_detail") {
        this.init();
      }
    }
  }
};
</script>