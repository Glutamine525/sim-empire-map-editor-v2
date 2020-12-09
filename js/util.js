function $$(id) {
    return document.getElementById(id);
}

function $$$(selector, all) {
    if (!all) return document.querySelector(selector);
    else return document.querySelectorAll(selector);
}

function getColor(property) {
    return document.body.style.getPropertyValue(property);
}

function getBuildingID(bConfig) {
    if (bConfig.id) return bConfig.id;
    if (bConfig.width === bConfig.height) return `${bConfig.line}-${bConfig.column}-${bConfig.width}`;
    else return `${bConfig.line}-${bConfig.column}-${bConfig.width}-${bConfig.height}`;
}

function initCell() {
    $cell = [];
    for (let i = 0; i <= $length; i++) {
        let row = [];
        for (let j = 0; j <= $length; j++) {
            row.push({
                isInRange: isInRange(i, j),
            });
        }
        $cell.push(row);
    }
}

function isBoundary(length, li, co) {
    let halfLength = length / 2;
    let result = false;
    if (li + co === halfLength + 2) result = "top-left";
    if (li + co === halfLength * 3) result = "bottom-right";
    if (li === co - halfLength) result = "top-right";
    if (li === co + halfLength) result = "bottom-left";
    if (li === 1 && co === halfLength + 1) result = "angle-top";
    if (li === halfLength && co === halfLength * 2) result = "angle-right";
    if (li === halfLength * 2 && co === halfLength) result = "angle-bottom";
    if (li === halfLength + 1 && co === 1) result = "angle-left";
    return result;
}

function isInRange(li, co) {
    let halfLength = $length / 2;
    if (li + co <= halfLength + 2) return false;
    if (li + co >= halfLength * 3) return false;
    if (li <= co - halfLength) return false;
    if (li >= co + halfLength) return false;
    return true;
}

function isInBuildingRange(li, co, originLi, originCo, width, height, range) {
    let diff = range - 4;
    li -= originLi;
    co -= originCo;
    if (li + co + range + diff < 0) return false;
    if (li + co > range + diff + width + height - 2) return false;
    if (li < co - (range + diff + width - 1)) return false;
    if (li > co + (range + diff + height - 1)) return false;
    return true;
}

function getAdjacence(li, co) {
    return {
        top: $cell[li - 1][co].occupied,
        right: $cell[li][co + 1].occupied,
        bottom: $cell[li + 1][co].occupied,
        left: $cell[li][co - 1].occupied,
    };
}

function clearBuilding() {
    let building = $$("building");
    $$$("#building > div", true).forEach((v) => {
        building.removeChild(v);
    });
}
