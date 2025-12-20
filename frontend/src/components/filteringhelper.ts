const priorityOrder={
    "Low":3,
    "Medium":2,
    "High":1,
    "Urgent":0
} as const;

type Priority = keyof typeof priorityOrder;

type Task = {
  dueDate: string;
  priority:Priority;
  [key: string]: unknown;
};

export const sortingTasks = (tasks: Task[],type:string): Task[] => {
    if(type==="dueDate"){
        return [...tasks].sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }
    return [...tasks].sort((a,b)=>{        
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
};
