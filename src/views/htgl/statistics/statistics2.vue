<style scoped>
.card-wrap {
  padding: 15px;
}
.desc {
  text-align: center;
  color: #108de9;
  line-height: 30px;
  font-size: 24px;
  font-weight: 650;
}
.card {
  height: 140px;
  position: relative;
}
.card2 {
  position: relative;
}
.tip {
  position: absolute;
  right: 10px;
  top: 10px;
}
.tip2 {
  position: absolute;
  right: 15px;
  top: 15px;
}
</style>
<template>
  <div>
    <Card>
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col :span="24" style="height:35px;">
          <Form  inline :label-width="120" class="search-form">
            <Form-item label="合同生效日期">
              <DatePicker
                type="year"
                placeholder="选择年"
                style="width: 200px;margin-right:20px;"
                @on-change="handleYear"
              ></DatePicker>
              <Select v-model="month" placeholder="选择月" style="width:200px" clearable >
								<Option v-for="item in monthList" :value="item">{{ item }}</Option>
							</Select>
              <!-- <DatePicker
                type="month"
                placeholder="选择月"
                style="width: 200px"
                @on-change="handleMonth"
              ></DatePicker> -->
            </Form-item>
            <Form-item style="margin-left:-40px;">
              <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            </Form-item>
          </Form>
        </Col>
      </Row>
    </Card>
    <div class="card-wrap">
      <Row type="flex" justify="center">
        <Col span="6">
          <Card class="card">
            <div slot="title">签署合同总量</div>
            <Tooltip class="tip" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>当前时间范围内，</p>
                <p>完成签署的合同总量。</p>
              </div>
            </Tooltip>
            <p class="desc">{{total}}份</p>
          </Card>
        </Col>
        <Col span="6" offset="2">
          <Card class="card">
            <div slot="title">待收款总额</div>
            <Tooltip class="tip" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>当前时间范围内，</p>
                <p>已签署收款合同的总金额。</p>
              </div>
            </Tooltip>
            <p class="desc">￥{{receiveInfo.factmoney}}</p>
            <div v-show="receiveInfo.actualmoney>0">
              <p>已收金额￥{{receiveInfo.actualmoney}}</p>
              <Progress :percent="receive" hide-info/>
            </div>
          </Card>
        </Col>
        <Col span="6" offset="2">
          <Card class="card">
            <div slot="title">待付款总额</div>
            <Tooltip class="tip" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>当前时间范围内，</p>
                <p>已签署付款合同的总金额。</p>
              </div>
            </Tooltip>
            <p class="desc">￥{{payInfo.factmoney}}</p>
            <div v-show="payInfo.actualmoney>0">
              <p>已收金额￥{{payInfo.actualmoney}}</p>
              <Progress :percent="pay" hide-info/>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    <div>
      <Row :gutter="5">
        <Col :span="12" :style="{marginBottom: '10px'}">
          <Card class="card2">
            <p slot="title" class="card-title">
              <Icon type="md-map"></Icon>新增签署合同
            </p>
            <Tooltip class="tip2" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>每个时间单位内，</p>
                <p>完成签署的合同数量。</p>
              </div>
            </Tooltip>
            <div class="data-source-row">
              <div class="visit">
                <div style="width:100%;height:240px;" id="visite_volume_con"></div>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="12" :style="{marginBottom: '10px'}">
          <Card class="card2">
            <p slot="title" class="card-title">
              <Icon type="md-map"></Icon>院系分布（前五）
            </p>
            <Tooltip class="tip2" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>当前时间范围内，已签署</p>
                <p>合同在不同院系的分布。</p>
              </div>
            </Tooltip>
            <div class="data-source-row">
              <div class="visit">
                <div style="width:100%;height:240px;" id="visite_volume_con2"></div>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="12" :style="{marginBottom: '10px'}">
          <Card class="card2">
            <p slot="title" class="card-title">
              <Icon type="md-map"></Icon>合同类型分布
            </p>
            <Tooltip class="tip2" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>当前时间范围内，已签署</p>
                <p>合同在不同合同类型的分布。</p>
              </div>
            </Tooltip>
            <div class="data-source-row">
              <div class="visit">
                <div style="width:100%;height:240px;" id="visite_volume_con3"></div>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="12" :style="{marginBottom: '10px'}">
          <Card class="card2">
            <p slot="title" class="card-title">
              <Icon type="md-map"></Icon>相对方分布（前五）
            </p>
            <Tooltip class="tip2" placement="top">
              <Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
              <div slot="content">
                <p>当前时间范围内，已签署</p>
                <p>合同在不同相对方的分布。</p>
              </div>
            </Tooltip>
            <div class="data-source-row">
              <div class="visit">
                <div style="width:100%;min-height:240px;" id="visite_volume_con4"></div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { getSignedInfo } from "@/api/index";
