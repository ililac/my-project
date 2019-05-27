<style  lang="less" scoped>
@import "../formModel.less";
</style>
<template>
  <Form ref="dictForm" :model="dictForm" :label-width="90" :rules="dictFormValidate">
    <div v-if="enable">
      <div class="ul">
        <FormItem label="范本名称" class="lef">
          <p>{{dictForm.modelName}}</p>
        </FormItem>
        <Form-item label="合同类型" class="lef">
          <p>{{dictForm.contractTypeName}}</p>
        </Form-item>
      </div>
      <div class="ul">
        <FormItem label="使用次数" class="lef">
          <span>{{dictForm.usedCount}}</span>
        </FormItem>
        <FormItem label="范本文件" class="lef">
          <a v-bind:href="fildDownUrl">{{dictForm.fileName}}</a>
        </FormItem>
      </div>
      <div class="ul txtar">
        <FormItem label="备注">
          <p>{{dictForm.comment}}</p>
        </FormItem>
      </div>
    </div>
    <div v-else="enable">
      <div class="ul">
        <FormItem label="范本名称：" prop="modelName">
          <Input v-model="dictForm.modelName"/>
        </FormItem>
      </div>
      <div class="ul">
        <Form-item label="合同类型：" class="lef">
          <span style="position: absolute;left: -84px;color: red;top: 3px;font-size: 20px;">*</span>
          <contract-type v-on:typeListen="typeChange" :widthDate.sync="myStyle" :typeDate.sync="dictForm"></contract-type>
        </Form-item>
        <FormItem label="使用次数：" style="position:relative;left:60px;" class="lef">
          <span>{{dictForm.usedCount}}</span>
        </FormItem>
      </div>
      <div class="ul">
        <FormItem label="范本文件：" prop="file">
          <Upload
            class="upLoad"
            action="/zhfw/syetem/upload/file?tag=modelAddress-fileName"
            :headers="accessToken"
            :on-success="handleSuccess"
            :on-error="handleError"
            :max-size="10240"
						:show-upload-list="false"
            :on-exceeded-size="handleMaxSize"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            type="drag"
            ref="up"
            style="position:relative"
          >
            <div id="upload" class="upload">点击上传</div>
          </Upload>
          <p style="color: #d3d3d3;">文件大小：<=10MB</p>
          <!-- <p id="uploadMask" class="upload-mask"></p> -->
          <a v-bind:href="fildDownUrl">{{dictForm.fileName}}</a>
        </FormItem>
      </div>
      <div class="ul">
        <FormItem label="备注：">
          <Input
            type="textarea"
						:maxlength="1000"
            v-model="dictForm.comment"
            :rows="5"
            placeholder="请输入详细情况"
          />
        </FormItem>
      </div>
    </div>
    <div class="ul">
      <FormItem label="发布人：" class="lef" v-show="dictForm.publishTime">
        <span>{{dictForm.createBy}}</span>
      </FormItem>
      <FormItem label="发布时间：" class="lef" v-show="dictForm.publishTime">
        <span>{{dictForm.publishTime}}</span>
      </FormItem>
      <FormItem label="发布机构：" class="lef" v-show="dictForm.publishTime">
        <span>{{dictForm.departmentTitle}}</span>
      </FormItem>
    </div>
    <div class="btns clear">
      <Button type="text" @click="childNum(false)">取消</Button>
      <Button type="primary" :loading="btnLoading" @click="handelSubmitDict">
        <span v-if="!btnLoading">发布</span>
        <span v-else>Loading...</span>
      </Button>
      <Button type="primary" :loading="btnLoading2" @click="handelSave">
        <span v-if="!btnLoading2">保存</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
  </Form>
</template>

