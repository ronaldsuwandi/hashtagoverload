'use strict';

var $mainForm;
var $inputText;
var $inputButton;
var $result;
var clipboard;
var $copy;
var $suggestions;

$(function() {
  $mainForm = $('.js-main-input-form');
  $inputText = $('.js-input-text');
  $inputButton = $('.input-button');
  $suggestions = $('.suggestions');
  $copy = $('.copy');

  $inputText.keypress(function(e) {
    if (e.keyCode === 13) {
      $inputButton.click();
    }
  });

  $inputButton.click(function process(e) {
    var text = $inputText.val();
    if (text) text = text.trim();

    if (!text) return;

    var hashtags = hashtagify(text);
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
    $suggestions.empty();

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
    // only get first word hurrdurr
    var word = split[0].trim().replace(/#/,'');
    var ajaxUrl = '/api/'+word;
    console.log(ajaxUrl);
    $.ajax({
      url: ajaxUrl,
      success: function(result) {
        callback(result);
      },
      error: function(jqXHR, textStatus, err) {
        console.error(err);
        callback([]);
      }
    });
  }
}

function copyAll() {
  $inputText.select();
}

