'use strict';

var $mainForm;
var $inputText;
var $inputButton;
var $result;
var clipboard;
var $copy;
var $suggestions;
var $suggestionMain;
var $hashtags;

var spinnerOpts = {
  lines: 9, // The number of lines to draw
  length: 1, // The length of each line
  width: 3, // The line thickness
  radius: 5, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb
  speed: 0.8, // Rounds per second
  trail: 42, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'loading', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

var spinner;

$(function() {
  $mainForm = $('.js-main-input-form');
  $inputText = $('.js-input-text');
  $inputButton = $('.input-button');
  $suggestions = $('.suggestions');
  $suggestionMain = $('.suggestion-main');
  $copy = $('.copy');

  $('[data-typer-targets]').typer()
  spinner = new Spinner(spinnerOpts);


  $inputText.keypress(function(e) {
    console.dir(e);
    if (e.keyCode === 13 && !e.altKey && !e.ctrlKey && !e.shiftKey &&
        !e.metaKey) {
      e.preventDefault();
      $inputButton.click();
    }
  });

  $inputButton.click(function process(e) {
    var text = $inputText.val();
    if (text) text = text.trim();

    if (!text) return;

    var hashtags = hashtagify(text);
    $suggestions.empty();

    findSuggestions(hashtags, function(suggestions) {
      for (var i=0;i<suggestions.length;i++) {
        var hash = '#' + suggestions[i].replace(/\s/,'-');
        var html = $.parseHTML('<div class="l-suggestion suggestion ' +
          'js-suggestion">'+hash+'</div>');
        $suggestions.append(html);
      }

      var $suggestion = $('.js-suggestion');
      $suggestion.click(function(e) {
        addText(this.innerText);
        copyAll();
      });
    });

    $inputText.val(hashtags.trim());
    copyAll();
  });
});

function addText(suggested) {
  $inputText.val($inputText.val() + ' ' + suggested);
}

function hashtagify(text) {
  var hashtagified = '';

  // regex to find character that's not a whitespace or #
  var regex = /([^#|^\s]+)/gi;
  var match = text.match(regex);
  var result = [];

  if (match instanceof Array) {
    for(var i=0;i<match.length;i++) {
      result.push('#' + match[i]);
    }
  }

  return result.join(' ');
}

function findSuggestions(text, callback) {
  var split = text.split(/\s/);
  if (split instanceof Array) {

    spinner.spin();
    $suggestions.append(spinner.el);

    // only get first word hurrdurr
    var word = split[0].trim().replace(/#/,'');
    var ajaxUrl = '/api/'+word;
    console.log(ajaxUrl);
    $.ajax({
      url: ajaxUrl,
      success: function(result) {
        spinner.stop();
        callback(result);
      },
      error: function(jqXHR, textStatus, err) {
        spinner.stop();
        console.error(err);
        callback([]);
      }
    });
  }
}

function copyAll() {
  $inputText.select();
}

