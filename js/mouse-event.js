function isInBuilding(path) {
    return path[0].id === "building" || path[1].id === "building" || path[2].id === "building";
}

function isInPreview(path) {
    return path[0].id === "preview" || path[1].id === "preview";
}

function isInRangeContainer(path) {
    return (
        path[0].id === "range-container" ||
        path[1].id === "range-container" ||
        path[2].id === "range-container" ||
        path[3].id === "range-container"
    );
}

function isInRoadHelper(path) {
    return path[0].id === "road-helper";
}

function getPosition(event) {
    let pageX = event.pageX - 96;
    let pageY = event.pageY - 72;
    return {
        pageX: pageX,
        pageY: pageY,
        li: Math.ceil(pageY / 30),
        co: Math.ceil(pageX / 30),
    };
}

function onMouseDown(event) {
    if (event.button !== 0) return;
    const path = event.path || (event.composedPath && event.composedPath());
    let { pageX, pageY, li, co } = getPosition(event);
    $config.isMouseDown = true;
    $config.startX = pageX;
    $config.startY = pageY;
    $config.startLi = li;
    $config.startCo = co;
    if (path.length > 3 && path[1].id !== "selection-operation" && path[2].id !== "selection-operation") {
        $selectionBlock.hide();
    }
    if (path.length > 3 && path[1].id !== "deletion-operation" && path[2].id !== "deletion-operation") {
        $deletionBlock.hide();
    }
    if ($config.operation === "null" && path.length > 3 && (isInBuilding(path) || isInRangeContainer(path))) {
        setTimeout(() => {
            $config.dragMap.startScrollLeft = $$$("html").scrollLeft;
            $config.dragMap.startScrollTop = $$$("html").scrollTop;
            $config.dragMap.startX = event.clientX;
            $config.dragMap.startY = event.clientY;
            $config.dragMap.nowX = event.clientX;
            $config.dragMap.nowY = event.clientY;
            $config.dragMap.isDragging = true;
        }, 0);
    }
    if (
        $config.isCtrlDown &&
        path.length > 3 &&
        (isInBuilding(path) || isInPreview(path) || isInRangeContainer(path))
    ) {
        setTimeout(() => {
            $config.dragMap.startScrollLeft = $$$("html").scrollLeft;
            $config.dragMap.startScrollTop = $$$("html").scrollTop;
            $config.dragMap.startX = event.clientX;
            $config.dragMap.startY = event.clientY;
            $config.dragMap.nowX = event.clientX;
            $config.dragMap.nowY = event.clientY;
            $config.dragMap.isDragging = true;
        }, 0);
    }
}

function onMouseUp(event) {
    if (event.button !== 0) return;
    // console.log("up", event);
    $config.isMouseDown = false;
    if ($config.dragMap.isDragging) {
        $config.dragMap.isDragging = false;
    }
    const path = event.path || (event.composedPath && event.composedPath());
    let { pageX, pageY, li, co } = getPosition(event);
    if (
        !$config.isCtrlDown &&
        $config.holding.isRoad &&
        path.length > 3 &&
        (isInBuilding(path) || isInRoadHelper(path) || isInPreview(path))
    ) {
        $$("road-helper").style.display = "none";
        $$("preview").style.display = "none";
        if (li === $config.startLi) {
            let start = co > $config.startCo ? $config.startCo : co;
            let end = co > $config.startCo ? co : $config.startCo;
            for (let v of $config.roadCache) {
                deleteBuilding(v.li, v.co);
            }
            for (let i = start; i <= end; i++) {
                if (!$cell[li][i].isInRange || $cell[li][i].occupied) continue;
                createBuilding(
                    Object.assign({}, $config.holding, {
                        line: li,
                        column: i,
                    })
                );
            }
        } else if (co === $config.startCo) {
            let start = li > $config.startLi ? $config.startLi : li;
            let end = li > $config.startLi ? li : $config.startLi;
            for (let v of $config.roadCache) {
                deleteBuilding(v.li, v.co);
            }
            for (let i = start; i <= end; i++) {
                if (!$cell[i][co].isInRange || $cell[i][co].occupied) continue;
                createBuilding(
                    Object.assign({}, $config.holding, {
                        line: i,
                        column: co,
                    })
                );
            }
        }
        $config.roadCache = [];
    }
    if (
        $config.operation === "selecting-building" &&
        path.length > 3 &&
        path[1].id !== "selection-operation" &&
        path[2].id !== "selection-operation"
    ) {
        $selectionBlock.finalize({
            startX: $config.startX,
            startY: $config.startY,
            nowX: pageX,
            nowY: pageY,
        });
    }
    if (
        $config.operation === "deleting-building" &&
        path.length > 3 &&
        path[1].id !== "deletion-operation" &&
        path[2].id !== "deletion-operation"
    ) {
        $deletionBlock.finalize({
            startX: $config.startX,
            startY: $config.startY,
            nowX: pageX,
            nowY: pageY,
        });
    }
}

