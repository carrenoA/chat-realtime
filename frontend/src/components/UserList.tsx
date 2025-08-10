
interface UserListProps {
  users: string[];
  selectedUser: string;
  onSelectUser: (user: string) => void;
}

export default function UserList({ users, selectedUser, onSelectUser }: UserListProps) {
  return (
    <>
      <h3>Usuarios conectados</h3>
      <ul>
        {users.map(user => (
          <li
            key={user}
            style={{ cursor: 'pointer', color: selectedUser === user ? 'blue' : 'black' }}
            onClick={() => onSelectUser(user)}
          >
            {user}
          </li>
        ))}
      </ul>
    </>
  );
}
