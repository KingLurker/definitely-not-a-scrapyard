import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { fs } from "../config/Config";

export const ModUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(fs, "users"));
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    // Delete user data from Firestore
    try {
      await deleteDoc(doc(fs, "users", userId));
      console.log(`Firestore data for user ${userId} deleted successfully`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user data from Firestore:", error);
      return;
    }

    // Call Cloud Function to delete the user from Firebase Authentication
    const functions = getFunctions();
    const deleteUser = httpsCallable(functions, "deleteUser");

    try {
      await deleteUser({ userId });
      console.log(`User ${userId} deleted from Authentication successfully`);
    } catch (error) {
      console.error("Error deleting user from Authentication:", error);
    }
  };

  const handleSubmitChanges = () => {
    if (!selectedUser || !newEmail || !newPassword) {
      console.log("Missing information for updating user");
      return;
    }

    // Update the users state to reflect the changes in the UI
    setUsers(
      users.map((user) => {
        if (user.id === selectedUser.id) {
          return { ...user, Email: newEmail };
        }
        return user;
      })
    );

    // Reset the form fields and selected user
    setNewEmail("");
    setNewPassword("");
    setSelectedUser(null);
  };

  return (
    <div className="container">
      <br />
      <h1>Modify Users</h1>
      <hr />

      <ol className="custom-counter">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={
              selectedUser && user.id === selectedUser.id ? "highlighted" : ""
            }
          >
            {user.Email || "No email provided"}
          </li>
        ))}
      </ol>

      {selectedUser &&
        (selectedUser.Email === "admin@dnas.com" ? (
          <div className="admin-message">
            <h3>Selected User: {selectedUser.Email}</h3>
            <p style={{ color: "red" }}>ADMIN USER</p>
          </div>
        ) : (
          <div className="user-actions">
            <h3>Selected User: {selectedUser.Email}</h3>
            <input
              type="text"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleSubmitChanges}>Submit Changes</button>
            <button onClick={() => handleDeleteUser(selectedUser.id)}>
              Delete User
            </button>
          </div>
        ))}
    </div>
  );
};
