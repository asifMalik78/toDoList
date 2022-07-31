
(function(){
    let tasks=[];
    const tasksList=document.getElementById("list");
    const tasksCounter=document.getElementById("tasks-counter");
    const addTaskInput=document.getElementById("add");

    async function fetchToDos(){
        // GET Request

        // fetch("https://jsonplaceholder.typicode.com/todos")
        //    .then(function(response){
        //     return response.json();
        //    }).then((data)=>{
        //       tasks=data.splice(0 , 20);
        //       renderList();
        //    })

        //    .catch(function(er){
        //     console.log("error");
        //    })

        
        try{
            const response=await fetch("https://jsonplaceholder.typicode.com/todos");
            const data=await response.json();
            tasks=data.slice(0 , 10);
            renderList();
        } catch(errors){
            console.log(errors);
        }

    }

    function addTaskToDOM(task){
        const li=document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" id="${task.id}"  ${task.completed ? 'checked' : ''}  data-id="${task.done}" class="custom-checkbox">
            <label for="${task.id}">${task.title}</label>
            <img src="image/icon.png" class="delete" data-id="${task.id}" />
        `;

        tasksList.append(li);
    }


    function renderList(){
        tasksList.innerHTML='';

        for(let i=0 ; i<tasks.length ; i++){
            addTaskToDOM(tasks[i]);
        }

        tasksCounter.innerHTML=tasks.length;

    }

    function markTasksComplete(taskId){
        const newTasks=tasks.filter((tsk)=>{
            return tsk.id==Number(taskId);
        });
        if(newTasks.length > 0){
            for(let i=0 ; i<newTasks.length ; i++){
                newTasks[i].completed=!newTasks[i].completed;
            }
            showNotification("Tasks Toggled Successfully");
            renderList();
            return;
        }


        showNotification("Could not Toggled the Tasks");

    
    }

    function addTask(task){

        if(task){

            // POST request
            fetch("https://jsonplaceholder.typicode.com/todos" , {
                method:'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },

                body:JSON.stringify(task)
            })
                .then(function(response){
                    return response.json();
                }).then((data)=>{
                    console.log(data);
                    tasks.push(task);
                    renderList();
                    showNotification("Task Added Successfully");
                })

                .catch(function(er){
                    console.log("error");
                })

                
            // tasks.push(task);
            // renderList();
            // showNotification("Task Added Successfully");
            // return;
        }

    }

    function deleteTasks(taskId){
        const newTasks=tasks.filter(function(tsk){
            return tsk.id != Number(taskId);
        });
        
    
        tasks=newTasks;
        renderList();
        if(tasks.length==0){
            tasksList.style.border="none";
        }

        // showNotification("Tasks deleted Successfully");
    }

    function showNotification(text){
        alert(text);
    }


    function handleInputKeypress(e){
        if(e.key=='Enter'){
            const text=e.target.value;
            addTaskInput.value='';
            if(!text){
                showNotification("Task text can not be Empty");
                return;
            }

            const task={
                title:text,
                id:Date.now(),
                completed:false
            }

            addTask(task);
        }
    }

    function handlClickListener(e){
        const target=e.target;
        if(target.className=='delete'){
            const taskId=target.dataset.id;
            deleteTasks(taskId);
            return;
        }
        else if(target.className=='custom-checkbox'){
            const taskId=target.id;
            markTasksComplete(taskId);
            return;
        }
    }


    function initializeApp(){
        fetchToDos();
        addTaskInput.addEventListener("keyup" , handleInputKeypress)
        document.addEventListener('click' , handlClickListener);
    }

    initializeApp();

})();

