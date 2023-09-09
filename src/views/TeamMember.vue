<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <table width="100%">
                    <tr>
                        <td class="text-right pl-3">
                            <v-avatar size="50" :color="member_info.bgColor">
                                <span class='text-center' :style="{ color: member_info.fColor, fontSize: '18px' }"><b>{{ member_info.user_code }}</b></span>
                            </v-avatar>
                        </td>
                        <td class="text-left pl-3" style="border-right: 1px solid black;">
                            <p class="mb-0">{{ member_info.name }}</p>
                            <p class="mb-0">{{ member_info.email }}</p>
                        </td>
                        <td class="text-left pl-3 pr-3" style="border-right: 1px solid black;">
                            <h3>Month to Date:</h3>
                            <p class="mb-0">MTD: {{ member_info.hours_worked }} ({{ member_info.work_pct}})</p>
                            <p class="mb-0">VAC: {{ member_info.mtd_vac }} SIC: {{ member_info.mtd_sic }} OTH: {{ member_info.mtd_otr }}</p>
                        </td>
                        <td class="text-left pl-3 pr-3" style="border-right: 1px solid black;">
                            <h3>Year to Date:</h3>
                            <p class="mb-0">YTD: {{ member_info.hours_worked_ytd }} ({{ member_info.work_pct_ytd}})</p>
                            <p class="mb-0">VAC: {{ member_info.ytd_vac }} SIC: {{ member_info.ytd_sic }} OTH: {{ member_info.ytd_otr }}</p>
                        </td>
                        <td class="text-center pl-3 pr-3" style="border-right: 1px solid black;">
                            <p class="mb-2">CURRENTLY WORKING:</p>
                            <p class="mb-0">{{ member_info.working_on }}</p>
                        </td>
                        <td class="text-center px-3" style="border-right: 1px solid black;">
                            <p class="mb-2">Next Out:</p>
                            <p class="mb-0" v-if="member_info.start_date != ''">{{ member_info.start_date }} - {{ member_info.end_date }} ({{member_info.reason}})</p>
                            <p class="mb-0" v-else>N/A</p>
                        </td>
                    </tr>
                </table>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8">
                <v-card>
                    <v-toolbar class="elevation-0 pt-1" dark>
                        <v-row>
                        <v-col class="pa-0">
                            <v-select outlined :items="customers" v-model="selectedClient" @change="getTasks()" label="Client" hide-details></v-select>
                        </v-col>
                        <v-col cols="4" class="pa-0">
                            <v-select style="white-space: nowrap;" outlined :items="statuses" v-model="selectedStatus" @change="getTasks()" label="Status" hide-details></v-select>
                        </v-col>
                        <v-col class="pa-0">
                            <v-select outlined :items="ownership" v-model="selectedOwner" @change="getTasks()" label="Assigned" hide-details></v-select>
                        </v-col>
                        <v-col class="pa-0 text-center mb-auto mt-auto">
                            <create-task></create-task>
                        </v-col>
                        </v-row>
                    </v-toolbar>
                    <hr>
                    <v-data-table max-height="500px" :items="tasks" :headers="headers2" :items-per-page="10" @click:row="getTaskTimers" style="cursor: pointer;">
                        <template v-slot:item.status="{ item }">
                          <v-chip :color="'#'+item.status_bgcolor" :style="{color: '#'+item.status_fcolor}">{{ item.status }}</v-chip>
                        </template>
                        <template v-slot:item.customer="{ item }">
                            <router-link :to="{ name: 'task-edit', params: { taskId: item.task_id } }">{{ item.customer }} / {{ item.project }} / {{item.task }}</router-link>
                        </template>
                        <template v-slot:item.time="{ item }">
                          <span :style="{color: item.timer_active ? 'red' : 'black'}">{{item.time}}</span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card>
                    <v-toolbar class="elevation-0" dark>
                        <v-toolbar-title>Timers:</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <add-timer v-show="selectedTask != ''" :task_id="selectedTask"></add-timer>
                    </v-toolbar>
                    <v-card-text class="scroll2">
                        <table width="100%">
                            <tr v-for="timer in timers" :key="timer.timer_id">
                                <td style="word-wrap: break-word; white-space: pre-wrap; border-bottom: 1px solid lightgrey;">
                                    <edit-timer 
                                    :label="timer.start_time_label + ' - ' + timer.end_time_label"
                                    :task_id="timer.task_id" 
                                    :client_id="timer.client_id" 
                                    :project_id="timer.project_id" 
                                    :timer_id="timer.timer_id"
                                    :start_tm="timer.start_time" 
                                    :start_dt="timer.start_date" 
                                    :end_tm="timer.end_time" 
                                    :end_dt="timer.end_date"
                                    :notes="timer.timer_details"
                                    :tp="timer.task_type_id"
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
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import CreateTask from '@/components/CreateTaskModal.vue'
import EditTimer from '@/components/EditTimerModalConfigFull.vue'
import AddTimer from '@/components/AddTimer.vue'
import moment from 'moment'
export default {
    components: {
        CreateTask,
        EditTimer,
        AddTimer
    },
    data() {
        return {
            customers: [],
            statuses: [],
            ownership: [],
            tasks: [],
            member_info: {},
            selectedClient: '',
            selectedStatus: 1,
            selectedTask: '',
            timers: [],
            selectedOwner: 'owner',
            statuses: [
          {
            text: 'All',
            value: 'All'
          },
          {
            text: 'New & Current',
            value: 1
          },
          {
            text: 'Hold',
            value: 3
          },
          {
            text: 'Completed',
            value: 5
          },
          {
            text: 'Cancelled',
            value: 9
          }],
        ownership: [
          {
            text: "My tasks Only",
            value: 'owner'
          },
          {
            text: 'Supporting',
            value: 'supporting'
          },
          {
            text: 'All',
            value: 'All'
          }
        ],
        headers2: [
            {
                text: "Due",
                align: "left",
                value: "due_date"
            },
            {
                text: "Status",
                align: "center",
                value: "status"
            },
            {
                text: "Customer/Project/Task",
                align: "left",
                value: "customer"
            },
            {
                text: "Est.",
                align: "center",
                value: "estimated_hours"
            },
            {
                text: "Time",
                align:"center",
                value: "time"
            }
        ],
        }
    },
    mounted(){
        this.getTasks()
        this.getCustomers()
        this.getClients()
        this.getMemberInfo()
        Events.$on("reload", () => {
          this.getTaskTimersById(this.selectedTask)
          this.getTasks()
       })
    },
    methods: {
        getCustomers(){
            this.apiCall('get-clients-dropdown').then((res) => {
                if (res.success) {
                    res.clients.forEach(element => {
                        this.customers.push({text: element.client_name, value: element.id})
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
        },
        getTasks(){
            this.apiCall('get-tasks-dashboard', {status: this.selectedStatus, ownership: this.selectedOwner, client: this.selectedClient, user_id: this.$route.params.memberId}).then((res) => {
              if(res.success){
                this.tasks = res.tasks
              }
            }).catch((error) => {
              console.log(error)
            })
        },
        getMemberInfo(){
            this.apiCall('get-member-info', {user_id: this.$route.params.memberId}).then((res) => {
              if(res.success){
                this.member_info = res.member_info
              }
            }).catch((error) => {
              console.log(error)
            })
        },
        getTaskTimers(value){
            this.selectedTask = value.task_id
            this.apiCall('get-task-timers', {user_id: this.$route.params.memberId, task_id: this.selectedTask}).then((res) => {
              if(res.success){
                this.timers = res.timers
              }
            }).catch((error) => {
              console.log(error)
            })
        },
        getTaskTimersById(value){
            this.apiCall('get-task-timers', {user_id: this.$route.params.memberId, task_id: value}).then((res) => {
              if(res.success){
                this.timers = res.timers
              }
            }).catch((error) => {
              console.log(error)
            })
        },
        getClients(){
          this.apiCall('get-clients-dashboard').then((res) => {
            if(res.success){
              this.clients = res.clients
            }
          }).catch((error) => {
            console.log(error)
          })
        },
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