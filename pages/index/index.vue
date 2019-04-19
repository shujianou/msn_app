<template>
	<view>
		<!-- 状态栏 -->
		<view class="status" :style="{position:headerPosition}"></view>
		<!-- 漂浮头部 -->
		<view class="header" :style="{position:headerPosition}">
			<view class="scan">
				<view class="icon scan" @tap="scan"></view>
			</view>
			<!-- <view class="input">
				<view class="icon search"></view>
				<input placeholder="搜点啥?" @tap="toSearch()" />
			</view> -->
			<!-- mSearch组件 如果使用原样式，删除组件元素-->
			<mSearch :mode="2" button="inside" :placeholder="defaultKeyword" @search="doSearch(1,1)" @confirm="doSearch(1,1)"
			 v-model="keyword"></mSearch>
			<view class="menu">
				<image mode="widthFix" src="../../static/img/ucenter/face.png"></image>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>

		<!-- 面试题列表 -->
		<view class="pick">
			<view v-for="subject in subjectList" :key="subject.id">
				<view class="box">
					<view class="title">
						<view class="big" v-if="subject.type===1">JAVA</view>
						<view class="big" v-if="subject.type===2">实施</view>
						<view class="big" v-if="subject.type==null||subject.type==''">其它</view>
					</view>
					<view class="subject-list">
						<view @tap="toSubject(subject)">
							<view>
								<text>{{subject.question}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 占位 -->
				<view class="place"></view>

			</view>
		</view>
		<uni-load-more :status="loadMoreStatus" :loadingType="loadingType" :contentText="contentText"></uni-load-more>
	</view>
</template>
<script>
	import mSearch from '@/components/search/search.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

	var page = 1,
		timer = null;
	export default {
		data() {
			return {
				loadMoreStatus: 'more',
				loadingText: '加载中...',
				loadingType: 0, //定义加载方式 0---contentdown  1---contentrefresh 2---contentnomore
				contentText: {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				},
				keyword: '',
				defaultKeyword: '搜什么?你懂的',
				//推荐商品 3个
				subjectList: [],

				categoryHeight: '0px',
				currentPageindex: 0,
				headerPosition: "fixed",
				page: 1,
				pageSize: 5,
				total: '',
				search: 1,
				tmpPage: {
					page: 1,
					pageSize: 5
				}
			};
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch,
			uniLoadMore
		},
		onReady() {},
		onPullDownRefresh: function() {
			this.page = 1;
			this.loadList();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新，需要自己在page.json文件中配置开启页面下拉刷新 "enablePullDownRefresh": true
		onPullDownRefresh() {
			/* setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000); */
			uni.stopPullDownRefresh();
		},
		onReachBottom: function() {
			let _this = this;
			//触底的时候请求数据，即为上拉加载更多
			//为了更加清楚的看到效果，添加了定时器
			/* if (timer != null) {
				clearTimeout(timer);
			}
			timer = setTimeout(function() {
				_this.page = _this.page + 1;
				if (_this.keyword != null && _this.keyword != '') {
					_this.doSearch(0);
				} else {
					_this.loadList();
				}
			}, 1000); */
			this.loadMoreStatus = 'loading';
			_this.page = _this.page + 1;
			if (_this.keyword != null && _this.keyword != '') {
				_this.doSearch(0, 0);
			} else {
				_this.loadList();
			}

		},
		onLoad() {
			this.loadList();
		},
		methods: {
			//初始化题目列表
			loadList() {
				uni.showNavigationBarLoading();
				let _this = this;
				this.apihttp.ajax({
					url: '/app/subject/list',
					method: 'POST',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						P_NO: _this.page,
						P_SIZE: _this.pageSize,
						Q_COLUMN: 'AND_status_EQ',
						Q_VALUE: '1',
						P_SORT: 'create_time',
						P_ORDER: 'desc',
					},
					success: function(res) {
						let data = res.data;
						if (data.code === 200) {
							if (data.data.rows == null || data.data.rows.length == 0) {
								uni.showToast({
									icon: 'none',
									title: '没有更多了~'
								});
								this.loadMoreStatus = 'noMore';
								return;
							}
							if (_this.subjectList.length > 0) {
								_this.subjectList = _this.subjectList.concat(data.data.rows);
							} else {
								_this.subjectList = data.data.rows;
							}
							_this.page = data.data.page;
							_this.pageSize = data.data.pageSize;
							_this.total = data.data.records;
							this.loadMoreStatus = 'more';
						} else {
							uni.showToast({
								icon: 'none',
								title: data.msg
							})
						}
						uni.hideNavigationBarLoading();
					}
				})
			},
			//执行搜索
			doSearch(search, initSearch) {
				let _this = this;
				let qValue;
				let qColumn;
				//search原始值
				let _search = search;

				if (initSearch == 1) {
					//首次搜索
					this.page = this.tmpPage.page;
					this.pageSize = this.tmpPage.pageSize;
				}
				if (this.keyword != null && this.keyword.length > 0) {
					qValue = '1,' + this.keyword;
					qColumn = 'AND_status_EQ,AND_question_LK';
				} else {
					qValue = '1';
					qColumn = 'AND_status_EQ';
					search = 0;
				}

				this.apihttp.ajax({
					url: '/app/subject/list',
					method: 'POST',
					header: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						P_NO: this.page,
						P_SIZE: this.pageSize,
						Q_COLUMN: qColumn,
						Q_VALUE: qValue,
						P_SORT: 'create_time',
						P_ORDER: 'desc',
						search: search
					},
					success: function(res) {
						let data = res.data;
						if (data.code === 200) {
							if (data.data.rows == null || data.data.rows.length == 0) {
								uni.showToast({
									icon: 'none',
									title: '没有更多了~'
								})
								this.loadMoreStatus = 'noMore';
								return;
							}
							if (_search === 1) {
								_this.subjectList = data.data.rows;
							} else {
								_this.subjectList = _this.subjectList.concat(data.data.rows);
							}
							_this.page = data.data.page;
							_this.pageSize = data.data.pageSize;
							_this.total = data.data.records;
							this.loadMoreStatus = 'more';
							uni.showToast({
								icon: 'none',
								title: data.msg,
								duration: 2000
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: data.msg,
								duration: 2000
							})
						}


					}
				})
			},

			//扫一扫
			scan() {
				uni.showToast({
					icon: 'none',
					title: '暂不支持扫题'
				})
				/* uni.scanCode({
					success: (res) => {
						uni.showToast({
							title: '条码内容：' + res.result
						});
					}
				}); */
			},
			//搜索跳转
			toSearch() {
				uni.navigateTo({
					url: '/pages/search/index'
				})
			},
			//题目跳转
			toSubject(e) {
				/* uni.navigateTo({
					url: '/pages/detail/detail'
				}) */
			}
		}
	};
