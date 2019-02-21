import { fabric } from 'fabric';
export default class MP
{
    constructor(cvs)
    {
        this.cvs = cvs;
        this.map = new Map();
        this.list = new Array();
    }
    add(vert,edg)
    {
        this.map.set(vert,edg);
        if(this.list.indexOf(vert)==-1) this.list.push(vert);
    }
    getEdge(vert)
    {
        return this.map.get(vert);
    }
    findAnother(vert,now)
    {
        if(this.list.length==1||(this.list.length==2&&this.list[0]==this.cvs.vRoot))
        {return new fabric.Circle({left: 2*now.left-vert.left,top: 2*now.top-vert.top});}
        let t = this.list.indexOf(vert);
        if(t==this.list.length-1) return this.list[t-1];
        return this.list[t+1];
    }
    remove(vert)
    {
        if(this.map.has(vert))
        {
            this.map.delete(vert);
            this.list.splice(this.list.indexOf(vert),1);
        }
    }
    checkLink()
    {
        if(this.list.length==0||(this.list.length==1&&this.list[0]==this.cvs.vRoot)) return false;
        return true;
    }
    clear()
    {
        this.map.clear();
        this.list = new Array();
    }
}
