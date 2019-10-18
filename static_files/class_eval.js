/* class_eval.js stores all the functions used to visualize the data found in class_evaluation.html. 
A majority of these functions rely on calls from firebase and google'sAPI in order to retrieve and produce the graphs. 
We also include the student list functions in here and are used to display the current student data to the user. 
*/


$(document).ready(() => {
    const database = firebase.database();
    
    /* Displays All Student Data */
    database.ref("students/").on('value', (snapshot) => {
        $('#gradeDiv').html('<h3>Students</h3>'+ "<table id='data' class='table table-responsive table-striped'><tr> <th>Student</th> <th>Grade</th> <th>Attendance</th></tr></table>")
        snapshot.forEach(function(data){
          
          $('#data').append("<tr> <td>"+data.key+"</td> <td>"+data.val().grade+"</td> <td>"+data.val().attendance+"</td> </tr>")
        });  
    });

    /* Modify Student Grades/Attendance */
    $('#stu_edit').click( ()=>{
        const name = $('#stu_name').val();
        const grade = $('#stu_grade').val();
        const atd = $('#stu_atd').val();
        let gpa;
    
        switch(grade){
          case 'A':
            gpa = 4.0;
            break;
          case 'B':
            gpa = 3.0;
            break;
          case 'C':
            gpa = 2.0;
            break;
          case 'D':
            gpa = 1.0;
            break;
          default:
            gpa = 0;
            break;
        }
    
        database.ref('students/'+ name).set({
          grade: grade,
          attendance: atd,
          gpa:gpa
        });
    });

    /* Displays all student data on the page */
    $('#allUsersButton').click( ()=> {
        database.ref("students/").on('value', (snapshot) => {
          $('#gradeDiv').html('<h3>Students</h3>'+ "<table id='data' class='table table-responsive table-striped'><tr> <th>Student</th> <th>Grade</th> <th>Attendance</th></tr></table>")
          snapshot.forEach(function(data){
            
            $('#data').append("<tr> <td>"+data.key+"</td> <td>"+data.val().grade+"</td> <td>"+data.val().attendance+"</td> </tr>")
          });
          
        });
      });

    /* Displays specific Student Data */
    $('#readButton').click( ()=> {
        const stu_name = 'students/' + $('#nameBox').val();
        database.ref(stu_name).once('value', (snapshot) => {
          $('#gradeDiv').html('<h3>Students</h3>'+ "<table id='data' class='table table-responsive table-striped'><tr> <th>Student</th> <th>Grade</th> <th>Attendance</th></tr></table>")
          $('#data').append("<tr> <td>"+snapshot.key+"</td> <td>"+snapshot.val().grade+"</td> <td>"+snapshot.val().attendance+"</td> </tr>")
        });
    });




    show_class_gpa();
    show_cape('COGS121');
    
    /* Gets Cape data inputted course */
    $("#prof_data").click( () =>{
      const course = $("#course_box").val();
      show_cape(course);  
    });
  
    /* Displays cape data in table format along with average */
    function show_cape(cour){
      const course = cour;
      
      /* Finds Child Nodes in firebase that match the given course */
      database.ref("cape_data").orderByChild('subject_course').equalTo(course).on('value', (snapshot) => {
        console.log(snapshot.val());
        $('#result').html('<h3 style="color:blue">'+ course +'</h3><br><div id="avg_stdy"></div>' + "<table id='data' class='table table-responsive table-striped'><tr> <th>Term</th> <th>Instructor</th> <th>Hours Study/Week</th> <th>Average GPA</th> </tr></table>")
        let avg_count = 0;
        let avg_study = 0;
        let avg_gpa = 0;
        
        /* Calculating Average for Study/GPA */
        snapshot.forEach(function(data){
          console.log(data.key);
          avg_count++;
          avg_study += parseInt(data.val().study_hours_per_week);
          
          /* Adding each child gpa to average + Null Check */
          if(data.val().avg_gpa_received != null){
            avg_gpa += parseInt(data.val().avg_gpa_received);
          }
          
          /* Appends Current child's data to the table */
          $('#data').append("<tr> <td>"+data.val().term+"</td> <td>"+data.val().instructor+"</td> <td>"+data.val().study_hours_per_week+"</td> <td>"+data.val().avg_gpa_received+"</td> </tr>")
  
        });

        /* Displays Average to Cape Card */
        $('#avg_stdy').append('<h5 style="color:green"> Average Study Hour/Week :' + (avg_study/avg_count).toFixed(2) +' Hrs</h5>');
        $('#avg_stdy').append('<h5 style="color:orange"> Average GPA :' + (avg_gpa/avg_count).toFixed(2) +'</h5>' + "(Undefined GPA counted as 0)");
  
  
      });
    }
    
    /* Shows Average GPA of teacher's class */
    function show_class_gpa(){
      database.ref("students").orderByChild('gpa').on('value', (snapshot) => {
        console.log(snapshot.val());
        let avg_count = 0;
        let avg_gpa = 0;
  
        /* Calculates average gpa of students found in firebase */
        snapshot.forEach(function(data){
          avg_count++;
        
          if(data.val().gpa != null){
            avg_gpa += parseFloat(data.val().gpa);
          }
        });

        /* Displays Class Average on Class Card */
        $('#class_gpa').html("Average GPA: "+ Number(avg_gpa/avg_count).toFixed(2)); 
       
      });
    }
  
      
  

  // Load google charts
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  google.charts.setOnLoadCallback(bar_grades);
  google.charts.setOnLoadCallback(cape_hours("COGS121"));
  google.charts.setOnLoadCallback(cape_gpa("COGS121"));
  
  // Draw the chart and set the chart values
  function drawChart() {
  /* Goes through each comment and counts them */  
  database.ref("side_comments").on("value", function(snapshot) {  
      var a = snapshot.numChildren(); // 1 ("name")
  
      var data = google.visualization.arrayToDataTable([
    ['Material', 'Questions Asked'],
    ['Lecture 1', a],
    ['Session 1', 3]
  ]);
  
    // Optional; add a title and set the width and height of the chart
    var options = {'title':'Number of Comments per Content', width:'400', height:'250'};
  
    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  
  
  });
  }
    /* Displays Grade distribution of the class via bar graph */
    function bar_grades() {
        /* Adding Average of all grades */
        database.ref("students").orderByChild('grade').on('value', (snapshot) => {
        console.log("grade =" + snapshot.val());
        let avg_count = 0;
        let avg_gpa = 0;
        let A=0, B=0, C=0, D=0, F=0;
        snapshot.forEach(function(data){
          
          console.log("data =" + data.val().grade);
          switch(data.val().grade){
            case 'A':
              A++;
              break;
            case 'B':
              B++;
              break;
            case 'C':
              C++;
              break;
            case 'D':
              D++;
              break;
            default:
              F++;
          break;
          }
  
          
          /* Using Google API to visualize bar graph */
          var data = google.visualization.arrayToDataTable([
          ["Grade", "Amount", { role: "style" } ],
          ["A", A, "color:#306bac"],
          ["B", B, "color:#306bac"],
          ["C", C, "color:#306bac"],
          ["D", D, "color:#306bac"],
          ["F", F, "color:#306bac"],
        ]);
  
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
                         { calc: "stringify",
                           sourceColumn: 1,
                           type: "string",
                           role: "annotation" },
                         2]);
        
  
                         var options = {
          title: "Current Student Grades",
          width: 400,
          height: 400,
          bar: {groupWidth: "95%"},
          legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("bar_grades"));
        chart.draw(view, options);
        });
      
       
      });
  
    }
  
    /* Displays Average hours studied(Cape Data) via barChart */
    function cape_hours(course){
      
      /* Finds child nodes that are related to the inputted course */
      database.ref("cape_data").orderByChild('subject_course').equalTo(course).once('value', (snapshot) => {
        console.log("grade =" + snapshot.val());
        
        /* initialize array data */
        let hour_data= [['Professor[Term]','Hours']]
        
        /* Goes through each child and extracts average study hours */
        snapshot.forEach(function(data){
          let prof = data.val().instructor+'['+data.val().term+']';
          let hours = parseFloat(data.val().study_hours_per_week);
          const newHours = [prof,hours];
          hour_data.push(newHours);
          
        });
        
        /* Using Google API to visualize BarChart */
        var data = google.visualization.arrayToDataTable(hour_data);
  
        var options = {
          title: 'Hours spent studying',
          chartArea: {width: '50%'},
          hAxis: {
            title: 'Hours',
            minValue: 0
          },
          vAxis: {
            title: 'Professors [Term]'
          },
          width:'400', 
          height:'250'
  
        };
  
        var chart = new google.visualization.BarChart(document.getElementById('cape_hours'));
  
        chart.draw(data, options);
      });
  
    }
    
    /* Displays GPA CAPE data via Histogram */
    function cape_gpa(course){
      
      database.ref("cape_data").orderByChild('subject_course').equalTo(course).once('value', (snapshot) => {
        console.log("grade =" + snapshot.val());
        
        let gpa_data= [['Professor[Term]','Gpa']]
        
        /* Goes through each child and extracts average GPA */
        snapshot.forEach(function(data){
          let prof = data.val().instructor+'['+data.val().term+']';
          let gpa = parseFloat(data.val().avg_gpa_received);
          const newGpa = [prof,gpa];
          gpa_data.push(newGpa);
          
        });
        
         /* Using Google API to visualize histogram */
        var data = google.visualization.arrayToDataTable(gpa_data);
  
        var options = {
            title: 'Average GPA Received for this course (Based on CAPE data)',
            legend: { position: 'none' },
            width:'400', 
            height:'250'
          };
  
          var chart = new google.visualization.Histogram(document.getElementById('cape_gpa'));
          chart.draw(data, options);
      });
  
    }
  
  });
  
  
  