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

function getBuildingID(config) {
    if (config.width === config.height) return `${config.line}-${config.column}-${config.width}`;
    else return `${config.line}-${config.column}-${config.width}-${config.height}`;
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

function isBoundary(li, co) {
    let halfLength = $length / 2;
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
    building.innerHTML = "";
}

function parseID(id) {
    return id.split("-").map((v) => +v);
}

function copyText(text) {
    let textarea = document.createElement("textarea");
    let currentFocus = document.activeElement;
    let toolBoxwrap = $$("top-nav");
    toolBoxwrap.appendChild(textarea);
    textarea.value = text;
    textarea.focus();
    if (textarea.setSelectionRange) {
        textarea.setSelectionRange(0, textarea.value.length);
    } else {
        textarea.select();
    }
    let flag;
    try {
        flag = document.execCommand("copy");
    } catch (eo) {
        flag = false;
    }
    toolBoxwrap.removeChild(textarea);
    currentFocus.focus();
    return flag;
}

function onClickLink(link) {
    if (copyText(link)) {
        $vm.$message({
            message: "已复制该链接。",
            type: "success",
            duration: 2000,
            offset: $config.topNavHeight + 10,
        });
    } else {
        $vm.$message({
            message: "复制链接失败。",
            type: "error",
            duration: 2000,
            offset: $config.topNavHeight + 10,
        });
    }
}

function setCookie(name, value) {
    let days = 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    let arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
}

function delCookie(name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function addZero(m) {
    return m < 10 ? "0" + m : m;
}

function formatTimestamp(timestamp) {
    let time = new Date(timestamp);
    let m = addZero(time.getMonth() + 1);
    let d = addZero(time.getDate());
    let h = addZero(time.getHours());
    let mm = addZero(time.getMinutes());
    let s = addZero(time.getSeconds());
    return `${m}月${d}日 ${h}:${mm}:${s}`;
}
