<template>
	<view style="height: auto;">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true"><block slot="backText">返回</block><block slot="content">添加商品</block></cu-custom>
		<view class="">
			<form>
				<view class="cu-form-group">
					<view class="title">商品全称：</view>
					<input placeholder="容量+全称+(口味)" @change="nameChange" name="name"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">商品简称：</view>
					<input placeholder="商品简称" @change="sortNameChange" name="short_name"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">商品编码：</view>
					<input placeholder="请填写商品的条码编号" @change="numberChange" :value="number" name="number"></input>
					<button class='cu-btn bg-green shadow' @tap="scanGoods">扫码</button>
				</view>
				<view class="cu-form-group">
					<view class="title">商品单位：</view>
					<picker @change="unitChange" :value="unitIndex" :range="unitTitle">
						<view class="picker">
							{{unitIndex>-1?unitTitle[unitIndex]:'请选择'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">商品规格：</view>
					<picker @change="formatChange" :value="formatIndex" :range="formatTitle">
						<view class="picker">
							{{formatIndex>-1?formatTitle[formatIndex]:'请选择'}}
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<view class="title">批发价：</view>
					<input placeholder="请输入批发价" type="digit" :value="wholesalePrice" @change="wholesalePriceChange" name="wholesale_price"></input>
					<view class="cu-capsule radius">
						<view class="cu-tag bg-blue">
							元 
						</view>
					</view>
				</view>
			</form>
			<view class="padding-xl">
				<button class="cu-btn block bg-blue margin-tb-sm lg" @tap="addGoods" style="position: fixed;bottom: 100rpx; width: 86%;"> 添加</button>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='bindSuccess'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-green" style="font-size: 16px;">
					添加成功
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-green margin-left" @tap="back">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				modalName: "",
				number: "",
				wholesalePrice: "",
				unitIndex: -1,
				unitTitle: [],
				formatIndex: -1,
				formatTitle: [],
				form: {}
			}
		},
		onShow() {
			request({
				uri: 'goods-format/list',
				data: {},
			}).then(res => {
				console.log(11)
				this.formatTitle = res.data
			})
			
			request({
				uri: 'goods-unit/list',
				data: {},
			}).then(res => {
				this.unitTitle = res.data
			})
		},
		methods: {
			back(){
				this.modalName = ''
				uni.navigateBack()
			},
			nameChange(e) {
				this.form.name = e.detail.value
			},
			sortNameChange(e) {
				this.form.sort_name = e.detail.value
			},
			numberChange(e){
				this.form.number = e.detail.value
			},
			unitChange(e) {
				this.unitIndex = e.detail.value
				this.form.unit = this.unitTitle[e.detail.value]
			},
			formatChange(e) {
				this.formatIndex = e.detail.value
				this.form.format = this.formatTitle[e.detail.value]
			},
			wholesalePriceChange(e) {
				const v = parseFloat(e.detail.value).toFixed(2)
				this.wholesalePrice = v
				this.form.wholesale_price = v
			},
			addGoods(e) {
				const t = this
				request({
					uri: 'goods/add',
					data: t.form,
					method: "POST",
				}).then(res => {
					t.modalName = 'bindSuccess'
				})
				
			},
			scanGoods(e) {
				const t = this
				uni.scanCode({
					success(res) {
						t.form.number = res.result
						t.number = res.result
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
