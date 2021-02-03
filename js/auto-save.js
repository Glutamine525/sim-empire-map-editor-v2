function startAutoSave(first) {
    if (first) {
        let initData = generateData(true);
        initData.timestamp = new Date().valueOf();
        initData.img = $$("mini-map").toDataURL("image/png");
        $vm.autoSave.unshift(initData);
    }
    $autoSave = setInterval(() => {
        let data = generateData(true);
        if ($vm.autoSave.findIndex((v) => v.md5 === data.md5) > -1) {
            return;
        }
        if ($vm.autoSave.length === 10) {
            $vm.autoSave.pop();
        }
        data.timestamp = new Date().valueOf();
        data.img = $$("mini-map").toDataURL("image/png");
        localStorage.setItem("autoSave", JSON.stringify(data));
        $vm.autoSave.unshift(data);
        $vm.$message({
            message: "自动保存",
            type: "success",
            duration: 2000,
            offset: $config.topNavHeight + 10,
        });
    }, 1000 * 30);
}

function stopAutoSave() {
    window.clearInterval($autoSave);
}