export default {
  name: "statistics",
  components: {
    // visiteVolume
  },
  data() {
    return {
      relative_type: [],
      total: 0,
      receiveInfo: {
        actualmoney: 0,
        factmoney: 0
      },
      payInfo: {
        actualmoney: 0,
        factmoney: 0
      },
      newSignedInfo: {}, //新增签署合同
      depInfo: {},
      typeInfo: {}, //院系分布
      counterPartInfo: {}, //相对方
        year: "",
        month: "",
        monthList:['1','2','3','4','5','6','7','8','9','10','11','12']
    };
  },
  computed: {
    receive: function() {
      return (this.receiveInfo.actualmoney / this.receiveInfo.factmoney) * 100;
    },
    pay: function() {
      return (this.payInfo.actualmoney / this.payInfo.factmoney) * 100;
    }
  },
  methods: {
    handleYear(y) {
      this.year = y;
    },
    handleSearch() {
      let time ='';
      if (this.year.length>0) {
        time = this.year
         if (this.month) {
           let month;
           if(this.month.length==1){
            month = `0${this.month}`
           }else{
             month = this.month
           }
            time = this.year+'-'+month
         }
      }else{
        if (this.month.length>0) {
          return
        }
        time = this.time
      }
      this.initCharts(time);
    },
    initCharts(v) {
      const option1 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: "6%",
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: []
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: []
          },
          {
            name: "",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: []
          },
          {
            name: "",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "insideRight"
              }
            },
            data: []
          }
        ]
      };
      const option2 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 0,
          left: "center",
          data: []
        },
        series: [
          {
            name: "院系分布：",
            type: "pie",
            radius: "55%",
            center: ["50%", "40%"],
            data: [],
            label: {
              normal: {
                formatter: "{b} : {c} ({d}%)"
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      const option3 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 0,
          left: "center",
          data: []
        },
        series: [
          {
            name: "合同类型分布：",
            type: "pie",
            radius: "55%",
            center: ["50%", "40%"],
            label: {
              normal: {
                formatter: "{b} : {c} ({d}%)"
              }
            },
            data: [
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      const option4 = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 0,
          left: "center",
          data: []
        },
        series: [
          {
            name: "相对方分布：",
            type: "pie",
            radius: "55%",
            center: ["50%", "40%"],
            data: [
            ],
            label: {
              normal: {
                formatter: "{b} : {c} ({d}%)"
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      getSignedInfo({ time: v }).then(res => {
        if (res.success) {
          this.payInfo = res.result.payInfo;
          this.receiveInfo = res.result.receiveInfo;
          this.total = res.result.total;
          let newSignedInfo = res.result.newSignedInfo;
          let depInfo = res.result.depInfo;
          let typeInfo = res.result.typeInfo;
          let counterPartInfo = res.result.counterPartInfo;
          for (var i = 0; i < newSignedInfo.valueList.length; i++) {
            option1.xAxis[0].data = newSignedInfo.timeList;
            option1.series[i].data = newSignedInfo.valueList[i].value;
            option1.series[i].name = newSignedInfo.valueList[i].name;
          }
          for(var i = 0;i<depInfo.depNameList.length;i++){
							let obj = {
								name:depInfo.depNameList[i],
								value:depInfo.depDataList[i]
							}
							option2.series[0].data.push(obj);
							option2.legend.data.push(depInfo.depNameList[i]);
            }
            for(var i = 0;i<typeInfo.typeNameList.length;i++){
							let obj = {
								name:typeInfo.typeNameList[i],
								value:typeInfo.typedataList[i]
							}
							option3.series[0].data.push(obj);
							option3.legend.data.push(typeInfo.typeNameList[i]);
            }
            for(var i = 0;i<counterPartInfo.counterPartNameList.length;i++){
							let obj = {
								name:counterPartInfo.counterPartNameList[i],
								value:counterPartInfo.counterPartDataList[i]
							}
							option4.series[0].data.push(obj);
							option4.legend.data.push(counterPartInfo.counterPartNameList[i]);
						}
          let visiteVolume1 = echarts.init(document.getElementById("visite_volume_con"));
          visiteVolume1.setOption(option1);
      let visiteVolume2 = echarts.init(
        document.getElementById("visite_volume_con2")
      );
      visiteVolume2.setOption(option2);
      let visiteVolume3 = echarts.init(
        document.getElementById("visite_volume_con3")
      );
      visiteVolume3.setOption(option3);
      let visiteVolume4 = echarts.init(
        document.getElementById("visite_volume_con4")
      );
      visiteVolume4.setOption(option4);
      window.addEventListener("resize", function() {
        visiteVolume1.resize();
        visiteVolume2.resize();
        visiteVolume3.resize();
        visiteVolume4.resize();
      });
        }
      });
      
    }
  },
  mounted() {
    let data = new Date()
    this.time = new Date().getFullYear()
    this.initCharts(this.time);
  }
};
</script>
