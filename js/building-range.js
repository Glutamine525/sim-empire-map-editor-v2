class BuildingRange {
    show(config) {
        if ($config.dragMap.isDragging) return;
        let { line, column, width, height, range } = config;
        if ($$(`range-${config.id}`)) return;
        let frag = document.createDocumentFragment();
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
                if (
                    !$cell[li + line] ||
                    !$cell[li + line][co + column] ||
                    !$cell[li + line][co + column].isInRange ||
                    !isInBuildingRange(li, co, 0, 0, width, height, range)
                )
                    cell.className += " range-hide";
                else if (isInBuildingRange(li, co, 0, 0, width, height, range)) {
                    cell.style.background = config.background + "6f";
                    cell.style.borderColor = config.background;
                    if (row.children[j - 1] && row.children[j - 1].className === "range-cell") {
                        row.children[j - 1].style.borderRight = "none";
                        cell.style.borderLeft = "none";
                    }
                    if (
                        node.children[i - 1] &&
                        node.children[i - 1].children[j] &&
                        node.children[i - 1].children[j].className === "range-cell"
                    ) {
                        node.children[i - 1].children[j].style.borderBottom = "none";
                        cell.style.borderTop = "none";
                    }
                }
                row.appendChild(cell);
            }
            node.appendChild(row);
        }
        node.style.top = `${(line - range - 1) * $cellSize}px`;
        node.style.left = `${(column - range - 1) * $cellSize}px`;
        node.style.width = `${(width + range * 2) * $cellSize}px`;
        node.style.height = `${(height + range * 2) * $cellSize}px`;
        frag.appendChild(node);
        $$("range-container").appendChild(frag);
        if ($config.operation === "null") {
            node.style.display = "none";
            $(`#range-${config.id}`).fadeIn(350);
        }
    }

    hide(id) {
        if ($$(`range-${id}`)) {
            if ($config.operation === "null") {
                $(`#range-${id}`).fadeOut(150, () => $$("range-container").removeChild($$(`range-${id}`)));
            } else {
                $$("range-container").removeChild($$(`range-${id}`));
            }
        }
    }
}
