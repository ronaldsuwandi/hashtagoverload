'use strict';

var $mainForm;
var $inputText;
var $result;
var $copyButton;
var $resultBox;

$(function() {
  $mainForm = $('.js-main-input-form');
  $inputText = $('.js-input-text');
  $result = $('.js-result');
  $copyButton = $('.copy-clipboard');
  $resultBox = $('.result-box');

  $copyButton.click(copyAll);
  // $result.focus(copyAll);

  $mainForm.submit(function process(e) {
    var text = $inputText.val();
    if (text) text = text.trim();

    if (!text) return;

    var hashtags = hashtagify(text);

    // $result.text(hashtags);
    // $result.val(hashtags.trim());
    // $resultBox.css('visibility', 'visible');

    $inputText.val(hashtags.trim());

    copyAll();
  });
});

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

function copyAll() {
  $inputText.select();
  // $result.select();
}