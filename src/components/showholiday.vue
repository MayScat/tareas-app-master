<template>
<div class="d-inline-block">
    <span @click="openModal()">
      <p style="color: red; cursor: pointer;" class="d-inline-block mb-0 pt-1">Holiday (in {{days}} days): {{closest_date}} - {{closest_date_name}}</p>
    </span>
  <v-dialog persistent v-model="dialog" scrollable width="600px">
    <v-card>
        <v-toolbar dark dense>
            <v-toolbar-title>
                Holidays:
            </v-toolbar-title>
        </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
                <v-simple-table >
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            Date
                        </th>
                        <th class="text-left">
                            Name
                        </th>
                        </tr>
                    </thead>
                        <tbody>
                        <tr v-for="item in holidays" :key="item.id">
                            <td>{{ item.date }}</td>
                            <td v-if="item.past" style="color: red;">{{ item.holiday_name }}</td>
                            <td v-else>{{ item.holiday_name }}</td>
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
    props: {
        days: Number,
        closest_date: String,
        closest_date_name: String,
    },
    data() {
      return {
        dialog: false,
        code: '',
        name: '',
        description: '',
        holidays: [],
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
            this.apiCall('get-holidays-config').then((res) => {
            if (res.success) {
                this.holidays = res.holidays
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