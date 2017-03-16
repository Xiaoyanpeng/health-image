;(function () {
	var
		$mainWrap = $('#mainWrap'),
		countHealth = function () {
			var healthArea = echarts.init(document.getElementById('healthArea'));
			var data = {key: 2};
			DataService.getPortraitsLevel1(data).then(function (res) {
				setData(res);
			})
			function setData(res) {
				var data = res.data.data;

				$('#countHealthTxt').html(res.data.message)

				option = {
					graphic: [
						{
							type: 'circle',
							z: 10000,
							left: 'center',
							top: 'center',
							shape: {
								cx: 0,
								cy: 0,
								r: 283,
							},
							style: {
								fill: 'none',
								stroke: '#fff',
								lineWidth: 6
							}
						},
						{
							type: 'circle',
							z: 100,
							left: 'center',
							top: 'center',
							shape: {
								cx: 0,
								cy: 0,
								r: 275,
							},
							style: {
								fill: 'none',
								stroke: 'rgba(0,0,0,.2)',
								lineWidth: 12
							}
						},
						{
							type: 'circle',
							z: 100,
							left: 'center',
							top: 'center',
							shape: {
								cx: 0,
								cy: 0,
								r: 90,
							},
							style: {
								fill: '#fff',
								stroke: 'rgba(255,255,255,.3)',
								lineWidth: 60
							}
						},
						{
							type: 'text',
							z: 100,
							top: 'middle',
							left: 'center',
							style: {
								text: [
									'100%'
								],
								font: '40px "STHeiti", sans-serif'
							}
						},
					],
					tooltip: {
						trigger: 'item',
						padding: 20,
						formatter: "{b} : <br/><br/>{d}%  ( {c} 人 ) "
					},
					legend: {
						orient: 'vertical',
						bottom: 150,
						right: 70,
						itemWidth: 20,
						itemHeight: 20,
						itemGap: 20,
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						data: ['患病人群', '健康人群', '恢复期人群'],
						formatter: function (name) {
							return '  ' + name;
						}
					},
					series: [
						{
							type: 'pie',
							radius: '75%',
							center: ['50%', '50%'],
							hoverAnimation: false,
							data: [
								{
									value: data['恢复期人群'].count,
									name: '恢复期人群',
									itemStyle: {
										normal: {
											color: '#F8B51E'
										}
									},
									label: {
										normal: {
											textStyle: {
												fontSize: 33
											},
											formatter: function (obj) {
												return '  ' + obj.percent + '% (恢复期人群：' + obj.value + '人）';
											}
										},
									},
									labelLine: {
										normal: {}
									},

								},
								{
									value: data['患病人群'].count,
									name: '患病人群',
									itemStyle: {
										normal: {
											color: '#EC5097'
										}
									},
									label: {
										normal: {
											textStyle: {
												fontSize: 33
											},
											formatter: function (obj) {
												return '  ' + obj.percent + '% (患病人群：' + obj.value + '人）';
											}
										}
									},
									labelLine: {
										normal: {}
									},
								},
								{
									value: data['健康人群'].count,
									name: '健康人群',
									itemStyle: {
										normal: {
											color: '#0194E2'
										}
									},
									label: {
										normal: {
											textStyle: {
												fontSize: 33
											},
											formatter: function (obj) {
												return '  ' + obj.percent + '% (健康人群：' + obj.value + '人）';
											}
										}
									},
									labelLine: {
										normal: {}
									}
								}
							],
						}
					]
				};
				healthArea.setOption(option);
			}
		},
		countRecent = function () {
			var illness = echarts.init(document.getElementById('illness'));
			var data = {key: 1};
			DataService.getPortraitsLevel1(data).then(function (res) {
				setData(res);
			})
			function setData(res) {
				var name = [];
				var value = [];
				var sum = 0;
				var sumArr = [];

				$('#countRecentTxt').html(res.data.message)

				for (prop in res.data.data) {
					name.push(prop)
					value.push(res.data.data[prop].count)
				}
				value.forEach(function (item) {
					sum += item;
				})
				value.forEach(function () {
					sumArr.push(sum)
				})

				option = {
					grid: {
						left: 150
					},
					tooltip: {
						trigger: 'axis',
						padding:20,
						axisPointer: {type: 'none'},
						formatter: function (obj) {
							return obj[1].name + ' :  ' + ((value[obj[1].dataIndex] / sum) * 100).toFixed(1) + '%\n\n (' + value[obj[1].dataIndex] + '人 )'
						}
					},
					xAxis: [
						{
							type: 'value',
							axisTick: {show: false},
							axisLine: {show: false},
							axisLabel: {show: false},
							splitLine: {show: false}
						}
					],
					yAxis: [
						{
							type: 'category',
							data: name,
							axisTick: {show: false},
							axisLine: {show: false},
							axisLabel: {
								margin: 40,
								textStyle: {
									color: '#09e2f9',
									fontSize: 24
								}
							}
						}
					],
					series: [
						{ // For shadow
							type: 'bar',
							itemStyle: {
								normal: {
									barBorderRadius: 20,
									color: '#043B62'
								}
							},
							barWidth: 25,
							barGap: '-100%',
							barCategoryGap: '40%',
							data: sumArr,
							animation: false,
							label: {
								normal: {
									show: true,
									position: 'right',
									offset: [20, 0],
									textStyle: {
										color: '#09e2f9',
										fontSize: 24,
									},
									formatter: function (obj) {
										return '  ' + ((value[obj.dataIndex] / sum) * 100).toFixed(1) + '%\n\n (' + value[obj.dataIndex] + '人 )'
									}
								}
							}
						},
						{
							type: 'bar',
							stack: '总量',
							barWidth: 25,
							data: value,

							itemStyle: {
								normal: {
									barBorderRadius: 20,
									color: new echarts.graphic.LinearGradient(
										1.8, 0, 0, 1,
										[
											{offset: 0, color: '#43eec6'},
											{offset: 1, color: '#0AE2F7'}
										]
									)
								}
							},

						},
					]
				};
				illness.setOption(option);
			}
		},
		coutnMap = function (value,id) {
			var parentObj = $('#'+id);
			var countMap = echarts.init(parentObj.find('.xm-map')[0]);
			var data = {value: value};

			DataService.getPortraitsTown(data).then(function (res) {
				setData(res);
			})
			function setData(res) {
				var data = res.data.data;
				parentObj.find('#coutnAreaTxt').html(res.data.message)
				console.log();
				var dataArr = []
				for (prop in data) {
					dataArr.push(data[prop])
				}

				// countMap.showLoading();
				$.getJSON('js/xm.json', function (geoJson) {
					var geoJsonArr = geoJson.features;
					var reslut = [];
					for (var i = 0; i < geoJsonArr.length; i++) {
						var obj = {
							name: geoJsonArr[i].properties.name,
							value: geoJsonArr[i].properties.cp,
						}
						reslut.push(obj);
					}

					// 海沧

					reslut[0].label = {
						normal: {
							position: 'left',
							offset: [0, 30]
						}
					}

					// 湖里
					reslut[1].label = {
						normal: {
							position: 'right',
							offset: [10, 0]
						}
					}

					// 集美
					reslut[3].label = {
						normal: {
							position: 'left',
							offset: [-10, 0]
						}
					}

					// countMap.hideLoading();

					echarts.registerMap('xm', geoJson);

					countMap.setOption(option = {
						tooltip: {
							trigger: 'item',
							padding: 20,
							formatter: '{b}'
						},
						// visualMap: {
						// 	min: 0,
						// 	max: 1,
						// 	text:['高','低'],
						// 	realtime: false,
						// 	calculable: true,
						// 	left:0,
						// 	inRange: {
						// 		color: ['#5288FF','#273D7A', '#172144']
						// 	},
						// 	textStyle:{
						// 		color:'#fff'
						// 	}
						//
						// },
						geo: {
							name: '糖尿病所在区域',
							map: 'xm',
							aspectScale: 0.88,
							zoom: 1.2,
							label: {
								normal: {
									show: false,
									textStyle: {
										color: '#fff',
										fontSize: 24
									}
								},
								emphasis: {
									show: false,
									textStyle: {
										color: '#fff',
										fontSize: 24
									}
								}
							},
							itemStyle: {
								normal: {
									label: {
										show: true,
									},
									areaColor: '#4298CB',
									borderColor: '#79CAE4',
								},
								emphasis: {
									label: {show: true},
									areaColor: '#479edd',
								}
							},
							left: 'center',
							top: 'center',
							layoutCenter: ['30%', '30%'],
							data: [
								{name: '同安区', value: data['同安区']},
								{name: '翔安区', value: data['翔安区']},
								{name: '集美区', value: data['集美区']},
								{name: '湖里区', value: data['湖里区']},
								{name: '思明区', value: data['思明区']},
								{name: '海沧区', value: data['海沧区']}
							]
						},
						series: [
							{
								type: 'effectScatter',
								coordinateSystem: 'geo',
								data: reslut,
								showEffectOn: 'render',
								rippleEffect: {
									brushType: 'stroke'
								},
								symbolSize: 20,
								hoverAnimation: true,
								label: {
									normal: {
										offset: [0, 10],
										formatter: function (obj) {
											return obj.name + '( ' + (dataArr[obj.dataIndex] * 100).toFixed(0) + '% )'
										},
										position: 'bottom',
										show: true,
										textStyle: {
											color: '#fff',
											fontStyle: 'normal',
											fontFamily: 'sans-serif',
											fontSize: 18
										},
									}
								},
								itemStyle: {
									normal: {
										color: '#fffb21',
										shadowBlur: 10,
										shadowColor: '#333'
									}
								},
								zlevel: 100
							}
						]
					});
				});
			}
		},
		countAge = function (value,id) {
			var data = {value: value};
			DataService.getPortraitsAge(data).then(function (res) {
				setData(res);
			})
			function setData(res) {
				var data = res.data.data;
				var parentObj = $('#'+id);

				// 动画效果
				parentObj.find('.age-left').show().addClass('fadeIn animated')
				parentObj.find('.age-right-img-item').show().addClass('fadeIn animated')

				parentObj.find('#countAgeTxt').html(res.data.message)
				var arr = [data["20岁以下"], data["20-40岁"], data["40-65岁"], data["65岁以上"]];
				for (var i = 0; i < arr.length; i++) {
					arr[i] = (arr[i] * 100).toFixed(0) + '%'
				}
				for (var i = 0; i < arr.length; i++) {
					parentObj.find('#ageBox .line2').eq(i).html(arr[i])
				}
			}
		},
		countSex = function (value,id) {
			var parentObj = $('#'+id);
			var sexRatio = echarts.init(parentObj.find('#sexRatio')[0]);
			var data = {value: value};
			DataService.getPortraitsSex(data).then(function (res) {
				setData(res);
			})
			function setData(res) {
				var data = res.data.data;
				var man = (data['男'] * 100).toFixed(0);
				var woman = (data['女'] * 100).toFixed(0);

				parentObj.find('#countSexTxt').html(res.data.message)

				option = {
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/> <br/>{b}: {c} ({d}%)",
						padding: 20
					},
					legend: {
						orient: 'vertical',
						bottom: 100,
						right: 70,
						itemWidth: 20,
						itemHeight: 20,
						itemGap: 20,
						textStyle: {
							color: '#fff',
							fontSize: 20
						},
						data: ['男', '女'],
						formatter: function (name) {
							return '  ' + name;
						}
					},
					series: [
						{
							name: '性别比例',
							type: 'pie',
							radius: ['50%', '70%'],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: true,
									textStyle: {
										fontSize: 24
									},
									formatter: function (obj) {
										return obj.percent + '%\n' + obj.name + ' ( ' + obj.value + '人 )';
									}
								}
							},
							labelLine: {
								normal: {
									length: 10,
									length2: 150
								}
							},
							data: [
								{
									value: man,
									name: '男',
									itemStyle: {
										normal: {
											color: '#DC508F'
										}
									},
								},
								{
									value: woman,
									name: '女',
									itemStyle: {
										normal: {
											color: '#EFAF29'
										}
									}
								},
							]
						}
					]
				};
				sexRatio.setOption(option);
			}
		};

		var
			idArr = ['countRecent','coutnMap','countAge','countSex'
			,'coutnMap2','countAge2','countSex2'],
			param = ['','糖尿病','糖尿病','糖尿病','高血压','高血压','高血压'],
			callFn = {
				countRecent : countRecent,
				coutnMap : coutnMap,
				countAge : countAge,
				countSex : countSex,
				coutnMap2 : coutnMap,
				countAge2 : countAge,
				countSex2 : countSex
			};


		// 首屏自动展示
		countHealth();

		// 滚动读取数据
		var ShowCont = function (id,param) {
			this.obj = $('#' + id);
			this.offsetTop = $('#' + id)[0].offsetTop;
			this.lock = true;
			this.fn = callFn[id];
			this.id = id;
			this.param = param;
		}
		var objList = [];
		$.each(idArr,function (index,item) {
			objList.push(new ShowCont(item,param[index]));
		})


		$mainWrap.scroll(function () {
			var scrollTop  = $mainWrap[0].scrollTop;
			$.each(objList,function (index,item) {
				if (scrollTop >= item.offsetTop-400 && item.lock) {
					item.lock = false;
					item.fn(item.param,item.id)
				}
			})
		})

})();