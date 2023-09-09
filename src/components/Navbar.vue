<template>
    <div id="nav" class="container-fluid">
        <v-navigation-drawer app temporary v-model="drawer">
            <v-toolbar dense class="elevation-0">
                <v-spacer></v-spacer>
                <v-toolbar-title>PASS 2.0</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item router to="/home" @click="reload()">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item router to="/dashboard">
                    <v-list-item-icon>
                        <v-icon>mdi-clipboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Projects</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-group prepend-icon="mdi-file-chart" :value="false">
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>Reports</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item class="ml-4" router to="/reports">
                    <v-list-item-icon><v-icon>mdi-file-chart</v-icon></v-list-item-icon>
                        <v-list-item-title >Billing</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="ml-4" router to="/calendar">
                        <v-list-item-icon>
                            <v-icon >mdi-calendar</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title >Calendar</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="ml-4" router to="/billing">
                    <v-list-item-icon><v-icon>mdi-cash-usd-outline</v-icon></v-list-item-icon>
                        <v-list-item-title >Invoices</v-list-item-title>
                    </v-list-item>
                </v-list-group>
                <v-list-group prepend-icon="mdi-brightness-5" :value="false">
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>Config</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item class="ml-4" router to="/config/users">
                    <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
                        <v-list-item-title >Users</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="ml-4" router to="/config/clients">
                        <v-list-item-icon>
                            <v-icon >mdi-account-box-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title >Clients</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="ml-4" router to="/config/projects">
                        <v-list-item-icon>
                            <v-icon >mdi-file</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title >Projects</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="ml-4" router to="/config/tasks">
                        <v-list-item-icon>
                            <v-icon >mdi-file-chart</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title >Tasks</v-list-item-title>
                    </v-list-item>
                    <v-list-item class="ml-4" router to="/config/holidays">
                        <v-list-item-icon>
                            <v-icon >mdi-calendar</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title >Holidays</v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar dark app>
            <v-app-bar-nav-icon class="d-xs-flex d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn text router to="/dashboard" class="d-none d-sm-flex d-sm-none d-md-flex mx-1" @click="reload()">
                <v-icon class="mx-1">mdi-home</v-icon>PASS 2.0
            </v-btn>
            <v-spacer></v-spacer>
            <input type="text" class="search" placeholder="Search" v-model="search_word" @keyup.enter="search(search_word)"><v-icon @click="search(search_word)" class="mx-2">mdi-magnify</v-icon>
            <v-spacer></v-spacer>
            <v-menu open-on-hover bottom color="secondary" offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn light v-on="on" @click="goToTeam()">
                    <v-avatar size="30" :color="bColor">
                        <span class='text-center' :style="{ color: fColor, fontSize: '12px' }"><b>{{ code }}</b></span>
                    </v-avatar>
                    <span class="mx-2">{{name}}</span>
                  </v-btn>
                </template>
                <v-list>
                  <change-password></change-password>
                  <oof-modal :user_id='this.$session.get("user_id")'></oof-modal>
                </v-list>
            </v-menu>
            <v-spacer></v-spacer>
            <v-menu offset-y :close-on-content-click="true" open-on-hover>
                <template v-slot:activator="{ on }">
                    <v-btn light v-on="on" class="d-none d-sm-flex d-sm-none d-md-flex mx-1">
                        <v-icon class="mx-1">mdi-clock</v-icon>My Recent Timers <v-icon class="mx-1">mdi-chevron-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <new-timer></new-timer>
                    <v-divider></v-divider>
                    <div v-for="timer in timers" :key="timer.task_id">
                        <pause-timer v-if="timer.running == 1" :area="'dpd'" 
                        :client_code="timer.client_code" :project_name="timer.project_name" 
                        :task_name="timer.task_name" :task_id="timer.task_id" :taskType="timer.timer_type"
                         :timerDetails="timer.timer_details" :timer_id="timer.timer_id"
                          :dateStarted="timer.timer_started_date" :timeStarted="timer.timer_started_time"></pause-timer>
                        <create-timer v-if="timer.running == 0" 
                        :client_code="timer.client_code" :project_name="timer.project_name"
                         :task_name="timer.task_name" :task_id="timer.task_id" :prev_details="timer.prev_details"></create-timer>
                    </div>
                </v-list>
            </v-menu>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-badge color="red" right overlap :value="new_msg > 0">
                          <template v-slot:badge>
                              {{new_msg}}
                          </template>
                          <v-btn text router to="/chat" v-on="on" class="d-none d-sm-flex d-sm-none d-md-flex mx-1">
                              <v-icon class="mx-1">mdi-chat</v-icon>
                          </v-btn>
                      </v-badge>
                </template>
                <span>Chat</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn text router to="/calendar" v-on="on" class="d-sm-flex d-sm-none d-md-flex mx-1">
                        <v-icon class="mx-1">mdi-calendar</v-icon>
                    </v-btn>
                </template>
                <span>Calendar</span>
            </v-tooltip>
            <!-- <v-btn text router to="/home" class="d-none d-sm-flex d-sm-none d-md-flex mx-1">
                <v-icon class="mx-1">mdi-clipboard</v-icon>Projects
            </v-btn> -->
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn text dark v-on="on" class="d-none d-sm-flex d-sm-none d-md-flex mx-1">
                        <v-icon class="mx-1" title="Reports">mdi-file-chart</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item router to="/reports/timers">
                        <v-list-item-title>
                            <v-icon>mdi-clock</v-icon>Timers
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/reports/billing">
                        <v-list-item-title>
                            <v-icon>mdi-file-check</v-icon>Reports Billing
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/Billing">
                        <v-list-item-title>
                            <v-icon>mdi-file-chart</v-icon>Invoices
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn text dark v-on="on" class="d-none d-sm-flex d-sm-none d-md-flex mx-1">
                        <v-icon class="mx-1" title="Config">mdi-brightness-5</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item router to="/config/users">
                        <v-list-item-title>
                            <v-icon>mdi-account</v-icon>Users
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/config/clients">
                        <v-list-item-title>
                            <v-icon>mdi-account-outline</v-icon>Clients
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/config/projects">
                        <v-list-item-title>
                            <v-icon>mdi-file</v-icon>Projects
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/config/tasks">
                        <v-list-item-title>
                            <v-icon>mdi-file-chart</v-icon>Tasks
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/config/holidays">
                        <v-list-item-title>
                            <v-icon>mdi-calendar</v-icon>Holidays
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on" class="d-none d-sm-flex d-sm-none d-md-flex mx-1" @click="logout">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </template>
                <span>Logout</span>
            </v-tooltip>
        </v-app-bar>
    </div>
