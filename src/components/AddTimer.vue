<template>
<div>
    <v-btn @click="openModal" color="warning">(+) Add</v-btn>
    <v-dialog persistent scrollable v-model="dialog" max-width="850px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Start Timer: {{ task_name }}</v-list-item-title>
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
                        <v-col cols="12" v-if="prev_details.timer_started_date != ''">
                            <v-alert color="#d3d3d3" class="box"><p class="mb-0"><span style="font-weight: bold;">Previous Details - {{prev_details.timer_label}}:</span> {{ prev_details.timer_details }}</p></v-alert>
                        </v-col>
                        <v-col cols="3">
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
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="date"
                                @input="menu1 = false"
                                ></v-date-picker>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field type="time" label="Start Time" hide-details v-model="time" outlined></v-text-field>
                            <label style="color: blue; text-decoration: underline; cursor: pointer;" @click="lastStop">Last Stop Time</label>
                        </v-col>
                        <v-col cols="3">
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
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="date2"
                              @input="menu2 = false"
                            ></v-date-picker>
                            </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field type="time" label="End Time" hide-details v-model="time2" outlined></v-text-field>
                            <label style="color: blue; text-decoration: underline; cursor: pointer;" @click="currTime()">Current Time</label>
                        </v-col>
                        <v-col cols="12">
                            <v-select :items="types" v-model="type" outlined hide-details label="Type"></v-select>
                        </v-col>
                        <v-col cols="12">
                            <div class="text-right">
                                <v-icon v-if="prev_details.timer_started_date != ''">mdi-arrow-down-left</v-icon>
                                <label  v-if="prev_details.timer_started_date != ''" style="color: blue; text-decoration: underline; cursor: pointer;" @click="lastDetails">Copy "Previous Details" here.</label>
                            </div>
                            <v-textarea label="Details" outlined v-model="details"></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
                <v-btn color="success darken-2" @click="insertTimer">Save</v-btn>
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
            task_name: String,
            project_name: String,
            prev_details: Object
        },
        data() {
            return {
                types: [],
                type: '',
                dialog: false,
                date: '',
                menu1: false,
                time: '',
                date2: '',
                menu2: false,
                time2:  '',
                menu2: false,
                details: '',
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
                this.getNow()
                this.getTypes()
                this.dialog = true
                this.time = moment(new Date()).format("HH:mm")
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = new Date().toISOString().substr(0, 10)
            },
            lastStop(){
                this.apiCall('get-last-stop').then((res) => {
                    if (res.success) {
                        this.date = res.last_stop_date
                        this.time = res.last_stop_time
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            lastDetails(){
                this.details = 'Continue: ' + this.prev_details.timer_details.replace('Continue: ','').trim()
                this.type = this.prev_details.task_type_id
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
            currTime(){
                this.time2 = moment(new Date()).format("HH:mm");
            },
            close() {
                this.dialog = false
                this.date = new Date().toISOString().substr(0, 10)
                this.date2 = null
                this.time2 = ''
                this.details = ''
                this.errors = []
            },
            insertTimer() {
                if(this.time != '' & this.time2 != ''){
                    let start_date = new Date(this.date + ' ' + this.time).getTime() / 1000
                    let end_date = new Date(this.date2 + ' ' + this.time2).getTime() / 1000
                    let diff = Math.round(end_date - start_date)
                    if(diff >= 18000){
                        confirm('This timer takes more than 5 hours. Are you sure you want to save it?') && 
                        this.apiCall("create-timer-config", {task_id: this.task_id, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
                            if(response.success) {
                                Events.$emit('reload')
                                this.close()
                            } else {
                                this.errors = response.errors
                                this.color = 'error'
                            }
                        })
                    } else {
                        this.apiCall("create-timer-config", {task_id: this.task_id, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
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
                    this.apiCall("create-timer-config", {task_id: this.task_id, start_date: this.date, start_time: this.time, end_date: this.date2, end_time: this.time2, type: this.type, details: this.details }).then((response) => {
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
.box {
    inline-size: 100%;
    word-break: break-all;
}
</style>