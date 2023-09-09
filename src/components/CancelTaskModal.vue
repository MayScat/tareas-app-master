<template>
    <v-dialog persistent scrollable v-model="dialog" max-width="400px">
        <template v-slot:activator="{ on }">
            <v-btn color="warning" v-on="on">
                Cancel/Hold
            </v-btn>
        </template>
        <v-card>
            <v-app-bar dark dense>
                <v-toolbar-title>
                    Cancel or Hold Task
                </v-toolbar-title>
            </v-app-bar>
            <v-card-text>
                <br>
                <div v-if="errors != []">
                    <v-alert :type="color" v-for="error in errors" :key="error.index">
                        {{error}}
                    </v-alert>
                </div>
                <v-select :items="statuses" hide-details outlined label="Status" v-model="selectedStatus"></v-select><br>
                <v-textarea v-model="reason" label="Reason" hide-details outlined></v-textarea>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="close">Cancel</v-btn>
                <v-btn color="success" @click="cancelTask">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialog: false,
            statuses: [],
            selectedStatus: '',
            reason: '',
            color: '',
            errors: []
        }
    },
    mounted(){
    },
    watch: {
        dialog() {
            if(this.dialog == true) {
                this.getStatuses()
            }
        }
    },
    methods: {
        getStatuses() {
            this.apiCall('get-task-statuses-cancel').then((res) => {
            if (res.success) {
                this.statuses = res.statuses
            }
            }).catch((error) => {
                console.log(error)
            })
        },
        cancelTask() {
            this.apiCall('cancel-hold-task',{task_id: this.$route.params.taskId, reason: this.reason, status: this.selectedStatus}).then((res) => {
            if (res.success) {
                this.errors = ['Task successfully Cancelled/Held']
                this.color = "success"
                setTimeout(() => {
                    Events.$emit('reload-edit')
                    this.close()
                    }, 1500)
            } else {
                this.errors = res.errors
                this.color = "error"
            }
            }).catch((error) => {
                console.log(error)
            });
        },
        close(){
            this.dialog = false
            this.statuses = []
            this.errors = []
            this.color = ''
            this.reason = ''
        }
    }
}
</script>

<style>

</style>