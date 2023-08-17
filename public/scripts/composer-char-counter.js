$(document).ready(function() {
  console.log($('#input').length);
  $('#input').on('input', function() {
    const textLength = $(this).val().length;
    const remainingChars = 140 - textLength;
    const counter = $('.counter');
    
    counter.text(remainingChars);

    if (remainingChars < 0) {
      counter.addClass('invalid');
    } else {
      counter.removeClass('invalid');
    }
  });
});
