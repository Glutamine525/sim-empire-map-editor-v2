function toggleWaiting(show) {
    if (show) {
        $$("ghost-container").style.display = "flex";
        if ($config.core === "safari") $$("ghost-container").style.display = "-webkit-box";
        $$("loading-background-container").style.display = "block";
    } else {
        $$("ghost-container").style.display = "none";
        $$("loading-background-container").style.display = "none";
    }
}

function importData() {
    let file = $$("load-file");
    file.click();
    file.onchange = () => {
        let fr = new FileReader();
        fr.onload = (event) => {
            let base64 = base64ToString(event.target.result);
            if (!base64) {
                $vm.$message({
                    message: "该数据已被损坏 或 不是txt文件，导入失败！",
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            let data = JSON.parse(base64);
            let dataMD5 = data.md5;
            delete data.md5;
            if (dataMD5 !== md5(JSON.stringify(data))) {
                $vm.$message({
                    message: "该数据已被损坏，导入失败！",
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            for (let i = 1; i <= $length; i++) {
                for (let j = 1; j <= $length; j++) {
                    if ($cell[i][j].occupied && !$cell[i][j].occupied.isFixed) {
                        deleteBuilding(i, j);
                    }
                }
            }
            onClickWoodNum(data.woodNum);
            onClickCivil(data.civil);
            onClickNoWood(data.isNoWood);
            onClickDisplayMode(data.isLightMode);
            onClickMiniMap(data.showMiniMap);
            $$("toggle-no-wood").checked = data.isNoWood;
            $$("toggle-display-mode").checked = data.isLightMode;
            $$("toggle-mini-map").checked = data.showMiniMap;
            $vm.specialBuildingList = data.specialBuildings;
            $vm.userSign = data.userSign;
            $vm.radioLabelUserSign = $vm.userSign[0].name;
            $vm.radioLabelUserSignLine = "第1行";
            $vm.radioLabelUserSignElement = "第1个";
            $vm.radioIndexUserSign = 0;
            $vm.radioIndexUserSignLine = 0;
            $vm.radioIndexUserSignElement = 0;
            for (let v of data.roads) {
                createBuilding({
                    line: v.line,
                    column: v.column,
                    width: 1,
                    height: 1,
                    text: "",
                    range: 0,
                    borderWidth: 1,
                    color: "var(--color-black)",
                    background: BuildingFixed.color_road,
                    borderColor: "var(--color-border-base)",
                    isRoad: true,
                });
            }
            for (let v of data.buildings) {
                createBuilding(v);
            }
            $vm.$message({
                message: "已成功导入数据！",
                type: "success",
                duration: 3000,
                offset: $config.topNavHeight + 10,
            });
        };
        fr.readAsText(file.files[0]);
        let tmp = document.createElement("input");
        tmp.type = "file";
        tmp.accept = ".txt";
        tmp.id = "load-file";
        tmp.style.display = "none";
        file.replaceWith(tmp);
    };
}

function exportData() {
    let data = {};
    data.woodNum = $config.woodNum;
    data.civil = $config.civil;
    data.isNoWood = $config.isNoWood;
    data.isLightMode = $config.isLightMode;
    data.showMiniMap = $config.showMiniMap;
    let buildings = [];
    let roads = [];
    for (let i = 1; i <= $length; i++) {
        for (let j = 1; j <= $length; j++) {
            if (!$cell[i][j].occupied) continue;
            if ($cell[i][j].occupied.isFixed) continue;
            let cell = $cell[i][j].occupied;
            if (cell.isRoad) {
                roads.push({ line: cell.line, column: cell.column });
            } else if (buildings.findIndex((v) => v.column === cell.column && v.line === cell.line) === -1) {
                buildings.push({
                    line: cell.line,
                    column: cell.column,
                    width: cell.width,
                    height: cell.height,
                    text: cell.text,
                    name: cell.name,
                    catagory: cell.catagory,
                    color: cell.color,
                    background: cell.background,
                    borderColor: cell.borderColor,
                    borderWidth: cell.borderWidth,
                    range: cell.range,
                    fontSize: cell.fontSize,
                    isMiracle: cell.isMiracle,
                    isDecoration: cell.isDecoration,
                    isProtection: cell.isProtection,
                    isGeneral: cell.isGeneral,
                });
            }
        }
    }
    data.buildings = buildings;
    data.roads = roads;
    data.specialBuildings = $vm.specialBuildingList;
    data.userSign = $vm.userSign;
    data.md5 = md5(JSON.stringify(data));
    download(new Blob([stringToBase64(JSON.stringify(data))]), `${getDataFileName()}.txt`);
}

function screenshot(withSign) {
    toggleWaiting(true);
    setTimeout(function () {
        console.time("sreenshot");
        $config.holding = {};
        $topNav.setOperation("无");
        $config.roadCache = [];
        $$("road-helper").style.display = "none";
        $$("preview").style.display = "none";
        $selectionBlock.hide();
        $deletionBlock.hide();
        let signScale = "";
        if (withSign) {
            signScale = $$("sign").style.transform || $$("sign").style.msTransform || $$("sign").style.webkitTransform;
            $$("sign").style.removeProperty("transform");
            $$("sign").style.removeProperty("-ms-transform");
            $$("sign").style.removeProperty("-webkit-transform");
            $$("map").appendChild($$("sign"));
        }
        const html = `
            <svg width="3480" height="3480" xmlns="http://www.w3.org/2000/svg">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml">
                        ${html2Text($$("map"))}
                    </div>
                </foreignObject>
            </svg>`;
        const svg = new Blob([html], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = window.URL.createObjectURL(svg);
        let img = new Image();
        img.src = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(html)));
        img.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = $cellSize * $length * 1.5;
            canvas.height = $cellSize * $length * 1.5;
            let ctx = canvas.getContext("2d");
            ctx.fillStyle = getColor("--color-background-darker");
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if ($config.isMapRotated) {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(Math.PI / 4);
                ctx.drawImage($$("cell"), -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            } else ctx.drawImage($$("cell"), 0, 0, canvas.width, canvas.height);
            if ($config.isMapRotated) {
                ctx.rotate(-Math.PI / 4);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                console.timeEnd("sreenshot");
                console.time("download");
                download(blob, `${getFileName()}.jpg`);
                toggleWaiting(false);
                console.timeEnd("download");
                if (withSign) {
                    $$("sign").style.transform = signScale;
                    $$("sign").style.msTransform = signScale;
                    $$("sign").style.webkitTransform = signScale;
                    $$$("#user-sign-preview .preview-box").appendChild($$("sign"));
                }
            }, "image/jpeg");
        };
    }, 10);
}

function download(blob, fileName) {
    $$("download").setAttribute("href", window.URL.createObjectURL(blob));
    $$("download").setAttribute("download", fileName);
    $$("download").click();
}

function getFileName() {
    let time = new Date();
    let fullYear = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let randoms = Math.random() + "";
    let numberFileName = fullYear + "" + month + date + randoms.slice(3, 10);
    return numberFileName;
}

function getDataFileName() {
    return `模拟帝国地图编辑器-${$config.civil}-${$config.woodNum}木-${getFileName()}`;
}

function stringToBase64(str) {
    let encode = encodeURI(str);
    let base64 = btoa(encode);
    return base64;
}

function base64ToString(base64) {
    try {
        let decode = atob(base64);
        let str = decodeURI(decode);
        return str;
    } catch (e) {
        return false;
    }
}

const tags = ["br", "hr", "img", "input", "param", "meta", "link"];

function separatorToCamelNaming(name) {
    const nameArr = name.split(/-/g);
    let newName = "";
    for (let i = 0, j = nameArr.length; i < j; i++) {
        const item = nameArr[i];
        if (i === 0) {
            newName += item;
        } else {
            newName += `${item[0].toLocaleUpperCase()}${item.substr(1)}`;
        }
    }
    return newName;
}

function style2String(node, styleNames) {
    const css = window.getComputedStyle(node);
    const style = [];
    for (const name of styleNames) {
        const fName = separatorToCamelNaming(name);
        let value = css[fName];
        if (fName === "fontFamily") {
            value = value.replace(/"/g, "");
        } else if (fName === "backgroundImage") {
            value = value.replace(/"/g, "'");
        }
        style.push(`${name}: ${value};`);
    }
    return style.join(" ");
}

function html2Text(node) {
    let txt = "";
    if (node.nodeName !== "#text") {
        const nodeName = node.nodeName.toLowerCase();
        const style = style2String(node, [
            "box-sizing",
            "padding",
            "margin",
            "z-index",
            "position",
            "display",
            "top",
            "left",
            "width",
            "height",
            "font-size",
            "font-family",
            "font-weight",
            "color",
            "content",
            "text-align",
            "text-shadow",
            "background-color",
            "background-image",
            "border-radius",
            "border-top",
            "border-right",
            "border-bottom",
            "border-left",
            "transform",
            "transform-origin",
            "opacity",
        ]);
        txt += `<${nodeName} style="${style}">`;
        if (!tags.includes(nodeName)) {
            const childNodes = node.childNodes;
            for (let i = 0, j = childNodes.length; i < j; i++) {
                txt += html2Text(childNodes[i]);
            }
            txt += `</${nodeName}>`;
        }
    } else {
        txt += node.data;
    }
    return txt;
}
