<template>
	<Poptip trigger="click" placement="bottom" title="选择合同类型">
	  <div :style="myStyle">
	    <Input v-model="typeName" readonly style="margin-right:13px;"/>
	    <!-- <Button icon="md-trash" @click="clearSelectDep">清空已选</Button> -->
	  </div>
	  <div slot="content" class="tree-bar">
	    <Input v-model="searchKey" suffix="ios-search" @on-change="searchDp" placeholder="输入部门名搜索" clearable/>
	    <Tree :data="dataDep" :load-data="loadDataTree" @on-select-change="selectTree"></Tree>
	    <Spin size="large" fix v-if="dpLoading"></Spin>
	  </div>
	</Poptip>
</template>

<script>
	import {
		contractType,
		contractTypeRapid
	} from "@/api/index";
	export default {
		
		name: "travelPlan",
		props: {
			typeDate:Object,
			widthDate:Object
		},
		data(){
			return{
				dataDep: [],
				searchKey: "",
				myStyle:this.widthDate,
				typeName:this.typeDate.contractType,
				typeid:this.typeDate.typeid,
				dpLoading:false
			}
		},
		methods: {
			init(){
				this.initDepartmentTreeData();
			},
			initDepartmentTreeData() {
			  contractType({dictId:"95313343841046528"}).then(res => {
			    if (res.success === true) {
			      res.result.forEach(function(e) {
			        if (e.haveChild) {
			          e.loading = false;
			          e.children = [];
			        }
			        if (e.status === -1) {
			          e.title = "[已禁用] " + e.title;
			          e.disabled = true;
			        }
			      });
			      this.dataDep = res.result;
			    }
			  });
			},
			searchDp() {
				if (this.searchKey) {
					this.dpLoading = true;
					contractTypeRapid({ title: this.searchKey }).then(res => {
						this.dpLoading = false;
						if (res.success) {
							res.result.forEach(function(e) {
								if (e.status === -1) {
									e.title = "[已禁用] " + e.title;
									e.disabled = true;
								}
							});
							this.dataDep = res.result;
						}
					});
				} else {
					this.initDepartmentTreeData();
				}
			},
			selectTree(v) {
				if (v.length > 0) {
					for (let attr in v[0]) {
						if (v[0][attr] === null) {
							v[0][attr] = "";
						}
					}
					let str = JSON.stringify(v[0]);
					let data = JSON.parse(str);
					this.typeid = data.id;
					this.typeName = data.title;
					this.$emit("typeListen",{id:data.id,typeName:data.title});
				}
			},
// 			clearSelectDep() {
// 				this.typeName = "";
// 				this.typeid = "";
// 			},
			loadDataTree(item, callback) {
				contractType({dictId:item.id}).then(res => {
					if (res.success === true) {
						res.result.forEach(function(e) {
							if (e.haveChild) {
								e.loading = false;
								e.children = [];
							}
							if (e.status === -1) {
								e.title = "[已禁用] " + e.title;
								e.disabled = true;
							}
						});
						callback(res.result);
					}
				});
			},
		},
		watch:{
			typeDate: {
		　　 	handler(newValue, oldValue) {
					if(newValue){
						this.typeName=newValue.contractType;
						this.typeid=newValue.typeid;
					}else{
						this.typeName=oldValue.contractType;
						this.typeid=oldValue.typeid;
					}
		　　　　	},
		　　　　	deep: true
		　　 },
		},
		mounted(){
			this.init();
		}
	};
</script>

<style lang="less" scoped>
	.tree-bar {
	    max-height: 500px;
	    overflow: auto;
	    margin-top: 5px;
	}
	
	.tree-bar::-webkit-scrollbar {
	    width: 6px;
	    height: 6px;
	}
	
	.tree-bar::-webkit-scrollbar-thumb {
	    border-radius: 4px;
	    -webkit-box-shadow: inset 0 0 2px #d1d1d1;
	    background: #e4e4e4;
	}
</style>
