class DrawTextItem {
    public left: number;
    public top: number;
    public fontSize: number;
    public fontFamily: string;
    public innerText: string;
    public color: string;
    public self_id: string;
    public page_id: string;
    public id: number;
    constructor(page_id: string, self_id: string, left: number, top: number, fontSize: number, fontFamily: string, innerText: string, color: string) {
        this.left = left;
        this.top = top;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.innerText = innerText;
        this.color = color;
        this.self_id = self_id;
        this.page_id = page_id;
        this.id = -1;
    }

    copy() {
        var item = new DrawTextItem(this.page_id, this.self_id, this.left, this.top, this.fontSize, this.fontFamily, this.innerText, this.color);
        item.id = this.id;
        return item;
    }


    getText() {
        return this.innerText;
    }
}

export default DrawTextItem;
