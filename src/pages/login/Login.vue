<template>
  <div id="Login">
  
    <v-container>
      <v-card max-width="400">
        <v-card-title primary-title>
          <h1>长顺可视化数据库</h1>

        <v-form v-model="valid">
          <v-text-field id="adminId" 
            v-model="LoginParams.adminId"
            :rules="idRules"
            prepend-inner-icon="person"
            label="用户名"
            required
          ></v-text-field>
    
          <v-text-field id="password"
            v-model="LoginParams.password"
            :rules="passwordRules"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="lock" 
            label="密码"
            required
            @click:append="showPassword = !showPassword"
          ></v-text-field>
  
          <v-card-actions>
            <v-btn color="primary" large block @click="submit">
              登录
            </v-btn>
          </v-card-actions>
        </v-form>
        
        </v-card-title>
      </v-card>
    </v-container>

  </div>
</template>

<script>
import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    return {
      valid: true,
      showPassword: false,
      LoginParams: {
        adminId: "",
        password: ""
      },
      idRules: [
        id => !!id || '用户名必填'
      ],
      passwordRules: [
        psw => !!psw || '密码必填'
      ]

    };//end return
  },

  methods: {
    submit: function() {
      if(this.valid){
        console.log("try submit");
        let formData=new URLSearchParams();
        //use md5 to encode password
        this.LoginParams.password = md5(this.LoginParams.password);
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
        );
      } else {
        console.log("Invalid Input");
      }
    }//end submit
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Login {
  text-align: center;
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
