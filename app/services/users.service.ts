import { User } from "../models/user.model";

const users: User[] = [];

export function addUser(user: User): void {
  users.push(user);
}

export function getUsers(): User[] {
  return [...users]; // másolatot ad vissza
}

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function updateUser(updatedUser: User): void {
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
  }
}

export function deleteUser(id: string): void {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
  }
}
