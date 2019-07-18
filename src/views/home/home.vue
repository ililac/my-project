<style lang="less">
	@import "./home.less";
	@import "../../styles/common.less";
	.block{
		height: 240px;
		overflow: auto;
	}
	.block.other{
		height: 260px;
	}
	.thead{
		height: 52px;
		line-height: 52px;
		border-bottom: 1px solid #e4e4e4;
		font-size: 20px;
		width: 100%;
		font-size: 14px;
		font-weight: 700;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #17233d;
	}
	.more{
// 		height: 30px;
// 		line-height: 30px;
// 		display: block;
// 		width: 100%;
// 		text-align: center;
// 		border-top: 1px solid #d8d8d8;
		float: right;
		margin-top: 16px;
		cursor: pointer;
	}
	.block,.thead{
		background: #fff;
		padding: 0 20px;
	}
	.imgLi{
		padding: 10px 0;
		height: 60px;
		width: 265px;
		.icon{
			display: inline-block;
			height: 100%;
			width: 50%;
			img{
				display: block;
				// width: 100%;
				height: 100%;
			}
		}
		.iconLef{
			float: left;
		}
		.iconRgh{
			float: right;
		}
	}
    .block .li{
		padding: 5px 0;
    }
	.block .li .name.lin{
		cursor: pointer;
	}
	.block .li .name{
		font-size: 16px;
		color: #2b85e4;
	}
	.thead span{
		display: inline-block;
		padding: 0 20px;
		cursor: pointer;
	}
    .thead .active{
		// background: #f1f1f1;
		border-top: 4px solid #3c8dbc;
    }
	.main .single-page-con{
		background-color: #d8d8d8!important;
		padding-bottom: 60px!important;
	}
