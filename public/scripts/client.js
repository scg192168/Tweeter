/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
$(document).ready(function () {
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
      <p>${tweet.content.text}</p>
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

    // validate the tweet text
    if (!tweetText) {
      alert("Tweet content cannot be empty!");
    } else if (tweetText.length > 140) {
      alert("Tweet is too long! Maximum 140 characters.");
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: $(this).serialize(),
        success: function () {
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