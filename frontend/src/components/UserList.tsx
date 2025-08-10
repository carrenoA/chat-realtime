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
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowUsers(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      aria-label="Lista de usuarios online"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-sidebar)',
        padding: 8,
        borderRight: '1px solid var(--border-color, #ccc)',
      }}
    >
      {isMobile && (
        <button
          onClick={() => setShowUsers((prev) => !prev)}
          aria-expanded={showUsers}
          aria-controls="user-list"
          style={{
            marginBottom: 8,
            padding: '8px 12px',
            fontWeight: 600,
            borderRadius: 6,
            border: '1px solid var(--border-color, #ccc)',
            backgroundColor: 'var(--bg-button)',
            color: 'var(--text-button)',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-button-hover, #ddd)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-button)')}
        >
          Online ({users.length}) {showUsers ? '▲' : '▼'}
        </button>
      )}

      {showUsers && (
        <>
          {!isMobile && (
            <h3
              style={{
                marginBottom: 12,
                borderBottom: '1px solid var(--border-color, #ccc)',
                paddingBottom: 8,
                color: 'var(--text-color)',
              }}
            >
              Online
            </h3>
          )}
          <ul
            id="user-list"
            role="list"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              overflowY: 'auto',
              flex: 1,
              maxHeight: isMobile ? 'calc(100vh - 50px)' : undefined,
              borderTop: isMobile ? '1px solid var(--border-color, #ccc)' : 'none',
            }}
          >
            {users.map((user) => {
              const isSelected = user === selectedUser;
              return (
                <li
                  key={user}
                  role="listitem"
                  tabIndex={0}
                  onClick={() => onSelectUser(user)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectUser(user);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    color: isSelected ? 'var(--color-primary, blue)' : 'var(--text-color)',
                    backgroundColor: isSelected ? 'var(--bg-selected, #e6f0ff)' : 'transparent',
                    padding: '8px 12px',
                    borderRadius: 6,
                    marginBottom: 6,
                    userSelect: 'none',
                    transition: 'background-color 0.2s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-button)';
                  }}
                  onBlur={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-button)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {user}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </aside>
  );
}
