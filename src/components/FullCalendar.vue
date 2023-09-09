<script>

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      calendarPlugins: [ dayGridPlugin ]
    }
  },
  methods: {
    previous(){
      document.getElementById('prev').addEventListener('click', function() {
    calendar.prev(); // call method
    var date = moment(calendar.getDate()).format("YYYY")
    console.log(date.toISOString())
  });
    }
  }
}

</script>

<template>
<div style="background-color: black;">
  <FullCalendar defaultView="dayGridMonth" :plugins="calendarPlugins" />
</div>
</template>