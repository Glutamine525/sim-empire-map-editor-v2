class BuildingRange {
    show(config) {
        let { line, column, width, height, range } = config;
        if ($$(`range-${config.id}`)) return;
        let node = document.createElement("div");
        node.className = "range";
        node.id = `range-${config.id}`;
        for (let i = 0; i < height + range * 2; i++) {
            let row = document.createElement("div");
            row.className = "range-row";
            for (let j = 0; j < width + range * 2; j++) {
                let li = i - config.range;
                let co = j - config.range;
                let cell = document.createElement("div");
                cell.className = "range-cell";
                if (!isInRange(li + line, co + column) || !isInBuildingRange(li, co, 0, 0, width, height, range))
                    cell.className += " range-hide";
                row.appendChild(cell);
            }
            node.appendChild(row);
        }
        node.style.top = `${(line - range - 1) * $cellSize}px`;
        node.style.left = `${(column - range - 1) * $cellSize}px`;
        node.style.width = `${(width + range * 2) * $cellSize}px`;
        node.style.height = `${(height + range * 2) * $cellSize}px`;
        $$("range-container").appendChild(node);
        if ($config.operation !== "placing-building") {
            node.style.display = "none";
            $(`#range-${config.id}`).fadeIn(350);
        }
    }

    hide(id) {
        if ($config.operation !== "placing-building") {
            $(`#range-${id}`).fadeOut(150, () => $$("range-container").removeChild($$(`range-${id}`)));
        } else {
            $$("range-container").removeChild($$(`range-${id}`));
        }
    }
}
