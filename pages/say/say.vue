<template>
	<view>
		<text>嫌页面low?那也没办法呀,你还是要在这获取牛逼值</text>
		<!-- 占位 -->
		<view class="place"></view>
		<radio-group @change="radioChange">
			<view>
				<label class="radio">
					<radio value="1" :checked="this.subjecType===1" />JAVA
				</label>
				<label class="radio">
					<radio value="2" />实施/运维
				</label>
			</view>
		</radio-group>
		<!-- 占位 -->
		<view class="place"></view>
		<view class="uni-textarea">
			<textarea class="uni-textarea" maxlength="5000" placeholder="贡献一道面试题可获得5点牛逼值,如果有大量的面试题可以直接发文档到我的微信:vitionx,小技巧:QQ扫一扫能直接扫描出面试题照片中的文字" v-model="subject" />

			</view>
		<view class="loginbtn has-radius has-mgtb-20">
			<button @click="submit">提 交</button>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				subject:'',
				radioCurrent: 0,
				subjecType: 1
			};
		},
		methods:{
			radioChange(evt) {
				this.subjecType=evt.detail.value;
				console.log(evt);
			},
			submit(){
				let _this=this;
				if(this.subject==''){
					uni.showToast({
						icon:'none',
						title:'要不要写点啥?'
					})
					return;
				}
				let user=uni.getStorageSync('user');
				let userId;
				var param;
				if(user!=null){
					userId=user.id;
					}
					if(userId!=undefined){
						param={
								question:this.subject,
								type:this.subjecType,
								userId:user.id
							}
						}else{
							param={
								question:this.subject,
								type:this.subjecType
							}
						}
					
				this.apihttp.ajax({
					url:'/app/subject/save',
					method:'POST',
					header:{
						'content-type':'application/x-www-form-urlencoded'
					},
					data:param,
					success:function(res){
						let data=res.data;
						if(data.code===200){
							_this.subject='';
							uni.showToast({
								icon:'none',
								title:data.msg
							})
						}else{
							uni.showToast({
								icon:'none',
								title:data.msg
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
/* product */
	page {
		background: #ccc;
	}
	
	.place {
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
		height: 100upx;
	}
	.uni-textarea{
		padding: 0 2.5vw 2.5vw 2.5vw;
		margin: 0 2.5 2.5vw 2.5vw;
		width: 95%;
		background-color: #fff;
	}
	.loginbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: white;
		font-size: 32rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #FFBD27;
		opacity: 0.8;
	}
	
</style>
