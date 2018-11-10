export default class History
{
    constructor()
    {
        this.top = -1;
        this.historyStack = new Array();
        this.changedSVGid = new Array();
    }
    add(savePack,changedSVGid)
    {
        if(this.top==99)
        {
            this.historyStack.slice(0,1);
            this.top--;
        }
        this.historyStack[++this.top] = JSON.stringify(savePack);
        this.changedSVGid[this.top] = changedSVGid;//<--------------------------------------------
        this.historyStack.length = this.top+1;
    }
    canUndo(){return this.top>0;}
    canRedo(){return this.top<this.historyStack.length-1;}
    getTopSVGid(){return this.changedSVGid[this.top];}
    getTop(){return this.historyStack[this.top];}
    undo(){return this.historyStack[--this.top];}
    undoSVG(){return this.historyStack[this.top--];}
    redo(){return this.historyStack[++this.top];}
}