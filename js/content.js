function drawCell(borderColor, backgroundColor) {
    let length = $length;
    let canvas = document.getElementById("cell");
    let ctx = canvas.getContext("2d");
    let offset = 0.5;
    ctx.lineWidth = 1;
    ctx.strokeStyle = borderColor;
    ctx.fillStyle = backgroundColor;
    for (let li = 1; li <= length; li++) {
        for (let co = 1; co <= length; co++) {
            if (isInRange(li, co)) {
                let x = co * 30 - 30 + offset;
                let y = li * 30 - 30 + offset;
                ctx.clearRect(x, y, 29, 29);
                ctx.strokeRect(x, y, 29, 29);
                ctx.fillRect(x + 0.5, y + 0.5, 28, 28);
            }
        }
    }
}

function drawBoundary(boundaryColor) {
    let length = this.$length;
    let canvas = document.getElementById("cell");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, length * 30, length * 30);
    ctx.fillStyle = boundaryColor;
    for (let li = 1; li <= length; li++) {
        for (let co = 1; co <= length; co++) {
            let boundary = isBoundary(length, li, co);
            switch (boundary) {
                case "top-left":
                    ctx.moveTo((co - 1) * 30 - 10, li * 30);
                    ctx.lineTo(co * 30, li * 30);
                    ctx.lineTo(co * 30, (li - 1) * 30 - 10);
                    ctx.fill();
                    break;
                case "top-right":
                    ctx.moveTo((co - 1) * 30, (li - 1) * 30 - 10);
                    ctx.lineTo((co - 1) * 30, li * 30);
                    ctx.lineTo(co * 30 + 10, li * 30);
                    ctx.fill();
                    break;
                case "bottom-left":
                    ctx.moveTo((co - 1) * 30 - 10, (li - 1) * 30);
                    ctx.lineTo(co * 30, (li - 1) * 30);
                    ctx.lineTo(co * 30, li * 30 + 10);
                    ctx.fill();
                    break;
                case "bottom-right":
                    ctx.moveTo((co - 1) * 30, li * 30 + 10);
                    ctx.lineTo((co - 1) * 30, (li - 1) * 30);
                    ctx.lineTo(co * 30 + 10, (li - 1) * 30);
                    ctx.fill();
                    break;
                case "angle-top":
                    ctx.moveTo(co * 30, li * 30);
                    ctx.lineTo((co - 1) * 30, li * 30);
                    ctx.lineTo((co - 1) * 30, li * 30 - 10);
                    ctx.lineTo(co * 30 - 15, li * 30 - 25);
                    ctx.lineTo(co * 30, li * 30 - 10);
                    ctx.fill();
                    break;
                case "angle-right":
                    ctx.moveTo((co - 1) * 30, li * 30);
                    ctx.lineTo((co - 1) * 30, (li - 1) * 30);
                    ctx.lineTo((co - 1) * 30 + 10, (li - 1) * 30);
                    ctx.lineTo(co * 30 - 5, li * 30 - 15);
                    ctx.lineTo((co - 1) * 30 + 10, li * 30);
                    ctx.fill();
                    break;
                case "angle-bottom":
                    ctx.moveTo((co - 1) * 30, (li - 1) * 30);
                    ctx.lineTo(co * 30, (li - 1) * 30);
                    ctx.lineTo(co * 30, (li - 1) * 30 + 10);
                    ctx.lineTo(co * 30 - 15, li * 30 - 5);
                    ctx.lineTo((co - 1) * 30, (li - 1) * 30 + 10);
                    ctx.fill();
                    break;
                case "angle-left":
                    ctx.moveTo(co * 30, li * 30);
                    ctx.lineTo(co * 30, (li - 1) * 30);
                    ctx.lineTo(co * 30 - 10, (li - 1) * 30);
                    ctx.lineTo(co * 30 - 25, li * 30 - 15);
                    ctx.lineTo(co * 30 - 10, li * 30);
                    ctx.fill();
                    break;
            }
        }
    }
}

function createBuilding(config) {
    let { line, column, width, height, text, range } = config;
    let id = getBuildingID(config);
    let protectionRecord = [];
    let building = new Building(config);
    for (let i = line; i < line + height; i++) {
        for (let j = column; j < column + width; j++) {
            $cell[i][j].occupied = building;
            if (building.isRoad || building.barrierType || building.isProtection) continue;
            for (let v of $config.protection) {
                if ($cell[i][j][v] && $cell[i][j][v].length && protectionRecord.indexOf(v) === -1) {
                    protectionRecord.push(v);
                }
            }
        }
    }
    building.marker = protectionRecord.length;
    updateBorder(building, false);
    building.init();
    if (building.isProtection) {
        let buildingRecord = [];
        for (let i = line - range; i < line + height + range; i++) {
            for (let j = column - range; j < column + width + range; j++) {
                if (!isInBuildingRange(i, j, line, column, width, height, range)) continue;
                if ($cell[i][j][text]) {
                    $cell[i][j][text].push(id);
                } else {
                    $cell[i][j][text] = [id];
                }
                let b = $cell[i][j].occupied;
                if (!b) continue;
                if (b.isRoad || b.barrierType || b.isProtection) continue;
                if (buildingRecord.indexOf(b) === -1) buildingRecord.push(b);
            }
        }
        updateMarker(buildingRecord);
    }
}

