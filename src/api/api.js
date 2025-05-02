import axios from 'axios';
const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout: Server is not responding');
    } else if (error.message === 'Network Error') {
      throw new Error('Server is not running or network error');
    }
    return Promise.reject(error);
  }
);

export const fetchUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const registerUser = async ({ email, password, name }) => {
  const checkResponse = await api.get(`/users?email=${email}`);
  if (checkResponse.data.length > 0) {
    throw new Error('User with this email already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
    boards: []
  };

  const response = await api.post('/users', newUser);
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.get(`/users?email=${email}&password=${password}`);
  if (response.data.length === 0) throw new Error('Invalid credentials');
  return response.data[0];
};


export const fetchUserBoards = async (userId) => {
  const response = await api.get(`/boards?ownerId=${userId}`);
  return response.data;
};

export const createUserBoard = async (userId, title) => {
  const newBoard = {
    title,
    columns: [],
    ownerId: userId
  };
  
  const boardResponse = await api.post('/boards', newBoard);
  const userResponse = await api.get(`/users/${userId}`);
  const currentBoards = userResponse.data.boards || [];
  
  await api.patch(`/users/${userId}`, {
    boards: [...currentBoards, boardResponse.data.id]
  });
  
  return boardResponse.data;
};

export const fetchBoards = async () => {
  const response = await api.get('/boards');
  return response.data;
};

export const fetchBoard = async (boardId) => {
  try {
    const response = await api.get(`/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching board:", error);
    return null; 
  }
};

export const createBoard = async (title) => {
  const response = await api.post('/boards', {
    title,
    columns: []
  });
  return response.data;
};

export const deleteBoard = async (id) => {
  await api.delete(`/boards/${id}`);
};

export const updateBoard = async (userId,boardId) => {
  await api.delete(`/boards/${boardId}`);
  const user = await api.get(`/users/${userId}`);
  await api.patch(`/users/${userId}`, {
    boards: user.data.boards.filter(id => id !== boardId)
  });
};

export const addColumn = async (boardId, title) => {
  const { data: board } = await api.get(`/boards/${boardId}`);
  const newColumn = {
    id: `${boardId}-col-${Date.now()}`,
    title,
    tasks: []
  };
  const updatedBoard = {
    ...board,
    columns: [...(board.columns || []), newColumn]
  };
  await api.patch(`/boards/${boardId}`, updatedBoard);
  return newColumn;
};

export const updateColumn = async (boardId, columnId, newTitle) => {
  const { data: board } = await api.get(`/boards/${boardId}`);
  const updatedColumns = board.columns.map(column =>
    column.id === columnId ? { ...column, title: newTitle } : column
  );
  await api.patch(`/boards/${boardId}`, {
    columns: updatedColumns
  });
};

export const deleteColumn = async (boardId, columnId) => {
  const { data: board } = await api.get(`/boards/${boardId}`);
  const updatedColumns = board.columns.filter(col => col.id !== columnId);
  await api.patch(`/boards/${boardId}`, { columns: updatedColumns });
};

export const addTask = async (boardId, columnId, text) => {
  const { data: board } = await api.get(`/boards/${boardId}`);
  const newTask = {
    id: `${columnId}-task-${Date.now()}`,
    text
  };
  
  const updatedColumns = board.columns.map(column => 
    column.id === columnId 
      ? { ...column, tasks: [...column.tasks, newTask] } 
      : column
  );
  
  await api.patch(`/boards/${boardId}`, {
    columns: updatedColumns
  });
  return newTask;
};

export const updateTask = async (boardId, columnId, taskId, newText) => {
  const { data: board } = await api.get(`/boards/${boardId}`);
  const updatedColumns = board.columns.map(column => {
    if (column.id === columnId) {
      const updatedTasks = column.tasks.map(task =>
        task.id === taskId ? { ...task, text: newText } : task
      );
      return { ...column, tasks: updatedTasks };
    }
    return column;
  });
  
  await api.patch(`/boards/${boardId}`, {
    columns: updatedColumns
  });
};

export const deleteTask = async (boardId, columnId, taskId) => {
  const { data: board } = await api.get(`/boards/${boardId}`);
  const updatedColumns = board.columns.map(column => {
    if (column.id === columnId) {
      const updatedTasks = column.tasks.filter(task => task.id !== taskId);
      return { ...column, tasks: updatedTasks };
    }
    return column;
  });
  
  await api.patch(`/boards/${boardId}`, {
    columns: updatedColumns
  });
};


export const deleteUserBoard = async (userId, boardId) => {
  await api.delete(`/boards/${boardId}`);
  const user = await api.get(`/users/${userId}`);
  await api.patch(`/users/${userId}`, {
    boards: user.data.boards.filter(id => id !== boardId)
  });
};

export const moveColumnOnServer = async (boardId, columns) => {
  await api.patch(`/boards/${boardId}`, { columns });
};


export { api };  