import MP from './ds';
import { fabric } from 'fabric';
import History from './history';
import { bus } from '../../../../bus.js'
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
            mapSrc:null,
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
        this.selectedEdge = null;
        this.counter = 0;
        this.freeDrawPth = new Array();
        this.vis = new Set();
        this.vertSet = new Set();
        this.edgeSet = new Set();
        this.SVGIdArray = new Array();
        this.SVGMap = new Map();
        this.history = new History();
        this.initCanvas();
        if(savepack){this.restore(savepack);}//RESTORE FROM PREVIOUS DATA
        else{this.renderMap();}
        this.changeStateTo("move"); 
        this.save();
    }
    changeStateTo(sta)//move,editvert,addvert,remove,connect,restore,freedraw，setmap
    {
        if(sta=="restore")
        {
            this.state = sta;
            return;
        }
        if(sta!=this.state)this.selectEdge(null);
        let objs = this.canvas.getObjects();
        if(this.state=="setmap")this.save();
        if(sta=="move"||sta=="setmap"||sta=="freedraw")
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
                if(tt instanceof fabric.Circle) tt.set({selectable:true,radius:tt.r,strokeWidth:5});
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
        if(this.selectedEdge==null){this.lineprop[name] = prop;}
        else
        {
            if(this.selectedEdge.lineprop[name]!=prop)
            {
                this.selectedEdge.lineprop[name]=prop;
                this.selectedEdge.p1.linkVert(this.selectedEdge.p2,this.selectedEdge.lineprop);
                this.renderAll();
                this.save();
            } 
        }
    }
    onClk(e) 
    {
        if(this.state == "addvert") {this.mouseDown = true;return;}
        if(this.state=="move"||this.state=="setmap")
        {
            this.mouseDown = true;
            this.mousePos = e.pointer;
            return;
        }
        if(this.state=="freedraw")
        {
            this.mouseDown = true;
            this.freeDrawPth.length = 0;
            let now = this.makeCircle(e.pointer,++this.counter,this,this.lineprop.lineWidth);
            now.selectable = false;
            now.addlk(this.vRoot,this.lineprop);this.add(now); this.renderAll();
            this.freeDrawPth.push(now);
            this.mousePos = e.pointer;
            return;
        }
        let c = e.target;
        if(c==null) 
        {
            this.selectVert(this.vRoot);
            this.selectEdge(null);
            return;
        }
        if(c instanceof fabric.Circle)
        {
            if (this.state == "editvert") 
            {
                this.selectVert(c);
                this.selectEdge(null);
            }
            else if(this.state=="connect")
            {
                this.selectVert(c);
                if(this.selectedVert==this.vRoot||this.selectedVert2==this.vRoot) return;
                //this.selectedVert.linkVert(this.selectedVert2,this.lineprop);
                this.selectedVert.addlk(this.selectedVert2,this.lineprop);
                this.selectedVert.draw();
                this.selectVert(this.vRoot);
                this.save();////////////////////////////////////////////////////////////
            }
            else if(this.state == "remove")
            {
                this.selectVert(c);
                if(this.selectedVert!=this.vRoot && !this.selectedVert.link.checkLink()) 
                {
                    this.vRoot.link.remove(this.selectedVert);
                    this.remove(this.selectedVert);
                    this.selectVert(this.vRoot);
                    return;
                }
                if(this.selectedVert==this.vRoot||this.selectedVert2==this.vRoot) return;
                this.removeEdge(this.selectedVert,this.selectedVert2);
                this.selectVert(this.vRoot);// the render instruction is included in the select method
                this.save();/////////////////////////////////////////////////////////////////////////////////////
            }
        }
        else
        {
            if(this.state=="editvert"&&c.lineprop){this.selectEdge(c);}
            if(this.state=="remove"&&c.isSVG){this.remove(c);}
            this.selectVert(this.vRoot);
        }
    }
    onMove(e) 
    {
        let p = e.target;
        if(p instanceof fabric.Circle)
        {
            if(p.left<10||p.left>this.size.x+10||p.top<10||p.top>this.size.y+10)
            {
                if(p.left<10){p.left+=3;p.draw();this.moveMap(5,0);}
                else if(p.left>this.size.x+10){p.left-=3;p.draw();this.moveMap(-5,0);}
                if(p.top<10){p.top+=3;p.draw();this.moveMap(0,5);}
                else if(p.top>this.size.y+10){p.top-=3;p.draw();this.moveMap(0,-5);}
            }   
            else
            {
                p.draw();
                this.renderAll();
            }
            this.moveflag = true;
        }
        else if(p.isSVG)
        {
            this.moveflag=true;
            p.rlPos = {x: p.left-this.mapProp.mapPos.x,y: p.top-this.mapProp.mapPos.y};
            if(p.left<10){p.left+=3;this.moveMap(5,0);}
            else if(p.left>this.size.x+10){p.left-=3;this.moveMap(-5,0);}
            if(p.top<10){p.top+=3;this.moveMap(0,5);}
            else if(p.top>this.size.y+10){p.top-=3;this.moveMap(0,-5);}
        }
    }
    onMouseMove(e)
    {
        if(!this.mouseDown) return;
        if(this.state=="move"||this.state=="setmap")
        {
            let det = {x: e.pointer.x-this.mousePos.x,y: e.pointer.y-this.mousePos.y};
            if(Math.abs(det.x)>10||Math.abs(det.y)>10)
            {
                this.moveMap(det.x,det.y);
                this.mousePos = e.pointer;
            }
        }
        else if(this.state=="addvert")
        {
            if(e.pointer.x<10){this.moveMap(5,0);}
            else if(e.pointer.x>this.size.x+10){this.moveMap(-5,0);}
            if(e.pointer.y<10){this.moveMap(0,5);}
            else if(e.pointer.y>this.size.y+10){this.moveMap(0,-5);}
        }
        else if(this.state=="freedraw")
        {
            if(Math.abs(e.pointer.x-this.mousePos.x)>=30||Math.abs(e.pointer.y-this.mousePos.y)>=30)
            {
                let now = this.makeCircle(e.pointer,++this.counter,this,this.lineprop.lineWidth);
                now.selectable = false;
                let pre = this.freeDrawPth[this.freeDrawPth.length-1];
                this.add(now); now.addlk(pre,this.lineprop);
                pre.draw();
                this.renderAll();
                this.mousePos = e.pointer;
                this.freeDrawPth.push(now);
            }
        }
    }
    onMouseUp(e)
    {
        if (this.state == "addvert") 
        {
            let c = this.makeCircle(e.pointer,++this.counter,this);
            c.addlk(this.selectedVert,this.lineprop);
            if(this.selectedVert!=this.vRoot) this.selectedVert.draw();
            this.add(c);
            this.selectVert(c);
            this.save();
            this.mouseDown = false;
        }
        else if(this.state=="editvert"&&this.moveflag)
        {
            this.save();
            this.moveflag = false;
        }
        else if(this.state=="move"||this.state=="setmap"){this.mouseDown = false;}
        else if(this.state=="freedraw")
        {
            this.mouseDown = false;
            //this.makeFreeCurve();
        }
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
    selectEdge(edge)
    {
        if(this.selectedEdge!=null)
        {
            this.selectedEdge.p1.set({fill:'red',stroke:'red'});
            this.selectedEdge.p2.set({fill:'red',stroke:'red'});
        }
        if(edge==null){bus.$emit('selectEdge',this.lineprop);}
        else
        {
            bus.$emit('selectEdge',edge.lineprop);
            edge.p1.set({fill:'blue',stroke:'blue'});
            edge.p2.set({fill:'blue',stroke:'blue'});
        }
        this.selectedEdge = edge;
    }
    removeE(v1,v2)
    {
        let edg = v1.link.getEdge(v2);
        if(edg==undefined) return false;
        this.remove(edg);
        v1.link.remove(v2);
        v2.link.remove(v1);
        return true;
    }
    removeEdge(v1,v2)
    {
        if(!this.removeE(v1,v2)) return;
        if(!v1.link.checkLink()) 
        {
            this.vRoot.link.remove(v1);
            this.remove(v1);
        }
        //else{v1.linkVert(this.vRoot,this.lineprop);}
        else{v1.addlk(this.vRoot,this.lineprop);}
        if(!v2.link.checkLink()) 
        {
            this.vRoot.link.remove(v2);
            this.remove(v2);
        }
        //else{v2.linkVert(this.vRoot,this.lineprop);}
        else{v2.addlk(this.vRoot,this.lineprop);}
    }
    renderAll()
    {
        this.canvas.renderAll();
    }
    setMap(src)
    {
        this.mapProp.mapSrc = src;
        this.renderMap();
    }
    moveMap(x,y)
    {
        this.mapProp.mapPos.x+=x;
        this.mapProp.mapPos.y+=y;
        this.renderMap();
    }
    renderMap()// calculate the relative position
    {
        let objs = this.canvas.getObjects();
        if(this.state=="setmap")
        {
            for(let tt of objs)
            {
                tt.rlPos.x = tt.left-this.mapProp.mapPos.x;
                tt.rlPos.y = tt.top-this.mapProp.mapPos.y;
            }
        }
        else
        {
            for(let tt of objs)
            {
                tt.left = this.mapProp.mapPos.x+tt.rlPos.x;
                tt.top = this.mapProp.mapPos.y+tt.rlPos.y;
                tt.setCoords();
            }
        }
        this.canvas.renderAll();
        if(this.mapProp.mapSrc)
        {
            this.canvas.setBackgroundImage(this.mapProp.mapSrc, this.canvas.renderAll.bind(this.canvas), {
                left: this.mapProp.mapPos.x,
                top: this.mapProp.mapPos.y,
                originX: 'left',
                originY: 'top'
            });
        }
        else
        {
            this.canvas.backgroundImage = 0;
            this.renderAll();
        }
    }
    createSVG(str,pos,id,save=true,SVGprop=null)
    {
        if(this.state=="move") return;
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
        // let addSVGEvent = new CustomEvent('addSVG',{detail:{id: this.SVGIdArray[id-1]}});
        // window.dispatchEvent(addSVGEvent);
        bus.$emit('showP',this.SVGIdArray[id-1]);
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
                // let removeSVGEvent = new CustomEvent('removeSVG',{detail:{id: this.SVGIdArray[obj.id-1]}});
                // window.dispatchEvent(removeSVGEvent);
                bus.$emit('removeP',this.SVGIdArray[obj.id-1]);
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
    makeCircle(pos,id,cvs,radius=7) 
    {
        let c = new fabric.Circle({
            left: pos.x,
            top: pos.y,
            strokeWidth: 0,
            radius: radius,
            fill: 'red',
            stroke: 'red',
            hasControls: false,
            hasBorders: true
        });
        c.r = radius;
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
        ret.p1 = p1; ret.p2 = p2;
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
        ret.p1 = p2;ret.p2 = p3;
        return ret;
    }
    makeFreeCurve()
    {
        if(this.freeDrawPth.length==1) {this.remove(this.freeDrawPth[0]);}
        if(this.freeDrawPth.length==2){return;}
        else
        {
            let pre = this.freeDrawPth[0];
            let x1,x2,y1,y2,i;
            let eps = 0.985;
            for(i=1;i<this.freeDrawPth.length-1;i++)
            {
                let now = this.freeDrawPth[i];
                x1 = now.left - this.freeDrawPth[i-1].left;
                y1 = now.top - this.freeDrawPth[i-1].top;
                x2 = this.freeDrawPth[i+1].left - this.freeDrawPth[i-1].left;
                y2 = this.freeDrawPth[i+1].top - this.freeDrawPth[i-1].top;
                if((x1*x2+y1*y2)*(x1*x2+y1*y2)/((x1*x1+y1*y1)*(x2*x2+y2*y2))<eps)
                {
                    now.linkVert(pre,this.lineprop);
                    pre.draw();
                    pre = now;
                }
                else
                {
                    this.removeE(now,this.freeDrawPth[i-1]);
                    this.removeE(now,this.freeDrawPth[i+1]);
                    this.remove(now);
                }
            }
            let now = this.freeDrawPth[i];
            now.linkVert(pre,this.lineprop);
            pre.draw();
        }
        this.renderAll();
        this.save();
    }
    initCanvas()
    {
        this.canvas = window.__canvas = new fabric.Canvas(this.name, { selection: false });
        fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
        fabric.Circle.prototype.addlk = function(vert,lineprop){
            let lp = { linetp: lineprop.linetp, lineMode: lineprop.lineMode,
                lineColor: lineprop.lineColor, lineWidth: lineprop.lineWidth,
                strokeColor: lineprop.strokeColor, strokeWidth: lineprop.strokeWidth,
            };
            let edg = {lineprop: lp};
            this.link.add(vert,edg); vert.link.add(this,edg);
        }
        fabric.Circle.prototype.linkVert = function(vert,lineprop){
            if(this.link.getEdge(vert)!=undefined) {this.cvs.remove(this.link.getEdge(vert));}
            else
            {
                this.addlk(vert,lineprop);
                //this.link.add(vert,null);
                //vert.link.add(this,null);
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
            //this.cvs.renderAll();
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
        let sta = this.state;
        this.canvas.dispose();
        this.size = siz;
        this.initCanvas();
        this.restore(this.history.getTop());
        this.changeStateTo(sta);
    }
    dfs(now,fa)
    {
        this.vis.add(now);
        this.vertSet.add({id:now.id,r:now.r,left:now.left,top:now.top});
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
        // let saveEvent = new CustomEvent('saveToServer',{detail:{savePack:savePack}});
        // window.dispatchEvent(saveEvent);
        bus.$emit('save',savePack);
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
            // let removeSVGEvent = new CustomEvent('removeSVG',{detail:{id: this.SVGIdArray[id-1]}});
            // window.dispatchEvent(removeSVGEvent);
            bus.$emit('removeP',this.SVGIdArray[id-1]);
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
            // let removeSVGEvent = new CustomEvent('removeSVG',{detail:{id: this.SVGIdArray[-id-1]}});
            // window.dispatchEvent(removeSVGEvent);
            bus.$emit('removeP',this.SVGIdArray[-id-1]);
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
            let circ = this.makeCircle({x:tt.left,y:tt.top},tt.id,this,tt.r);
            if(tt.id==0) {this.vRoot = circ;}
            if(tt.id==savePack.selectedvertid)
            {this.selectedVert = circ;circ.set({fill:'blue',stroke:'blue'});}
            if(tt.id==savePack.selectedVert2id)
            {this.selectedVert2 = circ;}
            vtmap.set(tt.id,circ);
        }
        for(let tt of savePack.edgeset)
        //{vtmap.get(tt.id1).linkVert(vtmap.get(tt.id2),tt.lineprop);}
        {vtmap.get(tt.id1).addlk(vtmap.get(tt.id2),tt.lineprop);}
        for(let tt of vtmap) 
        {if(tt[0]!=0)tt[1].draw();}
        this.renderMap();
        this.changeStateTo(savePack.state);
    }
}