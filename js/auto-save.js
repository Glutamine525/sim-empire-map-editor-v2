function startAutoSave(first) {
    if (first) {
        let initData = generateData();
        initData.timestamp = new Date().valueOf();
        $vm.autoSave.unshift(initData);
    }
    $autoSave = setInterval(() => {
        let data = generateData();
        if ($vm.autoSave.findIndex((v) => v.md5 === data.md5) > -1) {
            return;
        }
        if ($vm.autoSave.length === 10) {
            $vm.autoSave.pop();
        }
        data.timestamp = new Date().valueOf();
        $vm.autoSave.unshift(data);
    }, 1000 * 30);
}

function stopAutoSave() {
    window.clearInterval($autoSave);
}
