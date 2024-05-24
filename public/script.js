document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    const loadTasks = async () => {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => addTaskToDOM(task));
    };

    const addTaskToDOM = (task) => {
        const li = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskText.addEventListener('click', () => {
            li.classList.toggle('completed');
            updateTask(task.text, li.classList.contains('completed'));
        });

        if (task.completed) {
            li.classList.add('completed');
        }

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', () => {
            li.remove();
            deleteTask(task.text);
        });

        li.appendChild(taskText);
        li.appendChild(removeBtn);
        taskList.appendChild(li);
    };

    const addTask = async () => {
        const task = { text: taskInput.value, completed: false };
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        if (response.ok) {
            addTaskToDOM(task);
            taskInput.value = '';
        }
    };

    const updateTask = async (text, completed) => {
        await fetch('/tasks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, completed })
        });
    };

    const deleteTask = async (text) => {
        await fetch('/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
    };

    addTaskBtn.addEventListener('click', addTask);
    loadTasks();
});
