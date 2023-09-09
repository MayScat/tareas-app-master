<template>
  <v-container fluid>
    <v-row>
      <v-col class="col-md-6 col-sm-12">
        <v-card>
          <v-toolbar dense dark>
            <v-toolbar-title>
              <v-icon class="mx-1">mdi-clock</v-icon>Ticket
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <edit-ticket-modal :projects="projs" :ticket="ticket" :users="users" v-if="tickets.length != 0">
            </edit-ticket-modal>
          </v-toolbar>
          <v-container fluid>
            <v-row class="px-1">
              <v-col sm="12">
                <v-row no-gutters>
                  <v-col cols="12" sm="12" md="6">
                    <v-card class="pa-2 elevation-0">
                      <v-card-text>
                        <h3>Client: <small>{{ticket.client}}</small></h3>
                        <v-divider class=""></v-divider>
                        <h3>Project: <small>{{ticket.proj}}</small></h3>
                        <v-divider class=""></v-divider>
                        <h3>Sub-Project: <small>{{ticket.sub}}</small></h3>
                        <v-divider class=""></v-divider>
                        <h3>Added at: <small>{{ticket.created_at | dateForm}}</small></h3>
                        <v-divider class=""></v-divider>
                        <h3>Last Timer Date: <small>{{ticket.last_timer_date | dateForm}}</small></h3>
                        <v-divider class=""></v-divider>
                        <h3><details-modal :ticket_id="ticket.id"></details-modal></h3>
                        <v-divider class=""></v-divider>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="12" md="6">
                    <v-card class="pa-2 text-center elevation-0">
                      <v-card-title>
                        {{ticket.name}}
                      </v-card-title>
                      <v-divider class="mb-3"></v-divider>
                      <v-card-text class="pa-2">
                        <p style="font-size: 50px">{{today | timeForm}}</p>
                      </v-card-text>
                      <start-timer :timer_id="timer_id" :isDisabled="disableStart" :tName="ticket.name"
                        :tSub="ticket.proj" :timerDetails="ticket.timer_details" :timer_type="ticket.timer_type" :tCode="ticket.pCode"
                        :ticket="ticket.id" :client_id="ticket.client_id" :timerId="ticket.timer"></start-timer>
                      <stop-timer :timer_id="timer_id" :timer_type="ticket.timer_type" :isDisabled="disableStop" :tName="ticket.name"
                        :timerDetails="ticket.timer_details" :tSub="ticket.proj" :tCode="ticket.pCode"
                        :ticket="ticket.id" :client_id="ticket.client_id"></stop-timer>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card class="mt-3">
          <v-toolbar dense class="elevation-1" dark>
            <v-toolbar-title>
              <v-icon class="mx-1">mdi-file-check-outline</v-icon>Tickets
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <create-ticket></create-ticket>
          </v-toolbar>
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table :headers="headers2" dense :items="tickets" style="cursor: pointer;" :search="search.trim()" @click:row="setTicket">
            <template v-slot:item.action="{ item }">
              <v-btn></v-btn>
              <v-icon small>
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col class="col-md-6 col-sm-12">
        <v-card width="100%">
          <v-toolbar dense class="elevation-1" dark>
            <v-toolbar-title>
              <v-icon class="mx-1">mdi-clock</v-icon>Timers
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <custom-timer :timer_id="timer_id" :isDisabled="disableStart" :tName="ticket.name" :tSub="ticket.proj"
              :timerDetails="ticket.timer_details" :tCode="ticket.pCode" :ticket="ticket.id"
              :client_id="ticket.client_id" :timerId="ticket.timer"></custom-timer>
          </v-toolbar>
          <v-card-title>
            <v-text-field v-model="search2" append-icon="mdi-magnify" label="Search" single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table dense :footer-props="rows" :headers="headers" :items="timers"
            :search="search2.trim()">
            <template v-slot:item.details="{ item }">
              <td style="border: 0; padding: 5px;  line-height: 1;">
              <small>
                <h4 class="ma-0">{{item.timer}} - {{item.type | projType}} | {{item.hours | timeForm}} hrs <edit-timer-modal style="display: inline-block;" :id="item.id" v-if="item.billing_id == 0">
              </edit-timer-modal></h4>
              </small>
              <small class="ma-0" style="color: green;" v-if="item.stopped_at == ''">{{item.started_at | dateForm}} -
                {{item.stopped_at == '' ? "Now" : item.stopped_at | dateForm2}}</small>
                <small class="ma-0" v-else>{{item.started_at | dateForm}} -
                {{item.stopped_at == '' ? "Now" : item.stopped_at | dateForm2}}</small><br>
                <small><truncate clamp="Read More" :length="110" less="Show Less" :text="item.details"></truncate></small>
                </td>
            </template>
            <template v-slot:item.action="{ item }">
              <v-icon big color="error darken-2" @click="deleteTimer(item.id)" v-if="item.billing_id == 0">mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import truncate from 'vue-truncate-collapsed';
  import ModalDirection from "@/components/Modal";
  import DetailsModal from "@/components/detailsModal.vue"
  import EditTimerModal from "@/components/EditTimerModal.vue";
  import CreateTicket from "@/components/CreateTicketModal";
  import StartTimer from "@/components/CreateTimerModal.vue"
  import StopTimer from "@/components/StopTimerModal.vue";
  import CustomTimer from "@/components/CustomTimerModal.vue";
  import ProjectModal from '@/components/Modal.vue'
  import SubProjectModal from '@/components/SubProjectModal.vue'
  import EditTicketModal from '@/components/EditTicketModal.vue'
  import numeral from 'numeral'
  import moment from 'moment'
  export default {
    components: {
      truncate,
      ModalDirection,
      DetailsModal,
      EditTimerModal,
      CreateTicket,
      StartTimer,
      StopTimer,
      CustomTimer,
      ProjectModal,
      SubProjectModal,
      EditTicketModal
    },
    data() {
      return {
        search: '',
        search2: '',
        users: [],
        disableStart: false,
        disableStop: false,
        showMenu: false,
        rows: {
          'items-per-page-options': [10, 25, 50, {
            "text": "All",
            "value": -1
          }]
        },
        headers: [{
            text: 'Timer',
            value: 'details',
          }, {
            text: 'Del',
            sortable: false,
            value: 'action'
          }
        ],
        headers2: [{
          text: 'Ticket Name',
          value: 'name'
        }, {
          text: "Client",
          value: "client"
        }, {
          text: 'Project Name',
          value: 'project_name'
        }, {
          text: 'Sub-Project Name',
          value: 'sub_project_name'
        }],
        interval: '',
        projects: [],
        tickets: [],
        subProjects: [],
        clients: [],
        projs: [],
        subs: [],
        timers: [],
        ticket: {
          timer_type: 12,
          last_timer_date: new Date(),
          id: 0,
          name: '',
          sub: '',
          client: '',
          proj: '',
          user: '',
          pCode: '',
          client_id: 0,
          timer_details: '',
          members: ''
        },
        today: null,
        timer_id: 0
      }
    },
    filters: {
      timeForm(value) {
        return numeral(value).format('00:00:00').slice(0, -3);
      },
      dateForm(value) {
        return moment(value).format("lll")
      },
      dateForm2(value){
        if(value == "Now"){
          return "Now"
        } else {
          return moment(value).format("lll")
        }
      },
      truncate(str) {
        if (str.length <= 50) {
          return str
        }
        // Return str truncated with '...' concatenated to the end of str.
        return str.slice(0, 50) + '...'
      },
      projType(value) {
        if (value == 12) {
          return "Programming (General)"
        } else if (value == 3) {
          return "Programming (New Feature)"
        } else if (value == 2) {
          return "Bugs / Errors"
        } else if (value == 47) {
          return "Support"
        } else if (value == 1) {
          return "Counsulting"
        } else if (value == 4) {
          return "Programming (Changes)"
        } else if (value == 6) {
          return "Validation"
        } else if (value == 8) {
          return "Meeting (Client-Site)"
        } else if (value == 9) {
          return "Phone Call / Conference Call"
        } else if (value == 45) {
          return "Programming (On-Site)"
        } else if (value == 46) {
          return "Database / Stored Procedures"
        } else if (value == 48) {
          return "Project Management"
        } else if (value == 49) {
          return "Bugs / Errors (Client/Other)"
        } else if (value == 55) {
          return "Diseño Gráfico / Layout"
        } else if (value == 56) {
          return "Editorial & Copy"
        } else if (!isNumber(value)) {
          return value
        }
      }
    },
    mounted() {
      Events.$on('reload', () => {
        this.getLastTicket()
        this.getTickets()
        this.getTickets()
      })
      Events.$on('startTimer', () => {
        this.getLastTicket()
      })
      Events.$on('stopTimer', () => {
        this.getLastTicket()
        this.stop()
      })
      this.getLastTicket()
      this.getTickets()
      this.getProjects()
    },
    methods: {
      getTickets() {
        this.apiCall("get-tickets", {
          user_id: this.$session.get("user_id")
        }).then((response) => {
          if (response.success == true) {
            this.tickets = response.tickets
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getProjects(client) {
        this.apiCall("get-project-ids", null).then((response) => {
          if (response.success == true) {
            this.projs = response.projects
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getRunningTimer(){
        this.apiCall('get-running-timer', {id: this.ticket.id, user: this.$session.get("user_id")}).then((res) => {
          this.timers.splice(0, 1, res.started_timer)
        }).catch((error) => {
          console.log(error)
        })
      },
      setTicket(data) {
        clearInterval(this.interval)
        this.ticket.name = data.name
        this.ticket.created_at = data.created_at
        this.ticket.last_timer_date = data.last_timer_date
        this.ticket.proj = data.project_name
        this.ticket.sub = data.sub_project_name
        this.ticket.user = this.$session.get('userInfo').name
        this.ticket.pCode = data.project_code
        this.ticket.client = data.client
        this.ticket.timer_type = data.last_timer_type
        this.ticket.id = data.id
        this.ticket.status = data.status
        this.ticket.client_id = data.client_id
        this.ticket.project_id = data.project_id
        this.ticket.sub_project_id = data.sub_project_id
        this.ticket.priority = data.priority
        this.ticket.members = data.members
        this.ticket.description = data.description
        this.apiCall("get-ticket-time", {
          ticket_id: data.id,
          user_id: this.$session.get('user_id')
        }).then((response) => {
          if (response.success == true) {
            if (response.started) {
              this.disableStart = true
              this.disableStop = false
              this.timer_id = response.timer_id
              this.ticket.timer_details = response.timer_details
              this.startTimer()
            } else {
              this.ticket.timer_details = response.timer_details
              this.disableStart = false
              this.disableStop = true
            }
            this.today = response.time
            this.timers = response.timers_list
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      startTimer() {
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.today += 60
          this.getRunningTimer()
        }, 60000)
      },
      getLastTicket() {
        this.apiCall("get-last-ticket", {
          id: this.$session.get('user_id')
        }).then((response) => {
          if (response.success == true) {
            if (response.started) {
              this.disableStart = true
              this.disableStop = false
              this.timer_id = response.timer_id
              this.startTimer()
            } else {
              this.disableStart = false
              this.disableStop = true
            }
            this.today = response.time
            this.timers = response.timers_list
            this.ticket.name = response.ticket.name
            this.ticket.last_timer_date = response.ticket.last_timer_date
            this.ticket.created_at = response.ticket.created_at
            this.ticket.proj = response.ticket.project_name
            this.ticket.sub = response.ticket.sub_project_name
            this.ticket.user = this.$session.get('userInfo').name
            this.ticket.pCode = response.ticket.project_code
            this.ticket.client = response.ticket.client
            this.ticket.id = response.ticket.id
            this.ticket.status = response.ticket.status
            this.ticket.timer_type = response.ticket.last_timer_type
            this.ticket.client_id = response.ticket.client_id
            this.ticket.timer_details = response.ticket.timer_details
            this.ticket.project_id = response.ticket.project_id
            this.ticket.members = response.ticket.members
            this.ticket.sub_project_id = response.ticket.sub_project_id
            this.ticket.project_id = response.ticket.project_id
            this.ticket.priority = response.ticket.priority
            this.ticket.description = response.ticket.description
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      stop() {
        this.getLastTicket()
        clearInterval(this.interval)
      },
      deleteTimer(value) {
        confirm("Are you sure you want to delete this timer of this ticket?") && this.apiCall("delete-timer", {
          id: value
        }).then((response) => {
          if (response.success == true) {
            this.getLastTicket()
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getUsers() {
        this.apiCall("get-user-ids", null).then((response) => {
          if (response.success == true) {
            this.users = response.users
          }
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>
tbody tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .05);
 }
  .info-text {
    color: #2196F3;
  }

  .truncate-overflow {
  --max-lines: 3;
  position: relative;
  max-height: calc(var(--lh) * var(--max-lines));
  overflow: hidden;
  padding-right: 1rem; /* space for ellipsis */
}
.truncate-overflow::before {
  position: absolute;
  content: "...";
  /* tempting... but shows when lines == content */
  /* top: calc(var(--lh) * (var(--max-lines) - 1)); */
  
  /*
  inset-block-end: 0;
  inset-inline-end: 0;
  */
  bottom: 0;
  right: 0;
}
.truncate-overflow::after {
  content: "";
  position: absolute;
  /*
  inset-inline-end: 0;
  */
  right: 0;
  /* missing bottom on purpose*/
  width: 1rem;
  height: 1rem;
}
</style>