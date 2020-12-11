function onMouseDown(event) {
    // console.log("down", event);
    $config.isMouseDown = true;
    $config.startX = event.pageX - 96;
    $config.startY = event.pageY - 72;

    if (
        event.path.length > 3 &&
        event.path[1].id !== "selection-operation" &&
        event.path[2].id !== "selection-operation"
    ) {
        $selectionBlock.hide();
    }
    if (
        event.path.length > 3 &&
        event.path[1].id !== "deletion-operation" &&
        event.path[2].id !== "deletion-operation"
    ) {
        $deletionBlock.hide();
    }
}

function onMouseUp(event) {
    // console.log("up", event);
    $config.isMouseDown = false;
    if (
        $config.operation === "selecting-building" &&
        event.path.length > 3 &&
        event.path[1].id !== "selection-operation" &&
        event.path[2].id !== "selection-operation"
    ) {
        $selectionBlock.finalize({
            startX: $config.startX,
            startY: $config.startY,
            nowX: event.pageX - 96,
            nowY: event.pageY - 72,
        });
    }
    if (
        $config.operation === "deleting-building" &&
        event.path.length > 3 &&
        event.path[1].id !== "deletion-operation" &&
        event.path[2].id !== "deletion-operation"
    ) {
        $deletionBlock.finalize({
            startX: $config.startX,
            startY: $config.startY,
            nowX: event.pageX - 96,
            nowY: event.pageY - 72,
        });
    }
}

function onMouseClick(event) {
    let li = Math.ceil((event.pageY - 72) / 30);
    let co = Math.ceil((event.pageX - 96) / 30);
    if ($config.operation === "placing-building" && $$("preview").style.display === "flex") {
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
    }
}

function onMouseMove(event) {
    let li = Math.ceil((event.pageY - 72) / 30);
    let co = Math.ceil((event.pageX - 96) / 30);
    if (
        (event.path[0].id === "building" || event.path[0].id === "preview" || event.path[1].id === "preview") &&
        $config.operation === "placing-building"
    ) {
        let preview = $$("preview");
        if ($config.newHold) {
            $config.newHold = false;
            let previewText = $$("preview-text");
            preview.style.width = `${$config.holding.width * $cellSize}px`;
            preview.style.height = `${$config.holding.height * $cellSize}px`;
            preview.style.color = $config.holding.color;
            preview.style.background = $config.holding.background;
            preview.style.borderColor = $config.holding.borderColor;
            preview.style.borderWidth = `${$config.holding.borderWidth}px`;
            previewText.innerHTML = $config.holding.text;
            $config.holding.offsetLi = Math.floor(($config.holding.height - 1) / 2);
            $config.holding.offsetCo = Math.floor(($config.holding.width - 1) / 2);
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
        if (protectionRecord.length) {
            $$("preview-marker").style.display = "block";
            $$("preview-marker").innerHTML = protectionRecord.length;
        } else {
            $$("preview-marker").style.display = "none";
        }
        preview.style.display = "flex";
        preview.style.top = `${(li - 1 - $config.holding.offsetLi) * $cellSize}px`;
        preview.style.left = `${(co - 1 - $config.holding.offsetCo) * $cellSize}px`;
    } else {
        preview.style.display = "none";
    }
    if ($config.isMouseDown) {
        if (
            $config.operation === "selecting-building" &&
            event.path.length > 2 &&
            (event.path[0].id === "building" ||
                event.path[0].id === "selection-block" ||
                event.path[0].className.indexOf("building") > -1 ||
                event.path[1].className.indexOf("building") > -1)
        ) {
            $selectionBlock.update({
                startX: $config.startX,
                startY: $config.startY,
                nowX: event.pageX - 96,
                nowY: event.pageY - 72,
            });
        }
        if (
            $config.operation === "deleting-building" &&
            event.path.length > 2 &&
            (event.path[0].id === "building" ||
                event.path[0].id === "deletion-block" ||
                event.path[0].className.indexOf("building") > -1 ||
                event.path[1].className.indexOf("building") > -1)
        ) {
            $deletionBlock.update({
                startX: $config.startX,
                startY: $config.startY,
                nowX: event.pageX - 96,
                nowY: event.pageY - 72,
            });
        }
        onMouseClick(event);
    }
}