function onMouseClick(event) {
    if (event.button !== 0) return;
    const path = event.path || (event.composedPath && event.composedPath());
    let { li, co } = getPosition(event);
    if (li < 0 || co < 0 || li > 116 || co > 116) return;
    if (
        $config.operation === "placing-building" &&
        !$config.holding.isDecoration &&
        !$config.holding.isMiracle &&
        !$config.holding.isProtection &&
        !$config.holding.isGeneral &&
        $cell[li][co].occupied &&
        $cell[li][co].occupied.isGeneral &&
        $cell[li][co].occupied.width === $config.holding.width &&
        $cell[li][co].occupied.height === $config.holding.height
    ) {
        let targetLi = $cell[li][co].occupied.line;
        let targetCo = $cell[li][co].occupied.column;
        deleteBuilding(targetLi, targetCo);
        $$("preview").style.display = "none";
        createBuilding(
            Object.assign({}, $config.holding, {
                line: targetLi,
                column: targetCo,
            })
        );
    } else if (
        !$config.isCtrlDown &&
        $config.operation === "placing-building" &&
        $$("preview").style.display !== "none" &&
        path.length > 3 &&
        (path[0].id === "building" || isInPreview(path))
    ) {
        let { offsetLi, offsetCo, width, height } = $config.holding;
        for (let i = li - offsetLi; i < li - offsetLi + height; i++) {
            for (let j = co - offsetCo; j < co - offsetCo + width; j++) {
                if ($cell[i][j].occupied) return;
            }
        }
        $$("preview").style.display = "none";
        createBuilding(
            Object.assign({}, $config.holding, {
                line: li - $config.holding.offsetLi,
                column: co - $config.holding.offsetCo,
            })
        );
        if ($config.holding.isRoad) {
            $config.roadCache.push({ li: li - $config.holding.offsetLi, co: co - $config.holding.offsetCo });
            if (li === $config.startLi) {
                let width = Math.abs(co - $config.startCo) + 1;
                let left = co > $config.startCo ? $config.startCo : co;
                $$("road-helper").style.display = "block";
                $$("road-helper").style.width = `${width * 30}px`;
                $$("road-helper").style.height = "30px";
                $$("road-helper").style.left = `${(left - 1) * 30}px`;
                $$("road-helper").style.top = `${(li - 1) * 30}px`;
            } else if (co === $config.startCo) {
                let height = Math.abs(li - $config.startLi) + 1;
                let top = li > $config.startLi ? $config.startLi : li;
                $$("road-helper").style.display = "block";
                $$("road-helper").style.width = "30px";
                $$("road-helper").style.height = `${height * 30}px`;
                $$("road-helper").style.left = `${(co - 1) * 30}px`;
                $$("road-helper").style.top = `${(top - 1) * 30}px`;
            } else {
                $$("road-helper").style.display = "none";
            }
        }
    }
}

