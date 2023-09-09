<template>
  <div>
    <v-btn color="success darken-2" @click="openModal">
      <v-icon>mdi-plus</v-icon>Add Ticket
    </v-btn>
    <v-dialog persistent v-model="dialog" max-width="900px">
      <v-card>
        <v-app-bar dark dense class="elevation-1">
          <v-toolbar-title>New ticket</v-toolbar-title>
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
            <v-row dense>
              <v-col cols="12" sm="12" md="5">
                <v-select :items="clients" label="Client" @change="getClientProjects(client)" outlined v-model="client"></v-select>
              </v-col>
              <v-col cols="12" md="1" class="pt-4">
                <add-client-modal></add-client-modal>
              </v-col>
              <v-col cols="12" sm="12" md="5">
                <v-select :items="projects" label="Project" @change="getSubProjects(project)" outlined v-model="project"></v-select>
              </v-col>
              <v-col cols="12" md="1" class="pt-4">
              <add-project-modal :selectedClient="client" ></add-project-modal>
              </v-col>
              <v-col cols="12" sm="12" md="5">
                <v-select :items="subProjects" label="Sub-Project" outlined v-model="subProject"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="1" class="pt-4">
                <add-sub-modal :selectedProj="project" ></add-sub-modal>
              </v-col>
              <v-col cols="12" sm="12" md="5">
                <v-select :items="priorities" label="Priority" outlined v-model="priority"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field dense label="Ticket Name" class="pa-0 ma-0" outlined v-model="name"></v-text-field>
                 <v-textarea label="Description" outlined v-model="description"></v-textarea>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <p class="pa-0 ma-0">Members: <v-checkbox label="Select All" class="ma-0 pa-0" @change="selectAll(all)" v-model="all"></v-checkbox></p>
                <v-row dense>
                  <v-col cols="12" md="4" sm="12" v-for="user in users" :key="user.id" >
                    <v-checkbox  v-model="members" class="ma-0 pa-0" :label="user.text" :value="user.value"></v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-checkbox class="pl-4" label="Start Timer" color="green" v-model="startTimer"></v-checkbox>
          <div class="flex-grow-1" ></div>
          <v-btn color="red darken-1" dark @click="close()">Close</v-btn>
          <v-btn color="green darken-1" dark @click="insertTicket()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import AddProjectModal from '@/components/addProjectModal.vue'
  import AddClientModal from '@/components/addClientModal.vue'
  import AddSubModal from '@/components/addSubProjectModal.vue'
  export default {
    components: {
      AddProjectModal,
      AddClientModal,
      AddSubModal
    },
    mounted() {
      Events.$on("reload-modal", (data) => {
        if(data.id == 1){
          this.getClients()
          this.client = data.client_id
        }
        if(data.id == 2){
          this.getClientProjects(this.client)
          this.project = data.project_id
        }
        if(data.id == 3){
          this.getSubProjects(this.project)
          this.subProject = data.sub_project_id
        }
      })
    },
    data() {
      return {
        dialog: false,
        name: '',
        description: '',
        client: '',
        all: false,
        startTimer: 0,
        priorities: [{
          text: "Normal",
          value: 0
        }, {
          text: "High",
          value: 1
        }],
        priority: 0,
        errors: [],
        color: '',
        members: [],
        users: [],
        project: '',
        subProject: '',
        subProjects: [{text: "Select a Sub-Project", value: ""}],
        clients: [{text: "Select a Client", value: ""}],
        projects: [{text: "Select a Project", value: ""}]
      }
    },
    methods: {
      openModal() {
        this.dialog = true
        this.getClients()
        this.getUsers()
      },
      selectAll(value){
        if(this.all == false){
          this.members = []
        } else {
          this.members = []
          this.users.forEach((element) => {
            this.members.push(element.value)
          })
        }
      },
      getClientProjects(client) {
        this.project = ""
        this.subProject = ""
        this.projects = [{text: "Select a Project", value: ""}]
        this.subProjects = [{text: "Select a Sub-Project", value: ""}]
        this.apiCall("get-client-projects", {id: client}).then((response) => {
          if (response.success == true) {
            response.projects.forEach((element) => {
              this.projects.push(element)
            })
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getUsers(){
        this.apiCall("get-user-ids", null).then((response) => {
          if (response.success == true) {
            this.users = response.users
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      insertTicket() {
        this.apiCall("insert-ticket", {
          priority: this.priority,
          name: this.name,
          project_id: this.project,
          client_id: this.client,
          sub_project_id: this.subProject,
          description: this.description,
          members: this.members.join(),
          created_by: this.$session.get('user_id'),
          startTimer: this.startTimer
        }).then((response) => {
          console.log(this.project)
          if (response.success == true) {
            this.color = 'success'
            this.errors = ['Ticket has been succesfully created.']
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
      getSubProjects(project) {
        this.subProject = ""
        this.subProjects = [{text: "Select a Sub-Project", value: ""}]
        this.apiCall('get-sub-project-ids', {
          projectId: project
        }).then((response) => {
          if (response.success == true) {
            response.subProjects.forEach((element) => {
              this.subProjects.push(element)
            })
          } else {
            console.log(response)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getClients() {
        this.clients = [{text: "Select a Client", value: ""}]
        this.apiCall('get-clients-ids').then((response) => {
          if (response.success == true) {
            response.clients.forEach((element) => {
              this.clients.push(element)
            })
          } else {
            console.log(response)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      close() {
        this.dialog = false
        this.priority = 0
        this.name = ''
        this.description = ''
        this.project = ''
        this.subProject = ''
        this.subProjects = [{text: "Select a Sub-Project", value: ""}]
        this.members = []
        this.errors = []
        this.projects = [{text: "Select a Project", value: ""}]
        this.client = ''
        this.clients = [{text: "Select a Client", value: ""}]
      }
    }
  }
</script>