import { userService } from "../services/user.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { UserList } from "../cmps/UserList.jsx";
import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { utilService } from "../services/util.service.js";

export function UserIndex() {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  //   const defaultFilter = userService.getFilterFromSearchParams(searchParams);
  //   const [filterBy, setFilterBy] = useState(defaultFilter);

  //   const debouncedSetFilterBy = useCallback(
  //     utilService.debounce(setFilterBy, 1000),
  //     []
  //   );

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const users = await userService.query();
    setUsers(users);
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId);
      console.log("Deleted Succesfully!");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      showSuccessMsg("User removed");
    } catch (err) {
      console.log("Error from onRemoveUser ->", err);
      showErrorMsg("Cannot remove user");
    }
  }

  async function onAddUser() {
    const user = {
      fullname: prompt("User fullname?"),
      username: prompt("Username?"),
      password: prompt("Password"),
      score: +prompt("Score"),
    };
    try {
      const savedUser = await userService.save(user);
      console.log("Added User", savedUser);
      setUsers((prevUsers) => [...prevUsers, savedUser]);
      showSuccessMsg("User added");
    } catch (err) {
      console.log("Error from onAddUser ->", err);
      showErrorMsg("Cannot add user");
    }
  }

  async function onEditUser(user) {
    const score = +prompt("New score?");
    const userToSave = { ...user, score };
    console.log("user to save -front ", userToSave);
    try {
      const savedUser = await userService.save(userToSave);
      console.log("Updated User:", savedUser);
      setUsers((prevUsers) =>
        prevUsers.map((currUser) =>
          currUser._id === savedUser._id ? savedUser : currUser
        )
      );
      showSuccessMsg("User updated");
    } catch (err) {
      console.log("Error from onEditUser ->", err);
      showErrorMsg("Cannot update user");
    }
  }

  return (
    <main className="user-index">
      <h3>Users App</h3>

      <main>
        <button className="add-btn" onClick={onAddUser}>
          Add User
        </button>
        <UserList
          users={users}
          onRemoveUser={onRemoveUser}
          onEditUser={onEditUser}
        />
      </main>
    </main>
  );
}