</template>

<script>
    import NewTimer from '@/components/CreateNewTimerModal.vue'
    import CreateTimer from '@/components/CreateTimerModalDpd.vue'
    import PauseTimer from '@/components/PauseTimerModal.vue'
    import ChangePassword from '@/components/changePasswordModal.vue'
    import OofModal from '@/components/oofModal.vue'
    import SearchModal from '@/components/SearchModal.vue'
    export default {
        components: {
            NewTimer,
            CreateTimer,
            PauseTimer,
            ChangePassword,
            OofModal,
            SearchModal
        },
        data() {
            return {
                drawer: false,
                name: "",
                new_msg: 0,
                timers: [],
                timer_call: null,
                days: 0,
                holidays: [],
                closest_date: '',
                closest_date_name: '',
                alert: true,
                bColor: '',
                fColor: '',
                code: '',
                search_word: ''
            }
        },
        mounted() {
            if (this.$session.exists() && this.$session.has('user_id')) {
                this.timer_call = setInterval(() => {
                    this.getMessages()
                }, 15000);
                this.name = this.$session.get('userInfo').name
                console.log(this.name)
                this.getTimers()
            } else {
                clearInterval(this.timer_call);
            }

            Events.$on("reload", () => {
                this.getTimers()
            })
            this.bColor = this.$session.get('bColor');
            this.fColor = this.$session.get('fColor');
            this.code = this.$session.get('code');
        },
        
        methods: {
            goToTeam(value){
                this.$router.push({ name: 'team-member', params: { memberId: this.$session.get('user_id') }, force: true})
            },
            toggleAlert(){
                Events.$emit('toggle-alert')
            },
            search(word){
                if(word.trim() == ''){
                    alert('Please write a word to search');
                }  else {
                    this.$router.push({ path: '/search', query: { search_word: word } })
                }
            },
            getTimers(){
                this.apiCall('get-timers-dropdown').then((res) => {
                        if (res.success) {
                            this.timers = res.timers
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
            },
            getMessages(){
                if(this.$session.exists()){
                    this.new_msg = 0
                    this.apiCall('check-messages').then((res) => {
                        if (res.success) {
                            this.new_msg = res.msgs
                            if(this.$route.name == 'chat-hub'){
                                Events.$emit('reload-chats')
                            }
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                } else {
                    clearInterval(this.timer_call);
                    this.$router.replace('/')
                }
            },
            reload(){
                Events.$emit('reload')
            },
            logout() {
                this.$session.destroy();
                this.$router.push('/');
                clearInterval(this.timer_call);
            }
        }
    }
</script>

<style scoped>
@media all and (min-width: 0.1px) and (max-width: 800px) {
  .mobhide {
    display: none !important;
  }
}
.search {
    padding: 5px; 
    border: 1px solid white; 
    border-radius: 5px; height: 38px;
}
.search:focus {
  outline: none;
}
</style>