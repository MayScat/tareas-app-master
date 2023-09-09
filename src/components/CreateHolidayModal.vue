<template>
<div>
<v-btn color="warning" big @click="openModal">(+) New Holiday</v-btn>
  <v-dialog persistent v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">New Holiday</span>
      </v-card-title>
      <v-card-text>
        <div v-if="errors != []">
          <v-alert :type="color" v-for="error in errors" :key="error.index">
            {{error}}
          </v-alert>
        </div>
        <v-container>
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <div @click="menu=true">
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="hol.date" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="hol.date" outlined hide-details label="Holiday Date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="hol.date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn text color="primary" @click="$refs.menu.save(hol.date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                </v-menu>
              </div>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field label="Holiday Name" hide-details outlined v-model="hol.name"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="error darken-1" @click="close()">Close</v-btn>
        <v-btn color="success darken-1" @click="editHoliday()">Save</v-btn>
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
        hol: {name: '',
        date: null},
        errors: [],
        menu: false
      }
    },
    methods: {
        openModal(){
            this.dialog = true
        },
        editHoliday(){
            this.apiCall("create-holiday", {
              name: this.hol.name,
              date: this.hol.date
            }).then((response) => {
              if(response.success == true) {
                this.color = 'success'
                this.errors = ['Holiday has been succesfully created.']
                setTimeout(() => {
                  this.dialog = false
                  Events.$emit('reload')
                  this.errors = []
                }, 950);
              } else {
                this.color = 'error'
                this.errors = response.errors
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