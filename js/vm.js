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
                fontSize: 16,
                text: "高级<br />住宅",
                borderColor: "#000000",
                borderWidth: 1,
                background: "#ffa500",
                range: 0,
                isDecoration: false,
                isMiracle: false,
            },
            userSign: [
                {
                    name: "创作者",
                    top: 0,
                    left: 0,
                    textAlign: "left",
                    rotateDegree: 0,
                    lines: [
                        {
                            fontSize: 30,
                            opacity: 1,
                            elements: [
                                {
                                    isHighlight: false,
                                    color: null,
                                    shadowSize: 5,
                                    shadowColor: null,
                                    text: "",
                                },
                            ],
                        },
                    ],
                },
            ],
            radioLabelUserSign: "创作者",
            radioLabelUserSignLine: "第1行",
            radioLabelUserSignElement: "第1个",
            radioIndexUserSign: 0,
            radioIndexUserSignLine: 0,
            radioIndexUserSignElement: 0,
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
                    $$("range-container").innerHTML = "";
                    break;
                case "删除建筑":
                    $config.operation = "deleting-building";
                    $config.holding = {};
                    $topNav.setOperation("删除建筑");
                    $$("range-container").innerHTML = "";
                    break;
                case "导入数据":
                    importData();
                    break;
                case "导出数据":
                    exportData();
                    break;
                case "截图":
                    // screenshot(2);
                    screenshot();
                    break;
                default:
                    if (indexPath.length < 2) return;
                    if (indexPath[0] !== "特殊建筑") return;
                    let v = this.specialBuildingList.find((v) => v.name === index);
                    if (!v) return;
                    newHolding.name = v.name;
                    newHolding.catagory = "特殊建筑";
                    newHolding.text = v.text;
                    newHolding.width = v.width;
                    newHolding.height = v.height;
                    newHolding.range = v.range;
                    newHolding.color = v.color;
                    newHolding.fontSize = v.fontSize;
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
            newHolding.name = selectedBuilding.name;
            newHolding.catagory = indexPath[0];
            newHolding.text = selectedBuilding.text;
            newHolding.width = selectedBuilding.size;
            newHolding.height = selectedBuilding.size;
            newHolding.range = selectedBuilding.range_size;
            newHolding.color = selectedBuilding.color;
            newHolding.background = selectedBuilding.background_color;
            newHolding.borderColor = selectedBuilding.border_color;
            newHolding.borderWidth = 1;
            newHolding.isPreview = true;
            newHolding.isProtection =
                $config.civilBuilding[$config.civil]["防"].indexOf(selectedBuilding.text) > -1 &&
                $config.civilBuilding[$config.civil]["防护"].indexOf(selectedBuilding.name) > -1 &&
                indexPath[0] === "市政";
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
            if (this.specialBuilding.isDecoration && this.specialBuilding.isMiracle) {
                this.$message({
                    message: `该建筑 ${this.specialBuilding.name} 不允许同时是美化和奇迹建筑！`,
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            let v = this.specialBuildingList.find((v) => v.name === this.specialBuilding.name);
            if (v) {
                this.$message({
                    message: `该建筑名称 ${this.specialBuilding.name} 和已添加的特殊建筑重复，请更换建筑名称！`,
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            if (this.specialBuildingList.length >= 10) {
                this.specialBuildingList.shift();
                this.$message({
                    message: `该建筑 ${this.specialBuilding.name} 已经添加至侧边导航的「特殊建筑」中。但特殊建筑最多只能添加10个，已将最早添加的特殊建筑移除。`,
                    type: "warning",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
            } else {
                this.$message({
                    message: `该建筑 ${this.specialBuilding.name} 已经添加至侧边导航的「特殊建筑」中。`,
                    type: "success",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
            }
            this.specialBuildingList.push(Object.assign({}, this.specialBuilding));
        },
        deleteSpecialBuilding(index) {
            this.$message({
                message: `该建筑 ${this.specialBuildingList[index].name} 已经从「特殊建筑」中删除。`,
                type: "success",
                duration: 5000,
                offset: $config.topNavHeight + 10,
            });
            this.specialBuildingList.splice(index, 1);
        },
        onChangeSignTop() {
            let reminder = this.userSign[this.radioIndexUserSign].top % 30;
            if (reminder) {
                this.userSign[this.radioIndexUserSign].top -= reminder;
            }
            if (reminder >= 15) {
                this.userSign[this.radioIndexUserSign].top += 30;
            }
        },
        onChangeSignLeft() {
            let reminder = this.userSign[this.radioIndexUserSign].left % 30;
            if (reminder) {
                this.userSign[this.radioIndexUserSign].left -= reminder;
            }
            if (reminder >= 15) {
                this.userSign[this.radioIndexUserSign].left += 30;
            }
        },
        onChangeSignFontSize() {
            let reminder = this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].fontSize % 10;
            if (reminder) {
                this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].fontSize -= reminder;
            }
            if (reminder >= 5) {
                this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].fontSize += 10;
            }
        },
        onChangeRadioUserSign() {
            this.radioIndexUserSign = this.userSign.findIndex((v) => v.name === this.radioLabelUserSign);
            this.radioLabelUserSignLine = "第1行";
            this.radioLabelUserSignElement = "第1个";
            this.radioIndexUserSignLine = 0;
            this.radioIndexUserSignElement = 0;
        },
        onChangeRadioUserSignLine() {
            this.radioIndexUserSignLine =
                +this.radioLabelUserSignLine.substring(1, this.radioLabelUserSignLine.length - 1) - 1;
            this.radioLabelUserSignElement = "第1个";
            this.radioIndexUserSignElement = 0;
        },
        insertUserSign() {
            this.$prompt("请输入水印名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValidator: (value) => this.userSign.findIndex((v) => v.name === value) === -1,
                inputErrorMessage: "水印名称重复",
            })
                .then(({ value }) => {
                    if (this.userSign.length >= 10) {
                        this.$message({
                            type: "error",
                            message: "最多添加10个水印！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
                    this.userSign.push({
                        name: value,
                        top: 0,
                        left: 0,
                        textAlign: "left",
                        rotateDegree: 0,
                        lines: [
                            {
                                fontSize: 30,
                                opacity: 1,
                                elements: [
                                    {
                                        isHighlight: false,
                                        color: null,
                                        shadowSize: 5,
                                        shadowColor: null,
                                        text: "",
                                    },
                                ],
                            },
                        ],
                    });
                    this.$message({
                        type: "success",
                        message: `已创建新水印: ${value}`,
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
        insertUserSignLine() {
            if (this.userSign[this.radioIndexUserSign].lines.length >= 10) {
                this.$message({
                    type: "error",
                    message: "每个水印最多添加10行！",
                    duration: 3000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            this.userSign[this.radioIndexUserSign].lines.push({
                fontSize: 30,
                opacity: 1,
                elements: [
                    {
                        isHighlight: false,
                        color: null,
                        shadowSize: 5,
                        shadowColor: null,
                        text: "",
                    },
                ],
            });
        },
        insertUserSignElement() {
            if (this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].elements.length >= 10) {
                this.$message({
                    type: "error",
                    message: "每行最多添加10个元素！",
                    duration: 3000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].elements.push({
                isHighlight: false,
                color: null,
                shadowSize: 5,
                shadowColor: null,
                text: "",
            });
        },
        updateUserSign() {
            this.$prompt("请输入水印名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValidator: (value) => this.userSign.findIndex((v) => v.name === value) === -1,
                inputErrorMessage: "水印名称重复",
            })
                .then(({ value }) => {
                    let newSign = Object.assign({}, this.userSign[this.radioIndexUserSign]);
                    newSign.name = value;
                    this.userSign.splice(this.radioIndexUserSign, 1, newSign);
                    this.radioLabelUserSign = value;
                    this.$message({
                        type: "success",
                        message: `已修改该水印名称为: ${value}`,
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
        deleteUserSign() {
            this.$confirm("是否确认删除该水印？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    if (this.userSign.length === 1) {
                        this.$message({
                            type: "error",
                            message: "只剩下最后一个水印，无法删除！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
                    this.userSign.splice(this.radioIndexUserSign, 1);
                    this.radioLabelUserSign = this.userSign[0].name;
                    this.radioLabelUserSignLine = "第1行";
                    this.radioLabelUserSignElement = "第1个";
                    this.radioIndexUserSign = 0;
                    this.radioIndexUserSignLine = 0;
                    this.radioIndexUserSignElement = 0;
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
        deleteUserSignLine() {
            this.$confirm("是否确认删除该行？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    if (this.userSign[this.radioIndexUserSign].lines.length === 1) {
                        this.$message({
                            type: "error",
                            message: "只剩下最后一行，无法删除！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
                    this.userSign[this.radioIndexUserSign].lines.splice(this.radioIndexUserSignLine, 1);
                    this.radioLabelUserSignLine = "第1行";
                    this.radioLabelUserSignElement = "第1个";
                    this.radioIndexUserSignLine = 0;
                    this.radioIndexUserSignElement = 0;
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
        deleteUserSignElement() {
            this.$confirm("是否确认删除该元素？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    if (
                        this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].elements.length === 1
                    ) {
                        this.$message({
                            type: "error",
                            message: "只剩下最后一个元素，无法删除！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
                    this.userSign[this.radioIndexUserSign].lines[this.radioIndexUserSignLine].elements.splice(
                        this.radioIndexUserSignElement,
                        1
                    );
                    this.radioLabelUserSignElement = "第1个";
                    this.radioIndexUserSignElement = 0;
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
    },
    created() {},
    mounted() {
        this.onChangeCivil("中国");
    },
});
