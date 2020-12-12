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

onClickWoodNum = (woodNum) => {
    $$$("#wood-num + ul li", true).forEach((node) => (node.style.display = "none"));
    if (+woodNum === $topNav.getWoodNum()) return;
    $config.woodNum = woodNum;
    $topNav.setWoodNum();
    clearBuilding();
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
};

onClickCivil = (civil) => {
    $$$("#civil + ul li", true).forEach((node) => (node.style.display = "none"));
    if (civil === $topNav.getCivil()) return;
    $config.civil = civil;
    $config.protection = $config.civilBuilding[civil]["防"];
    $topNav.setCivil();
    $sideNavVue.onChangeCivil();
};

onClickDisplayMode = (isLightMode) => {
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
};

onClickNoWood = (isNoWood) => {
    $config.isNoWood = isNoWood;
    if (isNoWood) {
        let building = $$("building");
        BuildingFixed["tree"][$config.woodNum - 3].map((v) => {
            let unit = v.split("-").map((w) => +w);
            let id = `${v}-1`;
            delete $cell[unit[0]][unit[1]].occupied;
            building.removeChild($$(id));
        });
    } else {
        BuildingFixed["tree"][$config.woodNum - 3].map((v) => {
            let unit = v.split("-").map((w) => +w);
            if ($cell[unit[0]][unit[1]].occupied) {
                deleteBuilding(unit[0], unit[1], true);
            }
        });
        drawFixedBuilding("tree");
    }
};

function minionEyeballs(event) {
    let eyes = document.querySelectorAll("#minion .eye");
    eyes.forEach(function (eye) {
        let x = eye.getBoundingClientRect().left + eye.clientLeft / 2;
        let y = eye.getBoundingClientRect().top + eye.clientTop / 2;
        let radian = Math.atan2(event.clientX - x, event.clientY - y);
        let rot = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = "rotate(" + rot + "deg)";
    });
}
