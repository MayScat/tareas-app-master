<template>
    <v-container fluid>
        <v-card>
            <v-app-bar dense dark class="elevation-1">
                <v-toolbar-title>
                    <v-icon class="mx-1">mdi-calendar</v-icon>Calendar
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>

            <v-row dense class="px-3 pa-2">
                <v-col cols="12" md="2">
                    <v-select :items="months" @change="search()" label="Month" outlined v-model="selectedMonth"></v-select>
                </v-col>
                <v-col cols="12" md="2">
                    <v-select :items="years" @change="search()" label="Year" outlined v-model="selectedYear"></v-select>
                </v-col>
                <v-col cols="12" md="3">
                    <v-autocomplete
                        :items="clients" 
                        outlined
                        clearable
                        color="black"
                        item-text="text"
                        label="Client"
                        v-model="selectedClient"
                        @change="search()"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                    <v-autocomplete
                        :items="users" 
                        outlined
                        clearable
                        color="black"
                        item-text="text"
                        label="Users"
                        v-model="selectedUser"
                        @change="search()"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2">
                    <v-btn block class="mt-2" color="info darken-1" @click="search">
                        <v-icon>mdi-filter</v-icon>Search
                    </v-btn>
                </v-col>
                <v-col cols="12" md="12">
                    <v-btn dark id="next" class="float-right mx-1">Next</v-btn>
                    <v-btn dark id="prev" class="float-right">Prev</v-btn>
                    <FullCalendar class='demo-app-calendar' ref="fullCalendar" defaultView="dayGridMonth" :options="calendarOptions" :header="{center: false, right: false, left: 'title'}" :plugins="calendarPlugins" :weekends="true" :events="calendarEvents" @eventClick="handleDateClick">
                    </FullCalendar>
                </v-col>
                <v-dialog v-model="dialog2" max-width="80%">
                    <v-card>
                        <v-app-bar dense dark>
                            <v-toolbar-title>Timers: ({{timers.length}})</v-toolbar-title>
                        </v-app-bar>
                        <v-card-text>
                            <v-list v-if="timers.length != 0">
                                <v-list-item three-line v-for="timer in timers" :key="timer.id">
                                    <v-list-item-content>
                                        <v-list-item-title>Project: <b>{{timer.project_name}}</b><br>Task:
                                            <a>{{timer.ticket_name}} - {{timer.type}}</a> <edit-timer-modal 
                                                :timer_id='timer.id'
                                                :client_id='timer.client_id'
                                                :project_id='timer.project_id'
                                                :tp='timer.type_id'
                                                :task_id='timer.ticket_id'
                                                :notes='timer.details'
                                                :start_dt='timer.started_dt'
                                                :start_tm='timer.started_time'
                                                :end_dt='timer.ended_dt'
                                                :end_tm='timer.ended_time'
                                                ></edit-timer-modal>
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            <b>{{timer.user_name}}</b>
                                            <br>
                                            <b>{{timer.started_at | formatDate}}<v-icon small>mdi-arrow-right</v-icon>{{timer.stopped_at | formatDate}} ({{timer.hours | timeForm}}hrs)</b>
                                        </v-list-item-subtitle>
                                        <small class="text-wrap"><truncate  clamp="Read More" :length="200" less="Show Less" :text="timer.details"></truncate></small>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error" @click="dialog2 = !dialog2">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>
    import truncate from 'vue-truncate-collapsed';
    import FullCalendar from '@fullcalendar/vue'
    import dayGridPlugin from '@fullcalendar/daygrid'
    import interactionPlugin from '@fullcalendar/interaction'
    import EditTimerModal from '@/components/EditTimerModalFull.vue'
    import numeral from 'numeral'
    import moment from 'moment'
    import {
        stringify
    } from 'querystring'
    export default {
        components: {
            FullCalendar, // make the <FullCalendar> Component available
            EditTimerModal,
            truncate
        },
        data: function () {
            return {
                dialog: false,
                dialog2: false,
                calendarOptions: {
                    dayRender: this.customDayRender
                },
                calendarPlugins: [ // plugins must be defined in the JS
                    dayGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                calendarEvents: [], // initial Event Data
                date: '',
                totalHours: "00:00",
                timers: [],
                user_id: '',
                date1: moment(new Date()).format("YYYY-MM-DD"),
                date2: moment(new Date()).format("YYYY-MM-DD"),
                selectedClient: "",
                selectedUser: "",
                timers_selected: [],
                selection: [],
                clients: [{text: "All", value: ""}],
                users: [{text: "All", value: ""}],
                menu1: false,
                menu2: false,
                selectedMonth: moment(new Date()).format("MM"),
                selectedYear: moment(new Date()).format("YYYY"),
                months: [{
                    text: "January",
                    value: "01"
                }, {
                    text: "February",
                    value: "02"
                }, {
                    text: "March",
                    value: "03"
                }, {
                    text: "April",
                    value: "04"
                }, {
                    text: "May",
                    value: "05"
                }, {
                    text: "June",
                    value: "06"
                }, {
                    text: "July",
                    value: "07"
                }, {
                    text: "August",
                    value: "08"
                }, {
                    text: "September",
                    value: "09"
                }, {
                    text: "October",
                    value: "10"
                }, {
                    text: "November",
                    value: "11"
                }, {
                    text: "December",
                    value: "12"
                }],
                years: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027",
                    "2028", "2029", "2030"
                ]
            }
        },
        filters: {
            formatDate(value) {
                return moment(value).format("lll")
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
            },
            timeForm(value) {
                return numeral(value).format('00:00:00').slice(0, -3)
            }
        },
        watch: {
            selectedMonth(){
                
            }
        },
        mounted() {
            this.selectedUser = this.$session.get('user_id')
            this.getCalendar()
            this.getUsers()
            this.getClients()
            Events.$on('reload', () => {
                this.timers = []
                this.totalHours = 0

                this.apiCall('get-day-timers', {
                    id: this.selectedUser,
                    date: this.date,
                    client_id: this.selectedClient
                }).then((res) => {
                    if (res.success) {
                        this.timers = res.timers
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })

            let calendar = this.$refs.fullCalendar.getApi();
            document.getElementById('prev').addEventListener('click', () => {
                this.totalHours = "00:00"
                this.timers = []
                calendar.prev(); // call method
                var year = moment(calendar.getDate()).format("YYYY")
                var month = moment(calendar.getDate()).format("M")
                this.apiCall('get-calendar', {
                    month: month,
                    year: year,
                    client_id: this.selectedClient,
                    user_id: this.selectedUser
                }).then((res) => {
                    if (res.success) {
                        for (let i = 0; i < res.events.length; i++) {
                            if(!res.events[i].isHoliday){
                                res.events[i].title = numeral(res.events[i].title).format('00:00:00').slice(
                                    0, -3);
                            }
                        }
                        this.calendarEvents = res.events
                        this.totalHours = numeral(res.totalhours).format('00:00:00').slice(0, -3)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            });
            document.getElementById('next').addEventListener('click', () => {
                this.totalHours = "00:00"
                this.timers = []
                calendar.next();
                var year = moment(calendar.getDate()).format("YYYY")
                var month = moment(calendar.getDate()).format("MM")
                this.apiCall('get-calendar', {
                    month: month,
                    year: year,
                    client_id: this.selectedClient,
                    user_id: this.selectedUser
                }).then((res) => {
                    if (res.success) {
                        for (let i = 0; i < res.events.length; i++) {
                            if(!res.events[i].isHoliday){
                                res.events[i].title = numeral(res.events[i].title).format('00:00:00').slice(
                                    0, -3);
                            }
                        }
                        this.calendarEvents = res.events
                        this.totalHours = numeral(res.totalhours).format('00:00:00').slice(0, -3)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            });
            Events.$on('Filter', (data) => {
                this.totalHours = "00:00"
                this.timers = []
                this.calendarEvents = []
                this.timers = []
                if (data.year == '' || data.month == '') {
                    var year = moment(new Date()).format("YYYY")
                    var month = moment(new Date()).format("MM")
                } else {
                    var year = data.year
                    var month = data.month
                    let calendarApi = this.$refs.fullCalendar.getApi(); // Referencing the calendar to change the month
                    calendarApi.gotoDate(moment(year + "-" + month + "-01").format("YYYY-MM-DD"));
                }

                this.apiCall('get-calendar', {
                    month: month,
                    year: year,
                    client_id: data.client_id,
                    user_id: this.selectedUser
                }).then((res) => {
                    if (res.success) {
                        for (let i = 0; i < res.events.length; i++) {
                            if(!res.events[i].isHoliday){
                                res.events[i].title = numeral(res.events[i].title).format('00:00:00').slice(
                                    0, -3);
                            }
                        }
                        this.calendarEvents = res.events
                        this.totalHours = numeral(res.totalhours).format('00:00:00').slice(0, -3)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })
        },
        methods: {
            clearMonth(){
                this.selectedMonth = ''
            },
            clearYear(){
                this.selectedYear = ''
            },
            search() {
                this.errors = []
                Events.$emit('Filter', {
                    isFilter: true,
                    user_id: this.selectedUser,
                    client_id: this.selectedClient,
                    month: this.selectedMonth,
                    year: this.selectedYear
                })
            },
            customDayRender(info) {
                const now = new Date();
                const currentDate = info.date;

                if (currentDate.getMonth() !== now.getMonth()) {
                  info.el.classList.add('d-none');
                } else if (info.dayNumberText.trim() === '') {
                  info.el.classList.add('d-none');
                    }
            },
            getClients() {
                this.apiCall("get-clients-ids", null).then((response) => {
                    if (response.success == true) {
                        response.clients.forEach(element => {
                            this.clients.push(element)
                        })
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getUsers() {
                this.apiCall("get-user-ids").then((res) => {
                    res.users.forEach(element => {
                        this.users.push(element)
                    })
                }).catch((error) => {
                    console.log(error)
                })
            },
            handleDateClick(arg) {
                this.totalHours = "00:00"
                this.date = moment(arg.event.start).format("YYYY-MM-DD")
                this.totalHours = arg.event.title

                this.apiCall('get-day-timers', {
                    id: this.selectedUser,
                    date: this.date,
                    client_id: this.selectedClient
                }).then((res) => {
                    if (res.success) {
                        this.timers = res.timers
                        if(this.timers.length > 0) {
                            this.dialog2 = true
                        }
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            getCalendar() {
                this.apiCall('get-calendar',{user_id: this.selectedUser}).then((res) => {
                    if (res.success) {
                        for (let i = 0; i < res.events.length; i++) {
                            if(!res.events[i].isHoliday){
                                res.events[i].title = numeral(res.events[i].title).format('00:00:00').slice(
                                    0, -3);
                            }
                        }
                        this.calendarEvents = res.events
                        this.totalHours = numeral(res.totalhours).format('00:00:00').slice(0, -3)
                    }
                }).catch((error) => {
                    console.log(error)
                })
            }
        }
    }
</script>

<style lang='scss'>
    @import '~@fullcalendar/core/main.css';
    @import '~@fullcalendar/daygrid/main.css';

    .demo-app {
        font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
        font-size: 14px;
    }

    .fc-event {
        color: black !important;
        font-size: 16px;
        text-align: center;
    }

    .fc-other-month .fc-day-number {
        display: none;
    }
</style>