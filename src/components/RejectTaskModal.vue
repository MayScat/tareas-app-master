<template>
<div>
    <v-btn color="error darken-2" @click="openModal">Reject</v-btn>
    <v-dialog persistent scrollable v-model="dialog" max-width="600px">
        <v-card>
            <v-list dark>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="headline">Reject Task: {{ task_name }}</v-list-item-title>
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
                        <v-col cols="12">
                            <v-textarea outlined label="Reason" hide-details v-model="reason"></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="error darken-2" @click="close">Close</v-btn>
                <v-btn color="success darken-2" @click="rejectTask">Reject</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
    import moment from 'moment'
    export default {
        props: {
            task_id: [Number,String],
            task_name: String
        },
        data() {
            return {
                types: [],
                type: '',
                dialog: false,
                reason: '',
                errors: [],
                color: ''
            }
        },
        methods: {
            openModal(){
                this.dialog = true
            },
            close() {
                this.dialog = false
                this.reason = ''
                this.errors = []
            },
            rejectTask() {
                console.log(this.ticket)
                this.apiCall("reject-task-config", {task_id: this.task_id, reject_reason: this.reason}).then((response) => {
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
        computed: {
            computedDateFormattedMomentjs() {
                return this.date ? moment(this.date).format('YYYY-MM-DD') : ''
            },
        }
    }
</script>

<style scoped>

</style>