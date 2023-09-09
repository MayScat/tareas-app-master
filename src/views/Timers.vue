<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dark class="elevation-2">
                <div @click="menu2=true" style="margin-top: 23px;">
                    <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="date2"
                            label="To Date"
                            readonly
                            outlined
                            append-icon="mdi-calendar"
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                            v-on:click:append="menu2=true"
                            @focus="menu2=true"
                            
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="date2"
                        @input="menu2 = false"
                        @change="getTimersByPagination()"
                        ></v-date-picker>
                    </v-menu>
                </div>
                <div @click="menu1=true" style="margin-top: 23px;">
                    <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto">
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="date1"
                            label="From Date"
                            readonly
                            outlined
                            append-icon="mdi-calendar"
                            hide-details
                            v-bind="attrs"
                            v-on="on"
                            v-on:click:append="menu1=true"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="date1"
                        @input="menu1 = false"
                        @change="getTimersByPagination()"
                        ></v-date-picker>
                    </v-menu>
                </div>
                <v-autocomplete
                    :items="customers" 
                    outlined
                    color="white"
                    item-text="text"
                    label="Client"
                    v-model="selectedClient"
                    hide-details
                    @change="getTimersByPagination()"
                  ></v-autocomplete>
                <v-select hide-details outlined label="User" :items="users" v-model="selectedUser" @change="getTimersByPagination"></v-select>
                <v-text-field v-model="search_word" label="Search" @change="getTimersByPagination()" @blur="getTimersByPagination()" outlined hide-details></v-text-field>
            </v-app-bar>
            <v-data-table :headers="headers" :items="timers" :items-per-page.sync="perPage" :sort-desc.sync="sortDesc" sort-by="timer_started" :options.sync="pagination" :server-items-length="total_timers" :loading="loading">
                <template v-slot:item.team_user_id="{ item }">
                    <v-avatar size="35" :color="item.bgColor">
                        <span class='text-center' :style="{ color: item.fColor, fontSize: '16px' }"><b>{{ item.user_code }}</b></span>
                    </v-avatar>
                </template>
                <template v-slot:item.timer_elapsed_secs="{ item }">
                    {{ item.elapsed_time }}
                </template>
                <template v-slot:item.action="{ item }">
                    <edit-timer 
                    :task_id="item.task_id" 
                    :timer_id="item.timer_id" 
                    :dateStarted="item.start_date" 
                    :timeStarted="item.start_time" 
                    :timeStopped="item.end_time" 
                    :dateStopped="item.end_date"
                    :timerDetails="item.timer_details"
                    :taskType="item.task_type_id"></edit-timer>
                </template>
                <template v-slot:item.timer_details="{ item }">
                    <p class="text-wrap truncate">{{item.timer_details | truncate }}</p>
                </template>
                <template v-slot:item.task_name="{ item }">
                    <p class="text-wrap">{{item.task_name}}</p>
                </template>
                <template v-slot:item.delete="{ item }">
                    <v-icon big color="error darken-2" @click="deleteTimer(item.timer_id)">mdi-delete</v-icon>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
    import ClientModal from '@/components/CreateClientModal.vue'
    import EditTimer from '@/components/EditTimerConfig.vue'
    import moment from 'moment'
    export default {
        components: {
            ClientModal,
            EditTimer
        },
        data() {
            return {
                perPage: 10,
                selectedClient: '',
                customers: [],
                menu2: false,
                date2: moment(new Date().toISOString().substr(0, 10)).subtract(7,'d').format('YYYY-MM-DD'),
                menu1: false,
                date1: new Date().toISOString().substr(0, 10),
                users: [],
                headers: [{
                    text: "User",
                    value: "team_user_id"
                }, {
                    text: "Edit",
                    sortable: false,
                    value: "action"
                }, {
                    text: "Task",
                    value: 'task_name',
                    width: '35%'
                }, {
                    text: "Started",
                    value: "timer_started"
                }, {
                    text: "Ended",
                    value: "timer_stopped"
                }, {
                    text: "Time",
                    value: "timer_elapsed_secs"
                }, {
                    text: 'Details',
                    value: "timer_details",
                    width: '40%'
                }, {
                    text: "Delete",
                    sortable: false,
                    value: "delete"
                }],
                pagination: {},
                total_timers: 0,
                timers: [],
                search_word: '',
                axiosSRC: null,
                sortDesc: [true],
                loading: false,
                search: '',
                selectedUser: this.$session.get('user_id')
            }
        },
        filters: {
            truncate(str){
                return (str.length > 300) ? str.slice(0, 300-1) + '...' : str;
            }
        },
        mounted() {
            Events.$on("reload", () => {
                this.getTimersByPagination();
            })
            this.getUsers()
            this.getCustomers()
        },
        watch: {
            pagination() {
                this.getTimersByPagination();
            },
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
            getUsers(){
                this.users = [{text: 'All Users', value: 0}]
                this.apiCall('get-users',{}).then((res) => {
                    if (res.success) {
                        res.users.forEach(element => {
                            this.users.push({text: element.name, value: element.id});
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            deleteTimer(id) {
                confirm('Are you sure you want to delete this timer from the system?') &&
                this.apiCall('delete-timer-config', {timer_id: id}).then((res) => {
                    if (res.success) {
                        Events.$emit('reload');
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getTimersByPagination(){
                this.loading = true;
                this.apiCall('get-timers-config',{
                    page: this.pagination.page,
                    rows: this.perPage,
                    sortBy: this.pagination.sortBy,
                    ascdesc: this.sortDesc,
                    user_id: this.selectedUser,
                    from_date: this.date2,
                    to_date: this.date1,
                    client_id: this.selectedClient,
                    search_word: this.search_word
                    }).then((res) => {
                    if (res.success) {
                        this.timers = res.timers
                        this.total_timers = res.total_timers
                    }
                }).catch((error) => {
                    console.log(error)
                }).finally(() => this.loading = false);
            }
        }
    }
</script>

<style scoped>
    /deep/ .v-data-footer__select {
        display: none !important;
    }
    /deep/ .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>