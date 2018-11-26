import MP from './ds';
import { fabric } from 'fabric';
import History from './history';
export default class vCanvas
{
    constructor(siz,name,savepack=null,mapprop=null)
    {
        this.name = name;
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
            lineMode: "fill",
            lineColor: "red",
            lineWidth: 5,
            strokeColor: "red",
            strokeWidth: 1,
        };
        this.selectedVert = this.vRoot;
        this.selectedVert2 = this.vRoot;
        this.counter = 0;
        this.vis = new Set();
        this.vertSet = new Set();
        this.edgeSet = new Set();
        this.SVGIdArray = new Array();
        this.SVGMap = new Map();
        this.history = new History();
        this.initCanvas();
        if(savepack!=null){this.restore(savepack);}//RESTORE FROM PREVIOUS DATA
        else{this.renderMap();}
        this.changeStateTo("move"); 
        this.save();
    }
    changeStateTo(sta)//move,editvert,addvert,remove,connect,restore
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
                if(tt.isSVG==true) tt.set({selectable:true});
                tt.setCoords();
            }
            if(sta=="remove"||sta=="connect"){this.selectVert(this.vRoot);}
        }
        this.state = sta;
        this.renderAll();
    }
    setLineProp(name,prop)
    {
        this.lineprop[name] = prop;
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
            else if(this.state == "remove")
            {
                this.selectVert(c);
                if(this.selectedVert==this.vRoot||this.selectedVert2==this.vRoot) return;
                this.removeEdge(this.selectedVert,this.selectedVert2);
                this.selectVert(this.vRoot);// the render instruction is included in the select method
                this.save();/////////////////////////////////////////////////////////////////////////////////////
            }
        }
        else
        {
            this.selectVert(this.vRoot);
            if(this.state=="remove"&&c.isSVG)
            {this.remove(c);}
        }
    }
    onMove(e) 
    {
        let p = e.target;
        if(p instanceof fabric.Circle)
        {
            p.draw();
            this.moveflag = true;
        }
        else if(p.isSVG)
        {
            this.moveflag=true;
            p.rlPos = {x: p.left-this.mapProp.mapPos.x,y: p.top-this.mapProp.mapPos.y};
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
        if(this.state=="editvert"&&this.moveflag)
        //if(this.state=="editvert"&&this.selectedVert!=this.vRoot&&this.moveflag)//////////////////////////////////////////////////////////
        {
            this.save();
            this.moveflag = false;
        }
        else if(this.state=="move")
        {this.mouseDown = false;}
    }
    selectVert(vert)
    {
        if(this.state=="remove"||this.state=="connect")
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
    removeEdge(v1,v2)
    {
        let edg = v1.link.getEdge(v2);
        if(edg==undefined) return;
        this.remove(edg);
        v1.link.remove(v2);
        v2.link.remove(v1);
        if(!v1.link.checkLink()) 
        {
            this.vRoot.link.remove(v1);
            this.remove(v1);
        }
        else{v1.linkVert(this.vRoot,this.lineprop);}
        if(!v2.link.checkLink()) 
        {
            this.vRoot.link.remove(v2);
            this.remove(v2);
        }
        else{v2.linkVert(this.vRoot,this.lineprop);}
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
    createSVG(str,pos,id,save=true,SVGprop=null)
    {
        let that = this;
        fabric.loadSVGFromString(str, function(objects, options) {
            let obj = fabric.util.groupSVGElements(objects, options);
            obj.set({left:pos.x,top:pos.y,});
            let numId = that.SVGIdArray.indexOf(id);
            if(numId==-1)
            {
                numId = that.SVGIdArray.length+1;//CAUTION! numId MUST NOT BE 0!!!
                that.SVGIdArray.push(id);
            }
            else{numId++;}
            obj.id = numId;
            obj.isSVG = true;
            obj.SVGstr = str;
            that.addSVG(obj,numId,save);
        });
    }
    addSVG(obj,id,save=true)
    {
        this.SVGMap.set(parseInt(id),obj);
        let addSVGEvent = new CustomEvent('addSVG',{detail:{id: this.SVGIdArray[id-1]}});
        window.dispatchEvent(addSVGEvent);
        this.add(obj);
        if(save){this.save(id);}
    }
    add(obj)
    {
        obj.rlPos = {x: obj.left-this.mapProp.mapPos.x,y: obj.top-this.mapProp.mapPos.y};
        this.canvas.add(obj);
    }
    remove(obj,save=true)
    {
        if(obj!=null) 
        {
            this.canvas.remove(obj);
            if(obj.isSVG)
            {
                let removeSVGEvent = new CustomEvent('removeSVG',{detail:{id: this.SVGIdArray[obj.id-1]}});
                window.dispatchEvent(removeSVGEvent);
                this.SVGMap.delete(parseInt(obj.id));
                if(save) this.save(-obj.id);
            }
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
        let ret1 = new fabric.Line([p1.get('left'),p1.get('top'),p2.get('left'),p2.get('top')], {
            stroke: lineprop.strokeColor, strokeWidth: lineprop.strokeWidth*2+lineprop.lineWidth,
            selectable: false, evented: false,
        });
        let ret2 = new fabric.Line([p1.get('left'),p1.get('top'),p2.get('left'),p2.get('top')], {
            stroke: lineprop.lineColor, strokeWidth: lineprop.lineWidth,
            selectable: false, evented: false,
        });
        if(lineprop.lineMode=="dashed")
        {
            ret1.strokeDashArray = [30,10];
            ret2.strokeDashArray = [30,10];
        }
        let ret = new fabric.Group([ret1,ret2]);
        ret.selectable = false;
        ret.lineprop = { linetp: lineprop.linetp, lineMode: lineprop.lineMode,
                        lineColor: lineprop.lineColor, lineWidth: lineprop.lineWidth,
                        strokeColor: lineprop.strokeColor, strokeWidth: lineprop.strokeWidth,
                    };
        return ret;
    }
    makeCurve(p1,p2,p3,p4,tension,lineprop)
    {
        let s = (1-tension)/2;
        let x1 = p1.left; let y1 = p1.top;
        let x2 = p2.left; let y2 = p2.top;
        let x3 = p3.left; let y3 = p3.top;
        let x4 = p4.left; let y4 = p4.top;
        let i1,i2,i3,x,y,a,b,c,d;
        let prex = Math.round(x2),prey = Math.round(y2);
        let curve = [];
        let dist = Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2));
        let seg = 5;
        if(dist>500){seg = 2;}
        else if(dist>250){seg = 3;}
        else if(dist > 90){seg = 4;}
        for(let i=1;i<=15;i++)
        {
            i1 = i/15;
            i2 = i1*i1; i3 = i2*i1;
            a = -s*i3+2*s*i2-s*i1;
            b = (2-s)*i3+(s-3)*i2+1;
            c = (s-2)*i3+(3-2*s)*i2+s*i1;
            d = s*i3-s*i2;
            x = Math.round(x1*a+x2*b+x3*c+x4*d);
            y = Math.round(y1*a+y2*b+y3*c+y4*d);
            if((lineprop.lineMode=="dashed") && (i%seg==0)) 
            {
                prex = x; prey = y;
                continue;
            } 
            curve.push(new fabric.Line([prex,prey,x,y],{
                stroke: lineprop.strokeColor, strokeWidth: lineprop.strokeWidth*2+lineprop.lineWidth,
                //strokeDashArray: [20,5],
                selectable: false, evented: false,}));
            curve.push(new fabric.Line([prex,prey,x,y],{
                stroke: lineprop.lineColor, strokeWidth: lineprop.lineWidth,
                //strokeDashArray: [20,5],
                selectable: false, evented: false,}));
            prex = x; prey = y;
        }
        let ret = new fabric.Group(curve);
        ret.selectable = false;
        ret.lineprop = { linetp: lineprop.linetp, lineMode: lineprop.lineMode,
            lineColor: lineprop.lineColor, lineWidth: lineprop.lineWidth,
            strokeColor: lineprop.strokeColor, strokeWidth: lineprop.strokeWidth,
        };
        return ret;
    }
    initCanvas()
    {
        this.canvas = window.__canvas = new fabric.Canvas(this.name, { selection: false });
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
        this.canvas.on('mouse:down', this.onClk.bind(this));
        this.canvas.on('mouse:up',this.onMouseUp.bind(this));
        this.canvas.on('mouse:move',this.onMouseMove.bind(this));
        this.canvas.on('object:moving',this.onMove.bind(this));
        this.canvas.on('object:rotated',this.save.bind(this));
        this.canvas.on('object:scaled',this.save.bind(this));
    }
    resize(siz)
    {
        this.canvas.dispose();
        this.size = siz;
        this.initCanvas();
        this.restore(this.history.getTop());
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
    save(changedSVGid=0,record=true)
    {   
        if(this.state=="restore") return;
        let savePack=null;
        this.vis.clear();
        this.vertSet.clear();
        this.edgeSet.clear();
        this.dfs(this.vRoot,null);
        let svgArray = new Array();
        for(let tt of this.SVGMap)
        {
            svgArray.push({
                id: tt[0],
                svgstr: tt[1].SVGstr,
                pos:{x: tt[1].left,y: tt[1].top},
                prop:{angle: tt[1].angle,scaleX: tt[1].scaleX,scaleY: tt[1].scaleY}
            });
        }
        savePack = {
            vertset: Array.from(this.vertSet),
            edgeset: Array.from(this.edgeSet),
            svgarray: svgArray,    //<-------------------------------------------
            svgidarray: this.SVGIdArray,
            selectedvertid: this.selectedVert.id,
            selectedVert2id: this.selectedVert2.id,
            lineprop: this.lineprop,
            counter: this.counter,
            state: this.state,
            mapprop: this.mapProp
        }
        let ret = JSON.stringify(savePack);
        if(record) this.history.add(ret,changedSVGid);
        return ret;
    }
    saveToServer()
    {
        let savePack = this.save(0,false);
        //let saveEvent = new CustomEvent('saveToServer',{detail:{savePack:this.history.getTop()}});
        let saveEvent = new CustomEvent('saveToServer',{detail:{savePack:savePack}});
        window.dispatchEvent(saveEvent);
    }
    export()
    {
        document.getElementById(this.name).toBlob(function(blob){
            saveAs(blob,"map.png");
        });
    }
    undo()
    {
        if(!this.history.canUndo()) return;
        let id = parseInt(this.history.getTopSVGid());
        if(id>0)
        {
            let removeSVGEvent = new CustomEvent('removeSVG',{detail:{id: this.SVGIdArray[id-1]}});
            window.dispatchEvent(removeSVGEvent);
        }
        this.restore(this.history.undo());
    }
    redo()
    {
        if(!this.history.canRedo()) return;
        let src = this.history.redo();
        let id = parseInt(this.history.getTopSVGid());
        if(id<0)
        {
            let removeSVGEvent = new CustomEvent('removeSVG',{detail:{id: this.SVGIdArray[-id-1]}});
            window.dispatchEvent(removeSVGEvent);
        }
        this.restore(src);
    }
    restore(src)
    {
        this.changeStateTo("restore");
        this.canvas.clear();
        let savePack = JSON.parse(src);
        this.lineprop = savePack.lineprop;
        this.mapProp = savePack.mapprop;
        this.counter = savePack.counter;
        this.SVGIdArray = savePack.svgidarray;
        let svgArray = savePack.svgarray;
        this.SVGMap.clear();
        for(let tt of svgArray)
        {this.createSVG(tt.svgstr,tt.pos,this.SVGIdArray[parseInt(tt.id-1)],false,tt.prop);}
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