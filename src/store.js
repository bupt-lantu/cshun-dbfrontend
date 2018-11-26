import Vue from 'vue'
import Vuex from 'vuex'
import axios from './connect.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      canvas:{},
      villagesInfo:[],
      villages:[],
      villagers:{},
      currentVillageId:'5beb02d356e9d72429351209',
  },

  mutations: {
    setVillagesInfo(state,obj){
      state.villagesInfo=obj;
    },
    setVillagers(state,obj){
      state.villagers=obj;
      let index=0;
      for(let obj of state.villagers)
        obj.id=++index;
    },
    setCanvas(state,obj){
      state.canvas=obj;
    },
    setCurrentVillageId(state,id){
      state.currentVillageId=id;
    },
    updateVillager(state,payload){
      // let tmp=[...state.villagers];
      // let ele=tmp.find((obj)=> obj.id==payload.id);
      // ele.isInCanvas=payload.isIn;
      // state.villagers=[...tmp];
      let ele=state.villagers.find((obj)=> obj.id==payload.id);
      ele.isInCanvas=payload.isIn;
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
    canvas(state){
      return state.canvas;
    }
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

    getVillagers(context){
      axios.get(`village/${context.state.currentVillageId}?villagerInfo=true`).then((res) =>{
        context.commit('setVillagers',res.data.villagers);
        context.commit('setCanvas',res.data.canvas);
      }).catch((err)=>{
        console.log(err);
      });
    },
    setCurrentVillageId(context,id){
      context.commit('setCurrentVillageId',id);
    },
    updateVillager(context,payload){
      // let postData={};
      // postData.isInCanvas=isIn;
      // axios.post('villager/${id}', postData)
      //   .then(
      //     response => {
      //       context.commit('updateVillager',id,isIn);
      //       console.log(response);
      //     },
      //     error => {
      //       console.log(error);
      //     }
      // );
      context.commit('updateVillager',payload);
    },
  }
})
