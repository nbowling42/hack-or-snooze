"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
};

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
};

$navLogin.on("click", navLoginClick);

// When a user clicks submit a form pops up allowing them to create a story.
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $storyForm.show();
};

$navSubmit.on("click", navSubmitClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
};

function navFavoritesClick() {
  $allStoriesList.empty();
  if(currentUser.favorites.length === 0){
    $allStoriesList.append('<h3>No favorites have been added yet!</h3>');
  } else {
    for(let favorite of currentUser.favorites) {
      $allStoriesList.append(generateStoryMarkup(favorite));
    };
  };
};

$navFavorites.on("click", navFavoritesClick);

function navMyStoriesClick() {
  $allStoriesList.empty();
  if(currentUser.ownStories.length === 0){
    $allStoriesList.append('<h3>No stories have been created yet!</h3>');
  } else {
    for(let story of currentUser.ownStories) {
      $allStoriesList.append(generateStoryMarkup(story));
    };
  };
};

$navMyStories.on("click", navMyStoriesClick);