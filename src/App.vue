<template>
  <v-app>
    <transition name="fade">
    <NavBar v-if="$session.exists()" />
    </transition>
    <v-content>
        <router-view>
        </router-view>
        <div v-show="$session.exists()">
        <pause-timer :area="'float'" v-show="timer.client_code != null"
          :client_code="timer.client_code" :project_name="timer.project_name" 
          :task_name="timer.task_name" :task_id="timer.task_id" :taskType="timer.timer_type"
          :timerDetails="timer.timer_details" :timer_id="timer.timer_id"
          :dateStarted="timer.timer_started_date" :timeStarted="timer.timer_started_time"></pause-timer>
        </div>
    </v-content>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import NavBar from './components/Navbar';
  import PauseTimer from '@/components/PauseTimerModal.vue'
  export default {
    name: 'App',
    components: {
      NavBar,
      PauseTimer
    },
    data() {
      return {
        timer: {}
      }
    },
    mounted(){
      Events.$on("reload", () => {
          this.getTimers()
      })
      Events.$on("float", () => {
          this.getTimers()
      })
      this.getTimers()
    },
    methods: {
      getTimers(){
        if(this.$session.exists()){
          this.apiCall('get-timers-started-float').then((res) => {
                  if (res.success) {
                      this.timer = res.timers
                  }
              }).catch((error) => {
                  console.log(error)
              })
        }
        },
    }
  };
</script>
<style >
#app {
  height: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>