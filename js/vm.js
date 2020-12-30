var $vm = new Vue({
    el: "#app",
    data() {
        return {
            minorPatch: "",
            labelText: LabelText,
            buildingCatagory: LabelText.building_catagory,
            operationCatagory: LabelText.operation_catagory,
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
            autoSave: [],
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
                changableBorderColor: false,
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
            civilEditorStepLabel: [
                "住宅",
                "农业",
                "工业",
                "商业",
                "市政",
                "文化",
                "宗教",
                "军事",
                "美化",
                "奇迹",
                "住宅需求",
                "信息核对",
            ],
            predefineColors: [BuildingColor.White, BuildingColor.Black],
            predefineBackgroundColors: [
                BuildingColor["市政"]["水"],
                BuildingColor["市政"]["防"],
                BuildingColor["市政"]["粮"],
                BuildingColor["市政"]["货"],
                BuildingColor["市政"]["殿"],
                BuildingColor["市政"]["职"],
                BuildingColor["市政"]["贸"],
                BuildingColor["市政"]["税"],
                BuildingColor["市政"]["磨"],
                BuildingColor["市政"]["浇"],
                BuildingColor["市政"]["驿"],
                BuildingColor["美化"]["树"],
            ],
            civilEditorActiveStep: 0,
            civilEditorPreview: {},
            civilEditorResicenceData: [],
            civilEditorResicenceReq: [],
            civilEditorResult: {
                住宅: [
                    {
                        name: "普通住宅",
                        text: "宅",
                        width: 1,
                        height: 1,
                        range: 0,
                        color: BuildingColor.Black,
                        backgroundColor: BuildingColor["住宅"][0],
                        borderColor: "var(--color-border-base)",
                        isDecoration: false,
                        isMiracle: false,
                        isProtection: false,
                        effect: "dark",
                        id: "住宅-普通住宅",
                    },
                    {
                        name: "高级住宅",
                        text: "高级住宅",
                        width: 3,
                        height: 3,
                        range: 0,
                        color: BuildingColor.Black,
                        backgroundColor: BuildingColor["住宅"][1],
                        borderColor: "var(--color-border-base)",
                        isDecoration: false,
                        isMiracle: false,
                        isProtection: false,
                        effect: "plain",
                        id: "住宅-高级住宅",
                    },
                ],
                农业: [],
                工业: [],
                商业: [],
                市政: [
                    {
                        name: "水井",
                        text: "水",
                        width: 1,
                        height: 1,
                        range: 4,
                        color: BuildingColor.Black,
                        backgroundColor: BuildingColor["市政"]["水"],
                        borderColor: "var(--color-border-base)",
                        isDecoration: false,
                        isMiracle: false,
                        isProtection: false,
                        effect: "plain",
                        id: "市政-水井",
                    },
                ],
                文化: [],
                宗教: [],
                军事: [],
                美化: [
                    {
                        name: "树",
                        text: "树",
                        width: 1,
                        height: 1,
                        range: 0,
                        color: BuildingColor.Black,
                        backgroundColor: BuildingColor["美化"]["树"],
                        borderColor: "var(--color-border-base)",
                        isDecoration: true,
                        isMiracle: false,
                        isProtection: false,
                        effect: "plain",
                        id: "美化-树",
                    },
                ],
                奇迹: [],
                名称: "",
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
        formatTimestamp: formatTimestamp,
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
                    // newHolding.borderColor = DarkMode["color-border-base"];
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
                case "导入新文明":
                    importNewCivil();
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
            newHolding.width = selectedBuilding.size || selectedBuilding.width;
            newHolding.height = selectedBuilding.size || selectedBuilding.height;
            newHolding.range = selectedBuilding.range_size || selectedBuilding.range;
            newHolding.color = selectedBuilding.color;
            newHolding.background = selectedBuilding.background_color || selectedBuilding.backgroundColor;
            // newHolding.borderColor = selectedBuilding.border_color || selectedBuilding.borderColor;
            newHolding.borderColor = "var(--color-border-base)";
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
        loadAutoSave(index, row) {
            this.$confirm("是否确认载入该数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    loadData(row, true);
                    this.$message({
                        message: `已载入${this.formatTimestamp(row.timestamp)}的数据！`,
                        type: "success",
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
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
            let tmp = Object.assign({}, this.specialBuilding);
            if (tmp.changableBorderColor) {
                tmp.borderColor = "var(--color-border-base)";
            }
            this.specialBuildingList.push(tmp);
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
                    if (!value) {
                        this.$message({
                            type: "error",
                            message: "水印名称不能为空！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
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
                    if (!value) {
                        this.$message({
                            type: "error",
                            message: "水印名称不能为空！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
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
        updateCivilEditorStep(step) {
            this.civilEditorActiveStep = step;
            if (
                this.civilEditorActiveStep <= 9 &&
                this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]].length
            ) {
                this.selectCivilTag(0);
            } else {
                this.civilEditorPreview = {};
            }
            if (this.civilEditorActiveStep === 10) {
                if (this.civilEditorResicenceReq.length !== this.civilEditorResult["住宅"].length) {
                    this.civilEditorResicenceReq = [];
                    for (let v of this.civilEditorResult["住宅"]) {
                        this.civilEditorResicenceReq.push([]);
                    }
                }
                this.civilEditorResicenceData = [];
                for (let v of this.civilEditorResult["商业"]) {
                    this.civilEditorResicenceData.push(v);
                }
                for (let v of this.civilEditorResult["市政"]) {
                    if (v.isProtection) continue;
                    this.civilEditorResicenceData.push(v);
                }
                for (let v of this.civilEditorResult["文化"]) {
                    this.civilEditorResicenceData.push(v);
                }
                for (let v of this.civilEditorResult["宗教"]) {
                    this.civilEditorResicenceData.push(v);
                }
            }
            if (this.civilEditorActiveStep === 11) {
                this.selectCivilTag(0, 0);
            }
        },
        insertCivilBuilding() {
            this.$prompt("请输入建筑名称", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputValidator: (value) =>
                    this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]].findIndex(
                        (v) => v.name === value
                    ) === -1,
                inputErrorMessage: "名称名称重复",
            })
                .then(({ value }) => {
                    if (!value) {
                        this.$message({
                            type: "error",
                            message: "建筑名称不能为空！",
                            duration: 3000,
                            offset: $config.topNavHeight + 10,
                        });
                        return;
                    }
                    let length =
                        this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]].length + 1;
                    let maxLength = BuildingColor[this.civilEditorStepLabel[this.civilEditorActiveStep]].length;
                    length = length > maxLength ? maxLength : length;
                    this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]].push({
                        name: value,
                        text: value,
                        width: this.civilEditorStepLabel[this.civilEditorActiveStep] === "商业" ? 1 : 2,
                        height: this.civilEditorStepLabel[this.civilEditorActiveStep] === "商业" ? 1 : 2,
                        range: this.civilEditorStepLabel[this.civilEditorActiveStep] === "商业" ? 5 : 0,
                        color:
                            ["宗教", "军事", "奇迹"].indexOf(this.civilEditorStepLabel[this.civilEditorActiveStep]) > -1
                                ? BuildingColor.White
                                : BuildingColor.Black,
                        backgroundColor:
                            BuildingColor[this.civilEditorStepLabel[this.civilEditorActiveStep]][length - 1],
                        borderColor: "var(--color-border-base)",
                        isDecoration: this.civilEditorStepLabel[this.civilEditorActiveStep] === "美化",
                        isMiracle: this.civilEditorStepLabel[this.civilEditorActiveStep] === "奇迹",
                        isProtection: false,
                        effect: "plain",
                        id: `${this.civilEditorStepLabel[this.civilEditorActiveStep]}-${value}`,
                    });
                    length = this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]].length;
                    this.selectCivilTag(length - 1);
                    this.$message({
                        type: "success",
                        message: `已添加新建筑: ${value}`,
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
        selectCivilTag(index, catagoryIndex) {
            if (catagoryIndex !== undefined) {
                for (let i = 0; i < 10; i++) {
                    for (let v of this.civilEditorResult[this.civilEditorStepLabel[i]]) {
                        v.effect = "plain";
                    }
                }
                this.civilEditorPreview = this.civilEditorResult[this.civilEditorStepLabel[catagoryIndex]][index];
                this.civilEditorResult[this.civilEditorStepLabel[catagoryIndex]][index].effect = "dark";
                return;
            }
            for (let v of this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]]) {
                v.effect = "plain";
            }
            this.civilEditorPreview = this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]][
                index
            ];
            this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]][index].effect = "dark";
        },
        deleteCivilTag(index) {
            this.$confirm("是否确认删除该建筑？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    let buildingID = this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]][
                        index
                    ].id;
                    for (let v of this.civilEditorResicenceReq) {
                        let index = v.findIndex((value) => value === buildingID);
                        if (index > -1) {
                            v.splice(index, 1);
                        }
                    }
                    this.civilEditorPreview = this.civilEditorResult[
                        this.civilEditorStepLabel[this.civilEditorActiveStep]
                    ].splice(index, 1);
                    if (this.civilEditorResult[this.civilEditorStepLabel[this.civilEditorActiveStep]].length) {
                        this.selectCivilTag(0);
                    }
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
        generateNewCivil() {
            if (!this.civilEditorResult["名称"]) {
                this.$message({
                    type: "error",
                    message: "文明名称为空，生成失败!",
                    duration: 3000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            this.$confirm(
                "<strong>是否确认建筑信息、住宅需求全部正确？<br />生成后的文件将无法修改！</strong>",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    dangerouslyUseHTMLString: true,
                }
            )
                .then(() => {
                    exportNewCivil(this.civilEditorResult, this.civilEditorResicenceReq);
                    this.$message({
                        type: "success",
                        message: "生成成功!",
                        duration: 3000,
                        offset: $config.topNavHeight + 10,
                    });
                })
                .catch(() => {});
        },
    },
    created() {},
    mounted() {
        this.civilEditorPreview = this.civilEditorResult["住宅"][0];
        this.onChangeCivil("中国");
        $$$("#civil-editor-step .el-step__icon.is-text", true).forEach((v, i) => {
            v.style.cursor = "pointer";
            v.onclick = () => {
                this.updateCivilEditorStep(i);
            };
        });
        $$$("#civil-editor-step .el-step__title", true).forEach((v, i) => {
            let text = v.innerHTML;
            let span = document.createElement("span");
            span.innerHTML = text;
            span.style.cursor = "pointer";
            span.onclick = () => {
                this.updateCivilEditorStep(i);
            };
            v.innerHTML = "";
            v.appendChild(span);
        });
    },
});
