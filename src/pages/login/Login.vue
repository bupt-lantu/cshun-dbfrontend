<template>
  <v-app
    class="login"
    light
  >
  <div id="Header">
    <img width="384" height="73" src="../../assets/logo.png"/>
  </div>
  <div id="Login">
    <v-container>
      <v-card max-width="400">
        <v-card-title primary-title>
          <h1>欢迎登录</h1>
        <v-form ref="form" v-model="valid">
          <v-text-field id="username" 
            v-model="username"
            :rules="idRules"
            :error-messages="idError"
            prepend-inner-icon="person"
            label="用户名"
            required
          ></v-text-field>
    
          <v-text-field id="password"
            v-model="password"
            :rules="passwordRules"
            :error-messages="passwordError"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="lock" 
            label="密码"
            required
            @click:append="showPassword = !showPassword"
          ></v-text-field>
  
          <v-card-actions>
            <v-btn color="teal" large block 
              @click="submit">
              <span style="color: white; font-size: 150%">登录</span>
            </v-btn>
          </v-card-actions>
        </v-form>
        
        </v-card-title>
      </v-card>
    </v-container>

  </div>
  </v-app>
</template>

<script>
// import md5 from "js-md5";
export default {
  name: "Login",
  data() {
    return {
      valid: true,
      showPassword: false,
      username: "",
      password: "",
      idRules: [
        id => !!id || '用户名必填'
      ],
      passwordRules: [
        psw => !!psw || '密码必填'
      ],
      idError: '',
      passwordError: ''
    };//end return
  },

  watch: {
    username: function() {
      this.idError = '';
    },
    password: function() {
      this.passwordError = '';
    }
  },

  methods: {
    submit: function() {
      if(this.$refs.form.validate()){
        console.log("try submit");

        let postdata = {};
        postdata.username = this.username;
        //postdata.password = md5(this.password);
        postdata.password = this.password;
        
        this.$Http.post('login', postdata)
        .then(
          response => {
            // console.log(response);
            sessionStorage.setItem('isLogin', true);
            // this.$router.push({ name: 'select'});
            this.switchToRoute(response.data.info.level,response.data.info.visable[0]);
          },
          error => {
            console.log("Error Occurs");
            console.log(error);
            console.log(this.valid);
            if('code' in error && error.code == '401') {
              this.passwordError = '密码错误';
            } else {
              this.idError = '用户名不存在';
            }
          }
        );
      } else {
        console.log("Invalid Input");
      }
    },//end submit
    switchToRoute(level,id){
      this.$store.state.userLevel=level;
      this.$store.state.userRespectId=id;
      if(level==7){
        this.$router.push({ name: 'edit',params:{id:id}});
      }
      else{
         this.$router.push({ name: 'select'});
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Login {
  text-align: center;
  /* padding: 20px; */
  background: url(../../assets/bg01.jpg);
  background-size: 100% 100%;
  width: 80%;
  height: 80%;
  /* right: 500px; */
  margin-top: -10px;
  margin-right: 20px;
}
#Header {
  /* background-color: black; */
  padding: 20px;
}
#Login div {
  top: 40px;
  right: -90%;
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  display: block;
}
</style>
