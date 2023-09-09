<template>
<div>
    <v-icon @click="openModal" color="info">mdi-plus</v-icon>
  <v-dialog persistent v-model="dialog" max-width="600px">
    <v-card>
      <v-app-bar dense dark>
          <v-toolbar-title>New Sub-Project</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="close">mdi-close</v-icon>
      </v-app-bar>
      <v-card-text>
        <div v-if="errors != []">
          <v-alert :type="color" v-for="error in errors" :key="error.index">
            {{error}}
          </v-alert>
        </div>
        <v-container>
          <v-row dense no-gutters>
            <v-col cols="12" sm="12" md="12">
              <v-text-field dense label="Sub-Project Name" outlined required v-model="name"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Description" outlined v-model="description"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="error darken-2" @click="close()">Close</v-btn>
        <v-btn color="success darken-2" @click="insertSub()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>
<script>
  export default {
    props: {
      selectedProj: Number,
    },
    data() {
      return {
        dialog: false,
        code: '',
        name: '',
        description: '',
        errors: [],
        color: ''
      }
    },
    methods: {
        openModal(){
          if(this.selectedProj == ''){
            alert("Please select a project first.")
          }else {
            this.dialog = true
          }
        },
      insertSub() {
        this.apiCall("insert-sub-project", {
          name: this.name,
          description: this.description,
          project_id: this.selectedProj,
        }).then((response) => {
          if (response.success == true) {
            this.color = 'success'
            this.errors = ['Sub-Project has been succesfully added.']
            setTimeout(() => {
              this.close()
              Events.$emit('reload-modal', {id: 3, sub_project_id: response.sub})
            }, 950);
          } else {
            this.color = 'error'
            this.errors = response.errors
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      close() {
        this.dialog = false
        this.name = ''
        this.description = ''
        this.client = ''
        this.errors = []
        this.color = ''
      }
    }
  }
</script>