<template>
<div>
    <v-list-item @click="openModal" v-show="area == 'dpd'">
        <v-list-item-title>
            <v-icon>mdi-pause</v-icon> {{ task_name }} - {{ client_code }}: {{ project_name }}
        </v-list-item-title>
    </v-list-item>
    <v-btn color="blue" @click="openModal" dark large fixed tile bottom right fab v-show="area == 'float'">
        <v-icon>mdi-pause</v-icon>
    </v-btn>
    <v-dialog persistent scrollable v-model="dialog" max-width="850px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Edit Timer: {{ task_name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-icon @click="close">mdi-close</v-icon>
                </v-list-item>
            </v-list>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                      {{error}}
                    </v-alert>
                </div>
                <v-container fluid>
                    <v-row dense>
                        <v-col cols="6">
                            <div @click="menu1=true">
                                <v-menu
                                v-model="menu1"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    label="Start Date"
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
                                v-model="date"
                                @input="menu1 = false"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field type="time" label="Start Time" hide-details v-model="time" outlined></v-text-field>
                        </v-col>
                        <v-col cols="6" v-if="custom_time">
                            <div @click="menu2=true">
                                <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date2"
                                    label="End Date"
                                    readonly
                                    outlined
                                    append-icon="mdi-calendar"
                                    hide-details
                                    v-bind="attrs"
                                    v-on="on"
                                    v-on:click:append="menu2=true"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date2"
                                @input="menu2 = false"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="4" v-if="custom_time">
                            <v-text-field type="time" label="End Time" hide-details v-model="time2" outlined></v-text-field>
                            <label style="color: blue; text-decoration: underline; cursor: pointer;" @click="changeEndTime()">Current Time</label>
                        </v-col>
                        <v-col cols="10" v-else>
                            <h4>End Time:</h4>
                            <label>(Current Time) - <a style="color:blue; text-decoration: underline;" @click="changeEndTime()">Custom Time</a></label>
                        </v-col>
                        <v-col cols="12">
                            <v-select :items="types" v-model="type" outlined label="Type"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea label="Details" outlined v-model="details"></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
                <v-btn color="warning darken-2" @click="insertTimer(1)">Save & Continue</v-btn>
                <v-btn color="success darken-2" @click="insertTimer(0)">Save & Stop</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
    import moment from 'moment'
    export default {
        props: {
            task_id: Number,
            timer_id: Number,
            dateStarted: String,
            timeStarted: String,
            timerDetails: String,
            taskType: Number,
            task_name: String,
            client_code: String,
            project_name: String,
            area: String
        },
        data() {
            return {
                types: [],
                type: '',
                dialog: false,
                date: '',
                menu1: false,
                date2: '',
                menu2: false,
                time2: '',
                menu2: false,
                details: '',
                time: '',
                custom_time: false,
                picker: '',
                errors: [],
                color: ''
            }
        },
        methods: {
            openModal(){
                setTimeout(() => {
                    this.dialog = true
                }, 300);
                this.getTypes()
                this.time = this.timeStarted
                this.date = this.dateStarted
                this.type = this.taskType
                this.details = this.timerDetails
                this.time2 = moment(new Date()).format("HH:mm")
                this.date2 = new Date().toISOString().substr(0, 10)
            },
            getTypes(){
                this.apiCall('get-types-dropdown').then((res) => {
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
            changeEndTime() {
                this.custom_time = !this.custom_time
                if(!this.custom_time) {
                    this.time2 = moment(new Date()).format("HH:mm");
                    this.date2 = new Date().toISOString().substr(0, 10);
                } else {
                    this.time2 = moment(new Date()).format("HH:mm");
                    this.date2 = new Date().toISOString().substr(0, 10);
                }
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = null
                this.time2 = ''
                this.details = ''
                this.custom_time = false
                this.errors = []
            },
            insertTimer(cont) {
                if(this.time != '' & this.time2 != ''){
                    let start_date = new Date(this.date + ' ' + this.time).getTime() / 1000
                    if(this.custom_time == false){
                        this.time2 = moment(new Date()).format("HH:mm");
                        this.date2 = new Date().toISOString().substr(0, 10);
                    }
                    let end_date = new Date(this.date2 + ' ' + this.time2).getTime() / 1000
                    let diff = Math.round(end_date - start_date)
                    if(diff >= 18000){
                        confirm('This timer takes more than 5 hours. Are you sure you want to save it?') &&
                        this.apiCall("update-timer-config", {cont: cont, timer_id: this.timer_id, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                            if(response.success) {
                                Events.$emit('reload')
                                this.close()
                            } else {
                                this.errors = response.errors
                                this.color = 'error'
                            }
                        })
                    } else {
                        this.apiCall("update-timer-config", {cont:cont, timer_id: this.timer_id, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                            if(response.success) {
                                Events.$emit('reload')
                                this.close()
                            } else {
                                this.errors = response.errors
                                this.color = 'error'
                            }
                        })
                    }
                } else {
                    this.apiCall("update-timer-config", {cont:cont, timer_id: this.timer_id, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                        if(response.success) {
                            Events.$emit('reload')
                            this.close()
                        } else {
                            this.errors = response.errors
                            this.color = 'error'
                        }
                    })
                }
            },
            getTimerText() {
                this.details = this.timerDetails
            },
            getNow(){
                this.apiCall("get-server-time", null).then((res) => {
                    if(res.success){
                        this.time = moment(res.now).format("HH:mm")
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            }
        },
        computed: {
            computedDateFormattedMomentjs() {
                return this.date ? moment(this.date).format('YYYY-MM-DD') : ''
            },
        }
    }
</script>

<style scoped>

</style>