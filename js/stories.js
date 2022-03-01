"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  const deleteBtn = showDelete(story);

  return $(`
      <li id="${story.storyId}">
        ${deleteBtn ? createDeleteHtml() : ''}
        ${showStar ? createStarHtml(currentUser, story) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Grabs data from #story-form and adds it to the story list
async function createStory(evt){
  evt.preventDefault();

  const author = $("#author-name").val();
  const title = $("#title-name").val();
  const url = $("#url").val();

  const story = await storyList.addStory(currentUser, {author, title, url});
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $storyForm.slideUp("slow");
  $storyForm.trigger("reset");
}

$storyForm.on("submit", createStory)

// Makes mark-up for story favorites
function createStarHtml(user, story){
  // const isFavorite = user.favorites.includes(story)
  const isFavorite = user.isFavorite(story);
  const star = isFavorite ? "fas" : "far";

  return `
    <span class="star">
      <i class="${star} fa-star"></i>
    </span>`;
};

async function starBtnClick(evt) {
  // Grab story story object from the li that was clicked
  const storyId = evt.target.parentElement.parentElement.id
  const res = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`)
  const story = new Story(res.data.story);

  // Change star class either "fas" or "far" depending on current state
  const currentClass = evt.target.classList[0];
  let newClass = currentClass === "far" ? "fas" : "far";
  evt.target.classList.replace(currentClass, newClass);

  // Add/Remove class from user favorites
  const favorite = 
    newClass === 'fas' ? currentUser.addFavorite(story) : currentUser.removeFavorite(story);
};

$allStoriesList.on("click", ".star", starBtnClick);

// Makes mark-up to delete a story
function createDeleteHtml(){
  return `
  <span class="trash-can">
    <i class="fas fa-trash-alt"></i>
  </span>`;
};

function showDelete(story) {
  return currentUser.isOwnStory(story);
};

async function deleteBtnClick(evt) {
  // Grab the id of the story from the li we clicked and then remove from api
  const storyId = evt.target.parentElement.parentElement.id
  const res = await axios({
    method: 'delete',
    url: `https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`,
    data: {
      token: currentUser.loginToken
    }
  });

  // Remove the story from the story list and from currentUser.ownStories and then refresh the list
  storyList.stories = storyList.stories.filter((s) => s.storyId !== res.data.story.storyId)
  currentUser.removeStory(res.data.story);
  putStoriesOnPage();
};

$allStoriesList.on("click", ".trash-can", deleteBtnClick);