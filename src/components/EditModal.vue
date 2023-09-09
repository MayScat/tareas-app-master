<template>
  <v-dialog persistent v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-icon color="info" big v-on="on">mdi-pencil</v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">New Project</span>
      </v-card-title>
      <v-card-text>
        <div v-if="errors != []">
          <v-alert :type="color" v-for="error in errors" :key="error.index">
            {{error}}
          </v-alert>
        </div>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="6">
              <v-text-field label="Project Name" outlined required v-model="project.name"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-text-field label="Project Code" outlined disabled v-model="project.code"></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-select outlined :items="clients" label="Client" v-model="project.client_id"></v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea label="Description" outlined v-model="project.description"></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
        <v-btn color="blue darken-1" text @click="editProject()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    props: {
      project: Object,
      clients: Array
    },
    data() {
      return {
        dialog: false,
        errors: []
      }
    },
    methods: {
      editProject(){
        this.apiCall("edit-project", {
          id: this.project.id,
          code: this.project.code,
          name: this.project.name,
          description: this.project.description,
          client_id: this.project.client_id,
        }).then((response) => {
          if(response.success == true) {
            this.color = 'success'
            this.errors = ['Project has been succesfully edited.']
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