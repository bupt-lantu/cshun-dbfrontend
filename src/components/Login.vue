<template>
  <div id="Login">
    <h1>长顺可视化数据库</h1>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" id="adminId" type="text" 
      v-model="LoginParams.adminId">
      <label class="mdl-textfield__label" for="adminId">用户名</label>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" id="password" type="text" 
      v-model="LoginParams.password">
      <label class="mdl-textfield__label" for="password">密码</label>
    </div>

    <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    @click="submit()">
      登陆
    </button>

  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      LoginParams: {
        adminId: "",
        password: ""
      }
    };
  },

  methods: {
    submit: function() {
      let formData=new URLSearchParams();
      for(let it in this.LoginParams) {
        formData.append(it, this.LoginParams[it]);
      }
      console.log(formData.toString());
      
      this.$Http.post('https://127.0.0.1:8082/login',formData,
      {headers:{'Content-Type':'application/x-www-form-urlencoded'}})
      .then( 
        response => {
          console.log("Get Response");
          console.log(response);
          },
        error => {
          console.log("Error");
          console.log(error);
          }
      )
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Login {
  text-align: center;
  background-color: rgb(163, 155, 155);
  padding: 20px;
}
#Login div {
  margin-top: 20px;
  margin-right: auto;
  margin-bottom: 20px;
  margin-left: auto;
  display: block;
}
</style>
