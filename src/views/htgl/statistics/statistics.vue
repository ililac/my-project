<template>
    <div>
		<Card>
			<Row type="flex" justify="space-between" class="code-row-bg">
				<Col :span="24">
					<Form ref="searchForm" :model="searchForm" inline :label-width="120" class="search-form">
						<Form-item label="合同生效日期">
							<DatePicker
									v-model="searchForm.year"
									type="year"
									:options="options"
									@on-change="yearChange"
									clearable
									placeholder="选择年份"
									:editable="false"
							></DatePicker>
							<Select v-model="searchForm.month" style="width:200px;margin-left: 20px;">
								<Option v-for="item in monthList" :value="item">{{ item }}</Option>
							</Select>
						</Form-item>
						<Form-item>
							
						</Form-item>
						<Button @click="dateChange" type="primary" icon="ios-search">搜索</Button>
					</Form>
				</Col>
        	</Row>
        </Card>
        <div>
			<Row :gutter="12" :style="{marginTop: '10px'}">
				<Col :span="6" :style="{marginBottom: '10px'}">
					<Card class="info_card">
					  <div slot="title">
							审批合同总量
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
							  <div slot="content">当前时间范围内,经本院审批的合同总量</div>
							</Tooltip>
						</div>
					  <div class="info_con">
					  	{{total.approveTotalSize}}份
					  </div>
					</Card>
				</Col>
				<Col :span="6" :style="{marginBottom: '10px'}">
					<Card class="info_card">
					  <div slot="title">
							签署合同总量
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
							  <div slot="content">当前时间范围内,完成签署的合同总量</div>
							</Tooltip>
						</div>
					  <div class="info_con">
					  	{{total.approveTotalSize}}份
					  </div>
					</Card>
				</Col>
				<Col :span="6" :style="{marginBottom: '10px'}">
					<Card class="info_card">
					  <div slot="title">
							收款总额
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
							  <div slot="content">当前时间范围内,已签署收款合同的总金额</div>
							</Tooltip>
						</div>
					  <div class="info_con">
					  	¥{{total.recieveResult.factmoney}}
					  </div>
						<div>已收金额¥{{total.recieveResult.actualmoney}}</div>
						<Progress :percent="total.recieveResult.percent" hide-info/>
					</Card>
				</Col>
				<Col :span="6" :style="{marginBottom: '10px'}">
					<Card class="info_card">
					  <div slot="title">
							付款总额
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
							  <div slot="content">当前时间范围内,已签署付款合同的总金额</div>
							</Tooltip>
						</div>
					  <div class="info_con">
					  	¥{{total.payResult.factmoney}}
					  </div>
						<div>已付金额¥{{total.payResult.actualmoney}}</div>
						<Progress :percent="total.payResult.percent" hide-info/>
					</Card>
				</Col>
			</Row>
            <Row :gutter="8">
                <Col :span="12" :style="{marginBottom: '10px'}">
					<Card>
						<p slot="title" class="card-title">
							<Icon type="md-map"></Icon>
							新增审批合同
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
							    <div slot="content">
									<h3>每个时间单位内，经本院审批</h3>
									<h3>的合同数量。</h3>
								</div>
							</Tooltip>
						</p>
						<div class="data-source-row">
							<div class="visit">
								<div v-show="optionShow" style="width:100%;height:228px;" id="visite_volume_con"></div>
								<p v-show="!optionShow">暂无数据</p>
							</div>
						</div>
					</Card>
				</Col>
				<Col :span="12" :style="{marginBottom: '10px'}">
					<Card>
						<p slot="title" class="card-title">
							<Icon type="md-map"></Icon>
							新增签署合同
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
								<div slot="content">
								    <h3>每个时间单位内，完成签署的合</h3>
								    <h3>同数量。</h3>
								</div>
							</Tooltip>
						</p>
						<div class="data-source-row">
							<div class="visit">
								<div v-show="optionShow2" style="width:100%;height:228px;" id="visite_volume_con2"></div>
								<p v-show="!optionShow2">暂无数据</p>
							</div>
						</div>
					</Card>
				</Col>
					<Col :span="12" :style="{marginBottom: '10px'}">
					<Card>
						<p slot="title" class="card-title">
							<Icon type="md-map"></Icon>
							合同类型分布
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
								<div slot="content">
									<h3>当前时间范围内，经本院审批</h3>
									<h3>的合同在不同合同类型的分布。</h3>
								</div>
							</Tooltip>
						</p>
						<div class="data-source-row">
							<div class="visit">
								<div v-show="optionShow3" style="width:100%;height:228px;" id="visite_volume_con3"></div>
								<p v-show="!optionShow3">暂无数据</p>
							</div>
						</div>
					</Card>
				</Col>
					<Col :span="12" :style="{marginBottom: '10px'}">
					<Card>
						<p slot="title" class="card-title">
							<Icon type="md-map"></Icon>
							相对方分布（前五）
							<Tooltip class="info_icon" placement="top">
								<Icon type="ios-information-circle-outline" color="#108DE9" size="20"/>
							    <div slot="content">
								    <h3>当前时间范围内，经本院审批</h3>
								    <h3>的合同在不同相对方的分布。</h3>
								</div>
							</Tooltip>
						</p>
						<div class="data-source-row">
							<div class="visit">
								<div v-show="optionShow4" style="width:100%;height:228px;" id="visite_volume_con4"></div>
								<p v-show="!optionShow4">暂无数据</p>
							</div>
						</div>
					</Card>
				</Col>
            </Row>
        </div>
    </div>
