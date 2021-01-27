<template>
	<view style="height: auto;">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true"><block slot="backText">返回</block><block slot="content">绑定商品</block></cu-custom>
		<button class="cu-btn block bg-blue margin-tb-sm" @tap="bindGoods" style="position: fixed;bottom: 50rpx; right: 10rpx;width: 21%;"> 绑定</button>
		<view class="">
			<form>
				<view class="cu-form-group">
					<input placeholder="请输入商品全称或者简称" name="input" @input="kewordValue" :value="keyword" ></input>
					<button class='cu-btn bg-green shadow' @tap="searchGoods">搜索</button>
				</view>
			</form>
			<view>
				<text class="block text-center" v-if="list.length === 0" style="line-height: 800rpx;">
					暂无数据
				</text>
				<form>
					<radio-group class="block" @change="radioChange">
						<view class="cu-form-group" v-for="item in list">
							<view class="title">{{item.name}}/{{item.unit}}</view>
							<radio :class="radio==item.id?'checked':''" :checked="radio==item.id?true:false" :value="item.id"></radio>
						</view>
					</radio-group>
				</form>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='radioFail'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-red" style="font-size: 16px;">
					{{modelText}}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-green margin-left" @tap="hideModal">确定</button>
					</view>
				</view>
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
					绑定成功
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
				code: '',
				keyword: '',
				list: [],
				radio: 0,
				modalName: '',
				modelText: ''
			};
		},
		methods: {
			back(){
				this.modalName = ''
				uni.navigateBack()
			},
			hideModal(){
				this.modalName = ''
			},
			radioChange(e){
				this.radio = e.detail.value
			},
			bindGoods(){
				if (this.radio === 0) {
					this.modalName = 'radioFail'
					this.modelText = ''
					return
				}
				const t = this
				request({
					method: "POST",
					uri: "goods/update-number",
					data: {"number": this.code, "id": this.radio}
				}).then(res => {
					t.modalName = 'bindSuccess'
				})
			},
			kewordValue(e){
				this.keyword = e.detail.value
			},
			searchGoods(){
				if (this.keyword === '') {
					return
				}
				const t = this
				request({
					uri: 'goods/keyword-list',
					data: {'keyword': this.keyword}
				}).then(res => {
					this.list = res.data
				})
			}
		},
		onLoad(options) {
			this.code = options.code
			console.log(this.code)
		}
	}
</script>

<style>
.page {
		height: 100vh;
	}
</style>