function deleteBuilding(li, co, force) {
    let building = $cell[li][co].occupied;
    if (!building) return;
    if (building.isFixed && !force) return;
    if (!$$(building.id)) return;
    updateBorder(building, true);
    let { id, line, column, width, height, text, range } = building;
    if (building.isProtection) {
        let buildingRecord = [];
        for (let i = line - range; i < line + height + range; i++) {
            for (let j = column - range; j < column + width + range; j++) {
                if (!isInBuildingRange(i, j, line, column, width, height, range)) continue;
                $cell[i][j][text].splice($cell[i][j][text].indexOf(id), 1);
                let b = $cell[i][j].occupied;
                if (!b) continue;
                if (b.isRoad || b.barrierType || b.isProtection) continue;
                if (buildingRecord.indexOf(b) === -1) buildingRecord.push(b);
            }
        }
        updateMarker(buildingRecord);
    }
    for (let i = line; i < line + height; i++) {
        for (let j = column; j < column + width; j++) {
            delete $cell[i][j].occupied;
        }
    }
    $$("building").removeChild($$(building.id));
}

function drawFixedBuilding(type, woodNum) {
    woodNum = woodNum || $config.woodNum;
    woodNum -= 3;
    BuildingFixed[type][woodNum].map((v) => {
        let unit = v.split("-").map((w) => +w);
        if (unit.length < 3) unit.push(1);
        if (unit.length < 4) unit.push(unit[2]);
        let catagory = "water|mountain|tree|road".split("|").indexOf(type) > -1 ? type : "building";
        let barrierType = catagory !== "building" && catagory !== "road" ? type : "";
        createBuilding({
            line: unit[0],
            column: unit[1],
            width: unit[2],
            height: unit[3],
            range: 0,
            isFixed: true,
            barrierType: barrierType,
            isRoad: type === "road",
            text: BuildingFixed[`text_${type}`],
            color: "var(--color-black)",
            background: BuildingFixed[`color_${type}`],
            borderWidth: 1,
            borderColor: "var(--color-border-base)",
        });
    });
}

function updateBorder(building, show) {
    if (building.barrierType || building.isRoad) {
        let adj = getAdjacence(building.line, building.column);
        if (
            adj.top &&
            ((adj.top.barrierType && adj.top.barrierType === building.barrierType) ||
                (adj.top.isRoad && building.isRoad))
        ) {
            adj.top.borderBottom = show;
            adj.top.updateBorderStyle();
            building.borderTop = show;
        }
        if (
            adj.right &&
            ((adj.right.barrierType && adj.right.barrierType === building.barrierType) ||
                (adj.right.isRoad && building.isRoad))
        ) {
            adj.right.borderLeft = show;
            adj.right.updateBorderStyle();
            building.borderRight = show;
        }
        if (
            adj.bottom &&
            ((adj.bottom.barrierType && adj.bottom.barrierType === building.barrierType) ||
                (adj.bottom.isRoad && building.isRoad))
        ) {
            adj.bottom.borderTop = show;
            adj.bottom.updateBorderStyle();
            building.borderBottom = show;
        }
        if (
            adj.left &&
            ((adj.left.barrierType && adj.left.barrierType === building.barrierType) ||
                (adj.left.isRoad && building.isRoad))
        ) {
            adj.left.borderRight = show;
            adj.left.updateBorderStyle();
            building.borderLeft = show;
        }
    }
}

function updateMarker(buildings) {
    for (let v of buildings) {
        let protectionRecord = [];
        for (let i = v.line; i < v.line + v.height; i++) {
            for (let j = v.column; j < v.column + v.width; j++) {
                if ($cell[i][j].isRoad || $cell[i][j].barrierType || $cell[i][j].isProtection) continue;
                for (let w of $config.protection) {
                    if ($cell[i][j][w] && $cell[i][j][w].length && protectionRecord.indexOf(w) === -1) {
                        protectionRecord.push(w);
                    }
                }
            }
        }
        v.marker = protectionRecord.length;
        v.updateMarker();
    }
}
