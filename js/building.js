class Building {
    constructor(config) {
        this.line = config.line;
        this.column = config.column;
        this.width = config.width;
        this.height = config.height;
        this.text = config.text;
        this.color = config.color;
        this.background = config.background;
        this.borderColor = config.borderColor;
        this.borderWidth = config.borderWidth;
        this.range = config.range || 0;
        this.id = getBuildingID(config);
        this.name = config.name || "";
        this.catagory = config.catagory || "";
        this.fontSize = config.fontSize || 16;
        this.borderTop = config.borderTop || true;
        this.borderRight = config.borderRight || true;
        this.borderBottom = config.borderBottom || true;
        this.borderLeft = config.borderLeft || true;
        this.isMiracle = config.isMiracle || false;
        this.isDecoration = config.isDecoration || false;
        this.isFixed = config.isFixed || false;
        this.isProtection = config.isProtection || false;
        this.barrierType = config.barrierType || "";
        this.isRoad = config.isRoad || false;
        this.isGeneral = config.isGeneral || false;
        this.marker = config.marker || 0;
        //road sub-border color
        this.isRoadVertex = false;
        this.rBorderTop = false;
        this.rBorderRight = false;
        this.rBorderBottom = false;
        this.rBorderLeft = false;
    }

    init() {
        let node = document.createElement("div");
        let text = document.createElement("div");
        let marker = document.createElement("span");
        node.style.top = `${(this.line - 1) * $cellSize}px`;
        node.style.left = `${(this.column - 1) * $cellSize}px`;
        node.style.width = `${this.width * $cellSize}px`;
        node.style.height = `${this.height * $cellSize}px`;
        node.style.color = this.color;
        node.style.background = this.background;
        node.style.borderColor = this.borderColor;
        node.style.borderWidth = `${this.borderWidth}px`;
        node.style.fontSize = `${this.fontSize}px`;
        node.style.borderStyle = this.getBorderStyle();
        node.id = this.id;
        node.className = "building";
        if ((!this.isFixed || this.text) && !this.isRoad) node.className += " hoverable";
        if (this.isProtection && $config.showEffect) node.className += " protection-mask";
        if (this.isRoad) node.className += " road";
        text.innerHTML = this.text;
        text.className = "text";
        marker.innerHTML = this.marker;
        marker.className = "marker";
        if (!this.showMarker()) marker.style.display = "none";
        node.onmouseover = this.onMouseEnter;
        node.onmouseleave = this.onMouseLeave;
        if (this.catagory === "住宅") node.onmouseup = this.onMouseUp;
        if (!this.isFixed) node.ondblclick = this.onMouseDoubleClick;
        if (this.text) node.append(text);
        if (!this.isMiracle && !this.isDecoration && !this.isProtection && !this.barrierType) node.append(marker);
        $$("building").appendChild(node);
        this.updateMarker();
    }

    getBorderStyle() {
        let style = "";
        if (this.isRoad) {
            if (this.rBorderTop) style += "dashed ";
            else if (this.borderTop) style += "solid ";
            else style += "none ";
            if (this.rBorderRight) style += "dashed ";
            else if (this.borderRight) style += "solid ";
            else style += "none ";
            if (this.rBorderBottom) style += "dashed ";
            else if (this.borderBottom) style += "solid ";
            else style += "none ";
            if (this.rBorderLeft) style += "dashed ";
            else if (this.borderLeft) style += "solid ";
            else style += "none ";
        } else {
            style += this.borderTop ? "solid " : "none ";
            style += this.borderRight ? "solid " : "none ";
            style += this.borderBottom ? "solid " : "none ";
            style += this.borderLeft ? "solid " : "none ";
        }
        return style;
    }

    getRoadBorderColor() {
        let color = "";
        if (this.rBorderTop) color += "var(--color-border-darker) ";
        else if (this.borderTop) color += "var(--color-border-base) ";
        else color += "transparent ";
        if (this.rBorderRight) color += "var(--color-border-darker) ";
        else if (this.borderRight) color += "var(--color-border-base) ";
        else color += "transparent ";
        if (this.rBorderBottom) color += "var(--color-border-darker) ";
        else if (this.borderBottom) color += "var(--color-border-base) ";
        else color += "transparent ";
        if (this.rBorderLeft) color += "var(--color-border-darker) ";
        else if (this.borderLeft) color += "var(--color-border-base) ";
        else color += "transparent ";
        return color;
    }

    showMarker() {
        // if (this.marker === 0) return false;
        if (this.isRoad && !this.isRoadVertex) return false;
        if (this.barrierType) return false;
        if (this.isProtection) return false;
        if (this.isMiracle) return false;
        if (this.isDecoration) return false;
        return true;
    }

    updateBorderStyle() {
        $$(this.id).style.borderStyle = this.getBorderStyle();
    }

    updateBorderColor() {
        if (this.isRoad) $$(this.id).style.borderColor = this.getRoadBorderColor();
    }

    setMarker(marker) {
        this.marker = marker;
        this.updateMarker();
    }

    updateMarker() {
        if (this.showMarker()) {
            $$(this.id).lastChild.style.display = "block";
            $$(this.id).lastChild.innerHTML = this.marker;
            if (!this.isRoad) {
                if (this.marker === $config.protection.length) $$(this.id).lastChild.style.color = "green";
                if (this.marker < $config.protection.length) $$(this.id).lastChild.style.color = "red";
            }
        } else if (this.isRoad) {
            $$(this.id).lastChild.style.display = "none";
        }
    }

    onMouseEnter() {
        // if ($config.operation === "selecting-building") return;
        // if ($config.operation === "deleting-building") return;
        if ($config.isMouseDown) return;
        if ($config.dragMap.isDragging) return;
        let u = parseID(this.id);
        let building = $cell[u[0]][u[1]].occupied;
        if (building.range) window.requestAnimationFrame(() => $range.show(building));
        if (building.isFixed || building.isRoad) {
            $config.lastHover = {};
        } else $config.lastHover = building;
    }

    onMouseLeave() {
        // if ($config.operation === "selecting-building") return;
        // if ($config.operation === "deleting-building") return;
        // if ($config.isMouseDown) return;
        // if ($config.dragMap.isDragging) return;
        let u = parseID(this.id);
        let building = $cell[u[0]][u[1]].occupied;
        if (building.range) window.requestAnimationFrame(() => $range.hide(this.id));
    }

    onMouseUp(event) {
        // if ($config.dragMap.isDragging) return;
        if (event.button !== 2) return;
        $$$("body .el-notification.right .el-notification__closeBtn.el-icon-close", true).forEach((v) => v.click());
        let u = parseID(this.id);
        let building = $cell[u[0]][u[1]].occupied;
        let { line, column, width, height } = building;
        let requirement = $config.civilBuilding[$config.civil][`${building.name}需求`];
        let maxRange = 0;
        let result = {};
        Object.keys(requirement).forEach((cata) => {
            result[cata] = [];
            for (let req of requirement[cata]) {
                let range =
                    $config.civilBuilding[$config.civil][cata].find((v) => v.name === req)["range_size"] ||
                    $config.civilBuilding[$config.civil][cata].find((v) => v.name === req)["range"];
                let covered = false;
                maxRange = range > maxRange ? range : maxRange;
                for (let i = line - range; i < line + height + range; i++) {
                    if (covered) break;
                    for (let j = column - range; j < column + width + range; j++) {
                        if (covered) break;
                        let occupied = $cell[i][j].occupied;
                        if (!occupied) continue;
                        if (occupied.catagory !== cata || occupied.name !== req) continue;
                        for (let cornerLi of [line, line + height - 1, line, line + height - 1]) {
                            if (covered) break;
                            for (let cornerCo of [column, column, column + width - 1, column + width - 1]) {
                                if (
                                    isInBuildingRange(
                                        cornerLi,
                                        cornerCo,
                                        occupied.line,
                                        occupied.column,
                                        occupied.width,
                                        occupied.height,
                                        range
                                    )
                                )
                                    covered = true;
                                if (covered) break;
                            }
                        }
                    }
                }
                result[cata].push({ name: req, covered: covered });
            }
        });
        let message = "";
        Object.keys(result).forEach((cata) => {
            message +=
                "<div style='border: 1px solid var(--color-border-base); width: 100%; margin: 2px 0'></div><div>";
            message += `<span style="font-size: 15px; font-weight: bold;">${cata}</span><br />`;
            let count = 0;
            for (let req of result[cata]) {
                if (!count) {
                    message += "<div style='display: flex; display: -webkit-box; display: -ms-flexbox;'>";
                }
                message += "<div style='width: 50%'>";
                message += `<span style="cursor: pointer" onclick="$vm.onSelectBuilding('${req.name}', ['${cata}', '${req.name}'])">`;
                message += `<span>${req.name}:</span>`;
                message += `<span style="margin-left: 2px; font-weight: bold; color: ${
                    req.covered ? "#0be881" : "#ff5e57"
                }">${req.covered ? "√" : "×"}</span></span></div>`;
                count++;
                if (count >= 2) {
                    count = 0;
                    message += "</div>";
                }
            }
            message += "</div>";
        });
        $vm.$notify({
            dangerouslyUseHTMLString: true,
            iconClass: "fas fa-search",
            title: "住宅需求查询结果",
            message: message,
            duration: 6000,
            showClose: true,
            customClass: "residence-requirement",
            offset: $config.topNavHeight + 10,
        });
    }

    onMouseDoubleClick() {
        let u = parseID(this.id);
        let building = $cell[u[0]][u[1]].occupied;
        if (building.range) {
            $$("range-container").removeChild($$(`range-${this.id}`));
        }
        if (building.catagory === "住宅") {
            $$$("body .el-notification.right", true).forEach((v) => v.parentNode.removeChild(v));
        }
        deleteBuilding(u[0], u[1]);
    }
}
