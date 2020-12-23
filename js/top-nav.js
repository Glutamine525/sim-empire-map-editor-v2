class TopNav {
    constructor(height) {
        this.height = height;
        this.id = "top-nav";
        $$(this.id).style.height = `${this.height}px`;
    }

    setHeight(height) {
        this.height = height;
        $$(this.id).style.height = `${this.height}px`;
    }

    getHeight() {
        return this.height;
    }

    setWoodNum(woodNum) {
        woodNum = woodNum || $config.woodNum;
        $$("wood-num").innerHTML = woodNum;
    }

    getWoodNum() {
        return +$$("wood-num").innerHTML;
    }

    setCivil(civil) {
        civil = civil || $config.civil;
        $$("civil").innerHTML = civil;
    }

    getCivil() {
        return $$("civil").innerHTML;
    }

    setSelected(selected) {
        selected = selected || $config.selected;
        $$("top-nav-selected").innerHTML = selected;
    }

    setOperation(operation) {
        operation = operation || $config.operation;
        $$("top-nav-holding").innerHTML = operation;
    }
}

function onClickHamButton(checked) {
    if (!checked) {
        // popup
        $config.nowScrollX = $$$("html").scrollLeft;
        $config.nowScrollY = $$$("html").scrollTop;
        $config.isPanelShowed = true;
        $$("editor-container").style.left = "0";
        $$("main-page").style.overflow = "hidden";
        $$("editor").style.top = `${20 + $config.topNavHeight}px`;
        $$("editor").style.height = `calc(100% - ${60 + $config.topNavHeight}px)`;
        let img = new Image();
        img.src = $$("mini-map").toDataURL("image/png");
        img.onload = () => {
            $$("user-sign-map-preview").getContext("2d").drawImage(img, 0, 0);
        };
        $$$("#user-sign-preview .preview-box").appendChild($$("sign"));
        $$("sign").style.top = 0;
        $$("sign").style.left = 0;
        $$("sign").style.width = "3480px";
        $$("sign").style.height = "3480px";
        $$("sign").style.pointerEvents = "none";
        $$("sign").style.position = "absolute";
        $$("user-sign").style.display = "block";
        $$$("#top-nav .top-menu", true).forEach((v) => (v.style.pointerEvents = "none"));
        $$$("#top-nav .toggle--ordinary", true).forEach((v, i) => {
            if (i !== 2) v.style.pointerEvents = "none";
        });
    } else {
        // disappear
        $config.isPanelShowed = false;
        $$("editor-container").style.left = "-100%";
        $$("main-page").style.removeProperty("overflow");
        $$("sign").style.removeProperty("top");
        $$("sign").style.removeProperty("left");
        $$("sign").style.removeProperty("width");
        $$("sign").style.removeProperty("height");
        $$("sign").style.removeProperty("transform");
        $$("sign").style.removeProperty("-ms-transform");
        $$("sign").style.removeProperty("-webkit-transform");
        $$("sign").style.removeProperty("pointer-events");
        $$("sign").style.position = "relative";
        $$("user-sign").style.display = "none";
        $$("map").appendChild($$("sign"));
        $$$("#top-nav .top-menu", true).forEach((v) => (v.style.pointerEvents = "auto"));
        $$$("#top-nav .toggle--ordinary", true).forEach((v) => (v.style.pointerEvents = "auto"));
        window.scrollTo({
            left: $config.nowScrollX,
            top: $config.nowScrollY,
            behavior: "smooth",
        });
    }
    $$("ham-button").classList.toggle("active");
}

function onClickWoodNum(woodNum) {
    $$$("#wood-num + ul li", true).forEach((node) => (node.style.display = "none"));
    if (+woodNum === $topNav.getWoodNum()) return;
    $config.woodNum = woodNum;
    $topNav.setWoodNum();
    clearBuilding();
    $miniMap.clear();
    initCell();
    drawFixedBuilding("water");
    drawFixedBuilding("mountain");
    drawFixedBuilding("road");
    drawFixedBuilding("stone");
    drawFixedBuilding("copper");
    drawFixedBuilding("wood");
    drawFixedBuilding("clay");
    drawFixedBuilding("wharf");
    if (!$config.isNoWood) onClickNoWood(false);
    $vm.onSelectOperation("取消操作", ["取消操作"]);
    $config.roadCache = [];
    $$("road-helper").style.display = "none";
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
    $$("sign-wood-num").innerHTML = `${woodNum}木`;
    resetBuildingCount();
}

function onClickCivil(civil) {
    $$$("#civil + ul li", true).forEach((node) => (node.style.display = "none"));
    if (civil === $topNav.getCivil()) return;
    $config.civil = civil;
    $config.protection = $config.civilBuilding[civil]["防"];
    $config.protectionFull = $config.civilBuilding[civil]["防护"];
    $topNav.setCivil();
    $vm.onChangeCivil();
    $vm.onSelectOperation("取消操作", ["取消操作"]);
    $config.roadCache = [];
    $$("road-helper").style.display = "none";
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
    $$("sign-civil").innerHTML = civil;
    for (let i = 1; i <= $length; i++) {
        for (let j = 1; j <= $length; j++) {
            if ($cell[i][j].occupied && !$cell[i][j].occupied.isFixed) {
                deleteBuilding(i, j);
            }
        }
    }
    resetBuildingCount();
}

