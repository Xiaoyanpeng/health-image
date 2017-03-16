;(function () {

	function ShowChart() {
		this.patient = '';
		this.type = '';
		this.timeType = '';
		this.bloodType = '';
		this.yAxisMax = '';
		this.yAxisMin = '';
		this.lineMax = '';
		this.lineMin = '';

		this.init();

	}
	ShowChart.prototype = {
		init:function () {
			this.patient = '915cd110-5b1d-11e6-8344-fa163e8aee56';
			this.type = 1;
			this.timeType = 1;
			this.bloodType = 1;
			this.yAxisMax = 10;
			this.yAxisMin = 0;
			this.lineMax = 7;
			this.lineMin = 4;

			this.getBloodData();
			this.event();
		},
		event:function () {
			var that = this;
			var
				$bloodTypeSrc = $('#bloodTypeSrc li'),
				$timeTypeSrc = $('#timeTypeSrc li');

			$bloodTypeSrc.on('click',function () {
				var type = $bloodTypeSrc.index($(this)) + 1;

				$bloodTypeSrc.removeClass('active');
				$(this).addClass('active');

				that.bloodType = type;

				if (that.type == 1) {

					switch (type) {
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
							that.lineMax = 7
							that.lineMin = 4;
							that.yAxisMax = 10;
							that.yAxisMin = 0;
							break;
						case 2:
						case 4:
						case 6:
							that.lineMax = 11.1
							that.lineMin = 4;
							that.yAxisMax = 13;
							that.yAxisMin = 0;
							break;
					}
				} else {
					switch (type) {
						case 8:
							that.lineMax = 140;
							that.lineMin = 90;
							that.yAxisMax = 'auto';
							that.yAxisMin = 20;
							break;
						case 9:
							that.lineMax = 90;
							that.lineMin = 60;
							that.yAxisMax = 'auto';
							that.yAxisMin = 20;
							break;
						case 10:
							that.lineMax = 160;
							that.lineMin = 40;
							that.yAxisMax = 180;
							that.yAxisMin = 20;
							break;
					}
				}

				that.getBloodData();
			});
			$timeTypeSrc.on('click',function () {
				var type = $timeTypeSrc.index($(this)) + 1;
				$timeTypeSrc.removeClass('active');
				$(this).addClass('active');
				that.timeType = type;
				that.getBloodData();
			})

		},

		// type 1 血糖 2 血压
		// timeType 1 近一个月 2 近半年 3 近一年
		// bloodType 1 空腹血糖 2 早餐后血糖 3 午餐前血糖 4 午餐后血糖 5 晚餐前血糖 6 晚餐后血糖 7 睡前血糖
		// bloodType 8 舒张压 9 收缩压 10 心率
		// yAxisMax y轴坐标最大值
		// yAxisMin y轴坐标最小值
		// lineMax 标注线最大值
		// lineMin 标注线最小值

		getBloodData:function () {
			var that = this;
			var glucoseChart = echarts.init(document.getElementById('glucoseChart'));

			var data = {};
			data.patient = this.patient;
			data.type = this.type;
			data.timeType = this.timeType;
			data.bloodType = this.bloodType;

			DataService.healthIndex(data).then(function (res) {
				setData(res);
			})

			function setData(res) {
				var dataArr = res.data,
					healths = dataArr.healths,
					statistics = dataArr.statistics,
					high = statistics.high,
					normal = statistics.normal,
					low = statistics.low,
					$statisticsHigh = $('#statisticsHigh'),
					$statisticsNormal = $('#statisticsNormal'),
					$statisticsLow = $('#statisticsLow'),
					data = [];

				$statisticsHigh.html(high);
				$statisticsNormal.html(normal);
				$statisticsLow.html(low);

				// 数据转换
				$.map(healths,function (item) {
					var arr = [];
					for (prop in item) {
						arr.push(item[prop])
					}
					data.push(arr)
				})
				data.reverse();

				glucoseChart.setOption(option = {
					tooltip: {
						triggerOn: 'none',
						padding:20,
						formatter: function (params) {
							var date = new Date(params.name);
							date = date.getMonth() + 1 + '月' + date.getDate() + '日';
							var y = Number(params.value[1]).toFixed(2);
							return '日期：' + date + '<br><br>数值：' + y;
						}
					},
					textStyle: {
						color: '#fff',
						fontSize: 20
					},
					grid: {
						show: false,
						left:105,
						top:60,
						right:40,
						bottom:200
					},
					xAxis: {
						axisLine: {
							lineStyle: {
								color: '#fff'
							}
						},
						axisLabel: {
							formatter: function (value, idx) {
								var date = new Date(value);
								return [date.getMonth() + 1, date.getDate()].join('-');
							},
							textStyle:{
								fontSize:16,
							},
							margin:25,
							interval: 'auto'
						},
						axisTick: {
							alignWithLabel:true,
							inside:true,
							length:8,
							interval: 'auto',
						},
						data: data.map(function (item) {
							return item[0];
						}),
					},
					yAxis: {
						tylpe:'value',
						max: that.yAxisMax,
						min: that.yAxisMin,
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: false,
							textStyle:{
								fontSize:16
							}
						},
						splitLine: {
							show: false
						},
						offset:20,

					},
					toolbox: {
						width:260,
						height:80,
						bottom: 20,
						left:'center',
						feature: {
							saveAsImage: {
								backgroundColor: '#1C577E'
							}
						},
						itemSize: 150,
						iconStyle:{
							normal:{
								color:'#fff',
								opacity:0
							}
						}
					},
					dataZoom: [{
						show: false
					}, {
						type: 'inside',
						show: false,
					}],
					series: {
						id:'a',
						type: 'line',
						z:8888,
						hoverAnimation:false,
						data: data.map(function (item) {
							return item[1];
						}),
						itemStyle: {
							normal: {
								color: '#fff'
							}
						},
						symbol: 'circle',
						symbolSize: 10,
						lineStyle: {
							normal: {
								color: '#fff',
								width: 2,
								shadowColor: 'rgba(0,0,0,0.5)',
								shadowBlur: 8,
								shadowOffsetY: 8
							}
						},
						// markPoint: {
						// 	data: [
						// 		{type: 'max', name: '最大值'},
						// 		{type: 'min', name: '最小值'}
						// 	],
						// 	itemStyle: {
						// 		normal: {
						// 			color: '#dd2b3c'
						// 		}
						// 	},
						// 	symbolSize: 80,
						// },
						markLine: {
							silent: true,
							symbol:'',
							zlevel: -10,
							label:{
								normal:{
									show:true,
									position:'start',
									formatter: ' {c}    '
								}
							},
							data: [
								{
									yAxis: that.lineMax,
									x:90,
									symbol: 'rect',
									symbolSize: 12,
									lineStyle: {
										normal: {
											color: '#FE69FE',
											type: 'solid',
											width: 3
										}
									},
								},
								{
									yAxis: that.lineMin,
									x:90,
									symbol: 'rect',
									symbolSize: 12,
									lineStyle: {
										normal: {
											color: '#00FFFF',
											type: 'solid',
											width: 3
										}
									},
								}
							]
						}
					}

				})


				glucoseChart.setOption({
					graphic: echarts.util.map(data, function (item, dataIndex) {
						return {
							type: 'circle',
							id:'pointer'+ dataIndex,
							position: glucoseChart.convertToPixel('grid', item),
							shape: {
								cx: 0,
								cy: 0,
								r: 10
							},
							invisible: true,
							draggable: true,
							ondrag: echarts.util.curry(onPointDragging, dataIndex),
							onmouseup: echarts.util.curry(hideTooltip, dataIndex),
							$action:'merge',
							z:9999
						};
					})
				});

				window.addEventListener('resize', updatePosition);

				glucoseChart.on('dataZoom', updatePosition);

				function updatePosition() {
					glucoseChart.setOption({
						graphic: echarts.util.map(data, function (item, dataIndex) {
							return {
								id:'pointer'+ dataIndex,
								position: glucoseChart.convertToPixel('grid', item)
							};
						})
					});
				}

				function hideTooltip(dataIndex) {
					glucoseChart.dispatchAction({
						type: 'hideTip'
					});
				}

				function onPointDragging(dataIndex, dx, dy) {
					var newHigh=0,newNormal=0,newLow=0;
					data[dataIndex] = glucoseChart.convertFromPixel('grid', this.position);
					// Update data
					glucoseChart.setOption({
						series: [{
							id: 'a',
							data: data
						}]
					});
					glucoseChart.dispatchAction({
						type: 'showTip',
						seriesIndex: 0,
						dataIndex: dataIndex
					});

					$.map(data,function (item) {
						if (item[1] >= that.lineMax) {
							newHigh += 1
						}else if(item[1] <= that.lineMin){
							newLow += 1
						} else {
							newNormal +=1
						}
					})

					$statisticsHigh.html(newHigh);
					$statisticsNormal.html(newNormal);
					$statisticsLow.html(newLow);
				}
			}

		}

	}

	new ShowChart();

})();