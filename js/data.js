//数据（文件夹）
var data = [
	{
		title: '全部文件',
		id: 0,
		pid: -1,
		child: [
			{
				title: '我的游戏',
				id: 1,
				pid: 0,
				child: [
					{
						title: '守望先锋',
						id: 2,
						pid: 1,
						child: [
							{
								title: 'D.VA',
								id: 3,
								pid: 2
							},
							{
								title: '安娜',
								id: 4,
								pid: 2
							}
						]
					},
					{
						title: '英雄杀',
						id: 5,
						pid: 1,
						child: [
							{
								title: '韩信',
								id: 6,
								pid: 5
							},
							{
								title: '貂蝉',
								id: 7,
								pid: 5
							}
						]
					}
				]
			},
			{
				title: '我的音乐',
				id: 8,
				pid: 0,
				child: [
					{
						title: '古风',
						id: 9,
						pid: 8
					},
					{
						title: '漫',
						id: 10,
						pid: 8
					},
					{
						title: '轻音',
						id: 11,
						pid: 8
					}
				]
			}
		]
	}
];