</template>
<script>
    import echarts from 'echarts';
	import {
		statisticsDepartment
	} from "@/api/index";
    export default {
        name: 'statistics',
        components: {
            // visiteVolume
        },
        data() {
            return {
				monthList:[],
				relative_type:[],
				total:{
					approveTotalSize:0,
					signTotalSize:0,
					payResult: {factmoney: 0, actualmoney: 0,percent:0},
					recieveResult: {factmoney: 0, actualmoney: 0,percent:0}
				},
                searchForm: {
                    year:"",
					month:""
                },
				options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
				optionShow:true,
				optionShow2:true,
				optionShow3:true,
				optionShow4:true,
				visiteVolume:"",
				visiteVolume2:"",
				visiteVolume3:"",
				visiteVolume4:""
            }
        },
        methods: {
			//年份改变
			yearChange(v){
				console.log(v);
				let date = new Date();
				let year = date.getFullYear();
				// this.searchForm.year = 
				this.monthList = [];
				if(v == year){
					for(let i = 0;i <= date.getMonth();i++){
						this.monthList.push(i+1);
					};
				}else{
					for(let i = 0;i < 12;i++){
						this.monthList.push(i+1);
					};
				}
			},
			init(v){
				const option = {
					legend: {
						data:[]
					},
					tooltip: {
					  trigger: "axis",
					  axisPointer: {
					    type: "shadow"
					  }
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis : [
						{
							type : 'category',
							data : []
						}
					],
					yAxis : [
						{
							type : 'value'
						}
					],
					series : []
				};
				const option2 = {
				    tooltip: {
						trigger: 'axis'
					},
					xAxis:  {
						type: 'category',
						boundaryGap: false,
						data: []
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name:'合同份数',
							type:'line',
							data:[],
						}
					]
				};
				const option3 = {
				    tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					legend: {
						bottom: 0,
						left: 'center',
						data: []
					},
					series : [
						{
							name: '访问来源',
							type: 'pie',
							radius : '55%',
							center: ["50%", "40%"],
							data:[],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				};
				const option4 = {
				    tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					
					legend: {
						bottom: 0,
						left: 'center',
						data: []
					},
					series : [
						{
							name: '访问来源',
							type: 'pie',
							radius : '55%',
							center: ["50%", "40%"],
							data:[],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				};
				statisticsDepartment({time:v}).then(res => {
					if(res.success){
						this.total = {
							approveTotalSize:res.result.approveTotalSize,
							signTotalSize:res.result.signTotalSize,
							payResult:{
								factmoney: res.result.payResult.factmoney, 
								actualmoney: res.result.payResult.actualmoney,
								percent:(100*res.result.payResult.factmoney/res.result.payResult.actualmoney),
							},
							recieveResult:{
								factmoney: res.result.recieveResult.factmoney, 
								actualmoney: res.result.recieveResult.actualmoney,
								percent:(100*res.result.recieveResult.factmoney/res.result.recieveResult.actualmoney),
							}
						};
						option.xAxis[0].data = res.result.newApprovedContract.xValue;
						let arr = res.result.newApprovedContract.yValue;
						for(var i = 0;i<arr.length;i++){
							option.legend.data.push(arr[i].name);
							arr[i].type = 'bar'; 
							arr[i].stack = '广告'; 
							option.series.push(arr[i]);
						}
						option2.xAxis.data = res.result.newSignedContract.xValue;
						option2.series[0].data = res.result.newSignedContract.yValue;
						let arr2 = res.result.contractTypeCount.contractTypeName;
						let arr3 = res.result.contractTypeCount.contractTypeValue;
						for(var i = 0;i<arr2.length;i++){
							let obj = {
								name:arr2[i],
								value:arr3[i]
							}
							option3.series[0].data.push(obj);
							option3.legend.data.push(arr2[i]);
						}
						let arr4 = res.result.counterpartCount.counterpartName;
						let arr5 = res.result.counterpartCount.counterpartValue;
						for(var i = 0;i<arr4.length;i++){
							let obj = {
								name:arr4[i],
								value:arr5[i]
							}
							option4.series[0].data.push(obj);
							option4.legend.data.push(arr4[i]);
						}
						let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
						visiteVolume.setOption(option);
						let visiteVolume2 = echarts.init(document.getElementById('visite_volume_con2'));
						visiteVolume2.setOption(option2);
						let visiteVolume3 = echarts.init(document.getElementById('visite_volume_con3'));
						visiteVolume3.setOption(option3);
						let visiteVolume4 = echarts.init(document.getElementById('visite_volume_con4'));
						visiteVolume4.setOption(option4);
						if(option.xAxis[0].data.length > 0){
							this.optionShow = true;
						}else{
							this.optionShow = false;
						}
						if(option2.xAxis.data.length > 0){
							this.optionShow2 = true;
						}else{
							this.optionShow2 = false;
						}
						if(option3.series[0].data.length > 0){
							this.optionShow3 = true;
						}else{
							this.optionShow3 = false;
						}
						if(option4.series[0].data.length > 0){
							this.optionShow4 = true;
						}else{
							this.optionShow4 = false;
						}
						window.addEventListener('resize', function () {
						    visiteVolume.resize();
						    visiteVolume2.resize();
						    visiteVolume3.resize();
						    visiteVolume4.resize();
						});
					}
				})
				
			},
			dateChange(){
				let date = "";
				if(typeof(this.searchForm.year) == "object"){
					this.searchForm.year = this.searchForm.year.getFullYear();
				}
				let month = this.searchForm.month;
				if(this.searchForm.month < 10){
					month = "0"+month;
				}
				if(this.searchForm.month){
					date = this.searchForm.year+"-"+month;
				}else{
					date = this.searchForm.year+'';
				}
				this.init(date);
			}
		},
        mounted() {
			let date = new Date();
			let d = date.getFullYear();
			for(let i = 0;i <= date.getMonth();i++){
				this.monthList.push(i+1);
			};
			this.searchForm.year = d+'';
            this.init(d);
        }
    }
</script>
<style lang="less" scoped>
	.info_card{
		width:100%;
		height:160px;
		// padding: 10px;
		background-color: #fff;
		.info_tip{
			padding: 0 0 10px;
			.info_word{
				font-size: 14px;
			}
			
		}
		.info_icon{
			float: right;
		}
		.info_con{
			color: #2d8cf0;
			font-size: 26px;
			font-weight: 900;
			text-align: center;
		}
	}
	.card-title{
		.info_icon{
			float: right;
		}
	}
	.visit{
		text-align: center;
		line-height: 228px;
		font-size: 30px;
		font-weight: 900;
	}
</style>