
        const socket = io();
        const input = document.getElementById('task-input');
        const list = document.getElementById('task-list');

        function sendTask() {
            const task = input.value.trim();
            if (!task) return;
            socket.emit('new_task', { text: task });
            input.value = '';
        }

        socket.on("broadcast_task", data => {
    const list = document.getElementById(`${data.category}-list`);
    const li = document.createElement('li');
    li.textContent = data.text;
    list.appendChild(li);
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


        function deleteTask(taskText) {
            socket.emit('delete_task', { text: taskText });
        }
        socket.on('task_deleted', data => {
            const items = document.querySelectorAll('#task-list li');
            for (let item of items) {
                if (item.textContent.includes(data.text)) {
                    item.remove();
                    break;
                }
            }
        });

        function sendTask(category) {
    const input = document.getElementById(`input-${category}`);
    const task = input.value.trim();
    if (!task) return;
    socket.emit('new_task', { text: task, category: category });
    input.value = '';
}
