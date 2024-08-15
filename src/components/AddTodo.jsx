import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const InputAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
`;

const Button = styled.button`
  font-size: 20px;
  border: none;
  border-radius: 3px;
  margin-left: 10px;
  padding: 2px 10px;
  background: #1e90ff;
  color: #fff;
  text-align: center;
  cursor: pointer;
  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.5;
    cursor: default;
  `}
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`;

const AddTodo = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const initialTodoState = {
    id: null,
    name: "",
    is_completed: false,
  };

  const [todo, setTodo] = useState(initialTodoState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value });
  };

  const notify = () => {
    toast.success("Todo successfully created!", {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const saveTodo = () => {
    const data = {
      name: todo.name,
    };
    axios
      .post(baseURL + "todos", data)
      .then((res) => {
        setTodo({
          id: res.data.id,
          name: res.data.namae,
          is_completed: res.data.is_completed,
        });
        notify();
        navigate("/todos");
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <>
      <h1>New Todo</h1>
      <InputAndButton>
        <InputName
          type="text"
          required
          value={todo.name}
          name="name"
          onChange={handleInputChange}
        />
        <Button
          onClick={saveTodo}
          $disabled={!todo.name || /^\s*$/.test(todo.name)}
        >
          <Icon>
            <FiSend />
          </Icon>
        </Button>
      </InputAndButton>
    </>
  );
};

export default AddTodo;
