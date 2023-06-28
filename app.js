
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const taskList = document.getElementById('task-list');

    let tasks = [];

    function renderTasks() {
      taskList.innerHTML = '';

      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text + ' (Fecha: ' + task.datetime + ')';
        taskList.appendChild(li);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
          deleteTask(index);
        });

        li.appendChild(deleteButton);
      });
    }

    function addTask(taskText, taskDatetime) {
      const task = {
        text: taskText,
        datetime: taskDatetime
      };

      tasks.push(task);
      renderTasks();
      saveTasks();

      const now = new Date();
      const taskDate = new Date(taskDatetime);

      const timeDiff = taskDate.getTime() - now.getTime();
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));

      if (minutesDiff <= 5) {
        showNotification(taskText);
      }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
        saveTasks();
      
        checkPendingNotifications(); // Verificar notificaciones pendientes después de eliminar una tarea
      }

      function checkPendingNotifications() {
        const now = new Date();
      
        tasks.forEach((task) => {
          const taskDate = new Date(task.datetime);
          const timeDiff = taskDate.getTime() - now.getTime();
          const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      
          if (minutesDiff <= 5) {
            showNotification(task.text);
          }
        });
      }

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function showNotification(taskText) {
      if (Notification.permission === 'granted') {
        const notification = new Notification('Tarea pendiente', {
          body: `Faltan 5 minutos para completar la tarea: ${taskText}`,
          icon: 'icon.png' // Reemplaza con la URL de tu propia imagen
        });
      }
    }

    function requestNotificationPermission() {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }

    window.addEventListener('load', () => {
      const savedTasks = localStorage.getItem('tasks');

      if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
      }
      checkPendingNotifications();
      requestNotificationPermission();

      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDatetimeValue = taskDatetime.value;

        if (taskText !== '' && taskDatetimeValue !== '') {
          addTask(taskText, taskDatetimeValue);
          taskInput.value = '';
          taskDatetime.value = '';
        }
      });
    });