function onClickNoWood(isNoWood) {
    $config.isNoWood = isNoWood;
    if (isNoWood) {
        let building = $$("building");
        BuildingFixed["tree"][$config.woodNum - 3].map((v) => {
            let u = v.split("-").map((w) => +w);
            let id = `${v}-1`;
            delete $cell[u[0]][u[1]].occupied;
            if ($$(id)) building.removeChild($$(id));
            $miniMap.setPixel(u[0], u[1], getColor("--color-background-lighter"), 1, 1);
        });
        $$("sign-is-no-wood").innerHTML = "无木";
    } else {
        BuildingFixed["tree"][$config.woodNum - 3].map((v) => {
            let u = v.split("-").map((w) => +w);
            if ($cell[u[0]][u[1]].occupied) {
                deleteBuilding(u[0], u[1], true);
            }
        });
        drawFixedBuilding("tree");
        $$("sign-is-no-wood").innerHTML = "有木";
    }
}

function onClickDisplayMode(isLightMode) {
    $config.isLightMode = isLightMode;
    if (isLightMode) {
        Object.keys(LightMode).forEach((v) => {
            document.body.style.setProperty(`--${v}`, LightMode[v]);
        });
    } else {
        Object.keys(DarkMode).forEach((v) => {
            document.body.style.setProperty(`--${v}`, DarkMode[v]);
        });
    }
    drawCell(getColor("--color-border-lighter"), getColor("--color-background-lighter"));
    $miniMap.onChangeDisplayMode();
    let img = new Image();
    img.src = $$("mini-map").toDataURL("image/png");
    img.onload = () => {
        $$("user-sign-map-preview").getContext("2d").drawImage(img, 0, 0);
    };
}

function onClickMiniMap(show) {
    $config.showMiniMap = show;
    if (show) {
        $$("mini-map").style.display = "block";
        $$("mini-map-focus").style.display = "block";
        $$("mini-map-container").style.width = "182px";
        $$("mini-map-container").style.height = "182px";
        $$("mini-map-container").style.border = "1px solid var(--color-border-darker)";
        $$("mini-map-border").style.border = "1px solid #ffeb3b";
    } else {
        $$("mini-map").style.display = "none";
        $$("mini-map-focus").style.display = "none";
        $$("mini-map-container").style.width = "0";
        $$("mini-map-container").style.height = "0";
        $$("mini-map-container").style.border = "none";
        $$("mini-map-border").style.border = "none";
    }
}

function onClickRotateMap(isMapRotated) {
    $config.isMapRotated = isMapRotated;
    if (isMapRotated) {
        $$("cell").className = "rotate";
        $$("building").className = "rotate";
        $$("mini-map").className = "rotate";
        $$("user-sign-map-preview").className = "rotate";
        $$("content").style.pointerEvents = "none";
    } else {
        $$("cell").className = "";
        $$("building").className = "";
        $$("mini-map").className = "";
        $$("user-sign-map-preview").className = "";
        $$("content").style.pointerEvents = "auto";
    }
}

function updateBuildingCount(diff, building) {
    switch (building.name) {
        case "普通住宅":
            if (building.catagory !== "住宅") return;
            $$("top-nav-residence-0").innerHTML = +$$("top-nav-residence-0").innerHTML + diff;
            break;
        case "高级住宅":
            if (building.catagory !== "住宅") return;
            $$("top-nav-residence-1").innerHTML = +$$("top-nav-residence-1").innerHTML + diff;
            break;
        case "粮仓":
            if (building.catagory !== "市政") return;
            $$("top-nav-warehouse-0").innerHTML = +$$("top-nav-warehouse-0").innerHTML + diff;
            break;
        case "货栈":
            if (building.catagory !== "市政") return;
            $$("top-nav-warehouse-1").innerHTML = +$$("top-nav-warehouse-1").innerHTML + diff;
            break;
    }
}

function resetBuildingCount() {
    $$("top-nav-residence-0").innerHTML = 0;
    $$("top-nav-residence-1").innerHTML = 0;
    $$("top-nav-warehouse-0").innerHTML = 0;
    $$("top-nav-warehouse-1").innerHTML = 0;
}

function minionEyeballs(event) {
    let eyes = document.querySelectorAll("#minion .eye");
    eyes.forEach(function (eye) {
        let x = eye.getBoundingClientRect().left + eye.clientLeft / 2;
        let y = eye.getBoundingClientRect().top + eye.clientTop / 2;
        let radian = Math.atan2(event.clientX - x, event.clientY - y);
        let rot = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = "rotate(" + rot + "deg)";
        eye.style.msTransform = "rotate(" + rot + "deg)";
        eye.style.webkitTransform = "rotate(" + rot + "deg)";
    });
}
