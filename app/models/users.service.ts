import { User } from "../models/user.model";

const users: User[] = [];

export function addUser(user: User): void {
  users.push(user);
}

export function getUsers(): User[] {
  return [...users]; // másolatot ad vissza
}
