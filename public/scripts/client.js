/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
$(document).ready(function () {
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Function to create a tweet element
  const createTweetElement = function (tweet) {
    console.log("tweet", tweet);
    return $(`
    <article class="tweet">
      <header>
        <div class="tweet-header-left">
          <img src="${tweet.user.avatars}" alt="avatar"/>
          <span>${tweet.user.name}</span>
        </div>
        <p class="tweet-header-right">${tweet.user.handle}</p>
      </header>
      <p>${escape(tweet.content.text)}</p>
      <footer>
      <span>${timeago.format(tweet.created_at)}</span>
        <div class="icon-container">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
  };

  // Function to render tweets
  const renderTweets = function (tweets) {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      //prepending to show latest tweet first
      $("#tweets-container").prepend($tweet);
    }
  };

  // Function to lead tweets from the server
  const loadTweets = function () {
    $.ajax({
      url: "/tweets",
      method: "GET",
      dataType: "json",
      success: function (tweets) {
        renderTweets(tweets);
      },
      error: function (error) {
        console.error("Error loading tweets:", error);
      },
    });
  };

  // Submit event handler for the form
  $("form").submit(function (event) {
    event.preventDefault();

    const $form = $(this);
    const $textarea = $form.find("textarea");
    const tweetText = $textarea.val().trim();
    const $errorContainer = $(".error-container");

    //$errorContainer.slideUP();

    // validate the tweet text
    if (tweetText.length === 0) {
      $(".error-container").append(
        " <div class='error-message'><span>&#9888;</span><p >  The tweet cannot be empty!</p><span>&#9888;</span></div>"
      );
    } else if (tweetText.length > 140) {
      //console.log("tweet is too long");
      $(".error-container").append(
        " <div class='error-message'><span>&#9888;</span><p >  Tweet is too long. Pls rspt our arbitary limit of 140 chars #kthxbye</p><span>&#9888;</span></div>"
      );
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $(this).serialize(),
        success: function () {
          $("#tweets-container").empty();
          loadTweets();
          $textarea.val("");
        },
        error: function (error) {
          console.error("Error loading tweets:", error);
        },
      });
    }
  });

  // Load tweets from the server and render them
  loadTweets();
});

