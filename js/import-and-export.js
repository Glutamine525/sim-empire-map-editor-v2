function toggleWaiting(show) {
    if (show) {
        $$("ghost-container").style.display = "flex";
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
            if (
                data.woodNum === undefined ||
                data.civil === undefined ||
                data.isNoWood === undefined ||
                data.roads === undefined ||
                data.buildings === undefined
            ) {
                $vm.$message({
                    message: "该文件不是地图数据，导入失败！",
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            loadData(data);
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
    let data = generateData();
    download(new Blob([stringToBase64(JSON.stringify(data))]), `${getFileName()}.txt`);
}

function loadData(data, isAutoSave) {
    stopAutoSave();
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
    $$("toggle-no-wood").checked = data.isNoWood;
    if (!isAutoSave) {
        $vm.specialBuildingList = data.specialBuildings;
        $vm.userSign = data.userSign;
        $vm.radioLabelUserSign = $vm.userSign[0].name;
        $vm.radioLabelUserSignLine = "第1行";
        $vm.radioLabelUserSignElement = "第1个";
        $vm.radioIndexUserSign = 0;
        $vm.radioIndexUserSignLine = 0;
        $vm.radioIndexUserSignElement = 0;
    }
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
    startAutoSave();
}

function generateData(isAutoSave) {
    let data = {};
    data.woodNum = $config.woodNum;
    data.civil = $config.civil;
    data.isNoWood = $config.isNoWood;
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
    if (!isAutoSave) {
        data.specialBuildings = $vm.specialBuildingList;
        data.userSign = $vm.userSign;
    }
    data.md5 = md5(JSON.stringify(data));
    return data;
}

function importNewCivil() {
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
            if (
                data["名称"] === undefined ||
                data["住宅"] === undefined ||
                data["农业"] === undefined ||
                data["工业"] === undefined ||
                data["商业"] === undefined ||
                data["市政"] === undefined ||
                data["文化"] === undefined ||
                data["宗教"] === undefined ||
                data["军事"] === undefined ||
                data["美化"] === undefined ||
                data["奇迹"] === undefined ||
                data["防护"] === undefined ||
                data["防"] === undefined
            ) {
                $vm.$message({
                    message: "该文件不是文明建筑数据，导入失败！",
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            if (data["名称"] in $config.civilBuilding) {
                $vm.$message({
                    message: "已经导入该文明数据，导入失败！",
                    type: "error",
                    duration: 5000,
                    offset: $config.topNavHeight + 10,
                });
                return;
            }
            data["通用"] = $config.civilBuilding["中国"]["通用"];
            $config.civilBuilding[data["名称"]] = data;
            let li = document.createElement("li");
            let a = document.createElement("a");
            li.className = "top-menu-item-active";
            a.value = data["名称"];
            a.innerHTML = data["名称"];
            a.onclick = "onClickCivil(this.getAttribute('value'))";
            li.appendChild(a);
            $$$("#top-nav-controller a#civil + ul.top-sub-menu").appendChild(li);
            onClickCivil(data["名称"]);
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

function exportNewCivil(civil, resicenceReq) {
    let result = {};
    result["名称"] = civil["名称"];
    result["防护"] = [];
    result["防"] = [];
    for (let k in civil) {
        if (k === "名称") continue;
        result[k] = [];
        let index = 0;
        for (let v of civil[k]) {
            let tmp = {};
            tmp.name = v.name;
            tmp.text = v.text;
            tmp.width = v.width;
            tmp.height = v.height;
            tmp.range = v.range;
            tmp.color = v.color;
            tmp.backgroundColor = v.backgroundColor;
            tmp.borderColor = v.borderColor;
            result[k].push(tmp);
            if (v.isProtection) {
                result["防护"].push(v.name);
                result["防"].push(v.text);
            }
            if (k === "住宅") {
                result[`${v.name}需求`] = { 商业: [], 市政: [], 文化: [], 宗教: [] };
                for (let w of resicenceReq[index]) {
                    let splitter = w.indexOf("-");
                    let catagory = w.substring(0, splitter);
                    let name = w.substring(splitter + 1);
                    if (civil[catagory].find((value) => value.name === name).isProtection) continue;
                    result[`${v.name}需求`][catagory].push(name);
                }
            }
            index++;
        }
    }
    result.md5 = md5(JSON.stringify(result));
    download(new Blob([stringToBase64(JSON.stringify(result))]), `${result["名称"]}-建筑数据-${getPostfixName()}.txt`);
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
        // $$("download").setAttribute("href", url);
        // return;
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
    }, 0);
}

function download(blob, fileName) {
    $$("download").setAttribute("href", window.URL.createObjectURL(blob));
    $$("download").setAttribute("download", fileName);
    $$("download").click();
}

function getPostfixName() {
    let time = new Date();
    let fullYear = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let randoms = Math.random() + "";
    let numberFileName = fullYear + "" + month + date + randoms.slice(3, 10);
    return numberFileName;
}

function getFileName() {
    return `${$config.civil}-${$config.woodNum}木-${$config.isNoWood ? "无木" : "有木"}-${getPostfixName()}`;
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
            "padding-top",
            "padding-right",
            "padding-bottom",
            "padding-left",
            "margin-top",
            "margin-right",
            "margin-bottom",
            "margin-left",
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
            "border-top-color",
            "border-right-color",
            "border-bottom-color",
            "border-left-color",
            "border-top-width",
            "border-right-width",
            "border-bottom-width",
            "border-left-width",
            "border-top-style",
            "border-right-style",
            "border-bottom-style",
            "border-left-style",
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
