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
    let canvas = document.getElementById("cell");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, $length * 30, $length * 30);
    ctx.fillStyle = boundaryColor;
    for (let li = 1; li <= $length; li++) {
        for (let co = 1; co <= $length; co++) {
            let boundary = isBoundary(li, co);
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
            if (
                building.isRoad ||
                building.barrierType ||
                building.isProtection ||
                building.isMiracle ||
                building.isDecoration
            )
                continue;
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
    $miniMap.setPixel(line, column, building.background, width, height);
    if (building.isRoad) updateRoadMarker(line, column);
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
                if (b.isRoad || b.barrierType || b.isProtection || b.isMiracle || b.isDecoration) continue;
                if (buildingRecord.indexOf(b) === -1) buildingRecord.push(b);
            }
        }
        updateProtectionMarker(buildingRecord);
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
        updateProtectionMarker(buildingRecord);
    }
    for (let i = line; i < line + height; i++) {
        for (let j = column; j < column + width; j++) {
            delete $cell[i][j].occupied;
        }
    }
    if (building.isRoad) updateRoadMarker(line, column);
    $miniMap.setPixel(line, column, getColor("--color-background-lighter"), width, height);
    $$("building").removeChild($$(id));
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
            adj.top.rBorderBottom = false;
            adj.top.updateBorderColor();
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
            adj.bottom.rBorderTop = false;
            adj.bottom.updateBorderColor();
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

function updateProtectionMarker(buildings) {
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

function isRoad(li, co) {
    return $cell[li][co].occupied && $cell[li][co].occupied.isRoad;
}

function isDirRoad(li, co, dir) {
    if (isRoad(li, co) && getRoadDir(li, co) === dir) return true;
}

function getRoad(li, co) {
    if (isRoad(li, co)) return $cell[li][co].occupied;
}

function getRoadDir(li, co) {
    if (isRoad(li, co - 1)) return "h";
    if (isRoad(li, co + 1)) return "h";
    if (isRoad(li - 1, co) && !isRoad(li - 1, co - 1) && !isRoad(li - 1, co + 1)) return "v";
    if (isRoad(li + 1, co) && !isRoad(li + 1, co - 1) && !isRoad(li + 1, co + 1)) return "v";
    return "n";
}

function updateRoadDisplay(li, co) {
    let self = getRoad(li, co);
    for (let i = -1; i < 2; i += 2) {
        if (isRoad(li + i, co)) {
            let adj = getRoad(li + i, co);
            if (i === -1) {
                adj.rBorderBottom = true;
                adj.borderBottom = true;
                self.rBorderTop = true;
                self.borderTop = true;
            } else {
                adj.rBorderTop = true;
                adj.borderTop = true;
                self.rBorderBottom = true;
                self.borderBottom = true;
            }
            if (isDirRoad(li + i, co, "v") || isDirRoad(li + i, co, "n")) {
                self.isRoadVertex = true;
            }
            adj.updateBorderColor();
            adj.updateMarker();
        }
    }
    self.updateBorderColor();
    self.updateMarker();
}

function updateRoadMarker(li, co) {
    let neighbors = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (isRoad(li + i, co + j)) neighbors.push({ li: li + i, co: co + j });
        }
    }
    for (let v of neighbors) {
        let self = getRoad(v.li, v.co);
        if (getRoadDir(v.li, v.co) === "h") {
            let hasLeft = false;
            if (isRoad(v.li, v.co - 1)) {
                let left = getRoad(v.li, v.co - 1);
                let marker = left.marker;
                if (!marker) {
                    left.setMarker(1);
                    self.setMarker(2);
                    left.isRoadVertex = true;
                } else {
                    self.setMarker(marker + 1);
                    if (marker > 1) left.isRoadVertex = false;
                }
                self.isRoadVertex = true;
                updateRoadDisplay(v.li, v.co - 1);
                updateRoadDisplay(v.li, v.co);
                hasLeft = true;
            }
            if (isRoad(v.li, v.co + 1)) {
                let right = getRoad(v.li, v.co + 1);
                let marker = self.marker;
                if (!marker || !hasLeft) {
                    self.setMarker(1);
                    right.setMarker(2);
                    self.isRoadVertex = true;
                    marker = 1;
                } else {
                    right.setMarker(marker + 1);
                    if (marker > 1) self.isRoadVertex = false;
                }
                right.isRoadVertex = true;
                updateRoadDisplay(v.li, v.co);
                updateRoadDisplay(v.li, v.co + 1);
                marker += 2;
                let idx = v.co + 2;
                while (isRoad(v.li, idx)) {
                    getRoad(v.li, idx).isRoadVertex = true;
                    getRoad(v.li, idx).setMarker(marker);
                    getRoad(v.li, idx - 1).isRoadVertex = false;
                    updateRoadDisplay(v.li, idx - 1);
                    marker++;
                    idx++;
                }
            }
        }
    }
    for (let v of neighbors) {
        let self = getRoad(v.li, v.co);
        if (getRoadDir(v.li, v.co) === "v") {
            let hasTop = false;
            if (isDirRoad(v.li - 1, v.co, "v")) {
                let top = getRoad(v.li - 1, v.co);
                let marker = top.marker;
                if (!marker) {
                    top.marker = 1;
                    self.marker = 2;
                    top.isRoadVertex = true;
                } else {
                    self.marker = marker + 1;
                    if (marker > 1) top.isRoadVertex = false;
                }
                self.isRoadVertex = true;
                top.updateMarker();
                self.updateMarker();
                hasTop = true;
            }
            if (isDirRoad(v.li + 1, v.co, "v")) {
                let bottom = getRoad(v.li + 1, v.co);
                let marker = self.marker;
                if (!marker || !hasTop) {
                    self.marker = 1;
                    bottom.marker = 2;
                    self.isRoadVertex = true;
                    marker = 1;
                } else {
                    bottom.marker = marker + 1;
                    if (marker > 1) self.isRoadVertex = false;
                }
                bottom.isRoadVertex = true;
                self.updateMarker();
                bottom.updateMarker();
                self.rBorderBottom = false;
                self.borderBottom = false;
                bottom.rBorderTop = false;
                bottom.borderTop = false;
                self.updateBorderColor();
                bottom.updateBorderColor();
                marker += 2;
                let idx = v.li + 2;
                while (isDirRoad(idx, v.co, "v")) {
                    getRoad(idx, v.co).marker = marker;
                    getRoad(idx - 1, v.co).isRoadVertex = false;
                    getRoad(idx, v.co).isRoadVertex = true;
                    getRoad(idx - 1, v.co).updateMarker();
                    getRoad(idx, v.co).updateMarker();
                    marker++;
                    idx++;
                }
            }
        }
        if (getRoadDir(v.li, v.co) === "n") {
            self.isRoadVertex = false;
            self.marker = 0;
            updateRoadDisplay(v.li, v.co);
        }
    }
}

