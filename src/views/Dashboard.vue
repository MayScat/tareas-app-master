<template>
  <div>
    <v-container fluid>
      <v-row class="">
        <v-col cols="12" v-show="this.holidays.length > 0" class="px-5 py-0">
            <v-alert :value="alert" color="warning lighten-3" transition="scale-transition" style="color: red !important;" class="text-center mb-0 pa-2">
                <show-holiday :days="days" :closest_date="closest_date" :closest_date_name="closest_date_name"></show-holiday>
            </v-alert>
            <v-alert v-if="outs != ''" :value="alert" color="error lighten-3" transition="scale-transition" style="color: black !important;" class="text-center mb-0 mt-3 pa-2">
              <span @click="$router.push('/calendar')" style="cursor: pointer;" v-html="outs" ></span>
            </v-alert>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-card class="elevation-1">
            <v-toolbar class="elevation-0 mt-0 pt-1" dark>
              <v-row>
                <v-col class="pa-0 mb-auto mt-auto">
                  <v-toolbar-title>
                    <v-icon class="pb-1">mdi-view-dashboard</v-icon>Tasks: {{ tasks.length }}
                  </v-toolbar-title>
                </v-col>
                <v-col class="pa-0">
                  <v-autocomplete
                    :items="customers" 
                    outlined
                    color="white"
                    item-text="text"
                    label="Client"
                    v-model="selectedClient"
                    hide-details
                    @change="getTasks()"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="3" class="pa-0">
                  <v-select outlined :items="statuses" style="white-space: nowrap;" v-model="selectedStatus" @change="getTasks()" label="Status" hide-details></v-select>
                </v-col>
                <v-col class="pa-0">
                  <v-select outlined :items="ownership" v-model="selectedOwner" @change="getTasks()" label="Assigned" hide-details></v-select>
                </v-col>
                <v-col class="pa-0 text-center mb-auto mt-auto">
                  <create-task></create-task>
                </v-col>
              </v-row>
            </v-toolbar>
            <v-card-text>
                <v-data-table max-height="500px" :items="tasks" :headers="headers2" :items-per-page="10" @click:row="getTaskInfo" style="cursor: pointer;">
                    <template v-slot:item.status="{ item }">
                      <v-chip :color="'#'+item.status_bgcolor" :style="{color: '#'+item.status_fcolor}">{{ item.status }}</v-chip>
                    </template>
                    <template v-slot:item.customer="{ item }">
                      {{ item.customer }} / {{ item.project }} / {{item.task }}
                    </template>
                    <template v-slot:item.time="{ item }">
                      <span :style="{color: item.timer_active ? 'red' : 'black'}">{{item.time}}</span>
                    </template>
                    <template v-slot:item.msg="{ item }">
                      <v-badge v-if="item.msg > 0" color="purple" right overlap>
                        <template v-slot:badge>
                          {{item.msg}}
                        </template>
                        <v-icon color="primary" large>mdi-chat</v-icon>
                      </v-badge>
                      <v-icon v-else color="primary" large>mdi-chat</v-icon>
                    </template>
                    <template v-slot:item.docs="{ item }">
                      <v-badge v-if="item.docs > 0" color="error" right overlap>
                        <template v-slot:badge>
                          {{item.docs}}
                        </template>
                        <v-icon color="secondary" large>mdi-file</v-icon>
                      </v-badge>
                      <v-icon v-else color="secondary" large>mdi-file</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="5" md="5" sm="12">
          <v-card class="elevation-1">
            <v-toolbar dense class="elevation-0" dark>
              <v-icon class="mr-2">mdi-view-dashboard</v-icon>
              <v-toolbar-title>
                Customers
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-subheader class="font-weight-bold">
                <v-text-field append-icon="mdi-magnify" label="Search" v-model="search"></v-text-field>
              </v-subheader>
              <v-data-table :headers="headers" :items="clients" sort-by="min_due" :items-per-page="10" :search="search.trim()" style="cursor: pointer;">
                <template v-slot:item.open_tasks="{ item }">
                  <router-link :to="{ path: '/config/tasks', query: { client: item.client_id } }">{{ item.open_tasks }}</router-link>
                </template>
                <template v-slot:item.total_projects="{ item }">
                  <router-link :to="{ path: '/config/projects', query: { client: item.client_id } }">{{ item.total_projects }}</router-link>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="7" md="7" sm="12">
          <v-card class="elevation-1">
            <v-toolbar dense class="elevation-0" dark>
              <v-icon class="mr-2">mdi-view-dashboard</v-icon>
              <v-toolbar-title>
                Team
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-subheader class="font-weight-bold">
                <v-text-field append-icon="mdi-magnify" label="Search" v-model="search2"></v-text-field>
              </v-subheader>
              <v-data-table :headers="headers3" :items="team" :items-per-page="10" :search="search2.trim()" @click:row="goToTeam" style="cursor: pointer;">
                <template v-slot:item.user="{ item }">
                      <v-avatar size="30" :color="item.bColor">
                        <span class='text-center' :style="{ color: item.fColor, fontSize: '12px' }"><b>{{ item.code }}</b></span>
                      </v-avatar>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <closed-timers-modal></closed-timers-modal>
    </v-container>
  </div>
