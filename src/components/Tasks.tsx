import React, { useState, useEffect } from "react";
import CrudsService from './Service';
import axios from "axios";
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonButton,
  IonIcon,
  InputChangeEventDetail
} from "@ionic/react";
import { add, trash, create, checkmark } from "ionicons/icons";

type Task = {
  id?: any | null,
  titre: string,
  description: string,
  completed?: boolean,
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  
    const retrievecruds = () => {
      fetch("http://127.0.0.1:8000/api/cruds")
      .then(res => res.json())
      .then(
        (result: Task[]) => {
          setIsLoaded(true);
          setTasks(result);
          console.log(result);
        },
        (error: Error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    retrievecruds();
  }, []);



  const handleTaskInput = (event: CustomEvent<InputChangeEventDetail>) => {
    setNewTask((event.target as HTMLInputElement).value);
  };

  const handleNewTask = () => {
    if (newTask.trim() !== "") {
     
      fetch("http://127.0.0.1:8000/api/cruds", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ titre: newTask, description: "New task description" }),
      })
      .then(res => res.json())
      .then((newTaskData: Task) => {
        setTasks(prevTasks => [...prevTasks, newTaskData]);
        setNewTask("");
      })
      .catch((error: Error) => {
        setError(error);
      });
    }
  };

  const handleTaskDelete = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/cruds/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    })
    .catch((error: Error) => {
      setError(error);
    });
  };

  const handleTaskEdit = (id: number, taskText: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, task: taskText };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleTaskToggle = (id: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic React CRUD</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {tasks.map((task) => (
            <IonItem key={task.id}>
              <IonLabel>
                <h2>{task.titre}</h2>
                <p>{task.description}</p>
                <IonCheckbox
                  checked={task.completed}
                  onIonChange={() => handleTaskToggle(task.id)}
                />
              </IonLabel>
              <div slot="end">
                <IonButton
                  color="danger"
                  onClick={() => handleTaskDelete(task.id)}
                >
                  <IonIcon icon={trash} />
                </IonButton>
                <IonButton
                  color="primary"
                  onClick={() =>
                    handleTaskEdit(
                      task.id,
                      window.prompt("Update Task", task.titre) || ""
                    )
                  }
                >
                  <IonIcon icon={create} />
                </IonButton>
              </div>
            </IonItem>
          ))}
        </IonList>
        <IonItem>
          <IonInput
            placeholder="Add Task"
            value={newTask}
            onIonChange={handleTaskInput}
          />
          <IonButton color="success" onClick={handleNewTask}>
            <IonIcon icon={add} />
            <IonLabel>Add</IonLabel>
          </IonButton>
        </IonItem>
      </IonContent>
    </IonApp>
  );
};

export default Tasks;
