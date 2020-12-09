function onMouseClick(event) {
    let li = Math.ceil((event.pageY - 72) / 30);
    let co = Math.ceil((event.pageX - 96) / 30);
    if ($config.operation === "placing-building" && $$("preview").style.display === "flex") {
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
        for (let i = li - offsetLi; i < li - offsetLi + height; i++) {
            for (let j = co - offsetCo; j < co - offsetCo + width; j++) {
                if (!isInRange(li, co) || $cell[i][j].occupied) {
                    preview.style.display = "none";
                    return;
                }
            }
        }
        preview.style.display = "flex";
        preview.style.top = `${(li - 1 - $config.holding.offsetLi) * $cellSize}px`;
        preview.style.left = `${(co - 1 - $config.holding.offsetCo) * $cellSize}px`;
    } else {
        preview.style.display = "none";
    }
    if ($config.isMouseDown) {
        onMouseClick(event);
    }
}