function onMouseMove(event) {
    minionEyeballs(event);
    const path = event.path || (event.composedPath && event.composedPath());
    if ($config.isMouseDown && $config.dragMap.isDragging) {
        if (
            ($config.operation === "null" || $config.isCtrlDown) &&
            path.length > 3 &&
            (isInBuilding(path) || isInRangeContainer(path))
        ) {
            setTimeout(() => {
                let config = $config.dragMap;
                $config.dragMap.nowX = event.clientX;
                $config.dragMap.nowY = event.clientY;
                $$$("html").scrollLeft = config.startScrollLeft + config.startX - config.nowX;
                $$$("html").scrollTop = config.startScrollTop + config.startY - config.nowY;
            }, 0);
            return;
        }
    }
    let { li, co, pageX, pageY } = getPosition(event);
    if (li < 1 || co < 1 || li > 116 || co > 116) return;
    if (
        $config.operation === "placing-building" &&
        !$config.holding.isDecoration &&
        !$config.holding.isMiracle &&
        !$config.holding.isProtection &&
        !$config.holding.isGeneral &&
        $cell[li][co].occupied &&
        $cell[li][co].occupied.isGeneral &&
        $cell[li][co].occupied.width === $config.holding.width &&
        $cell[li][co].occupied.height === $config.holding.height
    ) {
        preview.style.top = `${($cell[li][co].occupied.line - 1) * $cellSize}px`;
        preview.style.left = `${($cell[li][co].occupied.column - 1) * $cellSize}px`;
        setPreviewMarker($cell[li][co].occupied.marker);
        preview.style.display = "flex";
    } else if (
        $config.operation === "placing-building" &&
        path.length > 3 &&
        (path[0].id === "building" || isInPreview(path))
    ) {
        setupPreview(li, co);
    } else {
        preview.style.display = "none";
    }
    if ($config.isMouseDown) {
        if (
            $config.operation === "selecting-building" &&
            path.length > 3 &&
            (path[0].id === "building" ||
                path[0].id === "selection-block" ||
                path[0].className.indexOf("building") > -1 ||
                path[1].className.indexOf("building") > -1)
        ) {
            $selectionBlock.update({
                startX: $config.startX,
                startY: $config.startY,
                nowX: pageX,
                nowY: pageY,
            });
        }
        if (
            $config.operation === "deleting-building" &&
            path.length > 3 &&
            (path[0].id === "building" ||
                path[0].id === "deletion-block" ||
                path[0].className.indexOf("building") > -1 ||
                path[1].className.indexOf("building") > -1)
        ) {
            $deletionBlock.update({
                startX: $config.startX,
                startY: $config.startY,
                nowX: pageX,
                nowY: pageY,
            });
        }
        onMouseClick(event);
    }
}

function canReplaceGeneral(li, co) {
    return (
        $cell[li][co].occupied &&
        $cell[li][co].occupied.isGeneral &&
        $cell[li][co].occupied.width === $config.holding.width &&
        $cell[li][co].occupied.height === $config.holding.height &&
        !$config.holding.isDecoration &&
        !$config.holding.isMiracle &&
        !$config.holding.isProtection &&
        !$config.holding.isGeneral
    );
}

function eDragMap() {
    let target = $$("content");
    let html = $$$("html");
    let startScrollLeft = -1;
    let startScrollTop = -1;
    let startX = -1;
    let startY = -1;
    let nowX = -1;
    let nowY = -1;
    target.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        if ($config.operation !== "null" && !$config.isCtrlDown) return;
        $config.dragMap.isDragging = true;
        startScrollLeft = html.scrollLeft;
        startScrollTop = html.scrollTop;
        startX = event.clientX;
        startY = event.clientY;
        nowX = event.clientX;
        nowY = event.clientY;
    });
    target.addEventListener("mousemove", (event) => {
        if (!$config.dragMap.isDragging) return;
        if ($config.operation !== "null" && !$config.isCtrlDown) return;
        setTimeout(() => {
            nowX = event.clientX;
            nowY = event.clientY;
            html.scrollLeft = startScrollLeft + startX - nowX;
            html.scrollTop = startScrollTop + startY - nowY;
        }, 0);
    });
    target.addEventListener("mouseup", (event) => {
        $config.dragMap.isDragging = false;
    });
}

