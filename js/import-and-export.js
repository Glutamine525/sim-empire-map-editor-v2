function toggleWaiting(show) {
    if (show) {
        $$("top-nav").style.filter = "blur(10px)";
        $$("main-page").style.filter = "blur(10px)";
    } else {
        $$("top-nav").style.filter = "none";
        $$("main-page").style.filter = "none";
    }
}

function exportData() {}

function importData() {}

function screenshot() {
    toggleWaiting(true);
    $config.operation = "null";
    $config.holding = {};
    $topNav.setOperation("无");
    $config.roadCache = [];
    $$("road-helper").style.display = "none";
    $$("preview").style.display = "none";
    $selectionBlock.hide();
    $deletionBlock.hide();
    let config = {
        useCORS: true,
        width: $length * $cellSize,
        height: $length * $cellSize,
        scale: 2,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        backgroundColor: getColor("--color-background-darker"),
    };
    html2canvas($$("map"), config).then((canvas) => {
        canvas.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            $$("download").setAttribute("href", url);
            $$("download").setAttribute("download", getFileName());
            $$("download").click();
            toggleWaiting(false);
        });
    });
}

function getFileName() {
    let time = new Date();
    let fullYear = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    let randoms = Math.random() + "";
    let numberFileName = fullYear + "" + month + date + randoms.slice(3, 10);
    return `${numberFileName}.png`;
}
