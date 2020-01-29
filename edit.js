    /* The functions found in edit.js is used to help create new questions for sessions. It gives
    the user the ability to remove all questions as well. It basic functions include the save question
     and uploading an image to go along with said question.*/
    
    $(document).ready(() => {
    const database = firebase.database()



    $('#resetButton').click(() => {
    console.log('Resetting the database');

    database.ref('edit/').remove(); 
    // delete the entire collection
    // writes data to the database:
    
  });

    // save the user inputs on to firebase

    $('#saveButton').click(() => {
    const questionNum = $('#exampleFormControlInput1').val();
    database.ref('edit/' + questionNum).set({
      Question_number: questionNum,
      //file: $('#inputGroupFile02').val(), 
      question:$('#exampleFormControlTextarea1').val(), 
      answer1: $('#answer ').val(),
      answer2: $('#answer2 ').val(),
      answer3: $('#answer3 ').val(),
      answer4: $('#answer4 ').val(),
      answer5: $('#answer5 ').val(),
      //answer5: $('#answer5 ').val(),
      file: $('#myImg').attr('src')
      
      })

  })

  

  // This file is helping to load the image when user upload a image
    
    $(function () {
        $(":file").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    });

    function imageIsLoaded(e) {
        $('#myImg').attr('src', e.target.result);
        $('#yourImage').attr('src', e.target.result);
    };



  })
