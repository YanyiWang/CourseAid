    /* Main function of this file is to help load the question from the firebase. */
    
    $(document).ready(() => {
    const database = firebase.database()

    /*$('#saveButton').click(() => {
    database.ref('edit/Question_1').set({Question_number: '1', file: 'cat.jpg', question:'what does this mean?', answer1: 'hello', answer2: 'goodbye' });
    database.ref('edit/Question_2').set({Question_number: '1', file: 'cat.jpg', question:'what does this mean?', answer1: 'hello', answer2: 'goodbye' });
    database.ref('edit/Question_3').set({Question_number: '1', file: 'cat.jpg', question:'what does this mean?', answer1: 'hello', answer2: 'goodbye' });
    console.log('Saving');
  })*/
$('#readButton').click(() => {
  const num= $('#Question_number').val()
    const key = 'edit/' + num;

    /*const questionNum = $('#exampleFormControlInput1').val();
    database.ref('edit/' + questionNum).set({
      Question_number: questionNum,
      //file: $('#inputGroupFile02').val(), 
      question:$('#exampleFormControlTextarea1').val(), 
      answer1: $('#answer ').val(),
      answer2: $('#answer2 ').val()*/
    // 'once' reads the value once from the database
   database.ref(key).once('value', (snapshot) => {
      const data = snapshot.val();
      console.log('You received some data!', data);
      if (!data) {
        // clear the display
        $('#answer').html('');
        $('#answer2').attr('src', '').attr('width', '0px');
        $('#exampleFormControlTextarea1').html('Error: could not find user: ' + key);
        return;
      }
      if (data.Question_number&& data.question && data.answer1 && data.answer2) {
        $('#question').html(data.Question_number);
        $('#content').html(data.question);
        $('#file').attr('src', data.file).attr('width', '300px')


        if (data.answer1 === "" ){
          $('#A').hide()
        }
        else{
        $('#A').html('A: ' + data.answer1);
      }


      if (data.answer2 === "" ){
          $('#B').hide()
        }
        else{
        $('#B').html('B: ' + data.answer2);
      }


      if (data.answer3 === "" ){
          $('#C').hide()
        }
        else{
        $('#C').html('C: ' + data.answer3);
      }


      if (data.answer4 === "" ){
          $('#D').hide()
        }
        else{
        $('#D').html('D: ' + data.answer4);
      }


        
        if (data.answer5 === "" ){
          $('#E').hide()
        }
        else{
        $('#E').html('E: ' + data.answer5);
      }


        //$('#exampleFormControlTextarea1').html('Question: ' + data.question);

      } else {
        // clear the display
        $('#question').html('');
        $('#C').attr('src', '').attr('width', '0px');
      }
    });
      });


});