function setPreviewMarker(marker) {
    $$("preview-marker").style.display = "block";
    $$("preview-marker").innerHTML = marker;
    if (marker === $config.protection.length) $$("preview-marker").style.color = "green";
    if (marker < $config.protection.length) $$("preview-marker").style.color = "red";
}

function setupPreview(li, co) {
    let preview = $$("preview");
    if ($config.newHold) {
        $config.newHold = false;
        let previewText = $$("preview-text");
        preview.style.width = `${$config.holding.width * $cellSize}px`;
        preview.style.height = `${$config.holding.height * $cellSize}px`;
        preview.style.color = $config.holding.color;
        preview.style.fontSize = `${$config.holding.fontSize}px`;
        preview.style.background = $config.holding.background;
        preview.style.borderColor = $config.holding.borderColor;
        preview.style.borderWidth = `${$config.holding.borderWidth}px`;
        previewText.innerHTML = $config.holding.text;
        $config.holding.offsetLi = Math.floor(($config.holding.height - 1) / 2);
        $config.holding.offsetCo = Math.floor(($config.holding.width - 1) / 2);
        if ($config.holding.isRoad) {
            preview.className += " road";
        } else {
            preview.className = preview.className.replace(" road", "");
        }
    }
    let { offsetLi, offsetCo, width, height } = $config.holding;
    let protectionRecord = [];
    for (let i = li - offsetLi; i < li - offsetLi + height; i++) {
        for (let j = co - offsetCo; j < co - offsetCo + width; j++) {
            if (!$cell[i][j].isInRange || $cell[i][j].occupied) {
                preview.style.display = "none";
                return;
            }
            if (
                $config.holding.isRoad ||
                $config.holding.isProtection ||
                $config.holding.isMiracle ||
                $config.holding.isDecoration
            )
                continue;
            for (let v of $config.protection) {
                if ($cell[i][j][v] && $cell[i][j][v].length && protectionRecord.indexOf(v) === -1) {
                    protectionRecord.push(v);
                }
            }
        }
    }
    if (
        $config.holding.isRoad ||
        $config.holding.isProtection ||
        $config.holding.isMiracle ||
        $config.holding.isDecoration
    ) {
        $$("preview-marker").style.display = "none";
    } else {
        setPreviewMarker(protectionRecord.length);
    }
    if (!$config.holding.isRoad) {
        preview.className = preview.className.replace(" road", "");
    }
    preview.style.top = `${(li - 1 - $config.holding.offsetLi) * $cellSize}px`;
    preview.style.left = `${(co - 1 - $config.holding.offsetCo) * $cellSize}px`;
    preview.style.display = "flex";
}