</script>
<style lang="scss">
	@font-face {
		font-family: "HMfont-home";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAP8AAsAAAAACFwAAAOwAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqEEINSATYCJAMQCwoABCAFhG0HTxtLBxHVmzvJfhS4scOeC1v4zNNRK/hO5b0IHqg/8838ye5XsIDanmAkhZ1NSZygm4SsbYYkp17ICsOUxIP/ZZm9xejtQAD8zzX10geY387mEtXapUd7A5xF6oAi2pJoE8YNY1dexGkIwCSZQoiq1es2RUdhTBKA6N2jWwf0lAlVky3QEYSUrFSIOTjQ5VR5GZjt/168obDQQeLQMGY27FqtMxWf5z5fpgWCgdYugng8B8DWgQYUAhSI7qWujmhhqBAaptJfURzQ0ZEwVkfB58uCQSTZi0o3//JAItBAhGBk2gAURUrtxMQ2BQnPC1IQ8HyZmpvE1XgdMIDtwHVEJt4qkThsZwFPVHiEFTHKtWBBYGGUe/HmsZu6TluCStw+fXGMY9GyUb4b133Xrze9etV77VqzxcuXbYq8bF6/7rtxo5lY6A1cLcuCQJS3oXHswOYKUSaI71xkXr3ayZy2SIix0YumRS6AwEnLmr58WS9z2pKlYcJCCGzcXOU81Xuhp1osIWbBiUQWehda7lTvaNeCJX0WbYgksMA0hdlLo6zDp1PEomIdVu7YE4wN7nH7uGPdHXz2R3uHnX68tcP6SPE5ZSdObNpN/9dybtfmr6tHoy6+rN+DqdvnW9lUbkHTdcUWfKp1yzVr5Ag5HCqGU0Hca3jpAt2GiWFRwxYvdpYFo2b3tN/HvLeFd+BAr5Bu7CXnzKFlJb8dtP3ucx1djc+589Pep+W7X706stfvml+7i8fsWunxp7/f/uzsrgzj9Sv3p+6T7yqwvrfdy3nk/J6eZ84fnHp2lSvf/m/7H7569dDvuY/fTX+Mwdog+QVAGyB/IHmGyK8/exQrX13Maucu+y23rrbi5tQ1T3yTor3oj4kV8a8VtyxSqtQwKyXLbJF2kaI5DgAkYGICPzQG4dwfQxPVOhMEOlExSEJJAg2dTFSRhcCBRVEIQacCmBSkxnqLCAaiIZQBFGAiAIGH3SBxcRo0PFxBFXkPHETzDkLwCA1MfCJiR4tswStWxeEccIPlAbXSxS1rYEH2G0U8ZpeU+sw/Oq+80JR1NjrghW6MOT6JNgQO3NEJPTgPj4PAONK4hlKGYLqq4mVvKlc6M0YVh3PADZYH1EoXd8sHlvv+G0U8ZldDq/D+0XnVPTRl3QIdVFcr2rX090m0IXA8jjs6oYcOPMwQgSkfpnENpewRMF2FSvG2qnJ+zfmE6wATY6YSUmhCCQehg9V8advwun0+nHuJ0VP0kYrcz/Qox5hl') format('woff2');
	}

	.icon {
		font-family: "HMfont-home" !important;
		font-size: 60upx;
		font-style: normal;
		color: #ffffff;

		&.scan {
			&:before {
				content: "\e69a";
			}
		}

		&.menu {
			&:before {
				content: "\e62b";
			}
		}

		&.search {
			&:before {
				content: "\e628";
			}
		}
	}

	page {
		background-color: #434343;

	}

	.status {
		width: 100%;
		height: 0;
		/*  #ifdef  APP-PLUS  */
		height: var(--status-bar-height);
		/*  #endif  */
		background-color: #434343;
		position: fixed;
		top: 0;
		z-index: 999;
	}

	.header {
		width: 100%;
		height: 100upx;
		background-color: #434343;
		display: flex;
		position: fixed;
		top: 0;
		/*  #ifdef  APP-PLUS  */
		top: var(--status-bar-height);
		/*  #endif  */

		z-index: 996;

		.scan {
			width: 100upx;
			height: 100upx;
			flex-shrink: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.input {
			width: calc(100% - 200upx);
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			input {
				width: calc(100% - 60upx);
				height: 60upx;
				background-color: #ffffff;
				border-radius: 60upx;
				padding-left: 60upx;
				font-size: 30upx;

			}

			.icon {
				width: 60upx;
				height: 60upx;
				position: absolute;
				color: #a18090;
				z-index: 996;
				top: 20upx;
				left: 0;
				font-size: 40upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.menu {
			width: calc(100% - 600upx);
			height: 100upx;
			flex-shrink: 1;
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 60upx;
				height: 60upx;
				border-radius: 60upx;
			}
		}
	}

	.place {
		/*  #ifdef  APP-PLUS  */
		margin-top: var(--status-bar-height);
		/*  #endif  */
		background-color: #434343;
		height: 100upx;
	}


	.pick {
		width: 95%;
		padding: 0 2.5vw 2.5vw 2.5vw;

		.box {
			width: 100%;
			border-radius: 20upx;
			background-color: #ccc;

			.title {
				display: flex;
				justify-content: flex-start;
				align-items: flex-end;
				height: 60upx;
				border-bottom: solid 1upx #eee;
				padding-bottom: 10upx;

				.big {
					font-size: 34upx;
					padding-left: 20upx;
					color: #46434f;
				}

				.small {
					font-size: 24upx;
					padding-left: 20upx;
					color: #827f8b;
				}
			}

			.subject-list {
				padding: 15upx 20upx 15upx 20upx;
				column-count: 2;
				column-width: 50%;
				column-gap: 10upx;

				text {
					width: 100%;
					color: #434343;
				}
			}
		}
	}
</style>
