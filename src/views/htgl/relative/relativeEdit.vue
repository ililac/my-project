<template>
  <div>
    <Modal
      title="相对方管理"
      v-model="modalVisible"
      :mask-closable="false"
      :width="1000"
      :styles="{top: '30px'}"
      class="formModel"
      footer-hide
      @on-visible-change="visiblechange"
    >
      <Form ref="dictForm" :model="dictForm" :label-width="120" :rules="dictFormValidate">
        <div class="ul">
          <FormItem label="相对方类型:" class="lef code1">
            <span class="span">*</span>
            <Select
              v-model="dictForm.counterpartNatureId"
              @on-change="handelSelectNature"
              placeholder="请选择"
              clearable
            >
              <Option value="企业">企业</Option>
              <Option value="国家机关">国家机关</Option>
              <Option value="事业单位">事业单位</Option>
              <Option value="社会团体">社会团体</Option>
              <Option value="其他组织机构">其他组织机构</Option>
              <Option value="自然人">自然人</Option>
            </Select>
          </FormItem>
          <Form-item label="相对方编号:" class="lef">
            <span>{{dictForm.counterpartNumber}}</span>
          </Form-item>
        </div>
        <div class="ul">
          <FormItem
            label="相对方名称:"
            class="lef"
            prop="counterpartName"
            v-show="dictForm.counterpartNatureId=='企业'"
          >
            <AutoComplete
              v-model="dictForm.counterpartName"
              :data="counterpartList"
              style="float: left;width: 80%;"
            >
              <Option v-for="item in counterpartList" :value="item" :key="item">{{ item }}</Option>
            </AutoComplete>
            <Button
              :loading="btnLoading2"
              style="float: left;width: 20%;"
              @click="findCompany"
              icon="md-refresh"
            >
              <span v-if="!btnLoading2">同步</span>
              <span v-else>同步</span>
            </Button>
          </FormItem>
          <FormItem
            label="相对方名称:"
            class="lef"
            prop="counterpartName"
            v-show="dictForm.counterpartNatureId!=='企业'"
          >
            <input type="text" value v-model="dictForm.counterpartName">
          </FormItem>
		    <FormItem label="企业类型:" v-show="dictForm.counterpartNatureId=='企业'" class="lef code">
            <span class="span">*</span>
            <Select v-model="dictForm.enterpriseId" placeholder="请选择" clearable>
              <Option v-for="item in ownership_type" :value="item.id">{{item.title}}</Option>
            </Select>
          </FormItem>
          <FormItem label="身份证号:" v-show="dictForm.counterpartNatureId=='自然人'" class="lef code">
            <span class="span">*</span>
            <Input type="text" @on-blur="checkCreditCode(dictForm.creditCode)" v-model="dictForm.creditCode"></Input>
          </FormItem>
		  
		</div>
        <div class="ul">
          <FormItem label="联系地址:" v-show="dictForm.counterpartNatureId=='自然人'" class="lef">
            <input type="text" v-model="dictForm.officeAddress">
          </FormItem>
          <!-- <Form-item label="机构类型:" class="lef">
						<select v-model="dictForm.counterpartTypeId" placeholder="请选择" >
							<option  v-for="item in relative_type" :value="item.id" >{{item.title}}</option>
						</select>
          </Form-item>-->
          <FormItem label="统一社会信用代码:" v-show="dictForm.counterpartNatureId=='企业'" class="lef">
            <span class="input-disable">{{dictForm.creditCode}}</span>
            <!-- <input type="text" value="" v-model="dictForm.creditCode"/> -->
          </FormItem>
          <FormItem label="资质证书:" class="lef">
            <Upload
              action="/zhfw/system/upload/uploadFiles?tag=qualificationInfoAddr-qualificationInfoName"
              ref="upload"
              :headers="accessToken"
              :show-upload-list="false"
              :format="['pdf']"
              :on-format-error="handleFormatError" 
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :on-error="handleError"
              :max-size="10240"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              class="upload"
            >
              <p class="upload">
                <Icon type="ios-cloud-upload-outline" size="20"/>
                <span id="qualificationInfoName">上传文件</span>
              </p>
            </Upload>
            <p style="color: #d3d3d3;">支持文件格式：pdf,支持文件大小：<=10MB</p>
            <div class="demo-upload-list" v-for="item in uploadList">
              <div class="demo-upload-list-cover">
                <template>
                  <!-- <Tag closable @on-close="handleRemove(item)" @click.native="fileDowm(item)"><a>{{item.name}}</a></Tag> -->
                  <p class="affixList">
                    <a v-bind:href="item.fileDownUrl">{{item.name}}</a>
                  </p>
                  <Icon type="ios-close-circle" @click.native="handleRemove(item)"></Icon>
                </template>
              </div>
            </div>
          </FormItem>
        </div>
        <div class="ul">
          <FormItem
            label="成立时间:"
            v-show="dictForm.counterpartNatureId=='企业'"
            class="lef"
            prop="estiblishTime"
          >
            <span class="input-disable">{{dictForm.registerDate}}</span>
            <!-- <input type="text" value="" v-model="dictForm.registerDate"/> -->
          </FormItem>
          <FormItem
            label="注册资本:"
            class="lef"
            v-show="dictForm.counterpartNatureId=='企业'"
            prop="regCapital"
          >
            <span class="input-disable">{{dictForm.registerCapital}}</span>
            <!-- <input type="text" value="" v-model="dictForm.registerCapital"/> -->
          </FormItem>
		  </div>
        <div class="ul">
          <FormItem label="法定代表人:" v-show="dictForm.counterpartNatureId!=='自然人'" class="lef">
            <span class="input-disable" v-if="dictForm.counterpartNatureId=='企业'">{{dictForm.legalPersonName}}</span>
            <input type="text" v-else v-model="dictForm.legalPersonName"/>
          </FormItem>
          <FormItem label="办公地址:" v-show="dictForm.counterpartNatureId!=='自然人'" class="lef">
            <span class="input-disable addr" :title="dictForm.officeAddress" v-if="dictForm.counterpartNatureId=='企业'">{{dictForm.officeAddress}}</span>
            <input type="text" v-else v-model="dictForm.officeAddress"/>
          </FormItem>
        </div>
        <div class="ul">
          <FormItem label="开户行:" class="lef">
            <Input type="text" v-model="dictForm.openBank" @on-change="valiText(dictForm.openBank)"></Input>
          </FormItem>
          <FormItem label="银行账号:" class="lef">
            <Input type="text" v-model="dictForm.bankAccount"></Input>
          </FormItem>
        </div>
        <div class="ul txtar">
          <FormItem label="经营范围:" v-if="dictForm.counterpartNatureId=='企业'">
            <span class="input-disable">{{dictForm.comment}}</span>
          </FormItem>
          <FormItem label="备注:" v-if="dictForm.counterpartNatureId!=='企业'">
            <Input type="textarea" :maxlength="1000" v-model="dictForm.comment" :rows="5"/>
          </FormItem>
        </div>
        <div class="ul" style="margin-bottom: 20px;">
          <Menu mode="horizontal" active-name="1" @on-select="navSelect"   v-if="dictForm.counterpartNatureId=='企业'">
            <MenuItem name="1">联系人信息</MenuItem>
            <MenuItem name="2" >股东信息</MenuItem>
						<MenuItem name="5">
							案件信息
						</MenuItem>
          </Menu>
		  <Menu mode="horizontal" active-name="1" @on-select="navSelect"   v-else>
            <MenuItem name="1">联系人信息</MenuItem>
          </Menu>
        </div>
        <div class="clear" v-show="detailList == 1">
          <Table border :columns="link" :data="dictForm.linkMans" sortable="custom" ref="table"></Table>
          <div
            class="clear"
            style="height: 40px;line-height: 40px;text-align: center;color: #2d8cf0;cursor: pointer;"
            @click="linkAdd"
          >+添加联系人</div>
          <Row type="flex" justify="end" class="page">
            <Page :total="dictForm.linkTotal" show-total :page-size="10" @on-change="pageChange"/>
          </Row>
        </div>
        <div class="clear" v-show="detailList == 2">
          <Table
            border
            :columns="stockholders"
            :data="dictForm.stockholdersList"
            sortable="custom2"
            ref="table2"
          ></Table>
          <Row type="flex" justify="end" class="page">
            <Page
              :total="dictForm.stockholdersTotal"
              show-total
              :page-size="10"
              @on-change="pageChange"
            />
          </Row>
        </div>
        <div class="clear" v-show="detailList == 3">
          <Table
            border
            :columns="administrative"
            :data="dictForm.punishmentInfos"
            sortable="custom3"
            ref="table3"
          ></Table>
          <Row type="flex" justify="end" class="page">
            <Page
              :total="dictForm.administrativeTotal"
              show-total
              :page-size="10"
              @on-change="pageChange"
            />
          </Row>
        </div>
        <div class="clear" v-show="detailList == 4">
          <Table
            border
            :columns="notice"
            :data="dictForm.ktannouncements"
            sortable="custom4"
            ref="table4"
          ></Table>
          <Row type="flex" justify="end" class="page">
            <Page :total="dictForm.noticeTotal" show-total :page-size="10" @on-change="pageChange"/>
          </Row>
        </div>
        <div class="clear btns">
          <Button type="text" @click="cancelHandel">取消</Button>
          <Button :loading="btnLoading" type="primary" @click="handelSubmitDict">
            <span v-if="!btnLoading">保存</span>
            <span v-else>Loading...</span>
          </Button>
        </div>
        <div class="clear"></div>
      </Form>
    </Modal>

    <Modal
      title="联系人添加"
      v-model="linkFormValidate"
      :mask-closable="false"
      :width="1000"
      :styles="{top: '30px'}"
      class="formModel"
    >
      <Form ref="linkForm" :model="linkForm" :label-width="120">
        <Form-item label="联系人姓名:" class="lef">
          <Input v-model="linkForm.name"/>
        </Form-item>
        <Form-item label="部门及职位:" class="lef">
          <Input v-model="linkForm.department"/>
        </Form-item>
        <FormItem label="联系电话:" class="lef">
          <!-- <Input v-model="linkForm.phone" @on-blur="phoneChange(linkForm.phone)"/> -->
          <Input v-model="linkForm.phone"/>
        </FormItem>
        <div class="clear"></div>
      </Form>
      <div slot="footer">
        <Button type="text" @click="linkFormValidate=false">取消</Button>
        <Button type="primary" @click="linkok">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  fromUp,
  relativeFindCompany,
  relativeFromSave,
  animateWidths,
  relativeName,
	caseDetail,
  modelRelativeDetail,
  getDictDataByType
} from "@/api/index";
export default {
  name: "relativeEdit",
  props: {
    formData: Object,
    sourceType: Number,
    visible: Boolean
  },
  data() {
    return {
      defaultList: [],
      uploadList: [], //上传的资质证书的列表
      dictForm: this.formData,
      accessToken: {}, // 上传token鉴权
      relative_type: [],
      sourse: this.sourceType,
      ownership_type: [],
      btnLoading: false,
      btnLoading2: false,
      detailList: 1, //详情列表出现的序号
      counterpartList: [], //相对方名称列表
      modalVisible: this.visible,
      linkFormValidate: false, //添加联系人模块
      dictFormValidate: {
        // 表单验证规则
        counterpartTypeId: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        counterpartName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        enterpriseId: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      linkForm: {
        name: "",
        department: "",
        phone: ""
      }, //联系人表单数据项
      linkTotal: 0, //联系人总数
      stockholdersTotal: 0, // 股东信息总数
      administrativeTotal: 0, //行政处罚总数
      noticeTotal: 0, //开庭公告总数
      form_up: {
        updateBy: "",
        createTime: "",
        departmentTitle: ""
      },
      findCompanyDate: {
        company: ""
      },
			caseForm:{
					pageNumber:1,
					pageSize:10,
					organizationParty:""
				},
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
        }
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
        }
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
				promisesTotal:0   //案件信息总数
    };
  },
  methods: {
    valiText(v) {
      if (!v) {
        return false;
      }
      if (!/^[\u4e00-\u9fa5]+$/gi.test(v)) {
        this.$Message.error("开户行只能输入文字");
        return false;
      }
    },
     checkCreditCode(v){
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
      if(reg.test(v) === false) { 
        this.$Message.error("身份证输入不合法");
        return false; 
      }
    },
    init() {
      this.accessToken = {
        access_token: this.getStore("accessToken"),
        Authorization: "Bearer " + this.getStore("accessToken")
      };
      // 获取表单数据
      fromUp().then(res => {
        this.form_up.updateBy = res.updateBy;
        this.form_up.createTime = res.createTime;
        this.form_up.departmentTitle = res.department;
        this.form_up.userName = res.nickName;
      });
      //相对方类型
      getDictDataByType("counterpart").then(res => {
        if (res.success) {
          this.relative_type = res.result;
        }
      });
      //企业所有制形式ownership_type
      getDictDataByType("company_syzxs").then(res => {
        if (res.success) {
          // this.contract_type = res.result;
          this.ownership_type = res.result;
        }
      });
    },
    //页码改变
    pageChange(v) {
      if (this.detailList == 1) {
        this.linkMans = this.dictForm.linkMans.substr(v - 1, 5);
      } else if (this.detailList == 2) {
      } else if (this.detailList == 3) {
      } else if (this.detailList == 4) {
      } else if (this.detailList == 5) {
				if(this.dictForm.counterpartName){
						this.caseForm.pageNumber = v;
						this.caseForm.organizationParty = this.dictForm.counterpartName;
						caseDetail(this.caseForm).then(res => {
							if(res.success == "true"){
								this.promisesDate = res.data;
								this.promisesTotal = parseInt(res.count);
							}
						});
					}
      }
    },
    //相对方相似验证
    relativeSimilar() {
      if (!this.dictForm.counterpartId) {
        this.dictForm.counterpartId = "";
      }
      if (this.dictForm.counterpartName) {
        animateWidths({
          counterpartName: this.dictForm.counterpartName,
          id: this.dictForm.counterpartId
        }).then(res => {
          if (res != "success") {
            this.$Message.error(res);
          }
        });
      }
    },
    handelSubmitDict() {
      if (!this.dictForm.counterpartName) {
        this.$Message.error("相对方名称没有输入");
        return;
      } else if (
        !this.dictForm.enterpriseId &&
        this.dictForm.counterpartNatureId == "企业"
      ) {
        this.$Message.error("企业类型没有选择");
        return;
      } else if (
        !this.dictForm.creditCode&&
        this.dictForm.counterpartNatureId == "自然人"
      ) {
        this.$Message.error("身份证号没有输入");
        return;
      } else {
        this.btnLoading = true;
        if (!this.dictForm.counterpartId) {
          this.dictForm.counterpartId = "";
        }
        animateWidths({
          counterpartName: this.dictForm.counterpartName,
          id: this.dictForm.counterpartId
        }).then(res => {
          if (res == "success") {
            let dictForm = { ...this.dictForm };
            let arr = this.uploadList;
            dictForm.qualificationInfoAddr = [];
            dictForm.qualificationInfoName = [];
            for (let j = 0; j < arr.length; j++) {
              dictForm.qualificationInfoAddr.push(arr[j].url);
              dictForm.qualificationInfoName.push(arr[j].name);
            }
            dictForm.stockholdersList = JSON.stringify(
              dictForm.stockholdersList
            );
            dictForm.linkMans = JSON.stringify(dictForm.linkMans);
            dictForm.punishmentInfos = JSON.stringify(dictForm.punishmentInfos);
            dictForm.ktannouncements = JSON.stringify(dictForm.ktannouncements);
            delete dictForm.administrativeTotal;
            delete dictForm.linkTotal;
            delete dictForm.noticeTotal;
            delete dictForm.stockholdersTotal;
            delete dictForm.counterpartTypeName;
            relativeFromSave(dictForm).then(res => {
              if (res.success) {
                this.modalVisible = false;
                this.btnLoading = false;
                this.childNum(true, res, this.dictForm._index);
                this.$Message.success("保存成功");
              } else {
                this.btnLoading = false;
              }
            });
          } else {
            this.$Message.error(res);
            this.btnLoading = false;
          }
        });
      }
    },
    childNum(v, res, order) {
      if (this.sourse == 2 && v) {
        this.$emit("listen", { show: v, data: res, order: order });
      } else {
        this.$emit("listen", { show: v });
      }
      this.$refs.dictForm.resetFields();
    },
    //同步数据
    findCompany() {
      // if (this.dictForm.disable) {
      //   this.$Message.error("编辑时此按钮禁用");
      //   return;
      // }
      this.btnLoading2 = true;
      this.findCompanyDate.company = this.dictForm.counterpartName;
      relativeFindCompany(this.findCompanyDate).then(res => {
        this.btnLoading2 = false;
        this.dictForm.comment = res.comment;
        this.dictForm.creditCode = res.creditCode;
        this.dictForm.registerCapital = res.registerCapital;
        this.dictForm.registerDate = res.registerDate;
        this.dictForm.legalPersonName = res.legalPersonName;
        this.dictForm.officeAddress = res.officeAddress;
        this.dictForm.stockholdersList = res.stockholders;
        this.dictForm.punishmentInfos = res.punishmentInfos.punishmentInfos
          ? res.punishmentInfos.punishmentInfos
          : [];
        this.administrativeTotal = res.punishmentInfos.total
          ? res.punishmentInfos.total
          : 0;
        this.dictForm.ktannouncements = res.ktannouncements.ktannouncements
          ? res.ktannouncements.ktannouncements
          : [];
        this.noticeLisTotal = res.ktannouncements.total
          ? res.ktannouncements.total
          : 0;
        if (res.enterpriseId) {
          this.dictForm.enterpriseId = res.enterpriseId;
        }
      });
    },
    navSelect(v) {
      this.detailList = v;
			if(v == 5){
					if(this.dictForm.counterpartName){
						this.caseForm.organizationParty = this.dictForm.counterpartName;
						caseDetail(this.caseForm).then(res => {
							if(res.success == "true"){
								this.promisesDate = res.data;
								this.promisesTotal = parseInt(res.count);
							}
						});
					}
				}
    },
    //资质证书上传之前
    handleBeforeUpload() {
      document.getElementById("qualificationInfoName").innerHTML =
        "文件上传中...";
    },
    //合同正文中上传文件的格式错误
    handleFormatError(file) {
      document.getElementById("qualificationInfoName").innerHTML = "点击上传";
      this.$Notice.warning({
        title: "格式错误",
        desc: "上传的文件“" + file.name + " ”格式错误"
      });
    },
    //资质证书大小限制
    handleMaxSize(file) {
      document.getElementById("qualificationInfoName").innerHTML = "点击上传";
      this.$Notice.warning({
        title: "大小超出限制",
        desc: "上传的文件“" + file.name + " ”超过了10MB"
      });
    },
    //资质证书上传成功
    handleSuccess(res, file) {
      if (res.success) {
        file.url = res.result[0].url;
        file.name = res.result[0].name;
        file.fileDownUrl =
          "/zhfw/contract/draft/download?fileName=" +
          res.result[0].name +
          "&url=" +
          res.result[0].url +
          "&access_token=" +
          this.getStore("accessToken");
        this.uploadList=this.$refs.upload.fileList;
      } else {
        this.$Message.error("上传失败");
      }
      document.getElementById("qualificationInfoName").innerHTML = "点击上传";
    },
    //资质证书上传失败
    handleError() {
      document.getElementById("qualificationInfoName").innerHTML = "点击上传";
      this.$Message.error("上传失败");
    },
    //以下是附件上传的事件
    handleRemove(file) {
      let fileList = this.$refs.upload.fileList;
      fileList.splice(fileList.indexOf(file), 1);
    },
    //相对方名称改变事件
    nameChange(value) {
      if (value) {
        relativeName({ word: value }).then(res => {
          if (res.success) {
            let arr = res.result;
            for (let i = 0; i < arr.length; i++) {
              arr[i] = arr[i].replace(/<[^>]+>/g, "");
            }
            this.counterpartList = arr;
          }
        });
      }
    },
    edit(v) {
      this.isEdit = true;
      this.linkForm = { ...v };
      this.dictForm._index = v._index;
      this.linkFormValidate = true;
    },
    remove(v) {
      let dictForm = { ...this.dictForm };
      if (!dictForm.delLinkManIds) {
        dictForm.delLinkManIds = [];
      }
      if (v.id) {
        dictForm.delLinkManIds.push(v.id);
      }
      dictForm.linkMans.splice(v._index, 1);
      this.dictForm = JSON.parse(JSON.stringify(dictForm));
    },
    //添加联系人
    linkAdd() {
      this.linkForm = {
        name: "",
        department: "",
        phone: ""
      };
      this.dictForm._index = -1;
      this.linkFormValidate = true;
    },
    //添加联系人后点击确定
    linkok() {
      // var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      // if (!reg.test(this.linkForm.phone)) {
      // 	this.linkForm.phone = this.linkForm.phone.replace(/\b(0+)/gi,"");
      // 	this.$Message.error("手机格式错误");
      // 	return;
      // }
      console.log(this.dictForm._index);
      if (this.dictForm._index >= 0) {
        this.dictForm.linkMans.splice(this.dictForm._index, 1);
      }
      this.dictForm.linkMans.unshift(this.linkForm);
      var arr = this.dictForm.linkMans;
      this.dictForm.linkMans = [];
      for (let i = 0; i < arr.length; i++) {
        this.dictForm.linkMans.push(arr[i]);
      }
      this.linkFormValidate = false;
    },
    //添加联系人后点击了取消
    linkcancel() {
      console.log(111);
    },
    visiblechange(v) {
      this.$emit("relativelisten", v);
    },
    //联系方式验证
    phoneChange(v) {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!reg.test(v)) {
        this.linkForm.phone = v.replace(/\b(0+)/gi, "");
        this.$Message.error("手机格式错误");
      }
    },
    handelSelectNature(v) {
      this.dictForm.creditCode = "";
      this.dictForm.registerCapital = "";
      this.dictForm.registerDate = "";
      this.dictForm.enterpriseId = "";
      this.dictForm.legalPersonName = "";
      this.$refs.upload.fileList = [];
      this.uploadList =this.$refs.upload.fileList;
    },
    cancelHandel(){
      this.$refs.upload.fileList = [];
      this.modalVisible = false;
    }
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        if (newValue) {
          this.dictForm = newValue;
        } else {
          this.dictForm = oldValue;
        }
        this.$refs.upload.fileList = this.dictForm.uploadList;
        this.uploadList = this.$refs.upload.fileList;
        this.counterpartList = [];
      },
      deep: true
    },
    visible: {
      handler(newValue, oldValue) {
        this.modalVisible = newValue;
      },
      deep: true
    },
    sourceType: function(newValue, oldValue) {
      if (newValue) {
        this.sourse = newValue;
      } else {
        this.sourse = oldValue;
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
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
.code,
.code {
  position: relative;
}
.code .span,
.code1 .span {
  position: absolute;
  left: -75px;
  top: 1px;
  font-size: 14px;
  color: #ed4014;
  font-family: SimSun;
}
.code1 .span {
  left: -85px;
}
.input-disable {
  display: inline-block;
  width: 100%;
  height: 32px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  line-height: 1.5;
  padding: 4px 7px;
}
.input-disable.addr{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.txtar .input-disable {
  border: 1px solid #dcdee2;
  height: 115px;
}
</style>
