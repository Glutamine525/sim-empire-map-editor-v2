class SideNav {
    constructor(width) {
        this.width = width;
        this.id = "side-nav";
        $$(this.id).style.height = `${this.height}px`;
    }

    setWidth(width) {
        this.width = width;
        $$(this.id).style.width = `${this.width}px`;
    }

    getWidth() {
        return this.width;
    }

    setMaginTop(top) {
        $$(this.id).style.setProperty("--margin-top", `${top}px`);
    }
}
