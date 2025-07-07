const socket = io();

function getUserImage(userId) {
    if (userId === 1) return "/static/img/user1.png";
    if (userId === 2) return "/static/img/user2.png";
    return null;
}

function sendTask(category) {
    const input = document.getElementById(`input-${category}`);
    const text = input.value.trim();
    if (!text) return;

    socket.emit("new_task", {
        text: text,
        category: category
    });

    input.value = "";
}

socket.on("broadcast_task", (data) => {
    const listIdMap = {
        shopping: "shopping-list",
        todo: "todo-list",
        important: "important-list"
    };

    const listId = listIdMap[data.category];
    if (!listId) return;

    const ul = document.getElementById(listId);

    const li = document.createElement("li");
    li.className = "textContent";
    li.setAttribute("data-id", data.id);

    const imgSrc = getUserImage(data.user_id);
    const userImgHtml = imgSrc
        ? `<img src="${imgSrc}" alt="User" width="24" height="24">`
        : `<span>❓</span>`;

    li.innerHTML = `
        <div class="box1">${data.text}</div>
        <div class="box2">
            <button class="delete-button" onclick="deleteTask('${data.id}')">❌</button>
        </div>
        <div class="box3">${userImgHtml}</div>
    `;

    ul.appendChild(li);
    gsap.from(li, {
  y: -30,
  opacity: 0,
  scale: 0.9,
  duration: 0.5,
  ease: "back.out(1.7)"
});
});

function deleteTask(id) {
    socket.emit("delete_task", { id: id });
}

socket.on("task_deleted", (data) => {
    const el = document.querySelector(`[data-id='${data.id}']`);
    if (el) {
    gsap.to(el, {
      opacity: 0,
      scale: 0.6,
      y: 20,
      duration: 0.3,
      ease: "power1.in",
      onComplete: () => el.remove()
    });
  }
});