function ePreviewBuilding() {
    let target = $$("content");
    let preview = $$("preview");
    target.addEventListener("mousemove", (event) => {
        if ($config.isCtrlDown) return;
        if ($config.operation !== "placing-building") return;
        let { li, co } = getPosition(event);
        if (li < 0 || co < 0 || li > 116 || co > 116) return;
        if (canReplaceGeneral(li, co)) {
            preview.style.top = `${($cell[li][co].occupied.line - 1) * $cellSize}px`;
            preview.style.left = `${($cell[li][co].occupied.column - 1) * $cellSize}px`;
            setPreviewMarker($cell[li][co].occupied.marker);
            preview.style.display = "flex";
        } else setupPreview(li, co);
    });
}

function ePlaceBuilding() {
    let target = $$("content");
    let preview = $$("preview");
    let roadHelper = $$("road-helper");
    let roadCache = [];
    let startLi = -1;
    let startCo = -1;
    function placeBuilding(event) {
        if ($config.isCtrlDown) return;
        if (!$config.isMouseDown) return;
        if ($config.operation !== "placing-building") return;
        let { li, co } = getPosition(event);
        if (li < 0 || co < 0 || li > 116 || co > 116) return;
        if (!$cell[li][co].isInRange) return;
        if (canReplaceGeneral(li, co)) {
            let targetLi = $cell[li][co].occupied.line;
            let targetCo = $cell[li][co].occupied.column;
            deleteBuilding(targetLi, targetCo);
            preview.style.display = "none";
            createBuilding(
                Object.assign({}, $config.holding, {
                    line: targetLi,
                    column: targetCo,
                })
            );
        } else {
            let { offsetLi, offsetCo, width, height } = $config.holding;
            for (let i = li - offsetLi; i < li - offsetLi + height; i++) {
                for (let j = co - offsetCo; j < co - offsetCo + width; j++) {
                    if ($cell[i][j].occupied) return;
                }
            }
            preview.style.display = "none";
            createBuilding(
                Object.assign({}, $config.holding, {
                    line: li - $config.holding.offsetLi,
                    column: co - $config.holding.offsetCo,
                })
            );
            if ($config.holding.isRoad) {
                if (event.type === "mousedown") {
                    startLi = li;
                    startCo = co;
                }
                roadCache.push({ li: li - $config.holding.offsetLi, co: co - $config.holding.offsetCo });
                if (li === startLi) {
                    let width = Math.abs(co - startCo) + 1;
                    let left = co > startCo ? startCo : co;
                    roadHelper.style.display = "block";
                    roadHelper.style.width = `${width * 30}px`;
                    roadHelper.style.height = "30px";
                    roadHelper.style.left = `${(left - 1) * 30}px`;
                    roadHelper.style.top = `${(li - 1) * 30}px`;
                } else if (co === startCo) {
                    let height = Math.abs(li - startLi) + 1;
                    let top = li > startLi ? startLi : li;
                    roadHelper.style.display = "block";
                    roadHelper.style.width = "30px";
                    roadHelper.style.height = `${height * 30}px`;
                    roadHelper.style.left = `${(co - 1) * 30}px`;
                    roadHelper.style.top = `${(top - 1) * 30}px`;
                } else {
                    roadHelper.style.display = "none";
                }
            }
        }
    }
    target.addEventListener("mousedown", (event) => placeBuilding(event));
    target.addEventListener("mousemove", (event) => placeBuilding(event));
    target.addEventListener("mouseup", (event) => {
        if ($config.isCtrlDown) return;
        if (!$config.isMouseDown) return;
        if ($config.operation !== "placing-building") return;
        if (!$config.holding.isRoad) return;
        let { li, co } = getPosition(event);
        roadHelper.style.display = "none";
        preview.style.display = "none";
        if (li === startLi) {
            let start = co > startCo ? startCo : co;
            let end = co > startCo ? co : startCo;
            for (let v of roadCache) {
                deleteBuilding(v.li, v.co);
            }
            for (let i = start; i <= end; i++) {
                if (!$cell[li][i].isInRange || $cell[li][i].occupied) continue;
                createBuilding(
                    Object.assign({}, $config.holding, {
                        line: li,
                        column: i,
                    })
                );
            }
        } else if (co === startCo) {
            let start = li > startLi ? startLi : li;
            let end = li > startLi ? li : startLi;
            for (let v of roadCache) {
                deleteBuilding(v.li, v.co);
            }
            for (let i = start; i <= end; i++) {
                if (!$cell[i][co].isInRange || $cell[i][co].occupied) continue;
                createBuilding(
                    Object.assign({}, $config.holding, {
                        line: i,
                        column: co,
                    })
                );
            }
        }
        roadCache = [];
    });
}

