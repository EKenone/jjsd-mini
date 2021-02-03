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
					<input placeholder="商品简称" @change="shortNameChange" name="short_name"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">商品编码：</view>
					<input placeholder="请填写商品的条码编号" @change="numberChange" :value="number" name="number"></input>
					<button class='cu-btn bg-green shadow' @tap="scanGoods">扫码</button>
				</view>
				<view class="cu-form-group">
					<view class="title">商品类别：</view>
					<view>
						{{categoryShow}}
					</view>
					<view class="action">
						<button class="cu-btn bg-green shadow" @tap="showModal" data-target="ChooseModal">选择</button>
					</view>
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
				<view class="cu-form-group">
					<view class="title">零售价：</view>
					<input placeholder="请输入零售价" type="digit" :value="retailPrice" @change="retailPriceChange" name="retail_price"></input>
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
					<view class="action" @tap="hide">
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
		<view class="cu-modal" :class="modalName=='hasError'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="action" @tap="hide">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-red" style="font-size: 16px;">
					{{err}}
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-green margin-left" @tap="hide">确定</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='scanFail'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="action" @tap="hide">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl text-green" style="font-size: 16px;">
					该条码已存在，请勿重复添加
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn bg-green margin-left" @tap="hide">确定</button>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='ChooseModal'?'show':''" @tap="hide">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-green" @tap="hide">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item,index) in category" class="padding-xs" :key="index">
						<button class="cu-btn orange block" :class="item.checked?'bg-blue':'line-blue'" @tap="ChooseCheckbox"
						 :data-value="item.id"> {{item.title}}
						</button>
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
				err: "",
				modalName: "",
				number: "",
				wholesalePrice: "",
				retailPrice: "",
				unitIndex: -1,
				unitTitle: [],
				formatIndex: -1,
				formatTitle: [],
				category: [],
				categoryChecked:[],
				categoryShow: "",
				form: {}
			}
		},
		onShow() {
			request({
				uri: 'goods/attr',
				data: {},
			}).then(res => {
				this.formatTitle = res.data.format
				this.unitTitle = res.data.unit
				let category = res.data.category
				category.forEach(function(item){
					item.checked = false
				})
				
				this.category = category
			})
			
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			ChooseCheckbox(e) {
				let items = this.category;
				let values = e.currentTarget.dataset.value;
				let checked;
				
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].id == values) {
						items[i].checked = !items[i].checked;
						checked = items[i].checked
						break
					}
				}
				
				let categoryChecked = this.categoryChecked
				let l = categoryChecked.length
				if (checked) {
					categoryChecked.push(values)
				} else {
					for (let i = 0; i < l; i++) {
						if (categoryChecked[i] == values) {
							categoryChecked.splice(i, 1);
						}
					}
				}
				this.categoryChecked = categoryChecked
				
				let showCheckedId = categoryChecked[0]
				if (!showCheckedId) {
					this.categoryShow = ""
				} else {
					for (let i = 0, lenI = items.length; i < lenI; ++i) {
						if (items[i].id == showCheckedId) {
							this.categoryShow = items[i].title
							break
						}
					}
				}
				
				if (categoryChecked.length > 1) {
					this.categoryShow = this.categoryShow + "等"
				}
				
			},
			hide(){
				this.modalName = ''
			},
			back(){
				this.modalName = ''
				uni.navigateBack()
			},
			nameChange(e) {
				this.form.name = e.detail.value
			},
			shortNameChange(e) {
				this.form.short_name = e.detail.value
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
				if (!e.detail.value) {
					return
				}
				const v = parseFloat(e.detail.value).toFixed(2)
				this.wholesalePrice = v
				this.form.wholesale_price = v
			},
			retailPriceChange(e) {
				if (!e.detail.value) {
					return
				}
				const v = parseFloat(e.detail.value).toFixed(2)
				this.retailPrice = v
				this.form.retail_price = v
			},
			addGoods(e) {
				
				if (!this.form.name) {
					this.err = "请填写商品全称"
					this.modalName = "hasError"
					return
				}
				
				if (!this.form.short_name) {
					this.err = "请填写商品简称"
					this.modalName = "hasError"
					return
				}
				
				if (!this.form.number) {
					this.err = "请输入商品编号"
					this.modalName = "hasError"
					return
				}
				
				const t = this
				t.form.category = this.categoryChecked
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
						request({
							method: "GET",
							uri: 'goods/number',
							data: {
								number: res.result
								// number: '6928804010381'
							}
						}).then(r => {
							if (r.data != null) {
								t.modalName = 'scanFail'
							} else {
								t.form.number = res.result
								t.number = res.result
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
