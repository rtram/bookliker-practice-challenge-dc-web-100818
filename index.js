const list = document.querySelector("#list")
const display = document.querySelector("#show-panel")

document.addEventListener("DOMContentLoaded", function() {
  getFetch()
});

function getFetch() {
  fetch("http://localhost:3000/books")
    .then(response => response.json())
    .then(data => data.forEach(render))
}

function patchFetch(update) {
  // debugger
  fetch(`http://localhost:3000/books/${update.id}`, {
    method: "PATCH",
    headers:
    {
  "Content-Type": "application/json"
    },
    body: JSON.stringify(update)
  })
    .then(resp => resp.json())
    .then(data => renderShowPanel(data))
}

function render(data) {
  const li = document.createElement("li")
  li.innerText = data.title
  li.addEventListener("click", (event) => {renderShowPanel(data)})
  list.append(li)
}

function renderShowPanel(data) {
  destroyChildren(display)

  const titleDiv = document.createElement("div")
  const img = document.createElement("img")
  const descriptionDiv = document.createElement("div")
  const userDiv = document.createElement("div")
  const readBtn = document.createElement("button")

  display.append(titleDiv, img, descriptionDiv, userDiv, readBtn)

  titleDiv.innerText = data.title
  img.src = data.img_url
  descriptionDiv.innerText = data.description

  data.users.forEach((userObj) => {
    const userName = document.createElement("div")
    userName.innerHTML = `<p><strong>${userObj.username}</strong></p>`
    userDiv.append(userName)
  })

  readBtn.innerText = "Read Book"
  readBtn.addEventListener("click", (event) => {addOrRemoveReader(data)})
}

function addOrRemoveReader(data) {
  const currentUser = {"id":1, "username":"pouros"}
  const userLikedIndex = data.users.findIndex((user) => {return user.id === currentUser.id})
  if (userLikedIndex > 0) {
    data.users.splice(userLikedIndex, 1)
    const patch = {
      id: data.id,
      users: data.users
    }
    patchFetch(patch)
  } else {
    data.users.push(currentUser)
    const patch = {
      id: data.id,
      users: data.users
    }
    patchFetch(patch)
  }
}

function destroyChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}
