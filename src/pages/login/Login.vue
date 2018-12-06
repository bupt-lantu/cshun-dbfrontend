<template>
  <v-app
    class="login"
    light
  >
  <div id="Login">
  
    <v-container>
      <v-card max-width="400">
        <v-card-title primary-title>
          <h1>长顺可视化数据库</h1>

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
            <v-btn color="primary" large block 
              @click="submit">
              登录
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
            console.log("Get Response");
            console.log(response);
            sessionStorage.setItem('isLogin', true);
            this.$router.push({ name: 'select'});
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
