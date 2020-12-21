function toggleWaiting(show) {
    if (show) {
        // $$("top-nav").style.filter = "blur(10px)";
        // $$("main-page").style.filter = "blur(10px)";
        $$("ghost-container").style.display = "flex";
        $$("loading-background-container").style.display = "block";
    } else {
        // $$("top-nav").style.filter = "none";
        // $$("main-page").style.filter = "none";
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
            // let data = JSON.parse(byteToString(event.target.result.split(" ").map((v) => +v)));
            let data = JSON.parse(base64ToString(event.target.result));
            let dataMD5 = data.md5;
            delete data.md5;
            if (dataMD5 !== md5(JSON.stringify(data))) {
                $vm.$message({
                    message: "该数据已被损坏，导入失败！",
                    type: "error",
                    duration: 3000,
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
                createBuilding({
                    line: v.line,
                    column: v.column,
                    width: v.width,
                    height: v.height,
                    text: v.text,
                    name: v.name,
                    catagory: v.catagory,
                    color: v.color,
                    background: v.background,
                    borderColor: v.borderColor,
                    borderWidth: v.borderWidth,
                    range: v.range,
                    fontSize: v.fontSize,
                    isMiracle: v.isMiracle,
                    isDecoration: v.isDecoration,
                    isProtection: v.isProtection,
                    isRoad: v.isRoad,
                    isGeneral: v.isGeneral,
                });
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
    // download(new Blob([stringToByte(JSON.stringify(data)).join(" ")]), `${getDataFileName()}.txt`);
    download(new Blob([stringToBase64(JSON.stringify(data))]), `${getDataFileName()}.txt`);
}

function screenshot(scale, withSign) {
    toggleWaiting(true);
    console.time("sreenshot");
    setTimeout(function () {
        $config.operation = "null";
        $config.holding = {};
        $topNav.setOperation("无");
        $config.roadCache = [];
        $$("cell").style.display = "none";
        $$("cell-helper").style.display = "block";
        $$("road-helper").style.display = "none";
        $$("preview").style.display = "none";
        $selectionBlock.hide();
        $deletionBlock.hide();
        let signScale = "";
        if (withSign) {
            signScale = $$("sign").style.transform;
            $$("sign").style.removeProperty("transform");
            $$("map").appendChild($$("sign"));
        }
        let config = {
            useCORS: true,
            width: $length * $cellSize,
            height: $length * $cellSize,
            scale: scale,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
            backgroundColor: getColor("--color-background-darker"),
        };
        html2canvas($$("map"), config).then((canvas) => {
            console.timeEnd("sreenshot");
            canvas.toBlob((blob) => {
                console.time("download");
                download(blob, `${getFileName()}.png`);
                $$("cell").style.display = "block";
                $$("cell-helper").style.display = "none";
                toggleWaiting(false);
                console.timeEnd("download");
                if (withSign) {
                    $$("sign").style.transform = signScale;
                    $$$("#user-sign-preview .preview-box").appendChild($$("sign"));
                }
            });
        });
    }, 100);
}

function download(blob, fileName) {
    $$("download").setAttribute("href", URL.createObjectURL(blob));
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
    let decode = atob(base64);
    let str = decodeURI(decode);
    return str;
}