<script>
import contractType from "../../activiti/business/contractType.vue";
import {
  myDelete,
  formSeve,
  getDictDataByType,
  contractModelquery,
  filesDown,
  fromUp
} from "@/api/index";
export default {
  name: "contractModel",
  components: {
    contractType
  },
  props: {
    formData: Object
  },
  data() {
    return {
			myStyle:{display:'flex',width:'365px'}, //合同类型宽度
      dictForm: this.formData,
      accessToken: {}, // 上传token鉴权
      dictFormValidate: {
        // 表单验证规则
        modelName: [{ required: true, message: "不能为空", trigger: "blur" }],
        messages: [{ required: true, message: "不能为空", trigger: "change" }],
        // messages: [{ required: true, message: "必须选择", trigger: "blur" }],
        file: [{ required: true, message: "此文件必须上传", trigger: "blur" }]
      },
      upId: "",
      enable: false,
      contract_type: [],
      fildDownUrl: "",
      btnLoading: false,
      btnLoading2: false,
      form_up: {
        updateBy: "",
        createTime: "",
        departmentTitle: ""
      },
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
        contractType: "",
        departmentTitle: ""
      }
    };
  },
  methods: {
    //合同类型的选择
    typeChange(v) {
      this.dictForm.contractTypeId = v.id;
      this.dictForm.contractTypeName = v.typeName;
      this.dictForm.contractType = v.typeName;
    },
    getUpId(id) {
      this.upId = id;
    },
    childNum(v) {
      this.$emit("listen", { show: v });
      // this.$refs.dictForm.resetFields();
    },
    init() {
      this.dictForm = this.formData;
      this.dictForm.contractType = this.formData.contractTypeName;
      this.accessToken = {
        'access_token': this.getStore("accessToken"),
        'Authorization': 'Bearer '+this.getStore("accessToken")
      };
      fromUp().then(res => {
        this.form_up.updateBy = res.nickName;
        this.form_up.createTime = res.createTime;
        this.form_up.departmentTitle = res.department;
      });
      getDictDataByType("contract_type").then(res => {
        if (res.success) {
          this.contract_type = res.result;
        }
      });
    },
    handleError(error, file, fileList) {
      this.$Message.error(error.toString());
      document.getElementById(this.upId).innerHTML = "上传失败，请重新上传";
    },
    beforeUpload() {
      // document.getElementById("uploadMask").style.display = "block";
      document.getElementById("upload").innerHTML = "文件上传中...";
			console.log(document.getElementById("upload").innerHTML);
      return true;
    },
    handleMaxSize(file) {
      document.getElementById("upload").innerHTML = "文件过大，请重新上传";
      this.$Notice.warning({
        title: "文件大小过大",
        desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 10M."
      });
    },
    handleSuccess(res, file, fileList) {
      
      if (res.message == "success") {
				document.getElementById("upload").innerHTML = "点击上传";
        this.dictForm[res.result.tag.split("-")[0]] = res.result.url;
        this.dictForm[res.result.tag.split("-")[1]] = res.result.name;
        this.$Message.success("上传文件 " + file.name + " 成功");
				this.fildDownUrl = "/zhfw/contract/draft/download?fileName="+res.result.name+"&url="+res.result.url+"&accessToken="+this.getStore("accessToken");
      } else {
        this.$Message.error("上传文件 " + file.name + "失败");
				document.getElementById("upload").innerHTML = "点击上传";
      }
      // if (fileList.length === 1) {
      //   document.getElementById("uploadMask").style.display = "block";
      // }
    },
    handleRemove() {
      document.getElementById("uploadMask").style.display = "none";
    },
    handlePreview() {
      const a = document.createElement("a"); // 创建a标签
      a.setAttribute("href", this.fildDownUrl); // href链接
      a.click();
    },
    handelSubmitDict() {
      this.dictForm.status = 0;
      this.loading = true;
      if (!this.dictForm.modelName) {
        this.$Message.error("范本名称没有填写");
        return;
      }
      if (!this.dictForm.contractTypeId) {
        this.$Message.error("合同类型没有填写");
        return;
      }
      if (!this.dictForm.fileName) {
        this.$Message.error("范本文件必须上传");
        return;
      }
      this.btnLoading = true;
      formSeve(this.dictForm).then(res => {
        this.modalVisible = false;
        this.childNum(true);
        this.btnLoading = false;
      });
    },
    handelSave() {
      this.dictForm.status = -1;
      if (!this.dictForm.modelName) {
        this.$Message.error("范本名称没有填写");
        return;
      }
      if (!this.dictForm.contractTypeId) {
        this.$Message.error("合同类型没有填写");
        return;
      }
      if (!this.dictForm.fileName) {
        this.$Message.error("范本文件必须上传");
        return;
      }
      this.btnLoading2 = true;
      formSeve(this.dictForm).then(res => {
        this.modalVisible = false;
        this.childNum(true);
        this.btnLoading2 = false;
      });
    }
  },
  watch: {
    formData: {
      handler(newValue, oldValue) {
        this.$refs.dictForm.resetFields();
        if (newValue) {
          this.dictForm = {...newValue};
          this.dictForm.contractType = newValue.contractTypeName;
          if (newValue.modelAddress) {
            this.fildDownUrl =
              "/zhfw/contract/draft/download?fileName=" +
              newValue.fileName +
              "&url=" +
              newValue.modelAddress +
              "&accessToken=" +
              this.getStore("accessToken");
          }
        } else {
          this.dictForm = {...oldValue};
          this.dictForm.contractType = oldValue.contractTypeName;
          if (oldValue.modelAddress) {
            this.fildDownUrl =
              "/zhfw/contract/draft/download?fileName=" +
              newValue.fileName +
              "&url=" +
              newValue.modelAddress +
              "&accessToken=" +
              this.getStore("accessToken");
            // this.fildDownUrl = "/zhfw/contract/contractModel/download?id="+oldValue.id+"&accessToken="+this.getStore("accessToken");
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  }
};
</script>
