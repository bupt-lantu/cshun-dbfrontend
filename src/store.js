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
    updateVillager(state,payload){
      let tmp=[...state.villagers];
      let ele=tmp.find((obj)=> obj._id==payload.id);
      ele.isInCanvas=payload.isIn;
      state.villagers=[...tmp];
      // let ele=state.villagers.find((obj)=> obj._id==payload.id);
      // ele.isInCanvas=payload.isIn;
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
  },

  actions: {
    getVillagesInfo(context){
      axios.get('village').then((res) =>{
        context.commit('setVillagesInfo',res.data.list);
        context.state.villages=[];
        for(let obj of res.data.list)
          context.state.villages.push(obj.name);
      }).catch((err)=>{
        console.log(err);
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
        await sessionStorage.setItem(`canvas${context.state.currentVillageId}`,res.data.canvas);
        resolve();
      })},
    setCurrentVillageId(context,id){
      context.commit('setCurrentVillageId',id);
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
  }
})