</style>
<template style="width: 100%;height: 100%;">
    <div class="home-main">
        <Row :gutter="5">
            <Col :span="6" :style="{marginBottom: '10px'}">
            <infor-card id-name="user_created_count" :end-val="count.size" iconType="md-person-add" color="#2d8cf0" intro-text="合同数量（个）"></infor-card>
            </Col>
            <Col :span="6" :style="{marginBottom: '10px'}">
            <infor-card id-name="visit_count" :end-val="count.total" iconType="ios-eye" color="#64d572" :iconSize="50" intro-text="合同金额（万元）"></infor-card>
            </Col>
            <Col :span="6" :style="{marginBottom: '10px'}">
            <infor-card id-name="collection_count" :end-val="count.income" iconType="md-cloud-upload" color="#ffd572" intro-text="应收金额（万元）"></infor-card>
            </Col>
            <Col :span="6" :style="{marginBottom: '10px'}">
            <infor-card id-name="transfer_count" :end-val="count.disburse" iconType="md-shuffle" color="#f25e43" intro-text="应付金额（万元）"></infor-card>
            </Col>
        </Row>
        <Row :gutter="5">
            <Col :span="8" :style="{marginBottom: '10px'}">
            <div class="thead">
				<span @click="blockSelect(1)" :class="[blockShow?'active':'']">待办</span><span @click="blockSelect(2)" :class="[blockShow?'':'active']">已办</span>
                <!-- <router-link to="/htgl/todomanage"><Icon type="ios-more" class="more"/></router-link> -->
				<Icon type="ios-more" class="more" @click="tip4"/>
            </div>
            <div class="block" v-show="blockShow">
                <div v-for="item in list1" class="li">
                    <p class="name lin" @click="tip(item,1)">{{item.contractName}}</p>
                    <p>{{item.counterPart}} {{item.draftsMan}} {{item.money}} {{item.createTime}}</p>
                </div>
            </div>
			<!-- <a href="/htgl/todomanage" v-show="blockShow" class="more">查看更多</a> -->
			<div class="block" v-show="!blockShow">
			    <div v-for="item in list2" class="li">
			        <p @click="tip(item,2)" class="name lin">{{item.name}}</p>
			        <p>{{item.processName}} {{item.applyer}} {{item.createTime}}</p>
			    </div>
			</div>
			<!-- <a href="/htgl/todomanage" v-show="!blockShow" class="more">查看更多</a> -->
            </Col>
            <Col :span="8" :style="{marginBottom: '10px'}">
            <div class="thead">
				合同范本
				<!-- <router-link to="/htgl/todomanage"><Icon type="ios-more" class="more"/></router-link> -->
				<Icon type="ios-more" class="more" @click="tip3"/>
            </div>
            <div class="block">
                <div v-for="item in list3" class="li">
                    <p class="name">{{item.modelName}}</p>
                    <p>{{item.contractTypeName}} {{item.createBy}} {{item.createTime}}</p>
                </div>
            </div>
			<!-- <a href="/htgl/todomanage" class="more">查看更多</a> -->
            </Col>
            <Col :span="8" :style="{marginBottom: '10px'}">
            <div class="thead">相对方
				<!-- <a href="/htgl/relative" style="float: right">操作</a> -->
				<Icon type="ios-more" class="more" @click="tip2"/>
			</div>
            <div class="block">
                <div v-for="item in list4" class="li">
                    <p class="name">{{item.counterpartName}}</p>
                    <p>{{item.counterpartTypeName}} {{item.enterpriseName}} {{item.regCapital}} {{item.createTime}}</p>
                </div>
            </div>
			<!-- <a href="/htgl/todomanage" class="more">查看更多</a> -->
            </Col>
        </Row>
        <Row :gutter="5">
            <Col :span="16" :style="{marginBottom: '10px'}">
                <div class="thead">
					合同应/实收金额
					<DatePicker v-model="model1" type="year" placeholder="请选择" style="width: 100px" @on-change="yearChange"></DatePicker>
					<!-- <Select @on-change="yearChange" v-model="model1" style="width:100px">
						<Option v-for="item in yearList" :value="item" :key="item">{{ item }}</Option>
					</Select> --> 年
                </div>
                <div class="block" style="height: 260px;">
                    <div class="visit">
                        <div style="width:100%;height:228px;" id="visite_volume_con"></div>
                    </div>
                </div>
            </Col>
            <Col :span="8" :style="{marginBottom: '10px'}">
            <div class="thead">常用链接</div>
            <div class="block other">
				<div class="imgLi">
					<a href="http://www.court.gov.cn/" target="_blank"><img src="../../assets/zgfy.png" alt=""></a>
				</div>
				<div class="imgLi">
					<a href="http://www.gsxt.gov.cn/index.html" target="_blank"><img src="../../assets/qyxxw.png" alt=""></a>
				</div>
				<div class="imgLi">
					<a href="http://zxgk.court.gov.cn/" target="_blank"><img style="display: block;width: 100%;height: 100%;" src="../../assets/zxxx.png" alt=""></a>
				</div>
				<!-- <div class="imgLi">
					<a href="http://www.gsxt.gov.cn/index.html" target="_blank"><img src="../../assets/zxxx.png" alt=""></a>
				</div> -->
				<!-- <div class="imgLi">
					<a href="http://casm.pkulaw.cn/dz1/text_compare_do.aspx" target="_blank" class="icon iconLef"><img src="../../assets/sh.png" alt=""></a>
					<a href="http://139.198.16.175:8073/" target="_blank" class="icon iconRgh"><img src="../../assets/sjdb.png" alt=""></a>
				</div> -->
                <!-- <div v-for="item in list5">
                    <p>{{item.name}}</p>
                </div> -->
            </div>
            </Col>
        </Row>
    </div>
	<!-- <div style="width:100%;height:100%;">
		<img style="display: block;width: 60%;margin: 150px auto;" src="../../assets/homebag.jpg" alt="">
	</div> -->
</template>

<script>
    import echarts from 'echarts';
	import inforCard from "./components/inforCard.vue";
    import {
        awaitDo,
        alreadyDo,
		contractNumberStatistics,
		contractModelquery,
		echartsData,
		contractRelativequery,
        eachOther
    } from "@/api/index";
