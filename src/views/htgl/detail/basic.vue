<template>
	<Form ref="detailForm" :model="detailForm" :label-width="140">
		<div class="ul">
			<FormItem label="合同来源" class="lef">
				<p>{{detailForm.sourceName}}</p>
			</FormItem>
		</div>
		<div class="ul">
			<FormItem label="合同正文" class="lef">
				<p v-show="fileDownUrl"><a v-bind:href="fileDownUrl">{{detailForm.contentname}}</a></p>
			</FormItem>
		</div>
		<div class="ul">
			<FormItem label="合同名称" class="lef">
				<p>{{detailForm.name}}</p>
			</FormItem>
			<Form-item label="合同类型" class="lef">
					<p>{{detailForm.contractType}}</p>
			</Form-item>
		</div>
		<div class="ul">
			<FormItem label="系统编号" class="lef">
				<p>{{detailForm.systemNumber}}</p>
			</FormItem>
			<FormItem label="合同编号" class="lef">
				<p>{{detailForm.number}}</p>
			</FormItem>
		</div>
		<div class="ul" v-for="(item,index) in detailForm.counterpartList" style="color: #515a6e;font-size: 12px;">
			<div class="lef">
				<label for="" style="text-align: right;width: 140px;display: inline-block;padding: 10px 12px 10px 0;">{{"相对方"+(index + 1)}}</label>
				<span>{{item.counterpartName}}</span>
			</div>
			<Form-item label="合同地位" class="lef">
				<span style="margin-right: 10px;">{{item.degree}}</span>
			</Form-item>
		</div>
		<div class="ul">
			<FormItem label="收付款方式" class="lef" prop="paytype">
				<p>{{detailForm.istopayName}}</p>
			</FormItem>
			<FormItem label="合同额（万元）" class="lef">
				<p>{{detailForm.money}}</p>
			</FormItem>
		</div>
		<div class="ul">
			<FormItem label="开始日期" class="lef">
				<p>{{detailForm.starttime}}</p>
			</FormItem>
			<FormItem label="结束日期" class="lef">
				<p>{{detailForm.endtime}}</p>
			</FormItem>
		</div>
		
		<div class="ul">
			<FormItem label="合同份数" class="lef">
				<label for=""></label><span style="line-height: 10px;margin:0 5px;text-align: center;display: inline-block;width: 20px;border-bottom: 1px solid #E3E5E8;">{{detailForm.totalnum}}</span>
			</FormItem>
			<FormItem label="关联主合同" class="lef">
				<p>{{detailForm.parentContractName}}</p>
			</FormItem>
		</div>
		<div class="ul txtar">
			<FormItem label="备注">
				<p>{{detailForm.description}}</p>
			</FormItem>
		</div>
		<div class="ul">
			<FormItem label="相关附件">
				<p v-for="item in detailForm.uploadList" class="auditLef" style="margin-right: 20px;"><a v-bind:href="item.fileDownUrl">{{item.name}}</a></p>
			</FormItem>
		</div>
		<div class="ul">
			<FormItem label="起草人" class="lef">
				<span>{{detailForm.draftsman}}</span>
			</FormItem>
			<FormItem label="起草时间" class="lef">
				<span>{{detailForm.draftstime}}</span>
			</FormItem>
		</div>
		<div class="ul">
			<FormItem label="起草机构" class="lef">
				<span>{{detailForm.draftsoutfit}}</span>
			</FormItem>
		</div>
		
	</Form>
</template>

<script>
	export default {
	    name: "basicForm",
		props:{
			formData:Object,
			sourceType:Number,
			fileDown:String
		},
	    data() {
	        return {
				detailForm: this.formData,
				fileDownUrl:this.fileDown
	        };
	    },
		watch:{
			formData: {
		　　 	handler(newValue, oldValue) {
					this.detailForm = {...newValue};
		　　　　	},
		　　　　	deep: true
		　　 },
			fileDown: {
		　　 	handler(newValue, oldValue) {
					this.fileDownUrl = newValue;
				},
		　　　　	deep: true
		　　},
			sourceType(newValue, oldValue) {
				if(newValue){
					this.sourse = newValue;
				}else{
					this.sourse = oldValue;
				}
		　　 }
		},
	};
</script>

<style>
</style>
