import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSession from 'vue-session'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import numeral from 'numeral'

const options = {
  persist: true
}

Vue.use(VueSession, options)
Vue.use(numeral)

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    apiCall(action, params) {
      var form = new FormData()

      var vals = {
        action: action,
        actionParameters: params
      }
      if (this.$session.exists()) {
        vals.auth_token = this.$session.get('auth_token')
        vals.user_id = this.$session.get('user_id')
      } else {
        clearInterval(this.timer_call);
        this.$router.replace('/')
      }
      form.append("appRequest", JSON.stringify(vals));
      return axios.post("https://pass2.design2net.com/api/", form).then((response) => {
        console.log(response)
        if (response.data.success == true) {
            return response.data.data
        } else {
          if(response.data.error == 'AUTH EXPIRED'){
            this.$session.destroy();
            clearInterval(this.timer_call);
            this.$router.replace('/');
          }
        }
      }).catch((error) => {
        return error
      })
    }
  }
})

window.Events = new Vue()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')