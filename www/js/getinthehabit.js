define(function(require){
      var update = function (taskName) {
        var db;
        var request = window.indexedDB.open("habitual", 1);
        request.onerror = function (event) {
          //TODO(David) Add in nice way to error
        };
        request.onsuccess = function (event) {
          db = request.result;
          var transaction = db.transaction(["tasks"], "readwrite");
          transaction.oncomplete = function(event) {
          };

          transaction.onerror = function(event) {
            //TODO(David) Add in nice way to error
          };

          var objectStore = transaction.objectStore("tasks");
            var reqget = objectStore.get(taskName);
            reqget.onsuccess = function (evt) {
              var record = evt.target.result;
              record.dateLastCompleted = Date.now();
              var req = objectStore.put(record);
              req.onsuccess = function(event){
                //TODO(David) When we share state with a server we need to think about doing it here.
              }
            }
        };
        request.onupgradeneeded = function(event) {
          db = event.target.result;
          var objectStore = db.createObjectStore("tasks", 
              { keyPath: "name" });
          objectStore.createIndex("task", "task", { unique: true });
        };
      }
      var setDone = function(e) {
        e.originalTarget.classList.add("notDone");
        e.originalTarget.classList.add("done");
        update(e.originalTarget.id);
      }
      var addTaskToPage = function (taskName) {
        if (!taskName) {
          return;
        }
        var intro = document.getElementById("intro");
        intro.style.display = "none";

        // Create Container Div
        var newItemContainer = document.createElement('div');

        //Create bar of task
        var newItem = document.createElement("div");
        newItem.classList.add("task");
        newItem.classList.add("notDone");
        newItem.id = taskName;
        newItem.addEventListener("click", setDone, false)

        // Create input for deleting
        var checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.name = taskName;
        checkBox.classList.add("checks");
        newItem.appendChild(checkBox);

        // Create Text
        var content = document.createTextNode(taskName);
        newItem.appendChild(content);
        newItemContainer.appendChild(newItem);
        document.body.insertBefore(newItemContainer, intro);
      }
      var addItem = document.getElementById("addItem");
      addItem.addEventListener("click", function (){
        // Add the item to the page
        var task = document.getElementById("task");
        var taskName = task.value;
        task.value = "";
        addTaskToPage(taskName);

        //Now lets add it to localStorage
        var db;
        var request = window.indexedDB.open("habitual", 1);
        request.onerror = function (event) {
          //TODO(David) Add in nice way to error
        };
        request.onsuccess = function (event) {
          db = request.result;
          var transaction = db.transaction(["tasks"], "readwrite");
          transaction.oncomplete = function(event) {
          };

          transaction.onerror = function(event) {
            //TODO(David) Add in nice way to error
          };

          var objectStore = transaction.objectStore("tasks");
          var req = objectStore.add({"name":taskName,
                                     "dateCreated": Date.now()});
          req.onsuccess = function(event){
            //TODO(David) When we share state with a server we need to think about doing it here.
          }
        };
        request.onupgradeneeded = function(event) {
          db = event.target.result;
          var objectStore = db.createObjectStore("tasks", 
              { keyPath: "name" });
          objectStore.createIndex("task", "task", { unique: true });
        };
      });
      var loaded = function() {
        var db;
        var request = window.indexedDB.open("habitual", 1);
        request.onerror = function (event) {
        };
        request.onsuccess = function (event) {
          db = request.result;
          var transaction = db.transaction(["tasks"], "readwrite");
          transaction.oncomplete = function(event) {
          };

          transaction.onerror = function(event) {
            // Don't forget to handle errors!
          };

          var objectStore = transaction.objectStore("tasks");
          var tasks = [];

          objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                tasks.push(cursor.value);
                cursor.continue();
            }
            else {
              for (tsk in tasks) {
                addTaskToPage(tasks[tsk].name);
                var isOverADay = ((Date.now() - 86400000) - tasks[tsk].dateLastCompleted)/(24*3600*1000)
                if (!isNaN(isOverADay) && isOverADay <= 1){
                  var task = document.getElementById(tasks[tsk].name);
                  task.classList.remove("notDone");
                  task.classList.add("done");
                }
              }
            }
          };
        }
      };
      require.ready(loaded());
});
