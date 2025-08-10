import { useState, useEffect } from 'react';

interface UserListProps {
  users: string[];
  selectedUser: string;
  onSelectUser: (user: string) => void;
}

export default function UserList({ users, selectedUser, onSelectUser }: UserListProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [showUsers, setShowUsers] = useState(!isMobile);

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowUsers(true); 
      else setShowUsers(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isMobile && (
        <button
          onClick={() => setShowUsers(!showUsers)}
          style={{
            marginBottom: 8,
            padding: '8px 12px',
            fontWeight: '600',
            borderRadius: 6,
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          aria-expanded={showUsers}
          aria-controls="user-list"
        >
          Online ({users.length}) {showUsers ? '▲' : '▼'}
        </button>
      )}

      {showUsers && (
        <>
          {!isMobile && (
            <h3 style={{ marginBottom: 12, borderBottom: '1px solid #ccc', paddingBottom: 8 }}>
              Online
            </h3>
          )}
          <ul
            id="user-list"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              overflowY: 'auto',
              flex: 1,
              maxHeight: isMobile ? 'calc(100vh - 50px)' : 'none',
              borderTop: isMobile ? '1px solid #ccc' : 'none',
            }}
          >
            {users.map(user => (
              <li
                key={user}
                style={{
                  cursor: 'pointer',
                  color: selectedUser === user ? 'blue' : 'black',
                  padding: '8px 12px',
                  backgroundColor: selectedUser === user ? '#e6f0ff' : 'transparent',
                  borderRadius: 6,
                  marginBottom: 6,
                  userSelect: 'none',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => onSelectUser(user)}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = selectedUser === user ? '#e6f0ff' : '#f0f0f0')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = selectedUser === user ? '#e6f0ff' : 'transparent')
                }
              >
                {user}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
