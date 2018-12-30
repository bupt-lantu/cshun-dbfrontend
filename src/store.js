import Vue from 'vue'
import Vuex from 'vuex'
import axios from './connect.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      // canvas:'',
      villagesInfo:[],
      villages:[],
      villagers:[],
      currentVillageId:'',
      currentVillageName:'',
      towns:[],
      townsArr:[],
      currentTown:'',
      bigvillages:[],
      bigvillagesArr:[],
      currentBigvillage:''
  },

  mutations: {
    setVillagesInfo(state,obj){
      state.villagesInfo=obj;
    },
    setVillagers(state,obj){
      state.villagers=obj;
    },
    // setCanvas(state,obj){
    //   state.canvas=obj;
    // },
    setCurrentVillageId(state,id){
      state.currentVillageId=id;
    },
    setCurrentVillageName(state,name){
      state.currentVillageName=name;
    },
    updateVillager(state,payload){
      let tmp=[...state.villagers];
      let ele=tmp.find((obj)=> obj._id==payload.id);
      ele.isInCanvas=payload.isIn;
      state.villagers=[...tmp];
      // let ele=state.villagers.find((obj)=> obj._id==payload.id);
      // ele.isInCanvas=payload.isIn;
    },
    setTowns(state,payload){
      state.towns=payload;
    },
    setTownsArr(state,payload){
      state.townsArr=[];
      for(let town of payload){
        state.townsArr.push(town.name);
      }
    },
    setCurrentTown(state,payload){
      state.currentTown=payload;
      sessionStorage.setItem('CT',payload);
    },
    setBigvillages(state,payload){
      state.bigvillages=payload;
    },
    setBigvillagesArr(state,payload){
      state.bigvillagesArr=payload;
    },
    setCurrentBigvillage(state,payload){
      state.currentBigvillage=payload;
      sessionStorage.setItem('CB',payload);
    }
  },

  getters:{
    villagesInfo(state){
      return state.villagesInfo;
    },
    villages(state){
      return state.villages;
    },
    villagers(state){
      return state.villagers;
    },
    currentVillageId(state){
      return state.currentVillageId;
    },
    currentVillageName(state){
      return state.currentVillageName;
    },
    towns(state){
      return state.towns;
    },
    townsArr(state){
      return state.townsArr;
    },
    currentTown(state){
      return state.currentTown;
    },
    bigvillages(state){
      return state.bigvillages;
    },
    bigvillagesArr(state){
      return state.bigvillagesArr;
    },
    currentBigvillage(state){
      return state.currentBigvillage;
    }
  },

  actions: {
    getVillagesInfo(context,payload){
      payload.map((xid)=>{
        axios.get(`village/${xid}`).then((res) =>{
          // context.commit('setVillagesInfo',res.data.list);
          context.state.villagesInfo.push(res.data);
          context.state.villages.push(res.data.name);
        }).catch((err)=>{
          console.log(err);
        });
      });
    },

    getVillagers(context,id){
      context.commit('setCurrentVillageId',id);
      // axios.get(`village/${id}?villagerInfo=true`).then((res) =>{
      //   context.commit('setVillagers',res.data.villagers);
      //   sessionStorage.setItem(`canvas${context.state.currentVillageId}`,res.data.canvas);
      // }).catch((err)=>{
      //   console.log(err);
      // });
      return new Promise(async (resolve, reject)=>{
        // context.commit('setCurrentVillageId',id);
        const res=await axios.get(`village/${id}?villagerInfo=true`);
        if(!res)
          reject();
        context.commit('setVillagers',res.data.villagers);
        context.commit('setCurrentVillageName',res.data.name);
        console.log(res);
        await sessionStorage.setItem(`canvas${context.state.currentVillageId}`,res.data.canvas);
        resolve();
      })},
    setCurrentVillageId(context,id){
      context.commit('setCurrentVillageId',id);
    },
    setCurrentVillageName(context,name){
      context.commit('setCurrentVillageName',name);
    },
    updateVillager(context,payload){
      context.commit('updateVillager',payload);
    },
    updateVillagerAll(context){
      for(let villager of context.state.villagers){
          let postData={};
          postData.isInCanvas=villager.isInCanvas;
          axios.post(`villager/${villager._id}`, postData)
          .then(
            () => {
              // console.log(response);
            },
            error => {
              // alert(error);
              console.log(error);
            }
        );
      }
    },
    sentCanvas(context,payload){
      let postData={};
      postData.canvas=payload;
      axios.post(`village/${context.state.currentVillageId}`,postData)
      .then(
        ()=> { 
              // context.commit('setCanvas',payload); 
              sessionStorage.setItem(`canvas${context.state.currentVillageId}`,payload);
            },
        (error) => {
            console.log(error);
        }
      );
    },
    getTowns(context){
      axios.get(`towns`).then((res) => {
        context.commit('setTowns',res.data.list);
        context.commit('setTownsArr',res.data.list);
      })
    },
    getBigvillages(context,id){
      axios.get(`towns/${id}`).then((res) => {
        context.commit('setCurrentTown',res.data.info.name);
        let bigvillages=res.data.info.villages;
        let tmpArr=[];
        let tmp=[];
        const promises=bigvillages.map((xid)=>{
          return axios.get(`bigvillage/${xid}`);
        });
        Promise.all(promises).then((ress)=>{
          for(let res of ress){
            tmpArr.push(res.data.info.name);
            let tmpData={};
            tmpData.id=res.data.info._id;
            tmpData.name=res.data.info.name;
            tmpData.gumis=res.data.info.gumis;
            tmp.push(tmpData);
          }
        }).then(()=>{
          context.commit('setBigvillagesArr',tmpArr);
          context.commit('setBigvillages',tmp);
        }).catch((err) => console.log(err));
      })
    },
    setCurrentBigvillage(context,name){
      context.commit('setCurrentBigvillage',name);
    }
  }
})
