const BuildingGreece = {
    防: ["消", "维", "瞭", "诊所"],
    防护: ["消防局", "维修所", "瞭望台", "诊所"],
    普通住宅需求: {
        商业: ["粮食货摊", "蔬菜货摊", "水果货摊", "生肉货摊", "鱼虾货摊", "陶器店", "亚麻布店", "酒馆"],
        市政: ["喷泉", "议会厅"],
        文化: ["剧场", "露天体育场"],
        宗教: ["小神殿", "中神殿"],
    },
    高级住宅需求: {
        商业: [
            "粮食货摊",
            "蔬菜货摊",
            "水果货摊",
            "生肉货摊",
            "鱼虾货摊",
            "陶器店",
            "亚麻布店",
            "酒馆",
            "羊毛货摊",
            "奶酪货摊",
            "橄榄油货摊",
        ],
        市政: ["喷泉", "议会厅"],
        文化: ["剧场", "露天体育场", "大学", "图书馆"],
        宗教: ["中神殿", "大神殿"],
    },
    住宅: [
        {
            name: "普通住宅",
            text: "宅",
            size: 1,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["住宅"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "高级住宅",
            text: "高宅",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["住宅"][1],
            border_color: BuildingColor.Black,
        },
    ],
    农业: [
        {
            name: "麦田",
            text: "麦田",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "卷心菜小屋",
            text: "卷心菜",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "桔子小屋",
            text: "桔子",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "猎人小屋",
            text: "猎人",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][3],
            border_color: BuildingColor.Black,
        },
        {
            name: "亚麻小屋",
            text: "亚麻",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][4],
            border_color: BuildingColor.Black,
        },
        {
            name: "葡萄园",
            text: "葡萄园",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][5],
            border_color: BuildingColor.Black,
        },
        {
            name: "绵羊牧场",
            text: "绵羊牧场",
            size: 3,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][6],
            border_color: BuildingColor.Black,
        },
        {
            name: "山羊牧场",
            text: "山羊牧场",
            size: 3,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][7],
            border_color: BuildingColor.Black,
        },
        {
            name: "橄榄园",
            text: "橄榄园",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["农业"][8],
            border_color: BuildingColor.Black,
        },
    ],
    工业: [
        {
            name: "陶瓦场",
            text: "陶瓦场",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "炼铜场",
            text: "炼铜场",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "塑像场",
            text: "塑像场",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "陶器场",
            text: "陶器场",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][3],
            border_color: BuildingColor.Black,
        },
        {
            name: "纺织厂",
            text: "纺织厂",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][4],
            border_color: BuildingColor.Black,
        },
        {
            name: "酒坊",
            text: "酒坊",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][5],
            border_color: BuildingColor.Black,
        },
        {
            name: "奶酪场",
            text: "奶酪场",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][6],
            border_color: BuildingColor.Black,
        },
        {
            name: "油坊",
            text: "油坊",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["工业"][7],
            border_color: BuildingColor.Black,
        },
    ],
    商业: [
        {
            name: "粮食货摊",
            text: "粮",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "蔬菜货摊",
            text: "菜",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "水果货摊",
            text: "果",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "生肉货摊",
            text: "肉",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][3],
            border_color: BuildingColor.Black,
        },
        {
            name: "鱼虾货摊",
            text: "鱼",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][4],
            border_color: BuildingColor.Black,
        },
        {
            name: "陶器店",
            text: "陶",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][5],
            border_color: BuildingColor.Black,
        },
        {
            name: "亚麻布店",
            text: "布",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][6],
            border_color: BuildingColor.Black,
        },
        {
            name: "酒馆",
            text: "酒",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][7],
            border_color: BuildingColor.Black,
        },
        {
            name: "羊毛货摊",
            text: "羊",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][8],
            border_color: BuildingColor.Black,
        },
        {
            name: "奶酪货摊",
            text: "奶",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][9],
            border_color: BuildingColor.Black,
        },
        {
            name: "橄榄油货摊",
            text: "橄",
            size: 1,
            range_size: 5,
            color: BuildingColor.Black,
            background_color: BuildingColor["商业"][10],
            border_color: BuildingColor.Black,
        },
    ],
    市政: [
        {
            name: "喷泉",
            text: "水",
            size: 1,
            range_size: 4,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["水"],
            border_color: BuildingColor.Black,
        },
        {
            name: "消防局",
            text: "消",
            size: 1,
            range_size: 6,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["防"],
            border_color: BuildingColor.Black,
        },
        {
            name: "维修所",
            text: "维",
            size: 1,
            range_size: 6,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["防"],
            border_color: BuildingColor.Black,
        },
        {
            name: "瞭望台",
            text: "瞭",
            size: 1,
            range_size: 7,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["防"],
            border_color: BuildingColor.Black,
        },
        {
            name: "诊所",
            text: "诊所",
            size: 2,
            range_size: 7,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["防"],
            border_color: BuildingColor.Black,
        },
        {
            name: "粮仓",
            text: "粮仓",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["粮"],
            border_color: BuildingColor.Black,
        },
        {
            name: "货栈",
            text: "货栈",
            size: 3,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["货"],
            border_color: BuildingColor.Black,
        },
        {
            name: "宫殿",
            text: "宫殿",
            size: 4,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["殿"],
            border_color: BuildingColor.Black,
        },
        {
            name: "议会厅",
            text: "议会厅",
            size: 2,
            range_size: 6,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["职"],
            border_color: BuildingColor.Black,
        },
        {
            name: "贸易站",
            text: "贸易站",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["贸"],
            border_color: BuildingColor.Black,
        },
        {
            name: "税务局",
            text: "税",
            size: 1,
            range_size: 4,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["税"],
            border_color: BuildingColor.Black,
        },
        {
            name: "风力磨坊",
            text: "磨",
            size: 1,
            range_size: 4,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["磨"],
            border_color: BuildingColor.Black,
        },
        {
            name: "水车",
            text: "水车",
            size: 2,
            range_size: 4,
            color: BuildingColor.Black,
            background_color: BuildingColor["市政"]["浇"],
            border_color: BuildingColor.Black,
        },
    ],
    文化: [
        {
            name: "剧场",
            text: "剧场",
            size: 2,
            range_size: 6,
            color: BuildingColor.Black,
            background_color: BuildingColor["文化"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "露天体育场",
            text: "露天体育场",
            size: 6,
            range_size: 10,
            color: BuildingColor.Black,
            background_color: BuildingColor["文化"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "大学",
            text: "大学",
            size: 5,
            range_size: 8,
            color: BuildingColor.Black,
            background_color: BuildingColor["文化"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "图书馆",
            text: "图书馆",
            size: 5,
            range_size: 8,
            color: BuildingColor.Black,
            background_color: BuildingColor["文化"][3],
            border_color: BuildingColor.Black,
        },
    ],
    宗教: [
        {
            name: "小神殿",
            text: "小神殿",
            size: 2,
            range_size: 5,
            color: BuildingColor.White,
            background_color: BuildingColor["宗教"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "中神殿",
            text: "中神殿",
            size: 3,
            range_size: 7,
            color: BuildingColor.White,
            background_color: BuildingColor["宗教"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "大神殿",
            text: "大神殿",
            size: 8,
            range_size: 9,
            color: BuildingColor.White,
            background_color: BuildingColor["宗教"][2],
            border_color: BuildingColor.Black,
        },
    ],
    军事: [
        {
            name: "步兵兵营",
            text: "步兵",
            size: 2,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["军事"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "射手兵营",
            text: "射手",
            size: 2,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["军事"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "骑兵兵营",
            text: "骑兵",
            size: 2,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["军事"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "祭坛",
            text: "祭坛",
            size: 2,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["军事"][3],
            border_color: BuildingColor.Black,
        },
        {
            name: "武器铺",
            text: "武器铺",
            size: 2,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["军事"][4],
            border_color: BuildingColor.Black,
        },
        {
            name: "马厩",
            text: "马厩",
            size: 2,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["军事"][5],
            border_color: BuildingColor.Black,
        },
    ],
    美化: [
        {
            name: "树",
            text: "树",
            size: 1,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["美化"]["树"],
            border_color: BuildingColor.Black,
        },
    ],
    奇迹: [
        {
            name: "特洛伊木马",
            text: "特洛伊木马",
            size: 3,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["奇迹"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "宙斯神像",
            text: "宙斯神像",
            size: 4,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["奇迹"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "罗德岛巨像",
            text: "罗德岛巨像",
            size: 4,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["奇迹"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "摩索拉斯基陵墓",
            text: "摩索拉斯基陵墓",
            size: 5,
            range_size: 0,
            color: BuildingColor.White,
            background_color: BuildingColor["奇迹"][3],
            border_color: BuildingColor.Black,
        },
    ],
    通用: [
        {
            name: "2x2建筑",
            text: "2x2",
            size: 2,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["通用"][0],
            border_color: BuildingColor.Black,
        },
        {
            name: "3x3建筑",
            text: "3x3",
            size: 3,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["通用"][1],
            border_color: BuildingColor.Black,
        },
        {
            name: "4x4建筑",
            text: "4x4",
            size: 4,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["通用"][2],
            border_color: BuildingColor.Black,
        },
        {
            name: "5x5建筑",
            text: "5x5",
            size: 5,
            range_size: 0,
            color: BuildingColor.Black,
            background_color: BuildingColor["通用"][3],
            border_color: BuildingColor.Black,
        },
    ],
};
