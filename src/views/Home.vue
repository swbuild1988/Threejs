<template>
	<div class="home">
		<Button>普通按钮</Button>
		<Button v-permission="['common:list']">具有common:list权限</Button>
		<Button v-permission="['common:edit']">具有common:edit</Button>
		<div class="rows">
			<div class="item" id="bar" ref="bar"></div>
			<div class="item" id="line" ref="line"></div>
			<div class="item" id="pie" ref="pie"></div>
			<div class="item" id="radar" ref="radar"></div>
			<div class="item" id="table">
				<Table stripe :columns="columns1" :data="data" height='238'></Table>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		Component,
		Vue,
		Prop
	} from 'vue-property-decorator'
	import echarts from 'echarts';
	@Component({
		components: {}
	})
	export default class Home extends Vue {
		// data
		columns1: any[] = [{
				title: '时间',
				key: 'time',
				align: 'center'
			},
			{
				title: '数值',
				key: 'value',
				align: 'center'
			}
		]
		data: any[] = [{
				time: '周一',
				value: 18
			},
			{
				time: '周二',
				value: 24
			},
			{
				time: '周三',
				value: 30
			},
			{
				time: '周四',
				value: 26
			},
			{
				time: '周五',
				value: 29
			}
		]
		barChart: any = null
		lineChart: any = null
		pieChart: any = null
		radarChart: any = null

		mounted() {
			console.log("state", this.$store.state)

			this.barInit()
			this.lineInit()
			this.pieInit()
			this.radarInit()
		}

		barInit() {
			// this.barChart = this.$echarts.init(document.getElementById('bar'))
			this.barChart = echarts.init(this.$refs.bar as HTMLCanvasElement)
			let xData: string[] = [],
				seriesData: number[] = []
			this.data.forEach(element => {
				xData.push(element.time);
				seriesData.push(element.value);
			});
			let barOption = {
				xAxis: {
					type: 'category',
					data: xData,
					axisLabel: {
						color: '#eee'
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						color: '#eee'
					}
				},
				series: [{
					data: seriesData,
					type: 'bar'
				}]
			};
			this.barChart.setOption(barOption)
		}
		lineInit() {
			// this.lineChart = this.$echarts.init(document.getElementById('line'))
			this.lineChart = echarts.init(this.$refs.line as HTMLCanvasElement)
			let xData: string[] = [],
				seriesData: number[] = []
			this.data.forEach(element => {
				xData.push(element.time);
				seriesData.push(element.value);
			});
			let lineOption = {
				xAxis: {
					type: 'category',
					data: xData,
					axisLabel: {
						color: '#eee'
					}
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						color: '#eee'
					}
				},
				series: [{
					data: seriesData,
					type: 'line'
				}]
			};
			this.lineChart.setOption(lineOption)
		}
		pieInit() {
			// this.pieChart = this.$echarts.init(document.getElementById('pie'))
			this.pieChart = echarts.init(this.$refs.pie as HTMLCanvasElement)
			let legend: string[] = [],
				data: any[] = []
			this.data.forEach(element => {
				legend.push(element.time);
				data.push({
					value: element.value,
					name: element.time
				})
			});
			let pieOption = {
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					orient: 'vertical',
					left: 10,
					data: legend
				},
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: '50%',
					data: data
				}]
			};
			this.pieChart.setOption(pieOption)
		}
		radarInit() {
			// this.radarChart = this.$echarts.init(document.getElementById('radar'))
			this.radarChart = echarts.init(this.$refs.radar as HTMLCanvasElement)
			let data: string[] = [],
				indicator: any[] = []
			this.data.forEach(element => {
				data.push(element.value);
				indicator.push({
					max: 40,
					name: element.time
				})

			})
			let radarOption = {
				title: {
					text: ''
				},
				radar: {
					name: {
						textStyle: {
							color: '#fff',
							backgroundColor: '#999',
							borderRadius: 3,
							padding: [3, 5]
						}
					},
					indicator: indicator
				},
				series: [{
					name: '',
					type: 'radar',
					areaStyle: {
						normal: {}
					},
					data: [{
						value: data,
						name: ''
					}]
				}]
			};
			this.radarChart.setOption(radarOption)
		}
	}
</script>
<style lang="less">
	.rows {
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-rows: 28vh 34vh 32vh;
		margin: 0 auto;
		width: 88%;
		padding-top: 20px;

		.item {
			border: 1px solid #9d9898;
			width: 100%;
			height: 100%;
		}

		#table {
			grid-column-start: 1;
			grid-column-end: 3;

			.ivu-table td,
			.ivu-table th {
				height: 38px;
			}
		}
	}
</style>