</template>
<script>
  import CreateTask from '@/components/CreateTaskModal.vue'
  import ClosedTimersModal from '@/components/ClosedTimersModal.vue'
  import ShowHoliday from '@/components/showholiday.vue'
  export default {
    components: {
      CreateTask,
      ClosedTimersModal,
      ShowHoliday
    },
    data() {
      return {
        tasks: [],
        clients: [],
        customers: [],
        team:[],
        search: '',
        search2: '',
        client_name: '',
        selectedClient: '',
        selectedOwner: 'owner',
        selectedStatus: 1,
        alert: false,
        closest_date: '',
        days: 0,
        holidays: [],
        closest_date_name: '',
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
            text: 'Owned',
            value: 'owner'
          },
          {
            text: 'Supporting',
            value: 'supporting'
          },
          {
            text: 'Owned & Supporting',
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
                text: "Comm.",
                align: "center",
                value: "msg"
            },
            {
                text: "Docs",
                align: "center",
                value: "docs"
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
        headers3: [
            { 
                text: "User",
                align: "center",
                value: "user"
            },
            {
                text: "Open",
                align: "center",
                value: "open_tasks"
            },
            {
                text: "Min Due",
                align: "left",
                value: "min_due"
            },
            {
                text: "MTD %",
                align: "left",
                value: "work_pct"
            },
            {
                text: "Time",
                align: "center",
                value: "time"
            },
            {
                text: "Currently Working",
                align: "left",
                value: "oof"
            }
        ],
        outs: '',
        headers: [{
            text: "Client",
            value: "client_name"
          },
          {
            text: "Proj.",
            align: "center",
            value: "total_projects"
          },
          {
            text: "OPN",
            align: "center",
            value: "open_tasks"
          },
          {
            text: "Min Due",
            value: "min_due"
          }
        ]
      }
    },
    filters: {

    },
    beforeCreate(){
      if(!this.$session.exists()) {
        this.$router.replace('/');
      }
    },
    mounted() {
      if(this.$session.exists()){
        this.getClients()
        this.getTeam()
        this.getOuts()
        this.getTasks()
        this.getCustomers()
        this.getHolidays()
        this.alert = this.$session.get('alert');
         Events.$on("reload", () => {
          this.getClients()
          this.getTeam()
          this.getTasks()
         })
         Events.$on("toggle-alert", () => {
            this.$session.set('alert', !this.alert);
            this.alert = this.$session.get("alert");
         })
         Events.$emit('float')
      }
    },
    methods: {
      getTaskInfo(value){
        this.$router.push({ name: 'task-edit', params: { taskId: value.task_id }})
      },
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
      getClients(){
        this.apiCall('get-clients-dashboard').then((res) => {
          if(res.success){
            this.clients = res.clients
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getOuts(){
        this.apiCall('get-outs-dashboard').then((res) => {
          if(res.success){
            console.log(res.outs);
            this.outs = res.outs
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      closeAlert(){
        this.$session.set('alert', false)
        this.alert = false
      },
      goToTeam(value){
        this.$router.push({ name: 'team-member', params: { memberId: value.id }})
      },
      getHolidays(){
        this.apiCall('get-holidays').then((res) => {
          if(res.success){
            this.holidays = res.holidays
            console.log(this.holidays)
            this.closest_date = this.holidays.length > 0 ? this.holidays[0].date : '';
            this.closest_date_name = this.holidays.length > 0 ? this.holidays[0].holiday_name : '';
            this.days = this.holidays.length > 0 ? this.holidays[0].days : 0;
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getTasks(){
        this.apiCall('get-tasks-dashboard', {status: this.selectedStatus, ownership: this.selectedOwner, client: this.selectedClient}).then((res) => {
          if(res.success){
            this.tasks = res.tasks
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getTeam(){
        this.apiCall('get-team-dashboard').then((res) => {
          if(res.success){
            this.team = res.users
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getProjects(data){
        this.client_name = data.client_name
      }
    }
  };
</script>
<style scoped>
tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
 }
</style>