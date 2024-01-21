const api_url = "https://api.github.com/users/";
const api_urllang = "https://api.github.com/";
var form = document.getElementById("form");

// avatar
function avatarMaking(data) {
  return `
    <div 
    style="
    display: grid;
    grid-template-columns: 1fr 3fr;
    ">
    <div>
    <img style="border: 2px solid #fff; padding: 10px; max-width: 300px;" src="${data.avatar_url}">
      </div>
      <div>
      <h4>${data.name}</h4><br>
      <span style:"text-decoration: solid;">Bio: </span>${data.bio}<br>
      Location: ${data.location}<br>
      Twitter: ${data.twitter_username}<br>
      </div>
      </div>
      <div style="padding: 20px;">
      <a href="${data.html_url}">Github Profile</a>
      </div>
      <div style="display: flex; flex-wrap: wrap; aling-items: center; justify-content: center;">
      <p>Repositories</p>
      </div>
      `;
}

function fetchUserLanguages(original_username, repodata) {
  const repos = document.querySelector("#repo");
  let languagelist = [];
  repodata.forEach(async (repo, index) => {
    const lang_response = await fetch(
      api_urllang +
        "repos/" +
        original_username +
        "/" +
        repo.name +
        "/languages"
    );
    let lang_data = await lang_response.json();
    // console.log(lang_data);
    if (Object.keys(lang_data).length === 0) {
      languagelist.push(`
      <div style="border: 1px solid black; margin: 10px; padding: 10px;">
      <h5><a href="${repo.html_url}">${repo.name}</a></h5>
      <p>${repo.description}</p>
      <p>No Languages found</p>
      </div>
      `);
    } else {
      var languages = Object.keys(lang_data);
      let lang_keys = [];
      languages.forEach((language) => {
        lang_keys.push(
          `<div style="background-color: #40A2D8; padding:2px; border-radius:1px;color:white;">${language} </div>`
        );
      });
      console.log(lang_keys);
      console.log(languages);
      languagelist.push(`
      <div style="border: 1px solid black; margin: 10px; padding: 10px;">
      <h5><a href="${repo.html_url}">${repo.name}</a></h5>
      <p>${repo.description}</p>
        <div style="display: flex; flex-wrap: wrap;justify-content: flex-start;gap:12px">${lang_keys}</div>
      </div>
      `);
    }
    var languagedata = languagelist.toString().split(",").join("");
    repos.innerHTML = languagedata;
  });
}
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const profile = document.querySelector("#main");
  var username = document.getElementById("username").value;
  var original_username = username.split(" ").join("");

  const fetchUserData = async (original_username) => {
    const response = await fetch(api_url + original_username); // response from server
    const repo = await fetch(api_url + original_username + "/repos");
    if (response.ok) {
      var data = await response.json();
    } else {
      throw new Error("User not found");
    }
    if (repo.ok) {
      var repodata = await repo.json();
    } else {
      throw new Error("Repository data not found");
    }

    var avatar = avatarMaking(data);
    fetchUserLanguages(original_username, repodata);
    profile.innerHTML = avatar;
  };
  fetchUserData(original_username);
});