export default {
	name: "home",
	components: {
		inforCard
	},
	data() {
		return {
			active:0,
			count: {
				size: 0,
				income:0,
				disburse:0,
				total:0
			},
			yearList:[2019,2018,2017,2016,2015],
			model1: '',
			blockShow:true,
			list:[],
			list2:[],
			list4:[],
			list1:[],
			list3:[],
			list5:[]
		};
	},
	computed: {
		avatarPath() {
		  return localStorage.avatorImgPath;
		}
	},
	methods: {
	    blockSelect(tar){
			if(tar == 1){
				this.blockShow = true
			}else{
				this.blockShow = false
			}
		},
		tip(v,type){
			let query = { type: type, id: v.id, backRoute: this.$route.name,procInstId:v.procInstId ,tableId:v.tableId,key:v.key};
			this.$router.push({
			  name: "contractApprove",
			  query: query
			});
		},
		tip2(){
			this.$router.push({
			  name: "relative"
			});
		},
		tip3(){
			this.$router.push({
			  name: "establish"
			});
		},
		tip4(){
			this.$router.push({
			  name: "todomanage"
			});
		},
		yearChange(){
			let year = this.model1.getFullYear();
			this.getEchartsData(year)
		},
		getEchartsData(v){
			let year = "";
			if(v){
				year =  v;
			}else{
				var myDate = new Date();
				year =	myDate.getFullYear();
			}
			echartsData({"year":year}).then(res => {
				this.$nextTick(() => {
					let visiteVolume = echarts.init(document.getElementById('visite_volume_con'));
					const option = {
						tooltip: {
								trigger: 'axis'
						},
						legend: {
							data:['计划收款(应收)','实际收款(实收)']
						},
						xAxis:  {
							type: 'category',
							boundaryGap: false,
							data: res.month
						},
						grid: {
							left: '3%',
							right: '10%',
							bottom: '3%',
							containLabel: true
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: '{value} 万元'
							}
						},
						series: [
							{
								name:'计划收款(应收)',
								type:'line',
								data:res.play,
								markPoint: {
									data: [
										{type: 'max', name: '最大值'},
										{type: 'min', name: '最小值'}
									]
								},
								markLine: {
									data: [
										{type: 'average', name: '平均值'}
									]
								}
							},
							{
								name:'实际收款(实收)',
								type:'line',
								data:res.actual,
								markPoint: {
									data: [
										{type: 'max', name: '最大值'},
										{type: 'min', name: '最小值'}
									]
								},
								markLine: {
									data: [
										{type: 'average', name: '平均值'}
									]
								}
							}
						]
					};
					visiteVolume.setOption(option);
					window.addEventListener('resize', function () {
						visiteVolume.resize();
					});
				});
			})
		},
		init() {
			awaitDo({pageNumber:1,pageSize:4}).then(res => {
				if(res.success){
					 this.list1 = res.result.content;
				}
			});
			alreadyDo({pageNumber:1,pageSize:4}).then(res => {
				if(res.success){
					this.list2 = res.result.content;
				}
			});
			contractNumberStatistics().then(res => {
				if(res.success){
					this.count = {
						size: res.result.size,
						income:res.result.inCome,
						disburse:res.result.disburse,
						total:res.result.total
					};
				}else{
					this.count = {
						size: 0,
						income:0,
						disburse:0,
						total:0
					};
				}
			})
			contractModelquery({
				modelName: "",
				contractTypeId: "",
				pageNumber: 1,
				pageSize: 4,
				order: "desc"
			}).then(res => {
				if (res.success === true) {
					this.list3 = res.result.data;
				}
			});
			contractRelativequery({
				blackFlag: '',
				counterpartName: '',
				counterpartTypeId: '',
				pageNumber: 1,
				pageSize: 4
			}).then(res => {
				if (res.success === true) {
					this.list4 = res.result.content;
				}
			});
			
			// setTimeout(function(){document.querySelector('.ivu-menu .ivu-menu').style.display = "block";}, 1500);
		},
	},
	mounted() {
		this.init();
		this.getEchartsData();
		
	}
};
</script>
