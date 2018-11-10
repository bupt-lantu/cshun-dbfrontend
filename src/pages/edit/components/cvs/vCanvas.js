import MP from './ds';
import { fabric } from 'fabric';
export default class vCanvas
{
    constructor(siz,savepack=null,mapprop=null)
    {
        this.size = siz;
        this.vRoot = new fabric.Circle({left: 0,top: 0,strokeWidth: 0,radius: 0,});
        this.vRoot.link = new MP(this);
        this.vRoot.id = 0;
        this.mousePos = {x:0,y:0};
        this.mapProp={
            mapSrc:"../assets/map.png",
            mapPos: {x:0,y:0},
            mapSize: {x:1920,y:1080}//
        }
        this.mouseDown = false; 
        this.state = "";
        this.moveflag = false;
        this.lineprop = {
            linetp: "curve",
            lineColor: 'red',
            lineWidth: 5
        };
        this.selectedVert = this.vRoot;
        this.selectedVert2 = this.vRoot;
        this.counter = 0;
        this.vis = new Set();
        this.vertSet = new Set();
        this.edgeSet = new Set();
        this.history = {top:-1,historyStack:new Array()};
        this.initCanvas();
        this.canvas.on('mouse:down', this.onClk.bind(this));
        this.canvas.on('mouse:up',this.onMouseUp.bind(this));
        this.canvas.on('mouse:move',this.onMouseMove.bind(this));
        this.canvas.on('object:moving',this.onMove.bind(this));
        if(savepack!=null)//RESTORE FROM PREVIOUS DATA
        {
            this.restore(savepack);
            this.save();
            return;
        }
        this.renderMap();
        this.changeStateTo("move");
        this.save();
    }
    changeStateTo(sta)//move,editvert,addvert,delete,connect,restore
    {
        if(sta=="restore")
        {
            this.state = sta;
            return;
        }
        let objs = this.canvas.getObjects();
        if(sta=="move")
        {
            this.selectVert(this.vRoot);
            for(let tt of objs) 
            {
                tt.set({selectable:false});
                if(tt instanceof fabric.Circle) tt.set({strokeWidth: 0,radius: 0});//hide the control points
            }
        }
        else
        {
            for(let tt of objs)
            {
                if(tt instanceof fabric.Circle) tt.set({selectable:true,radius:12,strokeWidth:5});
                tt.setCoords();
            }
            if(sta=="delete"||sta=="connect"){this.selectVert(this.vRoot);}
        }
        this.state = sta;
        this.renderAll();
    }
    setLineProp(lineprop)
    {
        console.log("SET");
        this.lineprop = lineprop;
    }
    onClk(e) 
    {
        if (this.state == "addvert") 
        {
            let c = this.makeCircle(e.pointer,++this.counter,this);
            c.linkVert(this.selectedVert,this.lineprop);
            if(this.selectedVert!=this.vRoot) this.selectedVert.draw();
            this.add(c);
            this.renderAll();
            this.selectVert(c);
            this.save();////////////////////////////////////////////////////////////////////
            return;
        }
        if(this.state=="move")
        {
            this.mouseDown = true;
            this.mousePos = e.pointer;
            return;
        }
        let c = e.target;
        if(c==null) {this.selectVert(this.vRoot);return;}
        if(c instanceof fabric.Circle)
        {
            if (this.state == "editvert") 
            {this.selectVert(c);}
            else if(this.state=="connect")
            {
                this.selectVert(c);
                if(this.selectedVert==this.vRoot||this.selectedVert2==this.vRoot) return;
                this.selectedVert.linkVert(this.selectedVert2,this.lineprop);
                this.selectedVert.draw();
                this.selectVert(this.vRoot);
                this.save();////////////////////////////////////////////////////////////
            }
            else if(this.state == "delete")
            {
                this.selectVert(c);
                if(this.selectedVert==this.vRoot||this.selectedVert2==this.vRoot) return;
                let edg = this.selectedVert.link.getEdge(this.selectedVert2);
                if(edg==undefined) return;
                this.remove(edg);
                this.selectedVert.link.remove(this.selectedVert2);
                this.selectedVert2.link.remove(this.selectedVert);
                if(!this.selectedVert.link.checkLink()) 
                {
                    this.vRoot.link.remove(this.selectedVert);
                    this.remove(this.selectedVert);
                }
                else{this.selectedVert.linkVert(this.vRoot,this.lineprop);}
                if(!this.selectedVert2.link.checkLink()) 
                {
                    this.vRoot.link.remove(this.selectedVert2);
                    this.remove(this.selectedVert2);
                }
                else{this.selectedVert2.linkVert(this.vRoot,this.lineprop);}
                this.selectVert(this.vRoot);// the render instruction is included in the select method
                this.save();/////////////////////////////////////////////////////////////////////////////////////
            }
        }
        else{this.selectVert(this.vRoot);}
    }
    onMove(e) 
    {
        let p = e.target;
        if(p instanceof fabric.Circle)
        {
            p.draw();
            this.moveflag = true;
        }
    }
    onMouseMove(e)
    {
        if(this.mouseDown&&this.state=="move")
        {
            let det = {x: e.pointer.x-this.mousePos.x,y: e.pointer.y-this.mousePos.y};
            if(Math.abs(det.x)>10||Math.abs(det.y)>10)
            {
                this.mapProp.mapPos.x+=det.x;
                if(this.mapProp.mapPos.x>0){this.mapProp.mapPos.x=0;}
                else if(this.mapProp.mapPos.x<this.size.x-this.mapProp.mapSize.x){this.mapProp.mapPos.x=this.size.x-this.mapProp.mapSize.x;} 
                this.mapProp.mapPos.y+=det.y;
                if(this.mapProp.mapPos.y>0){this.mapProp.mapPos.y=0;}
                else if(this.mapProp.mapPos.y<this.size.y-this.mapProp.mapSize.y){this.mapProp.mapPos.y=this.size.y-this.mapProp.mapSize.y;}
                this.renderMap();
                this.mousePos = e.pointer;
            }
        }
    }
    onMouseUp(e)
    {
        if(this.state=="editvert"&&this.selectedVert!=this.vRoot&&this.moveflag)//////////////////////////////////////////////////////////
        {
            this.save();
            this.moveflag = false;
        }
        else if(this.state=="move")
        {this.mouseDown = false;}
    }
    selectVert(vert)
    {
        if(this.state=="delete"||this.state=="connect")
        {
            if(vert==this.vRoot)
            {
                this.selectedVert.set({fill:'red',stroke:'red'});
                this.selectedVert2.set({fill:'red',stroke:'red'});
                this.selectedVert = this.selectedVert2 = this.vRoot;
            }
            else if(this.selectedVert!=vert)
            {
                this.selectedVert.set({fill:'red',stroke:'red'});
                this.selectedVert2 = this.selectedVert;
                this.selectedVert = vert;
                this.selectedVert.set({fill:'blue',stroke:'blue'});
            }
        }
        else
        {
            this.selectedVert.set({fill:'red',stroke:'red'});
            this.selectedVert = vert;
            this.selectedVert.set({fill:'blue',stroke:'blue'});
        }
        this.renderAll();
    }
    renderAll()
    {
        this.canvas.renderAll();
    }
    renderMap()// calculate the relative position
    {
        let objs = this.canvas.getObjects();
        for(let tt of objs)
        {
            tt.left = this.mapProp.mapPos.x+tt.rlPos.x;
            tt.top = this.mapProp.mapPos.y+tt.rlPos.y;
        }
        this.canvas.setBackgroundImage(this.mapProp.mapSrc, this.canvas.renderAll.bind(this.canvas), {
            left: this.mapProp.mapPos.x,
            top: this.mapProp.mapPos.y,
            originX: 'left',
            originY: 'top'
        });
    }
    add(obj)
    {
        obj.rlPos = {x: obj.left-this.mapProp.mapPos.x,y: obj.top-this.mapProp.mapPos.y};
        this.canvas.add(obj);
    }
    remove(obj)
    {
        if(obj!=null) 
        {
            this.canvas.remove(obj);
            //if(obj instanceof fabric.Circle){}
        }
    }
    sendToBack(obj)
    {
        this.canvas.sendToBack(obj);
    }
    makeCircle(pos,id,cvs) 
    {
        let c = new fabric.Circle({
            left: pos.x,
            top: pos.y,
            strokeWidth: 5,
            radius: 12,
            fill: 'red',
            stroke: 'red',
            hasControls: false,
            hasBorders: true
        });
        c.cvs = cvs;  
        c.id = id;
        c.link = new MP(this);
        return c;
    }
    makeLine(p1,p2,lineprop) 
    {
        let ret = new fabric.Line([p1.get('left'),p1.get('top'),p2.get('left'),p2.get('top')], {
            fill: lineprop.lineColor,
            stroke: lineprop.lineColor,
            strokeWidth: lineprop.lineWidth,
            selectable: false,
            evented: false,
        });
        ret.lineprop = lineprop;
        return ret;
    }
    makeCurve(p1,p2,p3,p4,tension,lineprop)
    {
        let s = (1-tension)/2;
        let x1 = p1.left; let y1 = p1.top;
        let x2 = p2.left; let y2 = p2.top;
        let x3 = p3.left; let y3 = p3.top;
        let x4 = p4.left; let y4 = p4.top;
        let dist = Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2));
        let i1,i2,i3,x,y,a,b,c,d;
        let prex = Math.round(x2),prey = Math.round(y2);
        let curve = [];
        for(let i=1;i<=10;i++)
        {
            i1 = i/10;
            i2 = i1*i1; i3 = i2*i1;
            a = -s*i3+2*s*i2-s*i1;
            b = (2-s)*i3+(s-3)*i2+1;
            c = (s-2)*i3+(3-2*s)*i2+s*i1;
            d = s*i3-s*i2;
            x = Math.round(x1*a+x2*b+x3*c+x4*d);
            y = Math.round(y1*a+y2*b+y3*c+y4*d);
            curve.push(new fabric.Line([prex,prey,x,y],{
                fill: lineprop.lineColor,
                stroke: lineprop.lineColor,
                strokeWidth: lineprop.lineWidth,
                selectable: false,
                evented: false,}));
            prex = x; prey = y;
        }
        let ret = new fabric.Group(curve);
        ret.selectable = false;
        ret.lineprop = lineprop;
        return ret;
    }
    initCanvas()
    {
        this.canvas = window.__canvas = new fabric.Canvas('c', { selection: false });
        fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
        fabric.Circle.prototype.linkVert = function(vert,lineprop){
            if(this.link.getEdge(vert)!=undefined) {this.cvs.remove(this.link.getEdge(vert));}
            else
            {
                this.link.add(vert,null);
                vert.link.add(this,null);
            }
            let edg;
            if(lineprop.linetp=="line"){edg = this.cvs.makeLine(this,vert,lineprop);}
            else{edg = this.cvs.makeCurve(this.link.findAnother(vert,this),this,vert,vert.link.findAnother(this,vert),0.2,lineprop);}
            this.link.add(vert,edg);
            vert.link.add(this,edg);
            if(this!=this.cvs.vRoot&&vert!=this.cvs.vRoot) 
            {
                this.cvs.add(edg);
                this.cvs.sendToBack(edg);
            }
        }
        fabric.Circle.prototype.draw = function () {
            this.cvs.remove(this);
            for(let tt of this.link.map)  
            {this.linkVert(tt[0],tt[1].lineprop);}
            this.cvs.add(this);
            this.cvs.renderAll();
        }
    }
    dfs(now,fa)
    {
        this.vis.add(now);
        this.vertSet.add({id:now.id,left:now.left,top:now.top});
        for(let tt of now.link.map)
        {
            if(tt[0]!=fa)
            {
                this.edgeSet.add({
                    id1 : now.id,
                    id2 : tt[0].id,
                    lineprop: tt[1].lineprop});
            }
            if(!this.vis.has(tt[0]))this.dfs(tt[0],now);
        }
    }
    save()
    {   
        if(this.state=="restore") return;
        this.vis.clear();
        this.vertSet.clear();
        this.edgeSet.clear();
        this.dfs(this.vRoot,null);
        let savePack = {
            vertset: Array.from(this.vertSet),
            edgeset: Array.from(this.edgeSet),
            selectedvertid: this.selectedVert.id,
            selectedVert2id: this.selectedVert2.id,
            lineprop: this.lineprop,
            counter: this.counter,
            state: this.state,
            mapprop: this.mapProp
        }
        if(this.history.top==99)
        {
            this.history.historyStack.slice(0,1);
            this.history.top--;
        }
        this.history.historyStack[++this.history.top] = JSON.stringify(savePack);
        this.history.historyStack.length = this.history.top+1;
        return savePack;
    }
    undo()
    {
        if(this.history.top==0) return;
        this.restore(this.history.historyStack[--this.history.top]);
    }
    redo()
    {
        if(this.history.top==this.history.historyStack.length-1) return;
        this.restore(this.history.historyStack[++this.history.top]);
    }
    restore(src)
    {
        this.changeStateTo("restore");
        this.canvas.clear();
        let savePack = JSON.parse(src);
        this.lineprop = savePack.lineprop;
        this.mapProp = savePack.mapprop;
        this.counter = savePack.counter;
        let vtmap = new Map();
        for(let tt of savePack.vertset)
        {
            let circ = this.makeCircle({x:tt.left,y:tt.top},tt.id,this);
            if(tt.id==0) {this.vRoot = circ;}
            if(tt.id==savePack.selectedvertid)
            {this.selectedVert = circ;circ.set({fill:'blue',stroke:'blue'});}
            if(tt.id==savePack.selectedVert2id)
            {this.selectedVert2 = circ;}
            vtmap.set(tt.id,circ);
        }
        for(let tt of savePack.edgeset)
        {vtmap.get(tt.id1).linkVert(vtmap.get(tt.id2),tt.lineprop);}
        for(let tt of vtmap) 
        {if(tt[0]!=0)tt[1].draw();}
        this.renderMap();
        this.changeStateTo(savePack.state);
    }
}