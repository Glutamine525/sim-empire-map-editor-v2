function onKeyDown(event) {
    if ($config.isPanelShowed) return;
    if (event.keyCode === 17) {
        $config.isCtrlDown = true;
    }
    if (event.keyCode === 32) {
        event.preventDefault();
    }
}

function onKeyUp(event) {
    if (event.keyCode === 17) {
        $config.isCtrlDown = false;
        return;
    }
    if ($config.isPanelShowed) return;
    let ctrlKey = event.ctrlKey || event.metaKey;
    if (ctrlKey && event.keyCode === 67) {
        if (!Object.keys($config.lastHover).length) {
            $vm.$message({
                message: "没有可以复制的建筑！",
                type: "error",
                duration: 3000,
                offset: $config.topNavHeight + 10,
            });
            return;
        }
        let newHolding = {};
        newHolding.name = $config.lastHover.name;
        newHolding.catagory = $config.lastHover.catagory;
        newHolding.text = $config.lastHover.text;
        newHolding.width = $config.lastHover.width;
        newHolding.height = $config.lastHover.height;
        newHolding.range = $config.lastHover.range;
        newHolding.color = $config.lastHover.color;
        newHolding.background = $config.lastHover.background;
        newHolding.borderColor = $config.lastHover.borderColor;
        newHolding.borderWidth = $config.lastHover.borderWidth;
        newHolding.fontSize = $config.lastHover.fontSize;
        newHolding.isPreview = true;
        newHolding.isProtection = $config.civilBuilding[$config.civil]["防"].indexOf($config.lastHover.text) > -1;
        newHolding.isDecoration = $config.lastHover.isDecoration;
        newHolding.isGeneral = $config.lastHover.isGeneral;
        newHolding.isMiracle = $config.lastHover.isMiracle;
        $config.operation = "placing-building";
        $config.holding = newHolding;
        $config.newHold = true;
        $topNav.setOperation(newHolding.catagory + "-" + newHolding.name);
        $vm.$message({
            message: "已复制该建筑。",
            type: "success",
            duration: 3000,
            offset: $config.topNavHeight + 10,
        });
        return;
    }
    if (event.keyCode === 32) {
        $vm.onSelectOperation("取消操作", ["取消操作"]);
    } else if (event.keyCode === 81) {
        $vm.onSelectBuilding("2x2建筑", ["通用", "2x2建筑"]);
    } else if (event.keyCode === 87) {
        $vm.onSelectBuilding("3x3建筑", ["通用", "3x3建筑"]);
    } else if (event.keyCode === 69) {
        $vm.onSelectBuilding("4x4建筑", ["通用", "4x4建筑"]);
    } else if (event.keyCode === 82) {
        $vm.onSelectBuilding("5x5建筑", ["通用", "5x5建筑"]);
    } else if (event.keyCode === 65) {
        $vm.onSelectOperation("道路", ["道路"]);
    } else if (event.keyCode === 83) {
        $vm.onSelectOperation("选中建筑", ["选中建筑"]);
    } else if (event.keyCode === 68) {
        $vm.onSelectOperation("删除建筑", ["删除建筑"]);
    } else if (event.keyCode === 90) {
        if ($config.protectionFull.length > 0)
            $vm.onSelectBuilding($config.protectionFull[0], ["市政", $config.protectionFull[0]]);
        else return;
    } else if (event.keyCode === 88) {
        if ($config.protectionFull.length > 1)
            $vm.onSelectBuilding($config.protectionFull[1], ["市政", $config.protectionFull[1]]);
        else return;
    } else if (event.keyCode === 67) {
        if ($config.protectionFull.length > 2)
            $vm.onSelectBuilding($config.protectionFull[2], ["市政", $config.protectionFull[2]]);
        else return;
    } else if (event.keyCode === 86) {
        if ($config.protectionFull.length > 3)
            $vm.onSelectBuilding($config.protectionFull[3], ["市政", $config.protectionFull[3]]);
        else return;
    } else if (event.keyCode === 49) {
        if ($vm.$data.buildingInfo["商业"].length > 0)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][0].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][0].name,
            ]);
        else return;
    } else if (event.keyCode === 50) {
        if ($vm.$data.buildingInfo["商业"].length > 1)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][1].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][1].name,
            ]);
        else return;
    } else if (event.keyCode === 51) {
        if ($vm.$data.buildingInfo["商业"].length > 2)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][2].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][2].name,
            ]);
        else return;
    } else if (event.keyCode === 52) {
        if ($vm.$data.buildingInfo["商业"].length > 3)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][3].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][3].name,
            ]);
        else return;
    } else if (event.keyCode === 53) {
        if ($vm.$data.buildingInfo["商业"].length > 4)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][4].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][4].name,
            ]);
        else return;
    } else if (event.keyCode === 54) {
        if ($vm.$data.buildingInfo["商业"].length > 5)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][5].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][5].name,
            ]);
        else return;
    } else if (event.keyCode === 55) {
        if ($vm.$data.buildingInfo["商业"].length > 6)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][6].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][6].name,
            ]);
        else return;
    } else if (event.keyCode === 56) {
        if ($vm.$data.buildingInfo["商业"].length > 7)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][7].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][7].name,
            ]);
        else return;
    } else if (event.keyCode === 57) {
        if ($vm.$data.buildingInfo["商业"].length > 8)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][8].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][8].name,
            ]);
        else return;
    } else if (event.keyCode === 48) {
        if ($vm.$data.buildingInfo["商业"].length > 9)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][9].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][9].name,
            ]);
        else return;
    } else if (event.keyCode === 189) {
        if ($vm.$data.buildingInfo["商业"].length > 10)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][10].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][10].name,
            ]);
        else return;
    } else if (event.keyCode === 187) {
        if ($vm.$data.buildingInfo["商业"].length > 11)
            $vm.onSelectBuilding($vm.$data.buildingInfo["商业"][11].name, [
                "商业",
                $vm.$data.buildingInfo["商业"][11].name,
            ]);
        else return;
    } else {
        return;
    }
    $config.roadCache = [];
    $$("road-helper").style.display = "none";
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
}
