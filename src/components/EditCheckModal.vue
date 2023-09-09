<template>
<div class="d-inline-block">
    <a router-link @click="getTodo">{{ description }}</a>
    <v-dialog persistent v-model="dialog" scrollable max-width="700px">
        <v-card>
            <v-app-bar dark>
                <v-toolbar-title>
                    Edit To-Do Item: {{ description }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-app-bar>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-row dense>
                    <v-col cols="4">
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
                                v-model="date"
                                label="ETA (Optional)"
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
                              @input="menu2 = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="8" class='d-flex justify-end'>
                        <v-checkbox v-model="prio" hide-details label="High Priority"></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="description_short" label="Description Short" hide-details outlined></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea v-model="details" hide-details label="Optional comments or notes" outlined></v-textarea>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">Close</v-btn>
                <v-btn color="success" @click="editUser()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>
<script>
    export default {
        props: {
            todo_id: Number,
            description: String,
            task_id: Number
        },
        data() {
            return {
                errors: [],
                color: '',
                dialog: false,
                id: '',
                date: '',
                menu2: false,
                details: '',
                prio: 0,
                description_short: ''
            }
        },
        methods: {
            getTodo(){
                this.dialog = true
                this.id = this.todo_id
                this.apiCall('get-todo-info', {todo_id: this.id, task_id: this.task_id}).then((res) => {
                    if (res.success) {
                        this.details = res.todo.comments
                        this.prio = res.todo.priority
                        this.date = res.todo.eta
                        this.description_short = res.todo.description
                    }
                }).catch((error) => {
                        console.log(error)
                })
            },
            editUser(){
                this.apiCall("edit-checklist", {
                    description_short: this.description_short,
                    comments: this.details,
                    prio: this.prio,
                    eta: this.date,
                    task_id: this.task_id,
                    id: this.id
                }).then((res) => {
                    if(res.success){
                        this.errors = ['To-do item successfully edited.']
                        this.color = "success"
                        setTimeout(() => {
                            Events.$emit("reload")
                                this.close()
                            }, 1500)
                    } else {
                        this.errors = res.errors
                        this.color = "error"
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            close(){
                this.dialog = false
                this.errors = []
            }
        }
    }
</script>

<style scoped>

</style>