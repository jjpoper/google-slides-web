class DrawTextItem {
    public left: number;
    public top: number;
    public fontSize: number;
    public fontFamily: string;
    public innerText: string;
    public color: string;
    public self_id: string;
    public page_id: string;
    public id="";
    constructor(page_id: string, id: string, left: number, top: number, fontSize: number, fontFamily: string, innerText: string, color: string) {
        this.left = left;
        this.top = top;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.innerText = innerText;
        this.color = color;
        this.self_id = id;
        this.page_id = page_id;
    }


    getText() {
        return this.innerText;
    }
}

export default DrawTextItem;
