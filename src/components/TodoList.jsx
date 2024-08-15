import React, { useEffect, useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { AiFillEdit } from "react-icons/ai";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchFrom = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`;

const TodoName = styled.span`
  font-size: 27px;
  ${({ $is_completed }) =>
    $is_completed &&
    `
    opacity: 0.4;
  `}
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`;

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`;

const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`;

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`;

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`;

const TodoList = () => {
  const baseURL = import.meta.env.VITE_API_URL;

  const [todos, setTodos] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    axios
      .get(baseURL + "todos")
      .then((res) => {
        setTodos(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const removeAllTodos = () => {
    const sure = window.confirm("Are you sure?");
    if (sure) {
      axios
        .delete(baseURL + "todos/destroy_all")
        .then((res) => {
          setTodos([]);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const updateIsCompleted = (index, val) => {
    const data = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed,
    };
    axios.patch(baseURL + `todos/${val.id}`, data).then((res) => {
      const newTodos = [...todos];
      newTodos[index].is_completed = res.data.is_completed;
      setTodos(newTodos);
    });
  };

  return (
    <>
      <h1>Todo List</h1>
      <SearchAndButton>
        <SearchFrom
          type="text"
          placeholder="Search todo..."
          onChange={(event) => {
            setSearchName(event.target.value);
          }}
        />
        <RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
      </SearchAndButton>

      <div>
        {todos
          .filter((val) => {
            if (searchName === "") {
              return val;
            } else if (
              val.name.toLowerCase().includes(searchName.toLocaleLowerCase())
            ) {
              return val;
            }
          })
          .map((val, key) => {
            return (
              <Row key={key}>
                {val.is_completed ? (
                  <CheckedBox>
                    <ImCheckboxChecked
                      onClick={() => updateIsCompleted(key, val)}
                    />
                  </CheckedBox>
                ) : (
                  <UncheckedBox>
                    <ImCheckboxUnchecked
                      onClick={() => updateIsCompleted(key, val)}
                    />
                  </UncheckedBox>
                )}
                <TodoName $is_completed={val.is_completed}>{val.name}</TodoName>
                <Link to={"/todos/" + val.id + "/edit"}>
                  <EditButton>
                    <AiFillEdit />
                  </EditButton>
                </Link>
              </Row>
            );
          })}
      </div>
    </>
  );
};

export default TodoList;
