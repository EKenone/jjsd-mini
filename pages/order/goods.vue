<template>
	<view style="height: auto;">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true"><block slot="backText">返回</block><block slot="content">添加商品</block></cu-custom>
		<view class="">
			<view class="padding-xl">
				<button class="cu-btn block bg-blue margin-tb-sm lg" @tap="scanGoods" style="position: fixed;bottom: 100rpx; width: 86%;"> 扫条形码</button>
			</view>
			<view class="text-center" v-if="goodsInfo.id == 0">
				<text v-if="noDataText">
					无数据
				</text>
				<text v-else>
					<text class="block">{{code}}</text>
					<text class="block">没查询到该条形码的商品，</text>
					<text class="block text-red">点击绑定商品按钮，可绑定系统已有商品</text>
				</text>
			</view>
			<view class="cu-list menu" v-else>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">商品名称</text>
					</view>
					<view class="action">
						<text class="text-black">{{goodsInfo.name}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">商品单位</text>
					</view>
					<view class="action">
						<text class="text-black">{{goodsInfo.unit}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">商品规格</text>
					</view>
					<view class="action">
						<text class="text-black">{{goodsInfo.format}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">商品编号</text>
					</view>
					<view class="action">
						<text class="text-black">{{goodsInfo.number}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">商品批发价</text>
					</view>
					<view class="action">
						<text class="text-black">{{goodsInfo.wholesale_price}}</text>
					</view>
				</view>
				<view class="cu-item">
					<view class="content">
						<text class="text-black">商品零售价</text>
					</view>
					<view class="action">
						<text class="text-black">{{goodsInfo.retail_price}}</text>
					</view>
				</view>
			</view>
			<view class="padding-xl">
				<button class="cu-btn fr bg-blue margin-tb-sm" @tap="jumpBind" v-if="code !== '' && goodsInfo.id === 0"> 绑定商品</button>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				noDataText: true,
				goodsInfo: {
					name: '',
					unit: '',
					format: '',
					number: '',
					id: 0,
					wholesale_price: '',
					retail_price: ''
				},
				code: ''
			};
		},
		methods: {
			jumpBind(){
				const t = this
				uni.navigateTo({
					url: "/pages/order/bind?code="+this.code,
					success(res) {
						t.noDataText = true
						t.code = '',
						t.goodsInfo.id = 0
					}
				})
			},
			scanGoods(e) {
				const t = this
				uni.scanCode({
					success(res) {
						t.code = ''
						t.goodsInfo.id = 0
						request({
							method: "GET",
							uri: 'goods/number',
							data: {
								number: res.result
								// number: '6928804010381'
							}
						}).then(r => {
							if (r.data != null) {
								t.goodsInfo = r.data
							} else {
								t.code = res.result
								t.noDataText = false
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
.page {
		height: 100vh;
	}
</style>