function eBlock(operation, buttonID) {
    let target = $$("content");
    let block;
    if (buttonID.indexOf("selection") > -1) {
        block = $selectionBlock;
    } else {
        block = $deletionBlock;
    }
    let startX = -1;
    let startY = -1;
    target.addEventListener("mousedown", (event) => {
        const path = event.path || (event.composedPath && event.composedPath());
        if (path.length > 3 && path[1].id !== buttonID && path[2].id !== buttonID) {
            block.hide();
        }
        if (!$config.isMouseDown) return;
        if ($config.isCtrlDown) return;
        if ($config.operation !== operation) return;
        let { pageX, pageY } = getPosition(event);
        startX = pageX;
        startY = pageY;
    });
    target.addEventListener("mousemove", (event) => {
        const path = event.path || (event.composedPath && event.composedPath());
        if (path.length > 3 && (path[1].id === buttonID || path[2].id === buttonID)) {
            return;
        }
        if (!$config.isMouseDown) return;
        if ($config.isCtrlDown) return;
        if ($config.operation !== operation) return;
        let { pageX, pageY } = getPosition(event);
        block.update({
            startX: startX,
            startY: startY,
            nowX: pageX,
            nowY: pageY,
        });
    });
    target.addEventListener("mouseup", (event) => {
        const path = event.path || (event.composedPath && event.composedPath());
        if (path.length > 3 && (path[1].id === buttonID || path[2].id === buttonID)) {
            return;
        }
        if (!$config.isMouseDown) return;
        if ($config.isCtrlDown) return;
        if ($config.operation !== operation) return;
        let { pageX, pageY } = getPosition(event);
        block.finalize({
            startX: startX,
            startY: startY,
            nowX: pageX,
            nowY: pageY,
        });
    });
}

function eSelectionBlock() {
    eBlock("selecting-building", "selection-operation");
}

function eDeletionBlock() {
    eBlock("deleting-building", "deletion-operation");
}

function assignMouseEvent() {
    document.addEventListener(
        "mousedown",
        () => {
            if (event.button !== 0) return;
            $config.isMouseDown = true;
        },
        true
    );
    document.addEventListener("mousemove", () => minionEyeballs(event));
    document.addEventListener(
        "mouseup",
        () => {
            if (event.button !== 0) return;
            $config.isMouseDown = false;
        },
        false
    );
    eDragMap();
    ePreviewBuilding();
    ePlaceBuilding();
    eSelectionBlock();
    eDeletionBlock();
}

// function eOperation() {
//     let target = $$("content");
//     target.addEventListener("mousedown", (event) => {
//     });
//     target.addEventListener("mousemove", (event) => {
//     });
//     target.addEventListener("mouseup", (event) => {
//     });
// }
