class SideNav {
    constructor(width) {
        this.width = width;
        this.id = "side-nav";
        $$(this.id).style.height = `${this.height}px`;
    }

    setWidth(width) {
        this.width = width;
        $$(this.id).style.width = `${this.width}px`;
    }

    getWidth() {
        return this.width;
    }

    setMaginTop(top) {
        $$(this.id).style.setProperty("--margin-top", `${top}px`);
    }
}

var vm = new Vue({
    el: "#app",
    data() {
        return {
            labelText: LabelText,
            buildingCatagory: LabelText.building_catagory,
            operationCatagory: LabelText.operation_catagory,
            backgroundColor: "",
            textColor: "",
            activeTextColor: "",
            // civilBuildingMap: {
            //     China: BuildingChina,
            //     Persian: BuildingPersian,
            //     Egypt: BuildingEgypt,
            //     Greece: BuildingGreece,
            //     Aztaka: BuildingAztaka,
            // },
            buildingInfo: {
                住宅: [],
                农业: [],
                工业: [],
                商业: [],
                市政: [],
                文化: [],
                宗教: [],
                军事: [],
                美化: [],
                奇迹: [],
                通用: [],
            },
        };
    },
    computed: {
        operationCatagory1() {
            let that = this;
            return this.operationCatagory.filter(function (v) {
                return v in that.labelText;
            });
        },
        operationCatagory2() {
            let that = this;
            return this.operationCatagory.filter(function (v) {
                return !(v in that.labelText);
            });
        },
    },
    methods: {
        onClickDarkMode(isDarkMode) {
            if (isDarkMode) {
                this.backgroundColor = DarkMode["color-background-base"];
                this.textColor = DarkMode["color-primary-text"];
                this.activeTextColor = DarkMode["color-primary"];
            } else {
                this.backgroundColor = LightMode["color-background-base"];
                this.textColor = LightMode["color-primary-text"];
                this.activeTextColor = LightMode["color-primary"];
            }
        },
        onChangeCivil(civil) {
            let that = this;
            Object.keys(this.buildingInfo).map(function (v) {
                that.buildingInfo[v] = that.civilBuildingMap[civil][v];
            });
        },
        onSelect(index, indexPath) {
            if (indexPath[0] in this.buildingInfo) {
                this.onSelectBuilding(index, indexPath);
            } else {
                this.onSelectOperation(index, indexPath);
            }
        },
        onSelectOperation(index, indexPath) {
            switch (index) {
                case "道路":
                    let newHolding = {};
                    newHolding.text = "";
                    newHolding.width = 1;
                    newHolding.height = 1;
                    newHolding.range = 0;
                    newHolding.color = "var(--color-black)";
                    newHolding.background = BuildingFixed.color_road;
                    newHolding.borderColor = "var(--color-border-base)";
                    newHolding.borderWidth = 1;
                    newHolding.isProtection = false;
                    newHolding.isRoad = true;
                    newHolding.isPreview = true;
                    Vue.prototype.operation = "placing-building";
                    Vue.prototype.holding = newHolding;
                    Vue.prototype.holdingSession = new Date().getTime();
                    this.$emit("update:select-building", ["道路"]);
                    break;
                case "取消操作":
                    Vue.prototype.operation = "null";
                    Vue.prototype.holding = {};
                    this.$emit("update:select-building", ["无"]);
                    break;
                case "删除建筑":
                    Vue.prototype.operation = "deleting-building";
                    Vue.prototype.holding = {};
                    this.$emit("update:select-building", ["删除建筑"]);
                    break;
                default:
                    console.log(index, indexPath);
                    break;
            }
        },
        onSelectBuilding(index, indexPath) {
            let newHolding = {};
            let selectedBuilding = this.getBuildingInfo(this.civil, indexPath[0], index);
            newHolding.text = selectedBuilding.text;
            newHolding.width = selectedBuilding.size;
            newHolding.height = selectedBuilding.size;
            newHolding.range = selectedBuilding.range_size;
            newHolding.color = selectedBuilding.color;
            newHolding.background = selectedBuilding.background_color;
            newHolding.borderColor = selectedBuilding.border_color;
            newHolding.borderWidth = 1;
            newHolding.isPreview = true;
            newHolding.isProtection = LabelText.protection_building[this.civil].indexOf(selectedBuilding.text) > -1;
            Vue.prototype.operation = "placing-building";
            Vue.prototype.holding = newHolding;
            Vue.prototype.holdingSession = new Date().getTime();
            this.$emit("update:select-building", indexPath);
        },
        getBuildingInfo(civil, catagory, name) {
            return this.civilBuildingMap[civil][catagory].filter(function (v) {
                return v.name === name;
            })[0];
        },
    },
});
