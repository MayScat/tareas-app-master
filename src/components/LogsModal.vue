<template>
<div class="d-inline-block">
    <b @click="openModal()">
      <a href="#">Logs</a>
    </b>
  <v-dialog persistent v-model="dialog" max-width="75%">
    <v-card>
        <v-toolbar dark dense>
            <v-toolbar-title>
                Logs:
            </v-toolbar-title>
        </v-toolbar>
      <v-card-text>
        <div v-if="errors != []">
          <v-alert :type="color" v-for="error in errors" :key="error.index">
            {{error}}
          </v-alert>
        </div>
        <v-container>
          <v-row>
            <v-col cols="12">
                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            User
                        </th>
                        <th class="text-left">
                            Date
                        </th>
                        <th class="text-left">
                            Changes
                        </th>
                        </tr>
                    </thead>
                        <tbody>
                        <tr v-for="item in logs" :key="item.id">
                            <td>{{ item.user }}</td>
                            <td>{{ item.date }}</td>
                            <td>{{ item.log }}</td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="error darken-2" @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>
<script>
  export default {
    data() {
      return {
        dialog: false,
        code: '',
        name: '',
        description: '',
        logs: [],
        client: '',
        errors: [],
        color: ''
      }
    },
    methods: {
        openModal(){
            this.dialog = true
            this.getLogs()
        },
        getLogs(){
            this.apiCall('get-logs-task', {id: this.$route.params.taskId}).then((res) => {
            if (res.success) {
                this.logs = res.logs
            }
            }).catch((error) => {
                console.log(error)
            })
        },
        close() {
          this.dialog = false
          this.logs = []
        }
    }
  }
</script>