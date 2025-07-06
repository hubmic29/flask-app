
        const socket = io();
        const input = document.getElementById('task-input');
        const list = document.getElementById('task-list');

        function sendTask() {
            const task = input.value.trim();
            if (!task) return;
            socket.emit('new_task', { text: task });
            input.value = '';
        }

        socket.on("broadcast_task", (data) => {
    const listId = {
        shopping: "shopping-list",
        todo: "todo-list",
        important: "important-list"
    }[data.category];

    if (!listId) return;

    const ul = document.getElementById(listId);

    const li = document.createElement("li");
    li.className = "textContent";
    li.setAttribute("data-id", data.id);
    li.innerHTML = `
        <div class="box1">${data.text}</div>
        <div class="box2">
           <button class="btn btn-sm btn-danger"
    onclick="deleteTask('${data.id}')">❌</button>

        </div>
        <div class="box3">
            <small>${data.user_id}</small>
        </div>
    `;

    ul.appendChild(li);
});


        socket.on('connect', () => {
            console.log("Connected to Socket.IO server");
        });

        socket.on('task_added', data => {
            addTaskToDOM(data.text);
        });


        function addTaskToDOM(taskText, userId) {
            const li = document.createElement('li');
            li.classList.add('textContent');

            const div1 = document.createElement('div');
            div1.classList.add('box1');
            div1.textContent = taskText;

            const div2 = document.createElement('div');
            div2.classList.add('box2');

            const div3 = document.createElement('div');
            div3.classList.add('box3');
            div3.innerHTML = `<small>${userId}</small>`;



            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-danger';
            deleteBtn.textContent = '❌';
            deleteBtn.onclick = () => deleteTask(taskText);

            div2.appendChild(deleteBtn);
            li.appendChild(div1);
            li.appendChild(div2);
            li.appendChild(div3);
            list.appendChild(li);
        }


        function deleteTask(id) {
    socket.emit("delete_task", { id: id });
}
        socket.on("task_deleted", (data) => {
    const el = document.querySelector(`[data-id='${data.id}']`);
    if (el) el.remove();
});

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

