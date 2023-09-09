<template>
  <v-dialog persistent scrollable v-model="dialog" max-width="400px">
    <v-card>
        <v-toolbar small class="elevation-0" dark>
            <v-toolbar-title>Auto Closed Timers:</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <br>
                <v-alert dark color="secondary" class="text-center">
                    <b>The following timers were left active for more than 8hrs and they were closed automatically by the system or have overlaps between them. Please revise and confirm them.</b>
                </v-alert>
            <hr>
            <table width="100%">
                <tr v-for="timer in timers" :key="timer.timer_id">
                    <td style="word-wrap: break-word; white-space: pre-wrap; border-bottom: 1px solid lightgrey;">
                        <edit-timer
                        :label="timer.start_time_label + ' - ' + timer.end_time_label"
                        :task_id="timer.task_id" 
                        :timer_id="timer.timer_id"
                        :timeStarted="timer.start_time" 
                        :dateStarted="timer.start_date" 
                        :timeStopped="timer.end_time" 
                        :dateStopped="timer.end_date"
                        :timerDetails="timer.timer_details"
                        :taskType="timer.task_type_id"
                        class="d-inline-block">
                        </edit-timer>
                        <p style="font-weight: bold;" class="mb-0">
                        <v-avatar size="23" :color="timer.bgColor">
                          <span class='text-center' :style="{ color: timer.fColor, fontSize: '11px' }"><b>{{ timer.user_code }}</b></span>
                        </v-avatar> Type: {{ timer.type_label }} - Elapsed: ({{timer.elapsed_time}})</p>
                        <p>{{ timer.timer_details}}</p>
                    </td>
                </tr>
            </table>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false" color="error">Close</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import EditTimer from '@/components/EditTimer.vue'
export default {
    components: {
        EditTimer
    },
    data() {
        return {
            timers: [],
            dialog: false,
        }
    },
    mounted(){
      if(this.$session.exists()){
        this.getTimers()
        Events.$on("reload", () => {
          this.timers = []
          this.getTimers2()
       })
      }
    },
    methods: {
        getTimers2(){
          this.apiCall('get-task-timers-closed', {user_id: this.$session.get('user_id')}).then((res) => {
              if(res.success) {
                this.timers = res.timers
                if(this.timers.length == 0) {
                  this.dialog = false;
                }
              }
            }).catch((error) => {
              console.log(error)
            })
        },
        getTimers(){
            this.apiCall('get-task-timers-closed', {user_id: this.$session.get('user_id')}).then((res) => {
              if(res.success) {
                this.timers = res.timers
                if(this.timers.length > 0){
                    this.dialog = true
                }
              }
            }).catch((error) => {
              console.log(error)
            })
        }
    }
}
</script>

<style>
.scroll2 {
        max-height: 250px; 
        min-height: 60vh;
        overflow-y: scroll;
    }
</style>