<template>
  <div>
    <v-btn dark text @click="openModal">
        <v-icon>mdi-magnify</v-icon> Search
    </v-btn>
    <v-dialog persistent v-model="dialog" width="90%">
        <v-toolbar dark card>
                <v-autocomplete
                    :items="users" 
                    outlined
                    hide-details
                    clearable
                    color="white"
                    item-text="text"
                    label="Users"
                    v-model="selectedUser"
                    v-if="selectedType == 3"
                ></v-autocomplete>
                <div @click="menu1 = true" style="margin-top: 23px;" v-if="selectedType == 3">
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
                            v-on:click="menu1=true"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="date1"
                        @input="menu1 = false"
                        ></v-date-picker>
                    </v-menu>
                </div>
                <div @click="menu2 = true" style="margin-top: 23px;" v-if="selectedType == 3">
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
                            v-on:click="menu2=true"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        v-model="date2"
                        @input="menu2 = false"
                        ></v-date-picker>
                    </v-menu>
                </div>
            <v-select :items="types" label="View" v-model="selectedType" hide-details outlined @change="results = []"></v-select>
            <v-text-field label="Search" outlined hide-details placeholder="Search any keyword..." v-model="search_word" @keyup.enter="getTimersByPagination()"></v-text-field>
        </v-toolbar>
        <v-card>
            <v-container>
                <v-data-table v-show="selectedType == 1" :headers="headers" :items="results" :loading="loading">
                    <template v-slot:item.action="{ item }">
                        <edit-project-modal :project="item"></edit-project-modal>
                    </template>
                </v-data-table>
                <v-data-table v-show="selectedType == 2" :headers="headers2" :items="results" :loading="loading">
                    <template v-slot:item.action="{ item }">
                        <v-btn @click="getTaskInfo(item.task_id)" color="warning">View</v-btn>
                    </template>
                    <template v-slot:item.task_details="{ item }">
                        <p class="text-wrap">{{item.task_details}}</p>
                    </template>
                </v-data-table>

                <v-data-table v-show="selectedType == 3" :headers="headers3" :items="results" :loading="loading">
                    <template v-slot:item.timer_details="{ item }">
                        <p class="text-wrap">{{item.timer_details}}</p>
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
                    <template v-slot:item.username="{ item }">
                    <v-avatar size="35" :color="item.bgColor">
                        <span class='text-center' :style="{ color: item.fColor, fontSize: '16px' }"><b>{{ item.user_code }}</b></span>
                    </v-avatar>
                </template>
                </v-data-table>
            </v-container>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-2" @click="closeModal()">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EditTimer from '@/components/EditTimerConfig.vue'
import EditProjectModal from '@/components/EditProjectModal.vue'
export default {
    components: {
        EditTimer,
        EditProjectModal
    },
    data() {
        return {
            selectedType: 3,
            date2: new Date().toISOString().substr(0, 10),
            menu2: false,
            date1: new Date().toISOString().substr(0, 10),
            menu1: false,
            loading: false,
            search_word: '',
            selectedUser: '',
            dialog: false,
            results: [],
            users: [],
            types: [
                {
                    text: 'By Project',
                    value: 1
                },
                {
                    text: 'By Task',
                    value: 2
                },
                {
                    text: 'By Timer',
                    value: 3
                },
            ],
            headers: [
                {
                    text: 'Project',
                    value: 'project_label',
                    sortable: false
                },
                {
                    text: 'Project Details',
                    value: 'project_details',
                    sortable: false
                },
                {
                    text: 'Action',
                    value: 'action',
                    sortable: false
                }
            ],
            headers2: [
                {
                    text: 'Task',
                    value: 'task_name',
                    sortable: false
                },
                {
                    text: 'Task Details',
                    value: 'task_details',
                    sortable: false
                },
                {
                    text: 'Action',
                    value: 'action',
                    sortable: false
                }
            ],
            headers3: [
                {
                    text: 'User',
                    value: 'username',
                    sortable: false
                },
                {
                    text: 'Timer',
                    value: 'timer_name',
                    sortable: false
                },
                {
                    text: 'Date',
                    value: 'timer_info',
                    sortable: false
                },
                {
                    text: 'Timer Details',
                    value: 'timer_details',
                    sortable: false
                },
                {
                    text: 'Action',
                    value: 'action',
                    sortable: false
                }
            ]
        }
    },
    methods: {
        openModal(){
            this.dialog = true
            this.getUsers()
            this.selectedUser = this.$session.get('user_id')
        },
        closeModal(){
            this.dialog = false
            this.search_word = ''
            this.date2 = new Date().toISOString().substr(0, 10)
            this.selectedType = 3
            this.date1 = new Date().toISOString().substr(0, 10)
            this.results = []
        },
        getTaskInfo(value){
            this.$router.replace({ name: 'task-edit', params: { taskId: value }})
            this.closeModal()
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
        getTimersByPagination(){
            this.results = []
            this.loading = true;
            this.apiCall('global-search',{
                view: this.selectedType,
                from_date: this.date1,
                to_date: this.date2,
                search_word: this.search_word,
                user_id: this.selectedUser
                }).then((res) => {
                if (res.success) {
                    this.results = res.search_results
                }
            }).catch((error) => {
                console.log(error)
            }).finally(() => this.loading = false);
        }
    }
}
</script>

<style>

</style>