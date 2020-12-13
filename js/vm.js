var $vm = new Vue({
    el: "#app",
    data() {
        return {
            labelText: LabelText,
            buildingCatagory: LabelText.building_catagory,
            operationCatagory: LabelText.operation_catagory,
            backgroundColor: "",
            textColor: "",
            activeTextColor: "",
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
            editorPanelTab: "first",
            previewBox: {
                row: 1,
                cell: 1,
            },
            specialBuildingList: [],
            previewMarkerColor: "red",
            specialBuilding: {
                name: "高级住宅",
                width: 3,
                height: 3,
                color: "#000000",
                text: "高级<br />住宅",
                borderColor: "#000000",
                borderWidth: 1,
                background: "#ffa500",
                range: 0,
                isDecoration: false,
                isMiracle: false,
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
                return !(v in that.labelText) && v !== "特殊建筑";
            });
        },
    },
    methods: {
        onChangeCivil(civil) {
            civil = civil || $config.civil;
            let that = this;
            Object.keys(this.buildingInfo).map(function (v) {
                that.buildingInfo[v] = $config.civilBuilding[civil][v];
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
            let newHolding = {};
            switch (index) {
                case "道路":
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
                    $config.operation = "placing-building";
                    $config.holding = newHolding;
                    $config.newHold = true;
                    $topNav.setOperation("道路");
                    break;
                case "取消操作":
                    $config.operation = "null";
                    $config.holding = {};
                    $topNav.setOperation("无");
                    break;
                case "选中建筑":
                    $config.operation = "selecting-building";
                    $config.holding = {};
                    $topNav.setOperation("选中建筑");
                    break;
                case "删除建筑":
                    $config.operation = "deleting-building";
                    $config.holding = {};
                    $topNav.setOperation("删除建筑");
                    break;
                default:
                    if (indexPath.length < 2) return;
                    if (indexPath[0] !== "特殊建筑") return;
                    let v = this.specialBuildingList.find((v) => v.name === index);
                    if (!v) return;
                    newHolding.text = v.text;
                    newHolding.width = v.width;
                    newHolding.height = v.height;
                    newHolding.range = v.range;
                    newHolding.color = v.color;
                    newHolding.background = v.background;
                    newHolding.borderColor = v.borderColor;
                    newHolding.borderWidth = v.borderWidth;
                    newHolding.isProtection = false;
                    newHolding.isRoad = false;
                    newHolding.isDecoration = v.isDecoration;
                    newHolding.isMiracle = v.isMiracle;
                    newHolding.isPreview = true;
                    $config.operation = "placing-building";
                    $config.holding = newHolding;
                    $config.newHold = true;
                    $topNav.setOperation(indexPath.join("-"));
                    break;
            }
        },
        onSelectBuilding(index, indexPath) {
            let newHolding = {};
            let selectedBuilding = this.getBuildingInfo($config.civil, indexPath[0], index);
            newHolding.text = selectedBuilding.text;
            newHolding.width = selectedBuilding.size;
            newHolding.height = selectedBuilding.size;
            newHolding.range = selectedBuilding.range_size;
            newHolding.color = selectedBuilding.color;
            newHolding.background = selectedBuilding.background_color;
            newHolding.borderColor = selectedBuilding.border_color;
            newHolding.borderWidth = 1;
            newHolding.isPreview = true;
            newHolding.isProtection = $config.civilBuilding[$config.civil]["防"].indexOf(selectedBuilding.text) > -1;
            newHolding.isDecoration = indexPath[0] === "美化";
            newHolding.isGeneral = indexPath[0] === "通用";
            newHolding.isMiracle = indexPath[0] === "奇迹";
            $config.operation = "placing-building";
            $config.holding = newHolding;
            $config.newHold = true;
            $topNav.setOperation(indexPath.join("-"));
        },
        getBuildingInfo(civil, catagory, name) {
            return $config.civilBuilding[civil][catagory].filter(function (v) {
                return v.name === name;
            })[0];
        },
        onClickPreviewSingle() {
            this.previewBox.row = 1;
            this.previewBox.cell = 1;
        },
        onClickPreviewRow() {
            this.previewBox.row = 1;
            this.previewBox.cell = 3;
        },
        onClickPreviewColumn() {
            this.previewBox.row = 3;
            this.previewBox.cell = 1;
        },
        onClickPreviewOverspread() {
            this.previewBox.row = 3;
            this.previewBox.cell = 3;
        },
        onClickInsertSpecialBuilding() {
            let v = this.specialBuildingList.find((v) => v.name === this.specialBuilding.name);
            if (v) {
                this.$message({
                    message: "该建筑名称和已添加的特殊建筑重复，请更换建筑名称！",
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            if (this.specialBuildingList.length >= 10) {
                this.specialBuildingList.shift();
                this.$message({
                    message:
                        "该建筑已经添加至「侧边导航」的特殊建筑中。但特殊建筑最多只能添加10个，已将最早添加的特殊建筑移除。",
                    type: "warning",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
            } else {
                this.$message({
                    message: "该建筑已经添加至「侧边导航」的特殊建筑中。",
                    type: "success",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
            }
            this.specialBuildingList.push(Object.assign({}, this.specialBuilding));
        },
    },
    created() {},
    mounted() {
        this.onChangeCivil("中国");
    },
});
