<template>
  <v-dialog persistent v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="green darken-3" dark v-on="on">
        <v-icon>mdi-plus</v-icon>Sub-Project
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">New Sub-Project</span>
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
              <v-text-field label="Sub-Project Name" outlined required v-model="name"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" sm="12">
              <v-select outlined :items="projects" label="Project" v-model="project"></v-select>
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
</template>
<script>
  export default {
    props: {
      projects: Array,
    },
    data() {
      return {
        dialog: false,
        code: '',
        name: '',
        description: '',
        client: '',
        errors: [],
        color: '',
        project: ''
      }
    },
    methods: {
      insertSub() {
        this.apiCall("insert-sub-project", {
          name: this.name,
          description: this.description,
          project_id: this.project,
        }).then((response) => {
          if (response.success == true) {
            this.color = 'success'
            this.errors = ['Sub-Project has been succesfully added.']
            setTimeout(() => {
              this.close()
              Events.$emit('reload')
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