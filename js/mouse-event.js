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
    if (
        $config.operation === "null" &&
        (event.path[0].id === "building" || event.path[1].id === "building" || event.path[2].id === "building")
    ) {
        $config.dragMap.startScrollLeft = $$$("html").scrollLeft;
        $config.dragMap.startScrollTop = $$$("html").scrollTop;
        $config.dragMap.startX = event.clientX;
        $config.dragMap.startY = event.clientY;
        $config.dragMap.nowX = event.clientX;
        $config.dragMap.nowY = event.clientY;
    }
    if (
        $config.isCtrlDown &&
        (event.path[0].id === "building" ||
            event.path[1].id === "building" ||
            event.path[2].id === "building" ||
            event.path[0].id === "building" ||
            event.path[0].id === "preview" ||
            event.path[1].id === "preview")
    ) {
        $config.dragMap.startScrollLeft = $$$("html").scrollLeft;
        $config.dragMap.startScrollTop = $$$("html").scrollTop;
        $config.dragMap.startX = event.clientX;
        $config.dragMap.startY = event.clientY;
        $config.dragMap.nowX = event.clientX;
        $config.dragMap.nowY = event.clientY;
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
    if ($config.isCtrlDown) return;
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
    if ($config.isMouseDown) {
        if (
            ($config.operation === "null" || $config.isCtrlDown) &&
            (event.path[0].id === "building" || event.path[1].id === "building" || event.path[2].id === "building")
        ) {
            let config = $config.dragMap;
            $config.dragMap.nowX = event.clientX;
            $config.dragMap.nowY = event.clientY;
            $$$("html").scrollLeft = config.startScrollLeft + config.startX - config.nowX;
            $$$("html").scrollTop = config.startScrollTop + config.startY - config.nowY;
            return;
        }
    }
    let li = Math.ceil((event.pageY - 72) / 30);
    let co = Math.ceil((event.pageX - 96) / 30);
    if (
        $config.operation === "placing-building" &&
        (event.path[0].id === "building" || event.path[0].id === "preview" || event.path[1].id === "preview")
    ) {
        setupPreview(li, co);
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
