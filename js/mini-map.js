class MiniMap {
    constructor() {
        this.id = "mini-map";
        this.ctx = $$("mini-map").getContext("2d");
        this.focus = $$("mini-map-focus");
        this.focusWidth = 0;
        this.focusHeight = 0;
    }

    init() {
        this.resizeFocus();
        this.ctx.fillStyle = "black";
        for (let i = 1; i <= $length; i++) {
            for (let j = 1; j <= $length; j++) {
                let boundary = isBoundary(i, j);
                if (boundary) {
                    this.ctx.fillRect((j - 1) * 2, (i - 1) * 2, 2, 2);
                }
                switch (boundary) {
                    case "top-left":
                        this.ctx.fillRect((j - 1) * 2 + 1, (i - 1) * 2 - 1, 1, 1);
                        break;
                    case "bottom-right":
                        this.ctx.fillRect((j - 1) * 2, (i - 1) * 2 + 2, 1, 1);
                        break;
                    case "top-right":
                        this.ctx.fillRect((j - 1) * 2, (i - 1) * 2 - 1, 1, 1);
                        break;
                    case "bottom-left":
                        this.ctx.fillRect((j - 1) * 2 + 1, (i - 1) * 2 + 2, 1, 1);
                        break;
                    case "angle-left":
                        this.ctx.fillRect((j - 1) * 2 + 1, (i - 1) * 2 - 1, 1, 1);
                        this.ctx.fillRect((j - 1) * 2 + 1, (i - 1) * 2 + 2, 1, 1);
                        break;
                    case "angle-right":
                        this.ctx.fillRect((j - 1) * 2, (i - 1) * 2 - 1, 1, 1);
                        this.ctx.fillRect((j - 1) * 2, (i - 1) * 2 + 2, 1, 1);
                        break;
                }
            }
        }
    }

    clear() {
        this.ctx.fillStyle = getColor("--color-background-lighter");
        for (let i = 1; i <= $length; i++) {
            for (let j = 1; j <= $length; j++) {
                if ($cell[i][j].isInRange) {
                    this.ctx.fillRect((j - 1) * 2, (i - 1) * 2, 2, 2);
                }
            }
        }
    }

    onChangeDisplayMode() {
        this.ctx.fillStyle = getColor("--color-background-lighter");
        for (let i = 1; i <= $length; i++) {
            for (let j = 1; j <= $length; j++) {
                if ($cell[i][j].isInRange && !$cell[i][j].occupied) {
                    this.ctx.fillRect((j - 1) * 2, (i - 1) * 2, 2, 2);
                }
            }
        }
    }

    setPixel(li, co, color, width, height) {
        height = height || width;
        this.ctx.fillStyle = color;
        this.ctx.fillRect((co - 1) * 2, (li - 1) * 2, width * 2, height * 2);
    }

    resizeFocus() {
        this.focusWidth = Math.floor((window.innerWidth / $cellSize) * 1.5);
        this.focusHeight = Math.floor((window.innerHeight / $cellSize) * 1.5);
        this.focus.style.width = `${this.focusWidth}px`;
        this.focus.style.height = `${this.focusHeight}px`;
    }

    updateFocus() {
        let left = 4 + ((window.pageXOffset - 96) / $cellSize) * 1.5;
        let top = 4 + ((window.pageYOffset - 72) / $cellSize) * 1.5;
        if (left < 4) left = 4;
        if (top < 4) top = 4;
        if (left + this.focusWidth > 176) left = 176 - this.focusWidth;
        if (top + this.focusHeight > 176) top = 176 - this.focusHeight;
        this.focus.style.left = left + "px";
        this.focus.style.top = top + "px";
    }
}
function onMiniMapMouseClick(event) {
    let x = event.clientX - $$("mini-map").getBoundingClientRect().left;
    let y = event.clientY - $$("mini-map").getBoundingClientRect().top;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > 174) x = 174;
    if (y > 174) y = 174;
    window.scrollTo({
        top: (y - $miniMap.focusHeight / 2) * 20,
        left: (x - $miniMap.focusWidth / 2) * 20,
    });
}

function onMiniMapMouseMove(event) {
    if (!$config.isMouseDown) return;
    onMiniMapMouseClick(event);
}
