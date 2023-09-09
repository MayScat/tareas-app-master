<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dark dense>
                <v-icon class="mx-1">mdi-file-chart</v-icon>
                <v-toolbar-title>Reports</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-card-text>
                <v-row dense>
                    <v-col cols="2">
                        <v-menu v-model="menu1" :close-on-content-click="false" class="ma-0 pa-0" :nudge-right="40"
                            transition="scale-transition" min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field hide-details clearable outlined v-model="date1" label="From:" class="ma-0 pa-0"
                                    prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date1" @input="menu1 = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="2">
                        <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" min-width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field hide-details clearable outlined v-model="date2" label="To:" prepend-icon="mdi-calendar" readonly
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date2" @input="menu2 = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="3">
                        <v-select outlined hide-details clearable label="Client" :items="clients" v-model="selectedClient" @change="filterClient">
                        </v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-select outlined hide-details label="Filter Type" :items="filts" v-model="selectedFilter" @change="filterClient"></v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-select outlined clearable hide-details label="Users" :items="users" v-model="selectedUser" @change="filterClient"></v-select>
                    </v-col>
                    <v-col cols="3">
                        <v-select outlined clearable hide-details label="Timer Type" :items="types" v-model="selectedType" @change="filterClient"></v-select>
                    </v-col>
                    <v-col cols="2">
                        <v-btn block class="mt-2" color="info darken-1" @click="search">
                            <v-icon>mdi-filter</v-icon>Search
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        <v-card>
                            <v-app-bar dense dark>
                                <v-toolbar-title>Projects:</v-toolbar-title>
                            </v-app-bar>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-checkbox dense v-if="timers.length != []" class="ma-0 pl-3" label="Select All" @update:active="()=>{this.$refs.treeview.open.push(item[0])}" v-model="selectAll" @change="selectAllTimers"></v-checkbox>
                                        <v-treeview rounded hoverable open-on-click class="text-wrap" v-model="timers_selected" selectable :items="timers" @input="updateTime">
                                            <template v-slot:label="{ item }">
                                                <p style="margin: 0px;">{{item.project_name ? item.project_name : ""}} {{item.sub_name ? " - " + item.sub_name + ":" : ""}} 
                                                <a>{{item.name}}</a><span v-show="item.project_name != undefined" class="mx-2" style="color: red;"><b>({{item.total_time | timeForm}})</b></span> 
                                                <edit-timer-modal 
                                                :timer_id='item.id'
                                                :client_id='item.client_id'
                                                :project_id='item.project_id'
                                                :tp='item.type'
                                                :task_id='item.task_id'
                                                :notes='item.details'
                                                :start_dt='item.started_dt'
                                                :start_tm='item.started_time'
                                                :end_dt='item.ended_dt'
                                                :end_tm='item.ended_time'
                                                v-show="item.task_id != undefined"></edit-timer-modal>
                                                {{item.user_name ? "| "+ item.user_name + " |" : ""}}
                                                <b>{{item.started_at | formatDate}} <span v-show="item.project_name == undefined">-</span> {{item.stopped_at | formatDate}}</b>
                                                <span style="color: red; font-weight: bold;" class="mx-2" v-show="item.project_name == undefined">({{item.hours | timeForm}})</span>
                                                <small class="text-wrap"><truncate clamp="Read More" :length="200" less="Show Less" :text="item.details"></truncate></small>
                                                </p>
                                            </template>
                                        </v-treeview>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card>
                            <v-app-bar dense dark>
                                <v-toolbar-title>Summary:</v-toolbar-title>
                            </v-app-bar>
                            <v-container>
                                <p class="mb-2" style="font-size: 20px;"><b>Timers:</b> {{timers_selected.length}}</p>
                                <hr>
                                <p class="mt-3 mb-2" style="font-size: 20px;"><b>Total time:</b> {{totalHours | timeForm}}</p>
                                <hr>
                                <v-row v-show="selectedFilter == 1">
                                    <v-col>
                                    <bill-modal v-if="selectedClient != '' && timers_selected.length != 0" class="float-right" :client="selectedClient" :timer_ids="timers_selected" 
                                    :date_t="date2" :date_f="date1"></bill-modal>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    import Chart from 'chart.js'
    import truncate from 'vue-truncate-collapsed';
    import moment from 'moment'
    import numeral from 'numeral'
    import BillModal from '@/components/CreateBillingModal.vue'
    import InfoModal from '@/components/InfoModal.vue'
    import EditTimerModal from '@/components/EditTimerModalFull.vue'
    import {
        isNumber,
        isNull,
        isDate,
        isUndefined
    } from 'util'

    export default {
        data() {
            return {
                leaf: 'leaf',
                selectAll: false,
                timers: [],
                filts: [
                    {
                        text: 'Filter Billing',
                        value: 1
                    },
                    {
                        text: 'Filter Timers',
                        value: 2
                    }
                ],
                selectedFilter: 1,
                selectedType: '',
                types: [],
                totalHours: 0,
                chartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                totalChart: 0,
                myChart: null,
                date1: moment(new Date()).format("YYYY-MM-DD"),
                date2: moment(new Date()).format("YYYY-MM-DD"),
                selectedClient: "",
                selectedUser: "",
                timers_selected: [],
                selection: [],
                clients: [],
                users: [],
                menu1: false,
                menu2: false
            }
        },
        components: {
            InfoModal,
            BillModal,
            truncate,
            EditTimerModal
        },
        mounted() {
            this.getClients()
            this.getRecentTimers()
            this.getUsers()
            this.getTypes()
            Events.$on("reload", () => {
                Events.$emit('FilterOn', {
                    isFilter: true,
                    client_id: this.selectedClient,
                    user_id: this.selectedUser,
                    start_date: this.date1 + " 00:00:00",
                    stop_date: this.date2 + " 23:59:59",
                    filt: this.selectedFilter,
                    typ: this.selectedType
                })
            })
            Events.$on('FilterOn', (values) => {
                this.timers = []
                this.totalHours = 0
                this.chartData = []
                this.labels = []
                this.apiCall('get-timer-summary', values).then((res) => {
                    if (res.success) {
                        this.timers = res.timers_list
                    } else {
                        console.log("error")
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
        },
        filters: {
            formatDate(value) {
                if (isUndefined(value)) {
                    return ""
                } else {
                    return moment(value).format("lll")
                }
            },
            timeForm(value) {
                if (isNaN(value)) {
                    return ""
                } else {
                    return numeral(value).format('00:00:00').slice(0, -3) + " hrs"
                }
            }
        },
        methods: {
            getTypes(){
                this.apiCall('get-types-dropdown', {isFilter: 1}).then((res) => {
                    if (res.success) {
                        this.types = []
                        res.types.forEach(element => {
                            this.types.push({text: element.value, value: element.id})
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            selectAllTimers(){
                if(this.selectAll){
                    for(let i = 0; i < this.timers.length; i++){
                        this.timers[i].children.forEach(element => {
                            this.timers_selected.push(element.id)
                        })
                    }
                } else {
                    this.timers_selected = []
                }
            },
            updateTime(data){
                this.apiCall('get-total-time-report', {timer_list: data}).then(res => {
                    if(res.success){
                        this.totalHours = res.totalHours
                    }
                }).catch(error => {
                    console.log(error)
                })
            },
            getClients() {
                this.apiCall("get-clients-ids", null).then((response) => {
                    if (response.success == true) {
                        this.clients = response.clients
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            search() {
                this.errors = []
                if (this.date1 != '' && this.date2 != '' && new Date(this.date2).getTime() < new Date(this.date1)
                    .getTime()) {
                    alert('To date cannot be earlier than From date.')
                    return
                }
                Events.$emit('FilterOn', {
                    isFilter: true,
                    client_id: this.selectedClient,
                    user_id: this.selectedUser,
                    start_date: this.date1 + " 00:00:00",
                    stop_date: this.date2 + " 23:59:59",
                    filt: this.selectedFilter,
                    typ: this.selectedType
                })
            },
            filterClient(){
                if (this.date1 != '' && this.date2 != '' && new Date(this.date2).getTime() < new Date(this.date1).getTime()) {
                    alert('To date cannot be earlier than From date.')
                    return
                }
                Events.$emit('FilterOn', {
                    isFilter: true,
                    client_id: this.selectedClient,
                    user_id: this.selectedUser,
                    start_date: this.date1 + " 00:00:00",
                    stop_date: this.date2 + " 23:59:59",
                    filt: this.selectedFilter,
                    typ: this.selectedType
                })
            },
            getUsers() {
                this.apiCall("get-user-ids").then((res) => {
                    this.users = res.users
                }).catch((error) => {
                    console.log(error)
                })
            },
            getRecentTimers() {
                this.labels = []
                this.chartData = []
                this.apiCall('get-timer-summary', {
                    isFilter: false,
                    user_id: this.$session.get("user_id")
                }).then((res) => {
                    if (res.success) {
                        this.timers = res.timers_list
                    } else {
                        console.log("error")
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }
</script>

<style scoped>

</style>