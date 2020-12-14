class SelectionBlock extends Block {
    constructor() {
        super();
        this.id = "selection-block";
        this.boundary = { top: [], right: [], bottom: [], left: [] };
    }

    finalize(config) {
        this.update(config);
        super.finalize(config);
        if (!this.cache.length) return;
        this.updateBoundary();
        $$("selection-operation-top").style.top = `${(this.startLi - 1) * $cellSize - 50}px`;
        $$("selection-operation-top").style.left = `${((this.startCo + this.nowCo) / 2) * $cellSize - 35}px`;
        $$("selection-operation-right").style.top = `${((this.startLi + this.nowLi - 2) / 2) * $cellSize - 5}px`;
        $$("selection-operation-right").style.left = `${this.nowCo * $cellSize + 10}px`;
        $$("selection-operation-bottom").style.top = `${this.nowLi * $cellSize + 10}px`;
        $$("selection-operation-bottom").style.left = `${((this.startCo + this.nowCo) / 2) * $cellSize - 35}px`;
        $$("selection-operation-left").style.top = `${((this.startLi + this.nowLi - 2) / 2) * $cellSize - 5}px`;
        $$("selection-operation-left").style.left = `${(this.startCo - 1) * $cellSize - 50}px`;
        $$("selection-operation-top").style.display = "block";
        $$("selection-operation-right").style.display = "block";
        $$("selection-operation-bottom").style.display = "block";
        $$("selection-operation-left").style.display = "block";
    }

    hide() {
        this.cache.forEach((v) => {
            $$(v).className = $$(v).className.replace(" selected-blue", "");
        });
        this.cache = [];
        $$("selection-block").style.display = "none";
        $$("selection-operation-top").style.display = "none";
        $$("selection-operation-right").style.display = "none";
        $$("selection-operation-bottom").style.display = "none";
        $$("selection-operation-left").style.display = "none";
    }

    updateBoundary() {
        let boundary = { top: [], right: [], bottom: [], left: [] };
        for (let i = this.startLi; i <= this.nowLi; i++) {
            if ($cell[i][this.startCo].occupied) boundary.left.push($cell[i][this.startCo].occupied.id);
            else boundary.left.push("");
            if ($cell[i][this.nowCo].occupied) boundary.right.push($cell[i][this.nowCo].occupied.id);
            else boundary.right.push("");
        }
        for (let i = this.startCo; i <= this.nowCo; i++) {
            if ($cell[this.startLi][i].occupied) boundary.top.push($cell[this.startLi][i].occupied.id);
            else boundary.top.push("");
            if ($cell[this.nowLi][i].occupied) boundary.bottom.push($cell[this.nowLi][i].occupied.id);
            else boundary.bottom.push("");
        }
        this.boundary = boundary;
    }
}

function onClickBlockMove(dir, index) {
    let boundary = $selectionBlock.boundary[dir];
    let offsetLi = [-1, 0, 1, 0][index];
    let offsetCo = [0, 1, 0, -1][index];
    let flag = true;
    for (let v of $selectionBlock.cache) {
        let u = parseID(v);
        let { line, column, width, height } = $cell[u[0]][u[1]].occupied;
        let start = dir === "top" || dir === "bottom" ? column : line;
        let end = dir === "top" || dir === "bottom" ? column + width : line + height;
        for (let i = start; i < end; i++) {
            switch (dir) {
                case "top":
                    if (
                        !$cell[line - 1][i].isInRange ||
                        ($cell[line - 1][i].occupied &&
                            $selectionBlock.cache.indexOf($cell[line - 1][i].occupied.id) === -1)
                    )
                        flag = false;
                    break;
                case "right":
                    if (
                        !$cell[i][column + width].isInRange ||
                        ($cell[i][column + width].occupied &&
                            $selectionBlock.cache.indexOf($cell[i][column + width].occupied.id) === -1)
                    )
                        flag = false;
                    break;
                case "bottom":
                    if (
                        !$cell[line + height][i].isInRange ||
                        ($cell[line + height][i].occupied &&
                            $selectionBlock.cache.indexOf($cell[line + height][i].occupied.id) === -1)
                    )
                        flag = false;
                    break;
                case "left":
                    if (
                        !$cell[i][column - 1].isInRange ||
                        ($cell[i][column - 1].occupied &&
                            $selectionBlock.cache.indexOf($cell[i][column - 1].occupied.id) === -1)
                    )
                        flag = false;
                    break;
            }
        }
        if (!flag) break;
    }
    if (!flag) {
        $vm.$message({
            message: "该方向上有障碍物，无法移动。",
            type: "error",
            duration: 2000,
            offset: $config.topNavHeight + 10,
        });
        return;
    }
    let buildingRecord = [];
    for (let v of $selectionBlock.cache) {
        let u = parseID(v);
        buildingRecord.push(Object.assign({}, $cell[u[0]][u[1]].occupied));
        deleteBuilding(u[0], u[1]);
    }
    $selectionBlock.cache = [];
    for (let v of buildingRecord) {
        if (dir === "top") v.line--;
        if (dir === "right") v.column++;
        if (dir === "bottom") v.line++;
        if (dir === "left") v.column--;
        createBuilding(v);
    }
    $selectionBlock.finalize({
        startX: ($selectionBlock.startCo + offsetCo) * $cellSize - 15,
        startY: ($selectionBlock.startLi + offsetLi) * $cellSize - 15,
        nowX: ($selectionBlock.nowCo + offsetCo) * $cellSize - 15,
        nowY: ($selectionBlock.nowLi + offsetLi) * $cellSize - 15,
    });
    if (dir === "top") {
        $$$("html").scrollTop -= 30;
    }
    if (dir === "right") {
        $$$("html").scrollLeft += 30;
    }
    if (dir === "bottom") {
        $$$("html").scrollTop += 30;
    }
    if (dir === "left") {
        $$$("html").scrollLeft -= 30;
    }
}
