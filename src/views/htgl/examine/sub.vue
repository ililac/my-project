<style lang="less">
@import "./sub.less";
</style>
<template>
		<div>
			<Upload
        multiple
        ref="upload"
        :before-upload="handleUpload"
        :show-upload-list="false"
        :on-success="uploadSuccess"
        action="//jsonplaceholder.typicode.com/posts/">
        <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
    </Upload>
		</div>
    
</template>

<script>
export default {
  name: "examine_submit",
  data() {
    return {
      file: [{
                name: 'aaa.jpg',
                type: 'image/jpeg',
                keyID: 123479
            },{
                name: 'bbb.jpg',
                type: 'image/jpeg',
                keyID: 987654
            }], // 总文件List
            uploadFile: [], // 需要上传的文件List
    };
  },
  methods: {
    handleUpload (file) { // 保存需要上传的文件
                let keyID = Math.random().toString().substr(2);
                file['keyID'] = keyID;
                this.file.push(file);
                this.uploadFile.push(file)
                return false;
            },
            delectFile (keyID) { // 删除文件
                this.file = this.file.filter(item => {
                    return item.keyID != keyID
                })
                this.uploadFile = this.uploadFile.filter(item => {
                    return item.keyID != keyID
                })
            },
            upload () { // 上传文件
                if(this.uploadFile.length === 0 ) {
                    this.$Message.error('未选择上传文件') 
                    return false
                } 
                for (let i = 0; i < this.uploadFile.length; i++) {
                    let item = this.file[i]
                    this.$refs.upload.post(item);
                }
            },
            uploadSuccess (response, file, fileList) { // 文件上传回调 上传成功后删除待上传文件
            },
  },
  mounted() {

  }
};
</script>